#!/bin/sh

TARGET=${1:-192.168.4.1}
UPLOAD_PATH=${2:-../data/}

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

upload_file () {
    curl -F "f=@${1};filename=${2}/${1}" http://${TARGET}/edit
}

upload_dir () {
    for F in *; do
	if [ -f "$F" ]; then
	    echo Uploading $F
	    DPATH="${PWD##${CHOP:=$PWD}}"
	    case "$F" in
		*.json|*.txt )
		    upload_file "$F" "$DPATH"
		;;
		*)
		    gzip $F
		    F=${F}.gz
		    upload_file "$F" "$DPATH"
		    gunzip $F
		;;
	    esac
	elif [ -d "$F" ]; then
	    cd $F
	    upload_dir
	    cd ..
	fi
    done

}

echo "Attempting to work on $TARGET"

if [ -d "$UPLOAD_PATH" ]; then
    delete_all
    cd $UPLOAD_PATH
    upload_dir
else
    echo "Not sure where to upload from.  Is $UPLOAD_PATH a valid directory?"
fi
