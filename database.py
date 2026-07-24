import os 
import chromadb
from dotenv import load_dotenv
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, PyPDFLoader


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


def analyst(project):
    with open(project, "r") as f:
        repository_file = f.read() 
    repository = {'project': repository_file}
    modified_prompt = analyst_prompt.invoke(repository)
    response = assistant_llm.invoke(modified_prompt)
    print(response.content)
    return response.content
    

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


def build_database():
    file_paths = get_documents("evidence")
    for path in file_paths:
        print(path)
        if path.endswith(".pdf"):
            doc = PyPDFLoader(path).load()
        else:
            doc = TextLoader(path,encoding="utf-8").load()
        
        chunks = splitter.split_documents(doc)
        for start in range(0, len(chunks), 100):
            batch = chunks[start: start+100]
            database.add(
                documents=[chunk.page_content for chunk in batch],
                metadatas=[{"source": path} for chunk in batch],
                ids=[f"{path}_{i+start}" for i in range(len(batch))]
            )

def retriever(question : str):
    retrived_chunks = database.query(
        query_texts = [question], 
        n_results = 5
    ) 
    return "\n".join(retrived_chunks["documents"][0])

if __name__ == "__main__":
    build_database()
