#!/bin/bash

if nc -z -w2 gitlab-prod.gitlab-prod 80 2>/dev/null
then

    printf "Host gitlab-prod.gitlab-prod\n\tStrictHostKeyChecking no\n\tUserKnownHostsFile=/dev/null\n" >> /etc/ssh/ssh_config

    if [[ ! -d /var/www/cocina-backend/.git ]]; then

        pushd /var/www/cocina-backend/

            git init
            git remote add origin git@gitlab-prod.gitlab-prod:$HOME_USER_NAME/cocina-backend.git
            git pull origin master

            mkdir -p /var/www/cocina-backend/storage
            chmod -R 777 /var/www/cocina-backend/storage

            mkdir -p /var/www/cocina-backend/upload/image/cache
            chmod -R 777 /var/www/cocina-backend/upload/image/cache

            ln -s upload public
        popd
    fi

    pushd /root/cocina/hakunamatata
        npm i
    popd

fi
