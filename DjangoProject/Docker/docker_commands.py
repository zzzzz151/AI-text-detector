import subprocess
import docker
import os
import asyncio

service_name = "communicator"

def container_exists(container_name:str):
    client = docker.from_env()
    containers = client.containers.list(all=True)
    client.close()

    container_names = [c.name for c in containers]
    return container_name in container_names
def container_is_running(container_name:str):
    client = docker.from_env()
    containers = client.containers.list(all=False)
    client.close()

    container_names = [c.name for c in containers]
    return container_name in container_names
def create_container_name(service_name, model_name):
    return f"{service_name}_{model_name}"
def create_communicator_container_name(model_name):
    return f"{service_name}_{model_name}"
def build_image(compose_file_path:str, build_args:dict):
    command = [
        "docker", "compose",
        "-f", compose_file_path,
        "build",
        "--quiet"
    ]
    for env_name, env_value in build_args.items():
        command.append("--build-arg")
        command.append(f"{env_name}={env_value}")

    subprocess.run(command)
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


    subprocess.Popen(command)
def start_container(container_name):
    subprocess.Popen(['docker', 'start', container_name])
def create_or_run_container(compose_file_path:str, service_name:str, container_name:str, extra_options:list):
    if not container_exists(container_name):
        build_image(compose_file_path, {"LM_NAME":extra_options[0][2]})
        run_image(compose_file_path, service_name, container_name, extra_options)
    elif not container_is_running(container_name):
        start_container(container_name)
def delete_container(container_name:str):
    """docker rm -f < Container_ID>"""
    if container_exists(container_name):
        subprocess.Popen(['docker', 'rm', '-f', container_name])

def store_file(path, file_name, file):
    os.makedirs(path, exist_ok=True)
    newFile = open(file_name, "w")
    newFile.write(file.read().decode('UTF-8'))
    newFile.close()
def add_communicator(compose_file_path, model_name):
    env_vars = [
        ('e', "LM_NAME", model_name),
        #('v', f"/DjangoAPI/AI_text_detector/LMs/{lm_name}:/usr/app/src/lm_name"),
        #('v', "/DjangoAPI/Docker/communicator/communicator.py:/usr/app/src/communicator.py"),
        #('v', "/DjangoAPI/Docker/communicator/messages.py:/usr/app/src/messages.py"),
        #('pip3', 'install', '-r', f'/usr/app/src/lm_name/requirements.txt')
    ]

    create_or_run_container(compose_file_path, service_name, create_communicator_container_name(model_name), env_vars)
def start_communicator(model_name):
    container_name = create_container_name(service_name, model_name)
    if not container_is_running(container_name):
        start_container(container_name)