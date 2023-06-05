cd DjangoProject/Docker/communicator

docker-compose down -v --rmi local


docker-compose pull
docker-compose up --build -d server api

cd ../../..
