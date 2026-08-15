import os 
import json
import time 
from pathlib import Path
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


def classifier(question: str):
    history = "\n".join(f"User : {h['question']}, Your Response : {h['assistant_response']}" 
                                for h in history_queue)
    user_question = {"question": question, "history" : history}
    modified_prompt = classifier_prompt.invoke(user_question)
    response = classifier_llm.invoke(modified_prompt)
    result = json.loads(response.content)
    if result["category"] != "Relevant":
        yield { 
            "type": "summary",
            "content": result["response"]
        }
        yield {
            "type": "evidence",
            "content": []
        }
        return
    else:
        queries = result["queries"]    
        yield from assistant(question, queries) 


history_queue = deque(maxlen=3)

def assistant(question, queries):
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
    evidence_json = [ 
                        item for item in evidence_json 
                        if item.get("file") and Path(item["file"]).suffix not in [".pdf", ".txt", ".md", ".json"]
                    ]

    if evidence_json and len(evidence_json) > 0:
        yield {
            "type": "evidence_arriving",
            "content": "yes"
        }
    else:
        yield {
            "type": "evidence_arriving",
            "content": "no"
        }

    for item in evidence_json:
        path_to_display = ""
        full_path = None
        project=""
        evidence_path = Path(item["file"]).as_posix()
        if "evidenceai" in evidence_path:
            path_to_display = "evidenceai/" +evidence_path.split("evidenceai")[1].lstrip("/")
            full_path = Path("./evidence/repository/EVIDENCEAI/") / path_to_display
            project = "EvidenceAI"
        elif "datagenesys" in evidence_path:
            path_to_display = "datagenesys/" +evidence_path.split("datagenesys")[1].lstrip("/")
            full_path = Path("./evidence/repository/DATAPREDICTIFY/") / path_to_display
            project = "DataPredictify"
        elif "askmentor" in evidence_path:
            path_to_display = "askmentor/" +evidence_path.split("askmentor")[1].lstrip("/")
            full_path = Path("./evidence/repository/ASKMENTOR/") / path_to_display
            project = "AskMentor"

        if full_path and full_path.exists():
            with open(full_path, "r", encoding="utf-8") as f:
                code = f.read()  
        yield{
            "type" : "evidence", 
            "content" : {
                "file" : path_to_display,
                "description": item["description"],
                "code": code,
                "project": project
            }
        }

@app.post("/skill")
async def skill_endpoint(request: Request):
    request_data = await request.json()
    skill = request_data["skill"]
    if skill.lower() == "c" or skill.lower() == "git":
        queries = [
            f"find how Prajakta has experience in {skill} programming as mentioned in resume.md"
        ]
    else:
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


@app.post("/project_skill")
async def skill_endpoint(request: Request):
    request_data = await request.json()
    skill = request_data["skill"]
    project = request_data["project"]
    queries = [
        f"{skill} implementation in project {project}",
        f"{skill} configuration in project {project}",
        f"{skill} usage in in project {project}"
    ]

    def stream():
        for response in assistant( f"Explain how prajakta utilize {skill} in {project} project", queries):
            yield json.dumps(response) + "\n"

    return StreamingResponse(
        stream(),
        media_type="application/json"
    )


@app.post("/assistant") 
async def skill_endpoint(request: Request):
    request_data = await request.json()
    question = request_data["question"]
    def stream():
        for response in classifier(question):
            yield json.dumps(response) + "\n"

    return StreamingResponse(
        stream(),
        media_type="application/json"
    )




