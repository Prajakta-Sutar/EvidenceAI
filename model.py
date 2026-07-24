import os 
import json
from fastapi import FastAPI 
from openai import OpenAI 
from dotenv import load_dotenv
from database import retriever
from langchain_openai import ChatOpenAI
from prompts.classifier_prompt import classifier_prompt
from prompts.assistant_prompt import assistant_prompt



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
    temperature=3,
    api_key=os.getenv("OPENAI_API_KEY")
)

def assistant(question):
    context = retriever(question) 
    inputs = {"question": question, "context":context}
    agumented_prompt = assistant_prompt.invoke(inputs)
    response = assistant_llm.invoke(agumented_prompt)
    return response.content




@app.get("/")
def classifier(question: str):
    user_question = {"question": question}
    modified_prompt = classifier_prompt.invoke(user_question)
    response = classifier_llm.invoke(modified_prompt)
    result = json.loads(response.content)
    if result["category"] != "Relevant":
        return result["response"]
    else:
        if result["clarification"] == "True":
            return result["response"]
        else:
            return assistant(question) 


