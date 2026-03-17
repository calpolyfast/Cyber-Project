# First argument is the instance id, second argument is the script, additional arguments are passed to the script

## Example
# http://test-2-id.localhost:3000/?search=%253Cimg%2520src%253D%2522%2522%2520onerror%253D%2522alert%281%29%2522%253E

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Error: missing required argument"
    exit 1
fi

INSTANCE_ID="$1"
SCRIPT="$2"

shift 2

kubectl exec -i ${INSTANCE_ID} -c browser -- node $SCRIPT "$@"