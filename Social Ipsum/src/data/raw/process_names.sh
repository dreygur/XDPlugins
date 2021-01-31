# /bin/bash

###
# Takes raw CSV name data from Social Security and Census databases and
# converts into a JSON array.
###

if [ $# -ne 2 ]; then
	echo "Syntax: $0 <input CSV> <output JSON>"
	exit 1
fi

cat $1 | 
    sort -t$',' -k3 -n -r |
    cut -d',' -f1 |
    tr '[:upper:]' '[:lower:]' |
    sed 's/^./\U&\E/g' |
    head -n 250 |
    jq --raw-input . |
    jq --slurp . > $2
