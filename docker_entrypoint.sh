#!/bin/bash

INDEX_FILE=/app/assets/index.*.js;

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

nginx -g 'daemon off;';