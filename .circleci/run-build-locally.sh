#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=96d252fcd14689d2508a8076928fc282fb83a13f\
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/jack-slater/bookclub-auth/tree/master
