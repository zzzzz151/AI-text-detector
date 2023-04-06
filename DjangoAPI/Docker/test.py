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
import os

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
def build_image(compose_file_path:str, build_args:dict):
    command = [
        "docker", "compose",
        "-f", compose_file_path,
        "build",
    ]
    for env_name, env_value in build_args.items():
        command.append("--build-arg")
        command.append(f"{env_name}={env_value}")

    subprocess.run(command)
    """
    try:
        output = subprocess.check_output(command, stderr=subprocess.STDOUT, universal_newlines=True)
        print(output)
    except subprocess.CalledProcessError as e:
        print(e.output)
    """
def run_image(compose_file_path:str, service_name:str, container_name:str, extra_options:list):
    command = [
        "docker", "compose",
        "-f", compose_file_path,
        "run",
        "-d",
        '--name', container_name,
        service_name,
    ]

    for arg_tuple in extra_options:
        indicator = arg_tuple[0]
        if indicator == 'e':
            command.insert(5, f"-{indicator}")
            command.insert(6, f"{arg_tuple[1]}={arg_tuple[2]}")
        elif indicator == 'v':
            command.insert(5, f"-{indicator}")
            command.insert(6, f"{arg_tuple[1]}")
        else:
            for arg in arg_tuple:
                command.append(arg)


    subprocess.run(command, check=True)
def start_container(container_name):
    subprocess.run(['docker', 'start', container_name])
def create_or_run_container(client, compose_file_path:str, service_name:str, container_name:str, extra_options:list):
    if not container_exists(client, container_name):
        build_image(compose_file_path, {"LM_NAME":extra_options[0][2]})
        run_image(compose_file_path, service_name, container_name, extra_options)
    elif not container_is_running(client, container_name):
        start_container(container_name)
def store_file(path, file_name, file):
    os.makedirs(path, exist_ok=True)
    newFile = open(file_name, "w")
    newFile.write(file.read().decode('UTF-8'))
    newFile.close()
def add_communicator(compose_file_path, lm_name):
    client = docker.from_env()
    service_name = "communicator"
    env_vars = [
        ('e', "LM_NAME", lm_name),
        #('v', f"/DjangoAPI/AI_text_detector/LMs/{lm_name}:/usr/app/src/lm_name"),
        #('v', "/DjangoAPI/Docker/communicator/communicator.py:/usr/app/src/communicator.py"),
        #('v', "/DjangoAPI/Docker/communicator/messages.py:/usr/app/src/messages.py"),
        #('pip3', 'install', '-r', f'/usr/app/src/lm_name/requirements.txt')
    ]
    create_or_run_container(client, compose_file_path, service_name, create_container_name(service_name, lm_name), env_vars)
    client.close()


if __name__ == "__main__":
    ...
    """
    client = docker.from_env()

    compose_file_path = './communicator/docker-compose.yml'
    env_vars = [
        ('e', "LISTEN_PORT", "5555"),
        ('e', "LM_NAME", "abcd"),
        ('v', "../../AI_text_detector/LMs/abcd/abcd.py:/usr/app/src/lm_name/lm_submission.py"),
        ('v', "../../AI_text_detector/LMs/abcd/requirements.txt:/usr/app/src/lm_name/requirements.txt"),
        ('v', "./communicator.py:/usr/app/src/communicator.py"),
        ('v', "./server/messages.py:/usr/app/src/server/messages.py"),
    ]
    service_name = "communicator"
    lm_name = 'lm_name'
    container_name = create_container_name(service_name, lm_name)



    create_or_run_container(compose_file_path, service_name, container_name, env_vars)
    sleep(5)
    subprocess.run(['docker-compose', '-f', compose_file_path, 'stop', container_name])
    subprocess.run(['docker-compose', '-f', compose_file_path, 'stop', 'server'])

    client.close()
    """