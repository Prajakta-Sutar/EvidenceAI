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



def print_tree(node, indent=0):
    print("  " * indent + f"{node.type} [{node.start_point} - {node.end_point}]")
    for child in node.children:
        print_tree(child, indent + 1)

def create_tree(path, language):
    current_language = get_language(language)
    parser = Parser(current_language)
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()
    tree = parser.parse(bytes(code, "utf8"))
    #print_tree(tree.root_node)
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
                "file" : path, 
                "file_purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "project" : project, 
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
                        "file" : path, 
                        "purpose": file_purpose, 
                        "function_name" : parent_function,
                        "function_purpose" : function_purpose,
                        "helper_function_name" :helper_function_name,
                        "helper_function_purpose" :helper_function_purpose,
                        "project" : project, 
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
                "file" : path, 
                "purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "project": project,
                "type": "useffect_statements"
            }
        })

    if function_usestate:
        function_chunks.append({
            "content" : "\n".join(function_usestate), 
            "metadata": {
                "file" : path, 
                "purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "project": project,
                "type": "usestate_statements"
            }
        })
    if function_other:
        function_chunks.append({
            "content" : "\n".join(function_other), 
            "metadata": {
                "file" : path, 
                "purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "project": project,
                "type": "other_function_statements"
            }
        })
    if function_other_lexical:
        function_chunks.append({
            "content" : "\n".join(function_other_lexical), 
            "metadata": {
                "file" : path, 
                "purpose": file_purpose, 
                "function_name" : parent_function,
                "function_purpose" : function_purpose,
                "project": project,
                "type": "other_lexical_statements"
            }
        })
    return function_chunks



def javascript_chunker(path):
    print(path)
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
                        "file" : path, 
                        "purpose": file_purpose, 
                        "function_name" : function_name,
                        "function_purpose" : function_purpose,
                        "project" : project, 
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
                "file": path,
                "purpose" : file_purpose,
                "project": project,
                "type": "imports"
            }
        })
    if file_exports:
        file_chunks.append({
            "content" : "\n".join(file_exports),
            "metadata": {
                "file": path,
                "purpose" : file_purpose,
                "project": project,
                "type": "exports"
            }
        })
    if file_const_var_let:
        file_chunks.append({
            "content" : "\n".join(file_const_var_let), 
            "metadata": {
                "file": path,
                "purpose" : file_purpose,
                "project": project,
                "type": "global_variables_constants"
            }
        })
    if file_top_level_functions:
        file_chunks.append({
            "content" : "\n".join(file_top_level_functions), 
            "metadata": {
                "file": path,
                "purpose" : file_purpose,
                "project": project,
                "type": "Top_level_expressions"
            }
        })
    if file_others:
        file_chunks.append({
            "content" : "\n".join(file_others), 
            "metadata": {
                "file": path,
                "purpose" : file_purpose,
                "project": project,
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


def md_chunker(path):
    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on = [  ("#", "title"), ("##", "section")]
    )
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



def no_split_chunker(path):
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
    return chunks 


def summary_chunker(path):
    if "askmentor_summary.txt" in path:
        json_summary = askmentor_json
    else:
        json_summary = datagenesys_json

    chunks = []

    overview = json_summary["project_overview"]
    chunks.append({
        "content" : json.dumps(overview, indent=2) , 
        "metadata" :{
            "file" : path,
            "purpose" : "High-level project overview",
            "type" :"project_summary", 
            "project" : overview["project_name"], 
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
                "file" : path,
                "purpose" : f"Architecture description for {component}",
                "type" :"architechture", 
                "project" : overview["project_name"], 
                "component" : component, 
                "source" : "Analyst"
                
            }
        })
        

    for file in json_summary["file_level_analysis"]:
        chunks.append({
            "content" : json.dumps(file, indent=2), 
            "metadata" :{
                "file" : path,
                "purpose" :  f"Summary of {file['file_path']}",
                "type" :"file overview", 
                "project" : overview["project_name"], 
                "code_file" : file["file_path"],
                "source" : "Analyst"
                
            }
        })
        

    for skill in json_summary["skills_demonstrated"]:
        chunks.append({
            "content" : json.dumps(skill, indent=2), 
            "metadata" :{
                "file" : path,
                "purpose" :  f"Summary of how I demostrated skill {skill["skill_name"]}",
                "type" :"skill overview", 
                "project" : overview["project_name"], 
                "skill" : skill["skill_name"],
                "source" : "Analyst"
                
            }
        })

    relation_map = json_summary["project_relationship_map"]
    chunks.append({
        "content" : json.dumps(relation_map["imports_and_usage"], indent=2), 
        "metadata" :{
            "file" : path,
            "purpose" : "Shows relationships between files and how components use each other",
            "type": "file_relationships", 
            "project" : overview["project_name"], 
            "source" : "Analyst"
            
        }
    })

    chunks.append({
        "content" : json.dumps(relation_map["important_dependencies"], indent=2), 
        "metadata" :{
            "file" : path,
            "purpose" : "Shows important libraries, frameworks, and dependency relationships",
            "type": "dependencies", 
            "project" : overview["project_name"], 
            "source" : "Analyst"
            
        }
    })

    chunks.append({
        "content" : json.dumps(relation_map["data_flow"], indent=2), 
        "metadata" :{
            "file" : path,
            "purpose" : "Explains how data moves through the application",
            "type": "data_flow", 
            "project" : overview["project_name"], 
            "source" : "Analyst"
            
        }

    })
    return chunks


if __name__ == "__main__":
    create_tree("./evidence/repository/askmentor/frontend/src/channels.js","javascript")