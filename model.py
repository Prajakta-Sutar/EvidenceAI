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
    model="gpt-5.4-mini",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

assistant_llm = ChatOpenAI(
    model="gpt-5.6-luna",
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
    print(result)
    if result["category"] != "Relevant":
        print(f"Classifier: {time.perf_counter() - start:.3f} seconds")
        yield result["response"], None
    else:
        queries = result["queries"]
        print(f"Classifier: {time.perf_counter() - start:.3f} seconds")
        yield from assistant(question, queries) 



def assistant(question, queries):
    start = time.perf_counter()
    retrieval_start = time.perf_counter()
    context  = retriever(queries)  
    print(f"Retriever inside assistant: {time.perf_counter() - retrieval_start:.3f} seconds")
    prompt_start = time.perf_counter()
    inputs = {"question": question, "context":context }
    agumented_prompt = assistant_prompt.invoke(inputs)
    print(f"Prompt creation: {time.perf_counter() - prompt_start:.3f} seconds")
    llm_start = time.perf_counter()
    summary = ""
    evidence = ""
    section = None
    for chunk in assistant_llm.stream(agumented_prompt):
        text = chunk.content

        if "SUMMARY" in text:
            section = "summary"
            continue

        if "EVIDENCE" in text:
            section = "evidence"
            continue

        if section == "summary":
            summary += text

        if section == "evidence":
            evidence += text
        
        print(text)
        yield summary , None

    print(f"Total Assistant: {time.perf_counter() - start:.3f} seconds")
   
    
