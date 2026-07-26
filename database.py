import os 
from tree_sitter_language_pack import get_language
from dotenv import load_dotenv
from chromadb.utils import embedding_functions
from langchain_community.document_loaders import PyPDFLoader
from chunking import python_chunker, javascript_chunker, html_chunker, md_chunker, no_split_chunker, summary_chunker


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
                "dist", 
                "repomix_res"
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
    project_docs = get_documents("evidence/repository")
    for path in project_docs:
        if path.endswith(".js"):
            chunks = javascript_chunker(path)
        """
        if path.endswith(".md"):
            chunks = md_chunker(path)
        
        elif path.endswith(".html"):
            chunks = html_chunker(path)

        elif path.endswith(".py"):
            chunks = python_chunker(path)

        elif path.endswith(".pdf"):
            loader = PyPDFLoader(path)
            document = loader.load()
            chunks = {
                "content" : document[0].page_content, 
                "metadata" : {
                    "file" : path, 
                    "type" : "resume", 
                    "purpose" : "Professional resume containing education, technical skills, projects, certifications, and work experience"
                }
            }
        elif path.endswith((".json", ".yml", "dockerfile", "css" )) :
            chunks = no_split_chunker(path)
        elif path.endswith(".js"):
            chunks = javascript_chunker(path)
        else:
            continue
        """
    """
    summary_docs = get_documents("./evidence/summary")
    for path in summary_docs:
        summary_chunks = summary_chunker(path)
        for chunk in summary_chunks:
            print("=" * 50)
            print("CONTENT:")
            print(chunk["content"])

            print("\nMETADATA:")
            for key, value in chunk["metadata"].items():
                print(f"{key}: {value}")

            print("\n")
    """          

            
    

if __name__ == "__main__":
    build_database()
