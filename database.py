import os 
import json
import uuid
import chromadb
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from chromadb.utils import embedding_functions
from langchain_community.document_loaders import PyPDFLoader
from prompts.statergist_prompt import statergist_prompt
from chunking import python_chunker, javascript_chunker, html_chunker, md_chunker, no_split_chunker, summary_chunker


load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")


# Create database collection to store embeddingsmeb
database_client = chromadb.PersistentClient("./portfolio_database")

embedding_funct = embedding_functions.OpenAIEmbeddingFunction(
    api_key=api_key,
    model_name="text-embedding-3-small"
)


database = database_client.get_or_create_collection(
    name="Portfolio_Evidence", 
    metadata={"description": "Collection storing Prajakta's Portfolio"},
    configuration={
        "hnsw" :{"space": "cosine"},
        "embedding_function" : embedding_funct
    }
)



dir_ignore = {
                ".git",
                "node_modules",
                "build",
                "dist", 
                "repomix_res",
                "__pycache",
                ".venv",
            }

def get_documents(root):
    documents = []
    for root, subdir, files in os.walk(root):
        subdir[:] = [
            d for d in subdir if d not in dir_ignore
        ]
        for file in files:
            if file == "package-lock.json":
                continue 
            path = os.path.join(root, file)
            documents.append(path)
    return documents


def add_chunks(chunks):
    if len(chunks) == 0:
        return
    for chunk in chunks:
        database.add(
            ids=str(uuid.uuid4()),
            documents=chunk["content"], 
            metadatas=chunk["metadata"]
        )


def build_database():
    project_docs = get_documents("./evidence")
    for path in project_docs:
        if os.path.basename(path).lower() == "dockerfile":
            chunks = no_split_chunker(path)
        elif path.endswith(".js"):
            chunks = javascript_chunker(path)
        elif path.endswith(".md"):
            chunks = md_chunker(path)
        elif path.endswith(".html"):
            chunks = html_chunker(path)
        elif path.endswith(".py"):
            chunks = python_chunker(path)
        elif path.endswith((".json", ".yml", ".css" )) :
            chunks = no_split_chunker(path)
        elif path.endswith(".txt") and "summary" in path.lower():
            chunks = summary_chunker(path)
        else:
            continue
        add_chunks(chunks)


statergy_llm = ChatOpenAI(
    model="gpt-5.4-mini",
    temperature=0.5,
    api_key=os.getenv("OPENAI_API_KEY")
)


def statergy_generator():
    while True:
        user = input("Input question here : ")
        print(question, "\n")
        input_question = {'question': user}
        modified_prompt = statergist_prompt.invoke(input_question)
        response = statergy_llm.invoke(modified_prompt)
        result = json.loads(response.content)
        for r in result:
            print(r, "\n")
    #return result["queries"], result["instructions"], result["evidence"]


def retriever(question : str):
    document_contents = []
    document_metadata = []
    document_ids = []
    seen = set()
    queries, instructions, evidence = statergy_generator(question)
    for query in queries:
        retrived_chunks = database.query(
            query_texts = [query], 
            n_results = 10
        )
        for chunk_id, doc, metadata in zip(retrived_chunks["ids"][0], retrived_chunks["documents"][0],retrived_chunks["metadatas"][0] ):
            if chunk_id not in seen:
                seen.add(chunk_id)
                document_contents.append(doc)  
                document_metadata.append(metadata)
                document_ids.append(chunk_id)


    context = ""
    
    for document, metadata in zip(document_contents, document_metadata):
        doc_metadata = "\n".join(f"{key}:{value}" for key, value in metadata.items())
        context += f"""
        metadata : {doc_metadata}
        content : {document}

        ----------------------------------------
        """
    return context , instructions, evidence


if __name__ == "__main__":
    statergy_generator()