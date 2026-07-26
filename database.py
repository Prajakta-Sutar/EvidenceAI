import os 
import json
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


with open("./evidence/summary/askmentor_summary.txt", "r", encoding="utf-8") as f:
    askmentor_json = json.load(f)

with open("./evidence/summary/datagenesys_summary.txt", "r", encoding="utf-8") as f:
    datagenesys_json = json.load(f)

def return_purpose(path):
    actual_path = path.replace("\\", "/")
    if "askmentor" in actual_path:
        file_path = actual_path.split("/askmentor")[1].lstrip("/")
        for file in askmentor_json["file_level_analysis"]:
            if file["file_path"] == file_path:
                return (askmentor_json["project_overview"]["project_name"], file["purpose"])

    if "datagenesys" in actual_path:
            file_path = actual_path.split("/datagenesys")[1].lstrip("/")
            for file in datagenesys_json["file_level_analysis"]:
                if file["file_path"] == file_path:
                    return (datagenesys_json["project_overview"]["project_name"],file["purpose"])
    
    return ("Unknown", "Unknown")


def create_tree(path, language):
    current_language = get_language(language)
    parser = Parser(current_language)
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()
    tree = parser.parse(bytes(code, "utf8"))
    return tree.root_node


def python_chunker(path):
    treenode = create_tree(path, "python")
    return None

def javascript_chunker(path):
    treenode = create_tree(path, "javascript")
    imports = []
    exports = []
    helper_function = []
    hooks = []
    others = []
    return None



def html_chunker(path):
    with open(path, "r",  encoding="utf-8") as f:
        html_file = f.read()
    soup = BeautifulSoup(html_file, "html.parser")
    scripts = []
    for script in soup.find_all("script"):
        if script.string:
            scripts.append(script.string)

    for script in soup.find_all("script"):
        script.decompose()

    project, purpose = return_purpose(path)
    chunks = []
    html_chunk = {
                "content" : str(soup), 
                "metadata" :{
                    "project" : project,
                    "file" : path,
                    "purpose" : purpose, 
                    "type" : "html"
                }
            }
    chunks.append(html_chunk)
    if scripts:
        script_chunk = {
                    "content" : "\n".join(scripts), 
                    "metadata" :{
                        "project" : project,
                        "file" : path,
                        "purpose" : purpose, 
                        "type" : "script"
                    }
                }
        chunks.append(script_chunk)
    return chunks


markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on = [  ("#", "title"), ("##", "section")]
)
def md_chunker(path):
    print(path)
    with open(path, "r", encoding="utf-8") as f:
        markdown_text = f.read()

    project, purpose = return_purpose(path)
    chunks = markdown_splitter.split_text(markdown_text)
    for chunk in chunks:
        chunk.metadata["project"] = project
        chunk.metadata["file"] = path
        chunk.metadata["purpose"] = purpose
        chunk.metadata["type"] = "markdown"
    return chunks





def build_database():
    project_docs = get_documents("evidence/repository")
  
    for path in project_docs:
        """
        if path.endswith(".md"):
            chunks = md_chunker(path)
        elif path.endswith((".json", ".yml", "dockerfile", "css" )) :
            project, purpose = return_purpose(path)

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
        if path.endswith(".html"):
            chunks = html_chunker(path)
           

            
    

if __name__ == "__main__":
    build_database()
