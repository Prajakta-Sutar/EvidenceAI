import os 
import json
import time 
from fastapi import FastAPI  
from dotenv import load_dotenv
from database import retriever
from langchain_openai import ChatOpenAI
from prompts.classifier_prompt import classifier_prompt
from prompts.assistant_prompt import assistant_prompt
from prompts.analyst_prompt import analyst_prompt
from collections import deque
from fastapi import Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware




# Get the OpenAI API to access the LLM and embedding model
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")



# Develope model which will act as router 
app = FastAPI() 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    history = "\n".join(f"User : {h['question']}, Your Response : {h['assistant_response']}" 
                                for h in history_queue)
    user_question = {"question": question, "history" : history}
    modified_prompt = classifier_prompt.invoke(user_question)
    response = classifier_llm.invoke(modified_prompt)
    result = json.loads(response.content)
    if result["category"] != "Relevant":
        print(f"Classifier: {time.perf_counter() - start:.3f} seconds")
        yield result["response"], None
    else:
        queries = result["queries"]
        print(f"Classifier: {time.perf_counter() - start:.3f} seconds")
        yield from assistant(question, queries) 


history_queue = deque(maxlen=3)

def assistant(question, queries):
    print("I am here in assistat\n")
    context  = retriever(queries)  
    history = "\n".join(f"User : {h['question']}, Your Response : {h['assistant_response']}" 
                        for h in history_queue)
    inputs = {"question": question, "context":context , "history" : history}
    agumented_prompt = assistant_prompt.invoke(inputs)
    summary = ""
    evidence = ""
    section = "summary"
    for chunk in assistant_llm.stream(agumented_prompt):
        text = chunk.content
        if "@" in text:
            section = "evidence"
            text = text.replace("@", "")
        if section == "evidence":
            evidence += text
        if section == "summary":
            summary += text
            yield{
                "type" : "summary", 
                "content" : text
            }

    history_queue.append({
        "question" : question, 
        "assistant_response" : summary
    })
    evidence_json = json.loads(evidence.strip())
    yield{
        "type" : "evidence", 
        "content" : evidence_json
    }

    
@app.post("/skill")
async def skill_endpoint(request: Request):
    print("I am here in skill endpoint\n")
    request_data = await request.json()
    skill = request_data["skill"]
    queries = [
        f"{skill} implementation",
        f"{skill} configuration",
        f"{skill} usage in projects"
    ]

    def stream():
        for response in assistant( f"Explain Ptrajakta's {skill} experience", queries):
            yield json.dumps(response) + "\n"

    return StreamingResponse(
        stream(),
        media_type="application/json"
    )
 