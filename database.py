import os 
import chromadb
from tree_sitter import Parser
from bs4 import BeautifulSoup
from tree_sitter_language_pack import get_language
from dotenv import load_dotenv
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_text_splitters import MarkdownHeaderTextSplitter
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


def create_tree(path, language):
    current_language = get_language(language)
    parser = Parser()
    parser.set_language(current_language)

    with open(path, "r", encoding="utf-8") as f:
        code = f.read()
    tree = parser.parse(bytes(code, "utf8"))
    return tree.root_node




chunk_at = [  ("#", "title"), ("##", "section"),]

markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on = chunk_at
)


def build_database():
    project_docs = get_documents("evidence/repository")
    chunks = None
    for path in project_docs:
        if path.endswith(".py"):
            treenode = create_tree(path, "python")
        elif path.endswith(".js"):
            treenode = create_tree(path, "javascript")
        elif path.endswith(".html"):
            with open(path, "r",  encoding="utf-8") as f:
                html_file = f.read()
            soup = BeautifulSoup(html_file, "html.parser")
            scripts = []
            for script in soup.findAll("script"):
                if script.string:
                    script.append(script.string)

            for script in soup.findAll("script"):
                scripts.decompose()
            chunks = str(soup)
    
        elif path.endswith(".md"):
            with open(path, "r", encoding="utf-8") as f:
                markdown_text = f.read()
            chunks = markdown_splitter(markdown_text)

        elif path.endswith(".json") or path.endswith(".yml") \
            or path.endswith("dockerfile") or path.endswith(".css"):
            with open(path, "r", encoding="utf-8") as f:
                document = f.read()
            chunks = document
        else:
            continue
        


"""
def retriever(question : str):
    retrived_chunks = database.query(
        query_texts = [question], 
        n_results = 5
    ) 
    return "\n".join(retrived_chunks["documents"][0])

"""

if __name__ == "__main__":
    build_database()
