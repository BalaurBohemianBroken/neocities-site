API_HERE="e8e2869dfba7b89f130f55b4b7164b3d"

TOPUSH=$(git diff-tree --no-commit-id --name-only --diff-filter=AM -n 1 HEAD~1..HEAD)
if [ ! -z "$TOPUSH" ]; then
    # I don't fully know how this works.
    # Best I get is that it uses what's defined in IFS to delimit
    # how the string is split into an array.
    # It seems to work with linebreaks fine.
    TOPUSH=($TOPUSH)
    CURRFILE=""
    COMMAND='curl -H "'
    COMMAND+="Authorization: Bearer ${API_HERE}"
    COMMAND+='" '
    # This loop is designed to get the same position in bash (linux) and zsh (mac). zsh normally indexes from 1
    for ((i = 0; i < ${#TOPUSH[@]}; ++i)); do
        CURRFILE=${TOPUSH[*]:$i:1}
        COMMAND+='-F "'
        COMMAND+="${CURRFILE}=@${CURRFILE}"
        COMMAND+='" '
        # I thought about changing this so that it pushes multiple files in a single api call
        # I decided against it,
    done
    COMMAND+='"https://neocities.org/api/upload"'
    echo "here's the push command i'm running!! :)"
    echo $COMMAND
    echo
    eval ${COMMAND}
fi

TODEL=$(git diff-tree --no-commit-id --name-only --diff-filter=D -n 1 HEAD~1..HEAD)
if [ ! -z "$TODEL" ]; then
    # I don't fully know how this works.
    # Best I get is that it uses what's defined in IFS to delimit
    # how the string is split into an array.
    # It seems to work with linebreaks fine.
    TODEL=($TODEL)
    CURRFILE=""
    COMMAND='curl -H "'
    COMMAND+="Authorization: Bearer ${API_HERE}"
    COMMAND+='" '
    # This loop is designed to get the same position in bash (linux) and zsh (mac). zsh normally indexes from 1
    for ((i = 0; i < ${#TODEL[@]}; ++i)); do
        CURRFILE=${TODEL[*]:$i:1}
        COMMAND+='-F "'
        COMMAND+="${CURRFILE}=@${CURRFILE}"
        COMMAND+='" '
        # I thought about changing this so that it pushes multiple files in a single api call
        # I decided against it,
    done
    COMMAND+='"https://neocities.org/api/upload"'
    echo "here's the delete command i'm running!! c:"
    echo $COMMAND
    echo
    #eval ${COMMAND}
fi