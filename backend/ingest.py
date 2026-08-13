import subprocess
from pathlib import Path 
import os 
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from prompts.analyst_prompt import analyst_prompt



load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

assistant_llm = ChatOpenAI(
    model="gpt-5.6-luna",
    temperature=0.5,
    api_key=os.getenv("OPENAI_API_KEY")
)


def analyst(project, name):
    with open(project, "r") as f:
        repository_file = f.read() 
    repository = {'project': repository_file}
    modified_prompt = analyst_prompt.invoke(repository)
    response = assistant_llm.invoke(modified_prompt)
    output_dir = Path("./evidence/summary")
    output_file = output_dir / f"{name}.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(response.content)


def unify_repos():
    code_repos = {
        "askmentor":"./evidence/repository/ASKMENTOR",
        "datapredictify":"./evidence/repository/DATAPREDICTIFY",
        "evidenceai":"./evidence/repository/EVIDENCEAI"
    }

    output_repo = Path("./evidence/repomix_res")

    for name, repo_path in code_repos. items():
        output_file = output_repo/f"{name}.txt"
        subprocess.run(["npx", "repomix", repo_path, "--output", output_file],check=True)
        analyst(output_file,name)

if __name__=="__main__":
    unify_repos()
