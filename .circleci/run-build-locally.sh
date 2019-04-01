#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=1e4d511f96608be5054e822014a86a4121be0044\
    --form config=./config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/jack-slater/bookclub-auth/tree/master
