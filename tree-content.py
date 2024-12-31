import os
import fnmatch
import time
import signal
from dataclasses import dataclass
from typing import List, Dict, Optional, Set
from tqdm import tqdm
from datetime import datetime

@dataclass
class DirectoryContext:
    path: str
    includes: List[str]
    excludes: List[str]
    subdirs: Dict[str, 'DirectoryContext']

class GradleScanner:
    def __init__(self):
        self.interrupted = False
        signal.signal(signal.SIGINT, self._handle_interrupt)
        
    def _handle_interrupt(self, signum, frame):
        self.interrupted = True
        print("\nGracefully shutting down...")

    def _matches_any_pattern(self, path: str, patterns: List[str], base_path: str) -> bool:
        rel_path = os.path.relpath(path, base_path)
        return any(fnmatch.fnmatch(rel_path, pattern) for pattern in patterns)

    def _should_include_file(self, path: str, context: DirectoryContext) -> bool:
        if not context.includes and not context.excludes:
            return True
        
        if self._matches_any_pattern(path, context.excludes, context.path):
            return False
            
        if context.includes:
            return self._matches_any_pattern(path, context.includes, context.path)
            
        return True

    def _find_matching_subcontext(self, path: str, context: DirectoryContext) -> Optional[DirectoryContext]:
        rel_path = os.path.relpath(path, context.path)
        parts = rel_path.split(os.sep)
        
        current = context
        for part in parts[:-1]:
            if part in current.subdirs:
                current = current.subdirs[part]
            else:
                return None
        return current

    def scan(self, root_context: DirectoryContext, output_file: Optional[str] = None) -> Set[str]:
        matched_files = set()
        total_files = sum([len(files) for _, _, files in os.walk(root_context.path)])
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = output_file or f"scan_results_{timestamp}.txt"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            with tqdm(total=total_files, desc="Scanning files") as pbar:
                for root, dirs, files in os.walk(root_context.path):
                    if self.interrupted:
                        break
                        
                    context = self._find_matching_subcontext(root, root_context) or root_context
                    
                    for file in files:
                        pbar.update(1)
                        file_path = os.path.join(root, file)
                        
                        if self._should_include_file(file_path, context):
                            matched_files.add(file_path)
                            rel_path = os.path.relpath(file_path, root_context.path)
                            depth = rel_path.count(os.sep)
                            prefix = "|   " * depth
                            f.write(f"{prefix}+-- {file}\n")
                            
                            try:
                                with open(file_path, 'r', encoding='utf-8') as content_file:
                                    content = content_file.read()
                                    f.write(f"{prefix}    Content: {len(content)} bytes\n")
                            except Exception as e:
                                f.write(f"{prefix}    Error reading content: {str(e)}\n")
        
        if self.interrupted:
            print(f"\nScan interrupted. Partial results saved to {output_file}")
        else:
            print(f"\nScan complete. Results saved to {output_file}")
            
        return matched_files

def create_context(config: dict) -> DirectoryContext:
    path = config['directory']
    includes = config.get('include', [])
    if isinstance(includes, str):
        includes = [includes]
    excludes = config.get('exclude', [])
    if isinstance(excludes, str):
        excludes = [excludes]
        
    subdirs = {}
    for subdir_name, subdir_config in config.get('directories', {}).items():
        subdirs[subdir_name] = create_context({
            'directory': os.path.join(path, subdir_name),
            **subdir_config
        })
        
    return DirectoryContext(path, includes, excludes, subdirs)

if __name__ == "__main__":
    config = {
        'directory': 'TFSProjects/MarketNet/MarketNetWeb',
        'include': ['**/*.java'],
        'exclude': [
            'WebContent/**', 
            'bin/**', 
            'temp/**',
            '**/BE_*.java',
            '**/UC_*.java',
            '**/FWTL_*.java',
            '**/FWTLS_*.java',
            '**/*EXE.java',
            '**/*_BE_*.java',
            '**/CE_*.java',
            '**/EF_*.java',
            '**/PV_*.java',
            '**/SCSV_*.java',
            '**/PVE_*.java',
            '**/DPVC_*.java',
            '**/BJEX_*.java',
            '**/BJE_*.java',
            '**/Get*.java',
            '**/X*.java',
            '**/Y*.java',
            '**/Z*.java',
            '**/D*.java',
            '**/E*.java',
            '**/F*.java',
            '**/G*.java',
            '**/H*.java',
            '**/I*.java',
            '**/J*.java',
            '**/K*.java',
            '**/L*.java',
            '**/M*.java'
        ],
        'directories': {
            'src': {
                'exclude': '*.json',
                'include': 'special/*.json'
            }
        }
    }
    
    context = create_context(config)
    scanner = GradleScanner()
    matched_files = scanner.scan(context)