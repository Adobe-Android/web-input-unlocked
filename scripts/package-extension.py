import zipfile
import pathlib

def main():
    directory = pathlib.Path.cwd()
    filenames = ["LICENSE", "manifest.json"]
    node_modules_directory = pathlib.Path("node_modules")

    with zipfile.ZipFile("extensions/chromium/web-input-unlocked.zip", mode="w") as archive:
        for file_path in directory.glob("src/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("popups/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("assets/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("icons/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for filename in filenames:
            archive.write(filename)
        for file_path in node_modules_directory.rglob("*"):
            archive.write(file_path, arcname=file_path)

    with zipfile.ZipFile("extensions/chromium/web-input-unlocked.zip", mode="r") as archive:
        archive.printdir()

if __name__ == '__main__':
    main()