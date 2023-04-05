from time import sleep
"""
import subprocess
import docker_compose

# Load the Docker Compose file
compose_file = 'path/to/docker-compose.yml'
project = docker_compose.Project.from_file(compose_file)

compose_file_path = './communicator/docker-compose.yml'

var = 'LISTEN_PORT=3131'

for i in range(5):
    env_var = f"MY_ENV_VAR_{i}"
    subprocess.run(["docker-compose", '-f', compose_file_path, "up", "-d", "--scale", "communicator=5", "--no-recreate"], env={env_var: "some_value"})



subprocess.run(['docker-compose', '-f', compose_file_path, 'up', 'communicator', '--detach'], env={'LISTEN_PORT': '3131'})
sleep(10)
subprocess.run(['docker-compose', '-f', compose_file_path, 'stop', 'communicator'])
subprocess.run(['docker-compose', '-f', compose_file_path, 'stop', 'server'])
"""

import subprocess
import docker

def container_exists(client, container_name:str):
    containers = client.containers.list(all=True)
    container_names = [c.name for c in containers]
    return container_name in container_names
def container_is_running(client, container_name:str):
    containers = client.containers.list(all=False)
    container_names = [c.name for c in containers]
    return container_name in container_names
def create_container_name(service_name, lm_name):
    return f"{service_name}_{lm_name}"
def create_and_run_container(compose_file_path:str, service_name:str, container_name:str, environment_variables:dict):
    command = [
        "docker", "compose",
        "-f", compose_file_path,
        "run",
        "-d",
        '--name', container_name,
        service_name,
    ]

    for key, value in environment_variables.items():
       command.insert(5, "--env")
       command.insert(6, f"{key}={value}")

    subprocess.run(command, check=True)
def start_container(container_name):
    subprocess.run(['docker', 'start', container_name])
def create_or_run_container(compose_file_path:str, service_name:str, container_name:str, environment_variables:dict):
    if not container_exists(client, container_name):
        create_and_run_container(compose_file_path, service_name, container_name, environment_variables)
    elif not container_is_running(client, container_name):
        start_container(container_name)

client = docker.from_env()

compose_file_path = './communicator/docker-compose.yml'
env_vars = {"LISTEN_PORT": "5555"}
service_name = "communicator"
lm_name = 'lm_name'
container_name = create_container_name(service_name, lm_name)



create_or_run_container(compose_file_path, service_name, container_name, env_vars)
sleep(5)
subprocess.run(['docker-compose', '-f', compose_file_path, 'stop', container_name])
subprocess.run(['docker-compose', '-f', compose_file_path, 'stop', 'server'])

client.close()