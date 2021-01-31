# /bin/bash

###
# Processing for British National Corpus word frequency lists
# found at <http://ucrel.lancs.ac.uk/bncfreq/>.
###

if [ $# -ne 2 ]; then
	echo "Syntax: $0 <input file> <output JSON>"
	exit 1
fi

cat $1 | 
    cut -f2 |
    jq --raw-input . |
    jq --slurp . > $2