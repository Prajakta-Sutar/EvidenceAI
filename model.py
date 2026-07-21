from fastapi import FastAPI 

app = FastAPI()

@app.get("/")
async def chat():
    return {"message": "hello I am assistant"}