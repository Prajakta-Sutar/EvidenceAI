import os 
import json
import uuid
import time
import chromadb
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from chromadb.utils import embedding_functions
from langchain_community.document_loaders import PyPDFLoader
from prompts.statergist_prompt import statergist_prompt
from concurrent.futures import ThreadPoolExecutor
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


def run_single_query(query):
    return database.query(
        query_texts = [query], 
        n_results = 15
    )

def retriever(queries):
    retrieved_docs = []
    seen = set()
    with ThreadPoolExecutor(max_workers=len(queries)) as executor:
        results = list(executor.map(run_single_query, queries))
        for chunks_per_query in results:
            ids = chunks_per_query["ids"][0]
            documents = chunks_per_query["documents"][0]
            metadatas = chunks_per_query["metadatas"][0]
            distances = chunks_per_query["distances"][0]
            for chunk_id, doc, metadata, distance in zip(ids, documents, metadatas, distances):
                if chunk_id not in seen:
                    seen.add(chunk_id)
                    retrieved_docs.append({
                        "id": chunk_id,
                        "content": doc,
                        "metadata": metadata,
                        "distance": distance
                    })

    retrieved_docs.sort(key=lambda x:x["distance"])


    context = ""
    
    for document in retrieved_docs:
        doc_metadata = "\n".join(f"{key}:{value}" for key, value in document["metadata"].items())
        context += f"""
        metadata : {doc_metadata}
        content : {document["content"]}
        ----------------------------------------
        """
    return context 



