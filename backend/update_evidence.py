import subprocess
from database import database
from database import build_database


def get_modified_files():
    result = subprocess.run(
        ["git", "diff", "--diff-filter=M", "--name-only", "HEAD^", "HEAD", "--", "frontend/", "backend/"],
        capture_output =True, 
        text=True,
        check=True
    )
    return result.stdout.splitlines()

def update_evidence():
    modified_files = get_modified_files()
    for file in modified_files:
        path = "./evidence/repository/EVIDENCEAI/evidenceai/" + file
    
        with open(f"../{file}", "r", encoding="utf-8") as f:
            content = f.read()

        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

        database.delete(
            where={"file": path}
        )

        build_database(path)
        
        




if __name__ == "__main__":
    update_evidence()