cd DjangoProject\Docker\communicator

docker compose down -v


docker compose pull
docker compose up --build -d server api

cd ..\..\..