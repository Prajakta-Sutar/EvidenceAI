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


def return_type(path, name):
    actual_path = path.replace("\\", "/")
    if "askmentor" in actual_path:
        file_path = actual_path.split("/askmentor")[1].lstrip("/")
        for file in askmentor_json["file_level_analysis"]:
            if file["file_path"] == file_path:
                for component in file["main_classes_functions_components"]:
                    if component["name"] == name:
                        return component["type"]

    if "datagenesys" in actual_path:
            file_path = actual_path.split("/datagenesys")[1].lstrip("/")
            for file in datagenesys_json["file_level_analysis"]:
                if file["file_path"] == file_path:
                    for component in file["main_classes_functions_components"]:
                        if component["name"] == name:
                            return component["type"]


def return_name(node, source_byte):
    for child in node.children:
        if child.type == "identifier":
            name = source_byte[child.start_byte:child.end_byte].decode("utf-8")
            return name
    return "Unknown"


def create_tree(path, language):
    current_language = get_language(language)
    parser = Parser(current_language)
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()
    tree = parser.parse(bytes(code, "utf8"))
    return tree.root_node




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
                    "project" : project, 
                    "file" : path, 
                    "file_purpose": purpose, 
                    "function_name" : function_name,
                    "function_purpose" : function_purpose,
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
                    "project" : project, 
                    "file" : path, 
                    "file_purpose": purpose,
                    "class_name" : class_name, 
                    "class_purpose" : class_purpose,
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
                "project" : project,
                "file" : path, 
                "file_purpose": purpose, 
                "type" : "imports"
            }
        })

    if global_assignments:
        chunks.append({
                "content": "\n".join(global_assignments),
                "metadata":{
                    "project" : project, 
                    "file" : path, 
                    "file_purpose": purpose, 
                    "type" : "assignment"
                }
            })
    return chunks



########################### Chunking for .js document #########################

def js_function_chunker(path, node, source_byte, parent_function):
    function_useffect = []
    function_usestate = []
    function_other =[]
    function_chunks = []
    function_other_lexical = []

    project, file_purpose = return_file_purpose(path)
    function_purpose = return_function_class_purpose(path, parent_function, "component")

    for child in node.children:
        code = source_byte[child.start_byte:child.end_byte].decode("utf-8")
        if child.type == "return_statement":
            function_chunks.append({
                "content" : code, 
                "metadata":{
                "project" : project, 
                "file" : path, 
                "file_purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose, 
                "type" : "return_statement"
                }
            })
        elif child.type == "expression_statement":
            function_useffect.append(code)
        elif child.type == "lexical_declaration":
            declarator = child.named_children[0]
            value = declarator.named_children[-1]
            if value.type in ("arrow_function", "function_expression"):
                helper_function_name = declarator.named_children[0].text.decode("utf-8")
                helper_function_purpose = return_function_class_purpose(path, helper_function_name, "function")
                function_chunks.append({
                    "content": code,
                    "metadata":{
                        "project" : project, 
                        "file" : path, 
                        "file_purpose": file_purpose, 
                        "function_name" : parent_function,
                        "function_purpose" : function_purpose,
                        "helper_function_name" :helper_function_name,
                        "helper_function_purpose" :helper_function_purpose,
                        "type" : "helper_function"
                    }
                })

            elif value.type == "call_expression":
                function_usestate.append(code)
            else:
                function_other_lexical.append(code)
        else:
            function_other.append(code)

    if function_useffect:
        function_chunks.append({
            "content" : "\n".join(function_useffect), 
            "metadata": {
                "project" : project, 
                "file" : path, 
                "file_purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "type": "useffect_statements"
            }
        })

    if function_usestate:
        function_chunks.append({
            "content" : "\n".join(function_usestate), 
            "metadata": {
                "project" : project, 
                "file" : path, 
                "file_purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "type": "usestate_statements"
            }
        })
    if function_other:
        function_chunks.append({
            "content" : "\n".join(function_other), 
            "metadata": {
                "project" : project, 
                "file" : path, 
                "file_purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "type": "other_function_statements"
            }
        })
    if function_other_lexical:
        function_chunks.append({
            "content" : "\n".join(function_other_lexical), 
            "metadata": {
                "project" : project, 
                "file" : path, 
                "file_purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "type": "other_lexical_statements"
            }
        })
    return function_chunks



def javascript_chunker(path):
    treenode = create_tree(path, "javascript")
    with open(path, "r",  encoding="utf-8") as f:
        source_code = f.read()

    source_byte = source_code.encode("utf-8")
    project, file_purpose = return_file_purpose(path)

    file_imports = []
    file_exports = []
    file_const_var_let = []
    file_top_level_functions = []
    file_chunks = []
    file_others = []

    for node in treenode.children:
        code = source_byte[node.start_byte:node.end_byte].decode("utf-8")
        if node.type == "import_statement":
            file_imports.append(code)
        elif node.type == "export_statement":
            file_exports.append(code)
        elif node.type == "expression_statement":
            file_top_level_functions.append(code)
        elif node.type in ("lexical_declaration", "variable_declaration"):
            file_const_var_let.append(code)
        elif node.type == "function_declaration":
            function_name = return_name(node, source_byte)
            function_type = return_type(path, function_name)
            if function_type == "function":
                function_purpose = return_function_class_purpose(path, function_name, function_type)
                file_chunks.append({
                    "content": code,
                    "metadata":{
                        "project" : project, 
                        "file" : path, 
                        "file_purpose": file_purpose, 
                        "function_name" : function_name,
                        "function_purpose" : function_purpose,
                        "type" : "function"
                    }
                })
            else:
                for child in node.children:
                    if child.type == "statement_block":
                        in_function_chunks = js_function_chunker(path,child, source_byte, function_name)
                        file_chunks.extend(in_function_chunks)
                        break
        else:
            file_others.append(code)

    if file_imports:
        file_chunks.append({
            "content" : "\n".join(file_imports), 
            "metadata": {
                "project" : project, 
                "file": path,
                "file_purpose" : file_purpose,
                "type": "imports"
            }
        })
    if file_exports:
        file_chunks.append({
            "content" : "\n".join(file_exports),
            "metadata": {
                "project" : project, 
                "file": path,
                "file_purpose" : file_purpose,
                "type": "exports"
            }
        })
    if file_const_var_let:
        file_chunks.append({
            "content" : "\n".join(file_const_var_let), 
            "metadata": {
                "project" : project, 
                "file": path,
                "file_purpose" : file_purpose,
                "type": "global_variables_constants"
            }
        })
    if file_top_level_functions:
        file_chunks.append({
            "content" : "\n".join(file_top_level_functions), 
            "metadata": {
                "project" : project, 
                "file": path,
                "file_purpose" : file_purpose,
                "type": "Top_level_expressions"
            }
        })
    if file_others:
        file_chunks.append({
            "content" : "\n".join(file_others), 
            "metadata": {
                "project" : project, 
                "file": path,
                "file_purpose" : file_purpose,
                "type": "Other_statements_in_file"
            }
        })
                
    return file_chunks


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
                    "file_purpose" : purpose, 
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
                        "file_purpose" : purpose, 
                        "type" : "script"
                    }
                }
        chunks.append(script_chunk)
    return chunks



########################### Chunking for .md document #########################


def md_chunker(path):
    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on = [  ("#", "title"), ("##", "section")]
    )
    with open(path, "r", encoding="utf-8") as f:
        markdown_text = f.read()

    project, purpose = return_file_purpose(path)
    documents = markdown_splitter.split_text(markdown_text)
    chunks =[]
    for doc in documents:
        chunks.append({
            "content" : doc.page_content, 
            "metadata":{
                "project" : project,
                "file" : path,
                "file_purpose" : purpose, 
                "type" : "markdown", 
                **doc.metadata
            }
        })
   
    return chunks



def no_split_chunker(path):
    project, purpose = return_file_purpose(path)
    with open(path, "r", encoding="utf-8") as f:
        page_content = f.read()
    chunks = [{
        "content" : page_content, 
        "metadata" :{
            "project" : project,
            "file" : path,
            "file_purpose" : purpose, 
            "type" : "configuration"
        }
    }]
    return chunks 


def summary_chunker(path):
    if "askmentor_summary.txt" in path.lower():
        json_summary = askmentor_json
    else:
        json_summary = datagenesys_json

    chunks = []

    overview = json_summary["project_overview"]
    chunks.append({
        "content" : json.dumps(overview, indent=2) , 
        "metadata" :{
            "project" : overview["project_name"], 
            "file" : path,
            "file_purpose" : "High-level project overview",
            "type" :"project_summary", 
            "source" : "Analyst"
        }
    })

    for component, description in json_summary["architecture"].items():
         chunks.append({
            "content" : f"""
            Componenet : {component}
            Description : {json.dumps(description, indent=2)}
            """ , 
            "metadata" :{
                "project" : overview["project_name"], 
                "file" : path,
                "file_purpose" : f"Architecture description for {component}",
                "component" : component, 
                "type" :"architechture",
                "source" : "Analyst"
                
            }
        })
        

    for file in json_summary["file_level_analysis"]:
        chunks.append({
            "content" : json.dumps(file, indent=2), 
            "metadata" :{
                "project" : overview["project_name"], 
                "file" : path,
                "file_purpose" :  f"Summary of {file['file_path']}",
                "code_file" : file["file_path"],
                "type" :"file_overview", 
                "source" : "Analyst"
                
            }
        })


    relation_map = json_summary["project_relationship_map"]
    chunks.append({
        "content" : json.dumps(relation_map["component_relationships"], indent=2), 
        "metadata" :{
            "project" : overview["project_name"], 
            "file" : path,
            "file_purpose" : "Shows relationships between files and how components use each other",
            "type": "file_relationships",
            "source" : "Analyst"
            
        }
    })

    chunks.append({
        "content" : json.dumps(relation_map["data_flow"], indent=2), 
        "metadata" :{
            "project" : overview["project_name"], 
            "file" : path,
            "file_purpose" : "Explains how data moves through the application",
            "type": "data_flow", 
            "source" : "Analyst"
            
        }

    })
    return chunks


