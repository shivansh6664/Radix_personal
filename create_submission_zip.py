import os
import zipfile

def create_code_zip():
    repo_root = r"C:\Users\pandi\.gemini\antigravity\scratch\RADIX"
    out_dir = r"C:\Users\pandi\Downloads"
    zip_path = os.path.join(out_dir, "Code.zip")
    
    exclude_dirs = {".git", "node_modules", "__pycache__", ".vscode", "dist", "build"}
    exclude_files = {".env", "Code.zip"}

    print(f"Creating submission zip at: {zip_path}")
    count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(repo_root):
            # Modify dirs in-place to avoid descending into excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files:
                    continue
                # Exclude any other secret files or large generated binaries
                if file.endswith((".pyc", ".pyo")):
                    continue
                    
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, repo_root)
                zf.write(full_path, rel_path)
                count += 1
                
    print(f"Successfully packaged {count} files into {zip_path} (size: {os.path.getsize(zip_path)/1024:.1f} KB)")

if __name__ == "__main__":
    create_code_zip()
