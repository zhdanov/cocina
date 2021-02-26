#!/bin/bash

if nc -z -w2 gitlab-prod.gitlab-prod 80 2>/dev/null
then

    printf "Host gitlab-prod.gitlab-prod\n\tStrictHostKeyChecking no\n\tUserKnownHostsFile=/dev/null\n" >> /etc/ssh/ssh_config

    if [[ ! -d /var/www/cocina-backend/upload ]]; then
        if [[ -d /var/www/cocina-backend ]]; then
          rmdir /var/www/cocina-backend
        fi

        git clone git@gitlab-prod.gitlab-prod:$HOME_USER_NAME/cocina-backend.git /var/www/cocina-backend

        mkdir -p /var/www/cocina-backend/frontend
        pushd /var/www/cocina-backend/frontend
            ln -s /root/cocina/common.blocks .
            ln -s /root/cocina/desktop.blocks .
            ln -s /root/cocina/mobile.blocks .
            ln -s /root/cocina/mobile-landscape.blocks .
            ln -s /root/cocina/config.css .
        popd

        mkdir -p /var/www/cocina-backend/storage
        chmod -R 777 /var/www/cocina-backend/storage

        mkdir -p /var/www/cocina-backend/upload/image/cache
        chmod -R 777 /var/www/cocina-backend/upload/image/cache
    fi

    pushd /root/cocina/hakunamatata
        npm i
    popd

fi
