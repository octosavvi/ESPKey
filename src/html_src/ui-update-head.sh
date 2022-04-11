#!/bin/sh

TARGET=${1:-192.168.4.1}
UPLOAD_PATH=${2:-$(mktemp -d)}

list_files () {
    curl -s "http://${TARGET}/list?dir=/" \
    | sed 's/},{/\n/g;s/^\[{//;s/}]$/\n/' \
    | awk -F'"' '$4=="file"{print$8}'
}

delete_all () {
    for F in $(list_files); do
	case "$F" in
	    'log.txt'|'config.json'|'auth.txt') echo Skipping $F; continue;;
	esac
	echo Deleting $F
	curl -sX DELETE "http://${TARGET}/edit?path=/${F}"
    done
}

upload_dir () {
    HERE=$(pwd)
    DPATH="${HERE##${CHOP:=$HERE}}"
    for F in *; do
	if [ -f "$F" ]; then
	    echo Uploading $F
	    curl -F "f=@${F};filename=${DPATH}/${F}" http://${TARGET}/edit
	elif [ -d "$F" ]; then
	    cd $F
	    upload_dir
	    cd ..
	fi
    done
}

if [ -d "$UPLOAD_PATH" ]; then
    cd "$UPLOAD_PATH"
    glob=*
    cd - >/dev/null
    if [ "$glob" = "*" ]; then
	# UPLOAD_PATH directory is empty so we need to extract files
	#awk '{if(p)print}/^exit 0$/{p=1;ORS=RS=""}' $0 | tar -jxf - -C "$UPLOAD_PATH"
	tail -n +$(awk '/^exit 0$/{print NR+1}' $0) $0 | tar -jxf - -C "$UPLOAD_PATH"
    fi
    echo "Attempting to update UI on $TARGET"
    delete_all
    cd "$UPLOAD_PATH"
    upload_dir
else
    echo "Not sure where to upload from.  Is $UPLOAD_PATH a valid directory?"
fi

exit 0
