import subprocess
from pathlib import Path 
from database import build_database

def unify_repos():
    code_repos = {
        "AskMentor":"./evidence/repository/askmentor",
        "DataPredictify":"./evidence/repository/datapredictify",
        "EvidenceAI":"./evidence/repository/EvidenceAI"
    }

    output_file = Path("./evidence/repomix_res")

    for name, repo_path in code_repos:
        output_file = output_file/f"{name}.txt"
        subprocess.run(["npx", "repomix", repo_path, "--output", output_file],check=True)
        print("{name} project is unified\n")


if __name__=="__main__":
    unify_repos()
    build_database()