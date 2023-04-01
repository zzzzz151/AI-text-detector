FROM mysql:8.0.32

ENV MYSQL_ROOT_PASSWORD ai
COPY data.sql /docker-entrypoint-initdb.d/data.sql
CMD ls