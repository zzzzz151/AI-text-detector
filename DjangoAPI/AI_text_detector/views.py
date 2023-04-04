import os
import sys
from typing import List
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
import json
#from .LMs.AI import LanguageModel
from datetime import datetime
import socket
import Docker.communicator.server.messages as m

#model = LanguageModel()

lm_name = "chatGPT_roberta"

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

message_ID = [0]
def increment_and_return_ID():
    ID = message_ID[0]
    message_ID[0] = ID + 1
    return ID


def log(msg):
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + msg)
    sys.stdout.flush()



def create_socket():
    lm_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lm_socket.connect((host, port))
    lm_socket.setblocking(True)
    return lm_socket

def get_prediction(text, lm):
    lm_socket = create_socket()
    ID = increment_and_return_ID()
    m.send_message_object(lm_socket, m.create_django_message(ID))
    m.send_message_object(lm_socket, m.create_predict_message(ID, lm, text))
    response = m.receive_message_object(lm_socket)
    lm_socket.close()
    if response and response.probability:
        return int(response.probability)
    return 0

@csrf_exempt
def handle_request(request):
    # JsonResponse normally returns HTTP 200, which is the status code for 'OK'
    # 400 means bad request and 404 means resource not found
    # 500 means an internal server error

    if request.content_type == 'text/plain':
        text = request.body.decode("utf-8")
    else:
        try:
            requestData = json.loads(request.body.decode())
            text = requestData["text"]
        except:
            log("Received invalid request")
            return JsonResponse(
                {'message': "Invalid request"},
                status=400,
                json_dumps_params={'indent': 2})

    log("Received text request for \"" + text + "\"")

    #probability_AI_generated = model.probability_AI_generated_text(text, "openAIBase")
    probability_AI_generated = get_prediction(text, lm_name)
    if probability_AI_generated is None:
        probability_AI_generated = 0
    #probability_AI_generated = random.randint(0, 100)

    responseData = {
        "text": text,
        "probability_AI_generated": probability_AI_generated
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})


def create_container():
    ...