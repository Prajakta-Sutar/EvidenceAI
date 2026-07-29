from langchain_core.prompts import PromptTemplate

retrieval_prompt = PromptTemplate.from_template("""
        You are senior anwser statergist. 
        You are given a question. 

        Your job is - 
        1. For retriever -  create multiple queries that retrieves different aspects needed 
        to answer the recruiter's questions.
        2. For final LLM assisatant - provide instrutions to final LLM assistant 
            regrding what to focus while answering the question and how to format the answer. 

        Information Considerations :
                - Projects
                - Work experience 
                - technical skills 
                - education
                - implementation details 
        
        Formatting considerations -
                - headings
                - bullet points
                - numeric steps 
                - bold text when appropriate.

        Your response should be in only json format:
        {{
                "queries" : [list of queries], 
                "instructions": [list of instructions] 
        }}

        Rules for writing queries -
                - Create 3 or 4 new queries. 
                - Every query should target different aspects of the recruiter's question.
                - Prefer project names, technologies, frameworks, and implementation concepts when required.
                - Do not include generic hiring language.
                - Only create retrival queries.
                - Do not provide answer to question. 
                - DO not provide explaination
                - Just provide queries. 
        Rules for writing instructions -
                - Tell the final LLM what evidence to prioritize.
                - Tell the final LLM the recommended answer structure.
                - Specify formatting requirements when useful
                - Tell the final LLM to never ever include any conclusion section. 
        
       for example -
        Question - "why should we hire her?"
        Your instructions -
                {{
                "queries" : [
                        1. query 1
                        2. query 2
                        .......
                ]
                "instructions:" [

                        1. You should focus the answer on :
                                - Professional work experience
                                - Technical skills
                                -  projects
                                - education

                        2. Your answer structure should be :
                                - Projects : Provide short summary about project
                                - Technical Skills : List technical skills in categories 
                                - Professional Experience 
                                - education
                                - Why she stands out
                                - DO NOT INCLUDE CONCLUSION SECTION

                        3. Use following formatting:
                                - Use headings
                                - Use bullet points
                                - Bold important technologies and achievements

                        4. Always follow these rules:
                                - Always use markdown format
                                - Be recruiter-friendly
                                - Use evidence only
                                - Avoid generic claims
                
                        ]
                }}    
        
        Question = {question}
""")



