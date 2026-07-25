from langchain_core.prompts import PromptTemplate

analyst_prompt = PromptTemplate.from_template(
    """
    Repository : {project}
    You are Senior Software Engineer analysing the project repository. 
    Analyze the project repository provid above. 
    
    Your goal is to create a knowledge that will be used in 
    Retrival Agumented generation system. 
    Do not give a generic summary. 
    Extract detailed technical information that helps answer 
    questions about the codebase. 

    Return only valid JSON.
    Do not include explanations outside JSON

    Analyze:

    1. Project Overview
    - Project name 
    - What problem does this project solve? What is main focus of the project ?
    - Main features

    2. Architecture
    - Frontend technologies
    - Backend technologies
    - Database/storage
    - External APIs
    - Communication flow between these components


    For each technology or architectural decision provide:
        - Technology name
        - Supporting file path(s)
        - Evidence explaining why this technology is used

        Create a separate evidence entry for each supporting file.
        Do not combine multiple files into a single evidence explanation.

        For Example:

        {{
        "frontend": {{
            "technology": "React",
            "evidence": [
                {{
                    "file": "src/App.js",
                    "reason": "Defines the main React component and configures application routing."
                }},
                {{
                    "file": "src/channels.js",
                    "reason": "Implements a React functional component for displaying and managing channel data."
                }}
            ]
        }}
        }}

    3. File-Level Analysis
    For each important file:
    -File path
    - Purpose
    - Main classes/functions/components
        - For each main component/class/function:
            - use name of main componenet/class/function as shown in code
            - Provide a short description of its responsibility
    - Technologies used
    - Imports/dependencies
    - Relationship with other files

    For example :
    {{
        "file_path": "dataScience/datagenisys/nan_handler.py",
        "purpose": "Handles missing values and drops columns with excessive missingness.",
        "main_classes_functions_components": [
            {{
            "name": "NaN_handler",
            "type": "function",
            "description": "Processes missing values in a dataset using imputation strategies and performs column cleaning based on missing value thresholds."
            }},
            {{
            "name": "remove_high_missing_columns",
            "type": "function",
            "description": "Identifies and removes columns that contain missing values above the configured threshold."
            }}
        ],
        "technologies_used": [
            "sklearn.impute.SimpleImputer",
            "NumPy",
            "pandas"
        ],
        "imports_dependencies": [
            "from sklearn.impute import SimpleImputer",
            "import numpy as np",
            "import pandas as pd"
        ],
        "relationships_with_other_files": [
            "Called by views.get_dataset before encoding and modeling."
        ]
        }}


    4. Skills Demonstrated
    Extract skills shown by the code:
    - Programming languages
    - Frameworks
    - Libraries
    - Software engineering concepts
    - Architecture patterns
    
    For each skill, identify all relevant evidence from the repository.
    Include multiple files if the skill appears in multiple places.
    
    And for each skill 
        - Skill name
        - Evidence file path
        - Function/class/component
        - Explanation

    
    5. Project Relationship Map
    Explain:
    - Which files import/use other files
    - Important dependencies
    - Data flow

    Avoid:
    - DO NOT HALLUCINATE
    - Making assumptions
    - Adding technologies not present in the code
    - Inventing features

    """
)