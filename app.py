import os
import json

def main():
    dirs = os.listdir()
    target_dirs = []

    for i in dirs:
        if not os.path.isdir(i): dirs.remove(i)

    for dir in dirs:
        manifest = os.path.join(os.getcwd(), dir, 'manifest.json')
        with open(manifest, 'r', encoding='utf-8') as f:
            name = json.load(f)["name"]
            target_dirs.append(name)

    for i, j in zip(dirs, target_dirs):
        os.rename(i, j)
        print(f"[Rename] {i} -> {j}")

if __name__ == "__main__":
    main()

"""
modules
function
variable
method
list
for loop
conditional login
file operation
json
dictionary

"""