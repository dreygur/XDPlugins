# /bin/bash

###
# Processing for Lorem Ipsum samples.
###

if [ $# -ne 2 ]; then
	echo "Syntax: $0 <input file> <output JSON>"
	exit 1
fi

cat $1 | 
    tr '[:upper:]' '[:lower:]' |
    sed -E "s/\s+/\n/g" |
    jq --raw-input . |
    jq --slurp . > $2