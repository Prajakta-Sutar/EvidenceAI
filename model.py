import os 
import json
from fastapi import FastAPI 
from openai import OpenAI
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from prompts.classifier_prompt import classifier_prompt




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


@app.get("/")
def classifier(question: str):
    user_question = {"question": question}
    modified_prompt = classifier_prompt.invoke(user_question)
    response = classifier_llm.invoke(modified_prompt)
    result = json.loads(response.content)
    print(result["category"])
    if result["category"] != "Relevant":
        print(result["response"])
        return result["response"]
    else:
        if result["clarification"] == "True":
            print(result["response"])
            return result["response"]
        else:
            print("Going for powerful model")
    
    return 0

