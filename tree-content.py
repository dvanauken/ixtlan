#!/usr/bin/env python3
import os
import fnmatch
from datetime import datetime
import sys

# List of folders and files to exclude, with the ability to use specific paths and wildcards
EXCLUDE_FOLDERS = {
    "src/app",
    "src/components/ixt-accordianxx",
    "src/components/ixt-breadcrumbxx",
    "src/components/ixt-buttonxx",
    "src/components/ixt-calendarxx",
    "src/components/ixt-canvasxx",
    "src/components/ixt-chartxx",
    "src/components/ixt-colorpallettexx",
    "src/components/mapx",
    "src/components/map-viewxx",

    "src/components/ixt-diagramxx",
    "src/components/ixt-expression-builderxx",
    "src/components/ixt-formxx",
    "src/components/ixt-imagex",
    "src/components/ixt-layer-managerx",
    "src/components/ixt-mapxx",
    "src/components/ixt-menuxx",
    "src/components/ixt-panelxx",
    "src/components/ixt-progressxx",
    "src/components/ixt-splitpanex",
    "src/components/ixt-tabsetx",
    "src/components/ixt-textrax",
    "src/components/ixt-treexx",
    "src/components/ixt-viewportxx",
    "src/components/ixt-colorpalettex",
    "src/components/ixt-dialogx",
    "*.spec.ts",
    "*.scss",
    "*.pdf",
    "*.js",
    "*.json",
    "*.geojson",
    "*.ps1",
    "*.py",
    "*.bat",
    "test",
    "assets",
    "tree.*.txt", 
    "*.geojson",
    "src/assets/110m/*.html",
    "node_modules", 
    ".git", 
    ".gitignore",
    ".editorconfig",
    "dist", 
    ".idea",
    ".angular/cache/**",  # This will exclude everything under the .angular/cache directory
    "error.txt",
    "LICENSE",
    ".npmrc",
    "README.md",
    "branding.html",
    "editorconfig",
    "polyfills.ts",
    "src/fonts.html",
    "src/colors.html",
    "src/favicon.ico",
    "src/polyfills.ts", 
    "TiltedPerspective.gif", "TiltedPerspective.jpg", "TiltedPerspective.png",
    "dist/ixtlan/fesm2022",
    "dist/ixtlan/esm2022",
    "*.html"

}

# Common image file extensions to ignore content
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".ico"}

def show_tree(path=".", prefix="", output_file=None):
    try:
        items = []
        with os.scandir(path) as it:
            for entry in it:
                full_path = os.path.relpath(entry.path, start=os.path.dirname(__file__))  # Get relative path from script location
                # Check if any pattern matches the full relative path
                if any(fnmatch.fnmatch(full_path, pattern) for pattern in EXCLUDE_FOLDERS):
                    continue
                items.append(entry)
        
        items.sort(key=lambda x: (not x.is_dir(), x.name))
        
        for i, item in enumerate(items):
            is_last = (i == len(items) - 1)
            if item.is_file():
                current_prefix = f"{prefix}--- "
            elif is_last:
                current_prefix = f"{prefix}\\-- "
                next_prefix = f"{prefix}    "
            else:
                current_prefix = f"{prefix}+-- "
                next_prefix = f"{prefix}|   "
            
            line = current_prefix + item.name
            
            if item.is_file():
                ext = os.path.splitext(item.name)[1].lower()
                if ext in IMAGE_EXTENSIONS:
                    line += ": <image file>"
                else:
                    try:
                        with open(item.path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            content_summary = ' '.join(content.split())
                            line += f": {content_summary}" if content_summary else ": <empty file>"
                    except Exception:
                        line += ": <error reading file>"
            
            with open(output_file, 'a', encoding='utf-8') as f:
                f.write(line + '\n')
            
            if item.is_dir():
                show_tree(item.path, next_prefix, output_file)
    except Exception as e:
        print(f"Error processing path {path}: {str(e)}", file=sys.stderr)

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "."
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    output_file = f"tree.{timestamp}.txt"

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            pass  # Just to ensure the file is created/emptied
        
        show_tree(path, "", output_file)
        
        print(f"Directory structure saved to {output_file}.")
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
