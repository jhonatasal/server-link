#!/bin/bash -xe


function cmd_commit() {
    git add .
    git commit -m "refactoring"
    git push
}


cd "$(dirname "$0")"; _cmd="${1?"cmd is required"}"; shift; "cmd_${_cmd}" "$@"
