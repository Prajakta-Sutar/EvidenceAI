import os 
import json
import time 
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
    start = time.perf_counter()
    user_question = {"question": question}
    modified_prompt = classifier_prompt.invoke(user_question)
    response = classifier_llm.invoke(modified_prompt)
    result = json.loads(response.content)
    if result["category"] != "Relevant":
        print(f"Classifier: {time.perf_counter() - start:.3f} seconds")
        return result["response"], None
    else:
        if result["clarification"] == "True":
            print(f"Classifier: {time.perf_counter() - start:.3f} seconds")
            return result["response"], None
        else:
            print(f"Classifier: {time.perf_counter() - start:.3f} seconds")
            return assistant(question) 



def assistant(question):
    print(question)
    start = time.perf_counter()
    retrieval_start = time.perf_counter()
    context , instructions = retriever(question)  
    print(f"Retriever inside assistant: {time.perf_counter() - retrieval_start:.3f} seconds")
    prompt_start = time.perf_counter()
    inputs = {"question": question, "context":context, "instructions": instructions }
    agumented_prompt = assistant_prompt.invoke(inputs)
    print(f"Prompt creation: {time.perf_counter() - prompt_start:.3f} seconds")
    llm_start = time.perf_counter()
    response = assistant_llm.invoke(agumented_prompt)
    print(f"Final LLM: {time.perf_counter() - llm_start:.3f} seconds")
    result = json.loads(response.content)
    summary = result["summary"]
    evidence = result["evidence"]
    print(f"Total Assistant: {time.perf_counter() - start:.3f} seconds")
    return summary , evidence
    
