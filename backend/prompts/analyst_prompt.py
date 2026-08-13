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

    For example -
    {{
     "project_overview": {{
        "project_name": "AskMentor",
        "Description": 
            "A desktop-oriented discussion forum for computer science topics where users 
            can create channels, publish posts and replies, attach files, search content 
            and people, manage profiles, and send direct messages.",
        "main_features": [
            "User signup and login",
            "Channel creation and browsing",
            "Threaded posts and replies within channels",
            "File uploads attached to posts and messages",
            "Post likes and dislikes",
            "Direct messaging between connected users",
            "Search for posts, people, and channels",
            "Profile editing and avatar selection",
            "Social media link management on profiles",
            "Admin deletion of channels, posts, and users"
        ]
    }}

    }}

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
    For each file:
    -File path
    - Purpose
    - Main classes/functions/components
        - For each main component/class/function:
            - use name of main componenet/class/function as shown in code
            - Provide a short description of its responsibility
    - Technologies/skill used such as Programming languages, Frameworks, 
       Libraries, Software engineering concept , Architecture patterns
    Do not miss any file 

    For example :
    {{
        "file_path": "dataScience/datagenisys/nan_handler.py",
        "purpose": "Handles missing values and drops columns with excessive missingness.",
        "main_classes_functions_components": [
            {{
            "name": "NaN_handler",
            "type": "function",
            "description": 
                "Processes missing values in a dataset using imputation strategies 
                and performs column cleaning based on missing value thresholds."
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
        ]
        }}

    
    4. Project Relationship Map
    Explain:
    - Identify important communication relationships between files or components.
        -The goal is to understand how different parts of the application interact.
         For each relationship include:
            - Source: The file/component that initiates the interaction.
            - Destination: The file/component/service it communicates with.
            - how: Explain the purpose of this communication  
        Do NOT include:
            - Third-party library imports
            - Standard library imports
            - Dependency package relationships
    
    - Data flow

    For example -
    {{
       "project_relationship_map": {{
            "component_relationships": [
            {{
                "source": "frontend/src/Channels.jsx",
                "destination": "backend/server.js",
                "how": 
                    "Channels component sends API requests to backend endpoints 
                    to retrieve and update channel and post data."
        
            }},
            {{
                "source": "backend/server.js",
                "destination": "database/models/User.js",
                "how": "Backend uses the User model to retrieve and update user information."
            }}
            ],
            "data_flow": [
            "User submits signup/login on Homepage -> axios POST to server.js -> server 
            validates against MySQL -> frontend stores session_user and possibly 
            isAdmin -> App routing unlocks protected pages.",
            "Channels page loads session_user -> fetches current user details 
            and connections -> fetches channel list -> user selects a channel 
            -> posts are retrieved and displayed with nested replies and files.",
            "Creating a post or reply in Channels -> server inserts post -> 
            frontend optionally uploads files -> server stores files in 
            fileTable -> frontend refreshes channel data.",
            "Messages page loads session_user and selected conversation 
            partner -> fetches messages and attached files -> user sends 
            message -> server inserts message and frontend uploads attachments if present.",
            "Search in Navlink -> backend queries by search type -> user
              navigates to chosen entity -> route state is passed to channels or messages to display the target.",
            "Profile page loads current user and suggestion lists -> user 
            can edit profile fields or add/remove media -> admin mode changes 
            the sidebar to list all users and enable deletions."
            ]
        }}
    
    }}

    
    Together your response should look like -
    {{
        "project_overview": {{
            "project_name": "AskMentor",
            "Description": 
                "A desktop-oriented discussion forum for computer science topics where users 
                can create channels, publish posts and replies, attach files, search content 
                and people, manage profiles, and send direct messages.",
            "main_features": [
                "User signup and login",
                "Channel creation and browsing",
                "Threaded posts and replies within channels",
                "File uploads attached to posts and messages",
                "Post likes and dislikes",
                "Direct messaging between connected users",
                "Search for posts, people, and channels",
                "Profile editing and avatar selection",
                "Social media link management on profiles",
                "Admin deletion of channels, posts, and users"
            ]
        }}
        "architecture":{{
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
        "file_level_analysis":{{
            "file_path": "dataScience/datagenisys/nan_handler.py",
            "purpose": "Handles missing values and drops columns with excessive missingness.",
            "main_classes_functions_components": [
                {{
                "name": "NaN_handler",
                "type": "function",
                "description": 
                    "Processes missing values in a dataset using imputation strategies and 
                    performs column cleaning based on missing value thresholds."
                }},
                {{
                "name": "remove_high_missing_columns",
                "type": "function",
                "description": 
                    "Identifies and removes columns that contain missing values above the configured threshold."
                }}
            ],
            "technologies_used": [
                "sklearn.impute.SimpleImputer",
                "NumPy",
                "pandas"
            ]
        }}
        "project_relationship_map": {{
            "component_relationships": [
            {{
                "source": "frontend/src/Channels.jsx",
                "destination": "backend/server.js",
                "how": "Channels component sends API requests to backend endpoints to retrieve 
                        and update channel and post data."
        
            }},
            {{
                "source": "backend/server.js",
                "destination": "database/models/User.js",
                "how": "Backend uses the User model to retrieve and update user information."
            }}
            ],
            "data_flow": [
            "User submits signup/login on Homepage -> axios POST to server.js -> 
            server validates against MySQL -> frontend stores session_user and 
            possibly isAdmin -> App routing unlocks protected pages.",
            "Channels page loads session_user -> fetches current user details 
            and connections -> fetches channel list -> user selects a channel -> 
            posts are retrieved and displayed with nested replies and files.",
            "Creating a post or reply in Channels -> server inserts post -> 
            frontend optionally uploads files -> server stores files in fileTable -> 
            frontend refreshes channel data.",
            "Messages page loads session_user and selected conversation partner -> 
            fetches messages and attached files -> user sends message -> server 
            inserts message and frontend uploads attachments if present.",
            "Search in Navlink -> backend queries by search type -> user navigates 
            to chosen entity -> route state is passed to channels or messages to display the target.",
            "Profile page loads current user and suggestion lists -> user can 
            edit profile fields or add/remove media -> admin mode changes the 
            sidebar to list all users and enable deletions."
            ]
        }}      
    
    }}
    
    
    Use same field name. Do not change field names. 
    
    Avoid:
    - DO NOT HALLUCINATE
    - Making assumptions
    - Adding technologies not present in the code
    - Inventing features

    """
)