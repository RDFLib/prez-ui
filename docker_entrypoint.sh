#!/bin/bash

# insert env vars in index.js
INDEX_FILE=/app/assets/index-*.js;

grep "=" .env | while read -r line; do # loop over VITE_ env vars
    left=`echo $line | awk -F "=" '{print $1}'`; # env var name
    right=`echo $line | awk -F "=" '{print $2}'`; # default value
    if (declare -p "${left}" &>/dev/null) # if env var is set
    then # env var exists
        sed -i 's|{}\.'"${left}"'|"'"${!left}"'"|g' $INDEX_FILE; # replace {}.ENV_VAR with value
    else # else use default value
        sed -i 's|{}\.'"${left}"'|"'"${right}"'"|g' $INDEX_FILE;
    fi
done

# insert base url in index.html
if (declare -p "VITE_BASE_URL" &>/dev/null)
then
    sed -i "s|BASE_URL = \"/\"|BASE_URL = \"$VITE_BASE_URL\"|g" /app/index.html
    sed -i "s|/@BASE_URL@/|$VITE_BASE_URL|g" /app/index.html ${INDEX_FILE}
else
    sed -i "s|/@BASE_URL@/|/|g" /app/index.html ${INDEX_FILE}
fi
cp /app/index.html /app/404.html

nginx -g 'daemon off;';