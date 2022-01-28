FROM --platform=linux/amd64 php:8.0.3-fpm-buster
SHELL ["/bin/bash", "-oeux", "pipefail", "-c"]

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_HOME=/composer

# composer install
COPY --from=composer:2.0 /usr/bin/composer /usr/bin/composer

# Node.js install
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# yarnをインストール
RUN apt-get update
RUN apt-get -y install git unzip libzip-dev libicu-dev libonig-dev zlib1g-dev
RUN apt-get clean
RUN curl --output libpng16-16_1.6.36-6_amd64.deb http://ftp.jp.debian.org/debian/pool/main/libp/libpng1.6/libpng16-16_1.6.36-6_amd64.deb
RUN curl --output libpng-dev_1.6.36-6_amd64.deb http://ftp.jp.debian.org/debian/pool/main/libp/libpng1.6/libpng-dev_1.6.36-6_amd64.deb
RUN curl --output libjpeg62-turbo_1.5.2-2+deb10u1_amd64.deb http://ftp.jp.debian.org/debian/pool/main/libj/libjpeg-turbo/libjpeg62-turbo_1.5.2-2+deb10u1_amd64.deb
RUN curl --output libjpeg62-turbo-dev_1.5.2-2+deb10u1_amd64.deb http://ftp.jp.debian.org/debian/pool/main/libj/libjpeg-turbo/libjpeg62-turbo-dev_1.5.2-2+deb10u1_amd64.deb
RUN curl --output libjpeg-dev_1.5.2-2+deb10u1_all.deb http://ftp.jp.debian.org/debian/pool/main/libj/libjpeg-turbo/libjpeg-dev_1.5.2-2+deb10u1_all.deb
RUN dpkg -i libpng16-16_1.6.36-6_amd64.deb
RUN dpkg -i libpng-dev_1.6.36-6_amd64.deb
RUN dpkg -i libjpeg62-turbo_1.5.2-2+deb10u1_amd64.deb
RUN dpkg -i libjpeg62-turbo-dev_1.5.2-2+deb10u1_amd64.deb
RUN dpkg -i libjpeg-dev_1.5.2-2+deb10u1_all.deb
RUN rm -rf *.deb
RUN rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-configure gd --with-jpeg
RUN docker-php-ext-install -j$(nproc) intl pdo_mysql zip bcmath gd exif

COPY ./php.ini /usr/local/etc/php/php.ini

WORKDIR /work
