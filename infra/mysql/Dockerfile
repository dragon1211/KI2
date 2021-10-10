FROM mysql/mysql-server:8.0

ENV MYSQL_DATABASE=laravel_local \
    MYSQL_USER=phper \
    MYSQL_PASSWORD=secret \
    MYSQL_ROOT_PASSWORD=secret \
    TZ=Asia/Tokyo

COPY ./my.cnf /etc/my.cnf
RUN chmod 644 /etc/my.cnf
# COPY ./my.cnf /etc/mysql/conf.d/my.cnf
# RUN chmod 644 /etc/mysql/conf.d/my.cnf