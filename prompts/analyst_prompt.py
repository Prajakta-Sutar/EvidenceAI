from langchain_core.prompts import PromptTemplate

analyst_prompt = PromptTemplate.from_template(
    """
    Repository : {Project}
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

        Example:

        {
        "backend": {
            "technology": "FastAPI",
            "evidence": {
            "file": "main.py",
            "reason": "Creates FastAPI application instance and defines API routes"
            }
        }
        }

    3. File-Level Analysis
    For each important file:
    -File path
    - Purpose
    - Main classes/functions/components
    - Technologies used
    - Imports/dependencies
    - Relationship with other files

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