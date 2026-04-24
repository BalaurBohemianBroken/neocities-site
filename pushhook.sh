API_HERE=""
IFS=$'\n'  # Ensures we only split the string of results by newline.
# Check what files were modified or added in the last commit.
TOPUSH=$(git diff-tree --no-commit-id --name-only -r --diff-filter=AM -n 1 HEAD~1..HEAD)
if [ ! -z "$TOPUSH" ]; then
    TOPUSH=($TOPUSH)
    CURRFILE=""
    COMMAND='curl -H "'
    COMMAND+="Authorization: Bearer ${API_HERE}"
    COMMAND+='" '
    # This loop is designed to get the same position in bash (linux) and zsh (mac). zsh normally indexes from 1
    for ((i = 0; i < ${#TOPUSH[@]}; ++i)); do
        # Ensures we push all the files in a single API call.
        CURRFILE=${TOPUSH[*]:$i:1}
        COMMAND+='-F "'
        COMMAND+="${CURRFILE}=@${CURRFILE}"
        COMMAND+='" '
    done
    COMMAND+='"https://neocities.org/api/upload"'
    echo "here's the push command i'm running!! :)"
    echo $COMMAND
    echo
    eval ${COMMAND}
fi

# This is largely a mirror of the above command, changed to work with a deletion request.
# Check what files were deleted in the last commit.
TODEL=$(git diff-tree --no-commit-id --name-only -r --diff-filter=D -n 1 HEAD~1..HEAD)
if [ ! -z "$TODEL" ]; then
    TODEL=($TODEL)
    CURRFILE=""
    COMMAND='curl -H "'
    COMMAND+="Authorization: Bearer ${API_HERE}"
    COMMAND+='" '
    for ((i = 0; i < ${#TODEL[@]}; ++i)); do
        CURRFILE=${TODEL[*]:$i:1}
        COMMAND+='-d "'
        COMMAND+="filenames[]=${CURRFILE}"
        COMMAND+='" '
    done
    COMMAND+='"https://neocities.org/api/delete"'
    echo "here's the delete command i'm running!! c:"
    echo $COMMAND
    echo
    eval ${COMMAND}
fi