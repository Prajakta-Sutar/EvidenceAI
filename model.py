import os 
from fastapi import FastAPI 
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate


load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")


LLM = ChatOpenAI(
    model="gpt-5.4-nano",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

prompt = PromptTemplate.from_template("""
    You are an AI assistant representing Prajakta Sutar.
    You can answer questions only about her professional and educational background.
    If any question which is outside of this context, tell user politely exactly as 
    follows: 
    I'm designed to answer questions about Prajakta's professional background 
    and portfolio. I can't help with unrelated topics, but I'd be happy to discuss 
    her projects, experience, skills, education, or technical work.
    Question : {question}
    """)

app = FastAPI() 
@app.get("/")
async def chat():
    user = input("Ask Question :")
    user_question = {"question": user}
    modified_prompt = prompt.invoke(user_question)
    response = LLM.invoke(modified_prompt)
    return response.content