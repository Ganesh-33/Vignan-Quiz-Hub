import os

root_directory = "."
output_name = "plain.txt"
ignored = {".git", "node_modules", ".agents", "__pycache__", ".vscode", output_name}

with open(output_name, "w", encoding="utf-8") as f_out:
    for root, dirs, files in os.walk(root_directory):
        dirs[:] = [d for d in dirs if d not in ignored]
        
        for name in files:
            path = os.path.join(root, name)
            
            try:
                with open(path, "r", encoding="utf-8") as f_in:
                    data = f_in.read()
                    f_out.write("=" * 60 + "\n")
                    f_out.write(f"PATH: {path}\n")
                    f_out.write("=" * 60 + "\n")
                    f_out.write(data)
                    f_out.write("\n\n")
            except:
                continue