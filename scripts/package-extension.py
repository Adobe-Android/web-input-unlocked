import sys
import zipfile
import pathlib

def main(*args):
    directory = pathlib.Path.cwd()
    node_modules_directory = pathlib.Path("node_modules")

    if args[0]:
        for arg in args[0]:
            if arg in ["chromium", "chrome"]:
                package_chromium(directory, node_modules_directory)
            elif arg in "firefox":
                package_firefox(directory, node_modules_directory)
            else:
                print("Invalid argument passed.")
                print("Only chrome, chromium, and firefox are valid arguments.")
    else:
        print("No arguments found.")
        print("Only chrome, chromium, and firefox are valid arguments.")

def package_chromium(directory, node_modules_directory):
    filenames = ["LICENSE"]

    with zipfile.ZipFile("extensions/chromium/web-input-unlocked.zip", mode="w") as archive:
        for file_path in directory.glob("src/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("popups/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("assets/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("icons/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("platform/chromium/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for filename in filenames:
            archive.write(filename)
        for file_path in node_modules_directory.rglob("*"):
            archive.write(file_path, arcname=file_path)

    with zipfile.ZipFile("extensions/chromium/web-input-unlocked.zip", mode="r") as archive:
        archive.printdir()
        print(archive.filename)

def package_firefox(directory, node_modules_directory):
    filenames = ["LICENSE"]

    with zipfile.ZipFile("extensions/firefox/web-input-unlocked.zip", mode="w") as archive:
        for file_path in directory.glob("src/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("popups/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("assets/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("icons/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for file_path in directory.glob("platform/firefox/*"):
            archive.write(file_path, arcname=file_path.relative_to(directory))
        for filename in filenames:
            archive.write(filename)
        for file_path in node_modules_directory.rglob("*"):
            archive.write(file_path, arcname=file_path)

    with zipfile.ZipFile("extensions/firefox/web-input-unlocked.zip", mode="r") as archive:
        archive.printdir()
        print(archive.filename)
    
    # https://extensionworkshop.com/documentation/publish/package-your-extension/
    extension_name = pathlib.Path(archive.filename)
    extension_name = extension_name.replace(extension_name.with_suffix(".xpi"))
    print(extension_name)

if __name__ == '__main__':
    sys.argv.pop(0)
    main(sys.argv)