import os 
from tree_sitter_language_pack import get_language
from dotenv import load_dotenv
from chromadb.utils import embedding_functions
from chunking import python_chunker, javascript_chunker, html_chunker, md_chunker

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

"""
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

"""

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


def build_database():
    
    project_docs = get_documents("evidence")
    """
    for path in project_docs:
        
        if path.endswith(".md"):
            chunks = md_chunker(path)
        
        elif path.endswith(".html"):
            chunks = html_chunker(path)

        elif path.endswith(".py"):
            chunks = python_chunker(path)
            
        elif path.endswith((".json", ".yml", "dockerfile", "css" )) :
            project, purpose = return_file_purpose(path)

            with open(path, "r", encoding="utf-8") as f:
                page_content = f.read()

            chunks = {
                "content" : page_content, 
                "metadata" :{
                    "project" : project,
                    "file" : path,
                    "purpose" : purpose, 
                    "type" : "configuration"
                }
            }
        
        """
    for path in project_docs:
        if path.endswith(".py"):
            chunks = python_chunker(path)
            for i, chunk in enumerate(chunks):
                print(f"\n========== CHUNK {i+1} ==========")

                print("CONTENT:")
                print(chunk["content"])

                print("\nMETADATA:")
                for key, value in chunk["metadata"].items():
                    print(f"{key}: {value}")
                

            
    

if __name__ == "__main__":
    build_database()
