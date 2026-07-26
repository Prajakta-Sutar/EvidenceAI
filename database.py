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

def return_function_purpose(path, name):
    actual_path = path.replace("\\", "/")
    if "askmentor" in actual_path:
        file_path = actual_path.split("/askmentor")[1].lstrip("/")
        for file in askmentor_json["file_level_analysis"]:
            if file["file_path"] == file_path:
                for component in file["main_classes_functions_components"]:
                    if component["name"] == name and component["type"] == "function":
                        return component["description"]

    if "datagenesys" in actual_path:
            file_path = actual_path.split("/datagenesys")[1].lstrip("/")
            for file in datagenesys_json["file_level_analysis"]:
                if file["file_path"] == file_path:
                    for component in file["main_classes_functions_components"]:
                        if component["name"] == name and component["type"] == "function":
                            return component["description"]
    return ("Unknown")


def return_class_purpose(path, name):
    actual_path = path.replace("\\", "/")
    if "askmentor" in actual_path:
        file_path = actual_path.split("/askmentor")[1].lstrip("/")
        for file in askmentor_json["file_level_analysis"]:
            if file["file_path"] == file_path:
                for component in file["main_classes_functions_components"]:
                    if component["name"] == name and component["type"] == "class":
                        return component["description"]

    if "datagenesys" in actual_path:
            file_path = actual_path.split("/datagenesys")[1].lstrip("/")
            for file in datagenesys_json["file_level_analysis"]:
                if file["file_path"] == file_path:
                    for component in file["main_classes_functions_components"]:
                        if component["name"] == name and component["type"] == "class":
                            return component["description"]
    return ("Unknown")


def create_tree(path, language):
    current_language = get_language(language)
    parser = Parser(current_language)
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()
    tree = parser.parse(bytes(code, "utf8"))
    return tree.root_node


def print_tree(node, indent=0):
    print("  " * indent + f"{node.type} [{node.start_point} - {node.end_point}]")
    for child in node.children:
        print_tree(child, indent + 1)


def python_chunker(path):
    treenode = create_tree(path, "python")
    imports = []
    chunks = []
    global_assignments = []

    with open(path, "r",  encoding="utf-8") as f:
        source_code = f.read()

    source_byte = source_code.encode("utf-8")
    project, purpose = return_purpose(path)

    for node in treenode.children:
        code = source_byte[node.start_byte:node.end_byte].decode("utf-8")
        if node.type in ("import_from_statement", "import_statement"):
            imports.append(code)
        elif node.type == "function_definition":
            function_name = None
            for child in node.children:
                if child.type == "identifier":
                    function_name = source_byte[child.start_byte:child.end_byte].decode("utf-8")
                    break
            function_purpose = return_function_purpose(path, function_name)
            chunks.append({
                "content": code,
                "metadata":{
                    "file" : path, 
                    "purpose": purpose, 
                    "function_name" : function_name,
                    "function_purpose" : function_purpose,
                    "project" : project, 
                    "type" : "function"
                }
            })
        elif node.type == "class_definition":
            class_name = None
            for child in node.children:
                if child.type == "identifier":
                    class_name = source_byte[child.start_byte:child.end_byte].decode("utf-8")
                    break
            class_purpose = return_class_purpose(path, class_name)
            chunks.append({
                "content": code,
                "metadata":{
                    "file" : path, 
                    "purpose": purpose,
                    "class_name" : class_name, 
                    "class_purpose" : class_purpose,
                    "project" : project, 
                    "type" : "class"
                }
            })
        elif node.type == "assignment" or node.type == "if_statement":
            code = source_byte[node.start_byte:node.end_byte].decode("utf-8")
            global_assignments.append(code)
        else:
            continue

    if imports:
        chunks.append({
            "content" : "\n".join(imports),
            "metadata":{
                "file" : path, 
                "purpose": purpose, 
                "project" : project, 
                "type" : "imports"
            }
        })

    if global_assignments:
        chunks.append({
                "content": "\n".join(global_assignments),
                "metadata":{
                    "file" : path, 
                    "purpose": purpose, 
                    "project" : project, 
                    "type" : "assignment"
                }
            })
    return chunks


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
        elif path.endswith(".html"):
            chunks = html_chunker(path)
        """
        if path.endswith(".py"):
            chunks = python_chunker(path)
           

            
    

if __name__ == "__main__":
    build_database()
