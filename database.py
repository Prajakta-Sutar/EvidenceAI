import os 
import chromadb
from dotenv import load_dotenv
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, PyPDFLoader


load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")


# Create database collection to store embeddingsmeb
database_client = chromadb.Client()
embedding_funct = embedding_functions.OpenAIEmbeddingFunction(
    api_key=api_key,
    model_name="text-embedding-3-small"
)
database = database_client.create_collection(
    name="Portfolio_Evidence", 
    metadata={"description": "Collection storing Prajakta's Portfolio"},
    configuration={
        "hnsw" :{"space": "cosine"},
        "embedding_function" : embedding_funct
    }
)
print("Database created !\n")



# Splitter to chunk the documents into smaller parts
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150
    )

dir_ignore = {
                ".git",
                "node_modules",
                "build",
                "dist"
            }


def get_documents(root):
    documents = []
    for root, subdir, files in os.walk(root):
        subdir[:] = [
            d for d in subdir if d not in dir_ignore
        ]

        for file in files:
            path = os.path.join(root, file)
            documents.append(path)

    return documents


def ingest_docs():
    file_paths = get_documents("evidence")
    for path in file_paths:
        if path.endswith(".pdf"):
            doc = PyPDFLoader(path).load()
        else:
            doc = TextLoader(path, ).load()
        
        chunks = splitter.split_documents(doc)

        database.add(
            documents=[chunk.page_content for chunk in chunks],
            metadatas=[{"source": path} for chunk in chunks],
            ids=[f"{path}_{i}" for i in range(len(chunks))]
        )


