cd DjangoProject\Docker\communicator

docker compose down


docker compose pull
docker compose up --build -d server api

cd ..\..\..