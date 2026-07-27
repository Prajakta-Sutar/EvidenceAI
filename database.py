import os 
import uuid
import chromadb
from dotenv import load_dotenv
from chromadb.utils import embedding_functions
from langchain_community.document_loaders import PyPDFLoader
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
    project_docs = get_documents("evidence/repository")
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
        elif path.endswith(".pdf"):
            loader = PyPDFLoader(path)
            document = loader.load()
            chunks = [{
                "content" : document[0].page_content, 
                "metadata" : {
                    "file" : path, 
                    "type" : "resume", 
                    "purpose" : "Professional resume containing education, technical skills, projects, certifications, and work experience"
                }
            }]
        elif path.endswith((".json", ".yml", ".css" )) :
            chunks = no_split_chunker(path)
        else:
            continue
        add_chunks(chunks)
    
    summary_docs = get_documents("evidence/summary")
    for path in summary_docs:
        summary_chunks = summary_chunker(path)
        add_chunks(summary_chunks)
            
def retriever(question : str):
    retrived_chunks = database.query(
        query_texts = [question], 
        n_results = 10
    ) 
    return "\n".join(retrived_chunks["documents"][0])   

if __name__ == "__main__":
    print("Before build:", database.count())

    build_database()

    print("After build:", database.count())

    result = retriever("What projects use React?")

    print(result)
