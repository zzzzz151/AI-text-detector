cd DjangoProject/Docker/communicator

docker-compose down -v --rmi all


docker-compose pull
docker-compose up --build -d server api

cd ../../..
