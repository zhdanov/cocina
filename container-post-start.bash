#!/bin/bash

if nc -z -w2 gitlab-prod.gitlab-prod 80 2>/dev/null
then

    printf "Host gitlab-prod.gitlab-prod\n\tStrictHostKeyChecking no\n\tUserKnownHostsFile=/dev/null\n" >> /etc/ssh/ssh_config

    if [[ ! -d /var/www/cocina-backend ]]; then
        git clone git@gitlab-prod.gitlab-prod:$HOME_USER_NAME/cocina-backend.git /var/www/cocina-backend
        pushd /var/www/cocina-backend/
            ln -s /root/cocina/frontend .
        popd
    fi

fi
