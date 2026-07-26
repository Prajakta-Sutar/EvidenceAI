import json
from tree_sitter import Parser
from bs4 import BeautifulSoup
from tree_sitter_language_pack import get_language
from langchain_text_splitters import MarkdownHeaderTextSplitter



with open("./evidence/summary/askmentor_summary.txt", "r", encoding="utf-8") as f:
    askmentor_json = json.load(f)

with open("./evidence/summary/datagenesys_summary.txt", "r", encoding="utf-8") as f:
    datagenesys_json = json.load(f)

def return_file_purpose(path):
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


def return_function_class_purpose(path, name, type):
    actual_path = path.replace("\\", "/")
    if "askmentor" in actual_path:
        file_path = actual_path.split("/askmentor")[1].lstrip("/")
        for file in askmentor_json["file_level_analysis"]:
            if file["file_path"] == file_path:
                for component in file["main_classes_functions_components"]:
                    if component["name"] == name and component["type"] == type:
                        return component["description"]

    if "datagenesys" in actual_path:
            file_path = actual_path.split("/datagenesys")[1].lstrip("/")
            for file in datagenesys_json["file_level_analysis"]:
                if file["file_path"] == file_path:
                    for component in file["main_classes_functions_components"]:
                        if component["name"] == name and component["type"] == type:
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

########################### Chunking for python document #########################

def python_chunker(path):
    treenode = create_tree(path, "python")
    imports = []
    chunks = []
    global_assignments = []

    with open(path, "r",  encoding="utf-8") as f:
        source_code = f.read()

    source_byte = source_code.encode("utf-8")
    project, purpose = return_file_purpose(path)

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
            function_purpose = return_function_class_purpose(path, function_name, "function")
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
            class_purpose = return_function_class_purpose(path, class_name, "class")
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



########################### Chunking for .js document #########################

def javascript_chunker(path):
    treenode = create_tree(path, "javascript")
    imports = []
    exports = []
    helper_function = []
    hooks = []
    others = [] 
    return None

########################### Chunking for HTML document #########################

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

    project, purpose = return_file_purpose(path)
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



########################### Chunking for .md document #########################

markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on = [  ("#", "title"), ("##", "section")]
)
def md_chunker(path):
    print(path)
    with open(path, "r", encoding="utf-8") as f:
        markdown_text = f.read()

    project, purpose = return_file_purpose(path)
    chunks = markdown_splitter.split_text(markdown_text)
    for chunk in chunks:
        chunk.metadata["project"] = project
        chunk.metadata["file"] = path
        chunk.metadata["purpose"] = purpose
        chunk.metadata["type"] = "markdown"
    return chunks



