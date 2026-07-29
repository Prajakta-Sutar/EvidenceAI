import os 
import json
from fastapi import FastAPI 
from openai import OpenAI 
from dotenv import load_dotenv
from database import retriever
from langchain_openai import ChatOpenAI
from prompts.classifier_prompt import classifier_prompt
from prompts.assistant_prompt import assistant_prompt
from prompts.analyst_prompt import analyst_prompt





# Get the OpenAI API to access the LLM and embedding model
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")



# Develope model which will act as router 
app = FastAPI() 
classifier_llm = ChatOpenAI(
    model="gpt-5.4-nano",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

assistant_llm = ChatOpenAI(
    model="gpt-5.4-mini",
    temperature=0.5,
    api_key=os.getenv("OPENAI_API_KEY")
)

def analyst(project):
    with open(project, "r") as f:
        repository_file = f.read() 
    repository = {'project': repository_file}
    modified_prompt = analyst_prompt.invoke(repository)
    response = assistant_llm.invoke(modified_prompt)
    print(response.content)


def classifier(question: str):
    user_question = {"question": question}
    modified_prompt = classifier_prompt.invoke(user_question)
    response = classifier_llm.invoke(modified_prompt)
    result = json.loads(response.content)
    if result["category"] != "Relevant":
        return result["response"], None
    else:
        if result["clarification"] == "True":
            return result["response"], None
        else:
            return assistant(question) 



def assistant(question):
    context , instructions, evidence = retriever(question)  
    inputs = {"question": question, "context":context, "instructions": instructions }
    agumented_prompt = assistant_prompt.invoke(inputs)
    response = assistant_llm.invoke(agumented_prompt)
    result = json.loads(response.content)
    summary = result["summary"]
    evidence = result["evidence"]
    print(evidence)
    return summary , evidence
    





if __name__ == "__main__":
    analyst("./evidence/repomix_res/datagenesys.txt")