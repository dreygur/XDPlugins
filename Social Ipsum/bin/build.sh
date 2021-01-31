# /bin/bash

DIST_PATH=$(dirname $(dirname $(readlink -f "$0")))

PKG_NAME=$(
  grep '"name"' $DIST_PATH/manifest.json |
  sed -E 's/\s?"name"\s?:\s?"//' |
  sed -E 's/",?$//')

SAFE_NAME=$(echo $PKG_NAME | sed -E 's/\W+//')

TAG="${1:-$(git rev-parse HEAD)}"

FNAME="$SAFE_NAME-$TAG.xdx"
echo -e "\e[32mpackaging\e[0m: $SAFE_NAME@$TAG -> $DIST_PATH/releases/$FNAME"

(cd $DIST_PATH ;
	zip -r ./releases/$FNAME ./* -x ./bin* -x *.git* -x ./release* -x ./src/data/raw*)