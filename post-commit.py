# To add files to an existing commit you need to get hacky. Based on: https://stackoverflow.com/a/12802592

# In pre-commit:
# touch .automated_commit

# In post-commit:
#if [ -e .automated_commit ]
#    then
#    rm .automated_commit
#    python3 post-commit.py
#    git commit --amend -C HEAD --no-verify
#fi

import subprocess
import sys
import re
from pathlib import Path
from datetime import datetime

class VersionTrackingFile:
    versions_location = Path("Resources/PageData/Version")
    re_version = r"v\.(\d+)\.(\d+)"
    
    def __init__(self, write_to, master_file, *patterns):
        self.write_to = VersionTrackingFile.versions_location / Path(write_to)
        self.master_file = master_file  # .html file that has version number within it. 
        self.patterns = patterns  # Regex for any other files that should trigger an update.
    
    def check_match(self, path_to_check):
        if (path_to_check == self.master_file):
            return True
        for pattern in self.patterns:
            if re.match(pattern, path_to_check):
                return True
        return False
    
    def update_version(self, msg):
        current_version = 0
        file_content = ""
        if self.write_to.is_file():
            with open(self.write_to, "r") as f:
                line = f.readline()
                current_version = re.match(VersionTrackingFile.re_version, line).group(1)
                current_version = int(current_version)
                f.seek(0)
                file_content = f.read()
        current_version += 1
        date = datetime.utcnow().strftime('%Y%m%d')
        version = f"v.{current_version}.{date}"
        file_content = f"{version} {msg}\n{file_content}"
        with open(self.write_to, "w") as f:
            f.write(file_content)
        subprocess.check_output(["git", "add", self.write_to])
            
            
def get_commit_message():
    return subprocess.check_output(["git", "log", "-1", "--pretty=%B"]).decode().strip()


def get_commit_files():
    output = subprocess.check_output(["git", "diff-tree", "--no-commit-id", "--name-only", "HEAD", "-r"])
    staged_files = { path.decode() for path in output.split(b"\n") if path }
    return staged_files


trackers = []
trackers.append(VersionTrackingFile("_.txt", "index.html", r"Resources\/Console\/.+"))
trackers.append(VersionTrackingFile("terminus.txt", "terminus.html", r"Resources\/Terminus\/.+"))
trackers.append(VersionTrackingFile("MEMORIES OF HIM.txt", "MEMORIES OF HIM.html", r"Resources\/MEMORIES OF HIM\/.+"))

to_check = get_commit_files()
trackers_to_run = set()
for f in to_check:
    for tracker in trackers:
        if tracker.check_match(f):
            trackers_to_run.add(tracker)

# Prepend to version file
version_message = get_commit_message()
for tracker in trackers_to_run:
    tracker.update_version(version_message)

# Update version in tracked file