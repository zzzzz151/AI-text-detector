import os
import random
import shutil
import socket
import sys
from datetime import datetime
import requests

import Docker.messages as m
from AI_text_detector.models import LM_Script, LM_API
from Docker.docker_commands import add_communicator, delete_container, \
    create_communicator_container_name, container_exists, container_is_running

docker_path = '/DjangoProject/Docker/'
docker_compose_path = docker_path + 'docker-compose.yml'
model_path = docker_path + 'LMs/'


def get_port_and_host():
    try:
        port = int(os.getenv('SEND_PORT'))
    except TypeError:
        port = int(sys.argv[2])
    try:
        host = os.getenv('SEND_HOST')
        if not host:
            host = sys.argv[2]
    except TypeError:
        host = sys.argv[2]
    return port, host
port, host = get_port_and_host()


def log(msg):
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + str(msg))
    sys.stdout.flush()

def start_stored_LMs():
    models = LM_Script.objects.all()
    try:
        # For every model in our database
        for model_object in models:
            model_name = model_object.name
            container_name = create_communicator_container_name(model_name)
            log(f"Model {model_name} selected.")

            # If a corresponding folder doesn't exist, remove this from our database instead of starting a container
            if not os.path.isdir(model_path + model_name):
                log(f"Model {model_name} will be deleted from the database for lacking a file.")
                delete_model_from_database(model_name)

                if container_exists(container_name):
                    log(f"Container for {model_name} will be deleted.")
                    delete_container(container_name)

                continue

            # If a container for this model doesn't exist
            if not container_exists(container_name):
                log(f"Model {model_name} in database lacks corresponding container. Creating {container_name}.")

            # If a container for this model exists but isn't running
            elif not container_is_running(container_name):
                log(f"Starting {container_name}.")

            add_communicator(docker_compose_path, model_name)
    except Exception as e:
        log("Failed to access database. Have Django's migrations been applied?")
        log(e)

def startup():
    start_stored_LMs()

message_ID = [0]
def increment_and_return_ID():
    ID = message_ID[0]
    message_ID[0] = ID + 1
    return ID
def create_socket():
    lm_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lm_socket.connect((host, port))
    lm_socket.setblocking(True)
    return lm_socket
def get_model_script_prediction(text, lm):
    lm_socket = create_socket()
    ID = increment_and_return_ID()
    m.send_message_object(lm_socket, m.create_django_message(ID))
    m.send_message_object(lm_socket, m.create_predict_message(ID, lm, text))
    response = m.receive_message_object(lm_socket)
    lm_socket.close()
    if response and response.probability:
        return int(response.probability)
    return 0

def clear_database():
    LM_Script.objects.all().delete()
    LM_API.objects.all().delete()

def store_file(path:str, file_name:str, content):
    os.makedirs(path, exist_ok=True)
    newFile = open(path + file_name, "w")
    if type(content) != str:
        newFile.write(content.read().decode('UTF-8'))
    else:
        newFile.write(content)
    newFile.close()

def save_model_script_in_database(lm_name, author, description, script):
    newLM = LM_Script()
    newLM.name = lm_name
    newLM.author = author
    newLM.description = description
    newLM.script = script
    newLM.save()

def process_model_script_submission(model_name, model_author, model_description, request):
    save_path = f"Docker/communicator/LMs/{model_name}/"
    script = request.data["script"]

    store_file(save_path, 'lm_submission.py', script)
    store_file(save_path, 'requirements.txt', "")
    add_communicator(docker_compose_path, model_name)

    save_model_script_in_database(model_name, model_author, model_description, save_path)

def process_model_API_submission(model_name, model_author, model_description, request):
    api_url = request.data["API"] if "API" in request.data else request.data["api"]
    newLM = LM_API()
    newLM.name = model_name
    newLM.author = model_author
    newLM.description = model_description
    newLM.API = api_url
    newLM.save()

def is_model_in_database(model_name):
    return LM_Script.objects.filter(name=model_name).exists() or LM_API.objects.filter(name=model_name).exists()

def is_model_valid(model_name):
    # Check 1: Model is not already in the database
    model_in_database = is_model_in_database(model_name)
    if model_in_database:
        log(f"Model {model_name} is in the database!")

    return not model_in_database

def get_model_API_prediction(text, lm_name):
    if text.strip() == "":
        return None

    try:
        api_url = LM_API.objects.get(pk=lm_name).API
        response = requests.post(api_url, data=text)
        probability = response.json()["probability_AI_generated"]
        probability *= 100
        probability = round(probability)
        return probability
    except Exception:
        return None

def is_script(model_name):
    return model_name in [x.name for x in LM_Script.objects.all()]

def predict_text(model_name, text):
    if model_name:
        if model_name in [x.name for x in LM_API.objects.all()]:
            probability_AI_generated = get_model_API_prediction(text, model_name)
        else:
            probability_AI_generated = get_model_script_prediction(text, model_name)
    else:
        probability_AI_generated = random.randint(0, 100)
    if probability_AI_generated is None:
        probability_AI_generated = 0

    response_data = {
        "text": text,
        "probability_AI_generated": probability_AI_generated
    }

    return response_data

def delete_model_script(model_name):
    model = LM_Script.objects.get(name=model_name)
    delete_container(create_communicator_container_name(model_name))
    delete_model_from_database(model_name)
    if os.path.exists(model.script):
        shutil.rmtree(model.script)

def does_model_container_exist(model_name):
    return container_exists(create_communicator_container_name(model_name))

def delete_model_from_database(model_name):
    LM_Script.objects.get(name=model_name).delete()