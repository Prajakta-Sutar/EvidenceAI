import os
import subprocess

def get_modified_files():
    result = subprocess.run(
        [
        "git",
        "diff",
        "--name-status",
        "HEAD^",
        "HEAD",
        "--",
        "frontend/src",
        "backend/",
        "cloudrun.yaml",
        ".github/workflows",
        ":!frontend/public",
        ":!frontend/src/assets",
        ":!backend/__pycache/",
        ":!backend/evidence/",
        ":!backend/portfolio_database/"
    ],
        capture_output =True, 
        text=True,
        check=True
    )
    return [ line.split("\t", 1) for line in result.stdout.splitlines()]

def update_evidence():
    modified_files = get_modified_files()
    for status, file in modified_files:
        path = "./backend/evidence/repository/EVIDENCEAI/evidenceai/" + file
        if status in ["M", "A"]:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(file, "r", encoding="utf-8") as f:
                content = f.read()

            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print('Updated', file)

        if status == "D":
            if os.path.exists(path):
                os.remove(path)


if __name__ == "__main__":
    update_evidence()