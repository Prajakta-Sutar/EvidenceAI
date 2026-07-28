from langchain_core.prompts import PromptTemplate

retrieval_prompt = PromptTemplate.from_template("""
        You are query generator for retrieval.
        Your job is to create multiple queries that retrieves 
        different aspects needed to answer the recruiter's questions. 
        Consider :
        - Projects
        - Work experience
        - technical skills 
        - education
        - implementation details 

        Only create retrival queries 
""")



