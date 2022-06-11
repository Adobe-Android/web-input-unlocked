import zipfile
import pathlib

directory = pathlib.Path.cwd()
filenames = ["LICENSE", "manifest.json"]

with zipfile.ZipFile("extensions/chromium/web-input-unlocked.zip", mode="w") as archive:
    for file_path in directory.glob("src/*"):
        archive.write(file_path, arcname=file_path.relative_to(directory))
    for file_path in directory.glob("popups/*"):
        archive.write(file_path, arcname=file_path.relative_to(directory))
    for file_path in directory.glob("node_modules/*"):
        archive.write(file_path, arcname=file_path.relative_to(directory))
    for file_path in directory.glob("assets/*"):
        archive.write(file_path, arcname=file_path.relative_to(directory))
    for file_path in directory.glob("icons/*"):
        archive.write(file_path, arcname=file_path.relative_to(directory))
    for filename in filenames:
        archive.write(filename)

with zipfile.ZipFile("extensions/chromium/web-input-unlocked.zip", mode="r") as archive:
    archive.printdir()