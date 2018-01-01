#!/bin/sh

cat log-precss.htm > log.htm
cleancss log.css >> log.htm
cat log-postcss-prejs.htm >> log.htm
#fail# uglifyjs -mt --inline-script < log.js >> log.htm
#sorta# perl -Ipacker/ packer/jsPacker.pl -e62 -q -i log.js >> log.htm
cat log.js >> log.htm
cat log-postjs.htm >> log.htm
mv -v log.htm ../data/static/

echo "Creating new ui-update.sh"
cat ui-update-head.sh > ui-update.sh
cd ../data/static/
for f in *; do gzip -9 $f; done
cd ..
tar -jcvf - . >> ../src/ui-update.sh
cd -
for f in *; do gunzip $f; done
