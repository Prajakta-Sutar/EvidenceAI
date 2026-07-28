from langchain_core.prompts import PromptTemplate

retrieval_prompt = PromptTemplate.from_template("""
        You are query generator for retrieval.
        You are given a question. 
        Your job is to create multiple queries that retrieves 
        different aspects needed to answer the recruiter's questions. 


        Consider :
                - Projects
                - Work experience
                - technical skills 
                - education
                - implementation details 
        
        Rules :
                - Create 3 or 4 new queries. 
                - Every query should target different aspects of the recruiter's question.
                - Prefer project names, technologies, frameworks, and implementation concepts when required.
                - Do not include generic hiring language.
                - Only create retrival queries.
                - Do not provide answer to question. 
                - DO not provide explaination
                - Just provide queries. 

        
        
        Question = {question}
""")



