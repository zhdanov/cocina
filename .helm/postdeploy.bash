#!/bin/bash

pushd "$(dirname "$0")"

    ./../hakunamatata/container/container__make-alias.bash cocina-dev php-fpm
    ./../hakunamatata/container/container__copy-dotfiles.bash cocina-dev php-fpm

popd
