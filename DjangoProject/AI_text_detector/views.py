import json
import os
import random
import socket
import sys
from datetime import datetime

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import parsers
from rest_framework.decorators import authentication_classes, permission_classes, renderer_classes, api_view
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

import Docker.communicator.messages as m
from AI_text_detector.AI_LMs import AI
from Docker.test import add_communicator
from .AI_LMs.AI import docker_compose_path
from .models import *



AI.start_stored_LMs()

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
    print(strDateTimeNow + " " + str(msg))
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
def store_file(path:str, file_name:str, content):
    os.makedirs(path, exist_ok=True)
    newFile = open(path + file_name, "w")
    if type(content) != str:
        newFile.write(content.read().decode('UTF-8'))
    else:
        newFile.write(content)
    newFile.close()
def save_lm(lm_name, author, description, script):
    newLM = LM_Script()
    newLM.name = lm_name
    newLM.author = author
    newLM.description = description
    newLM.script = script
    newLM.save()

@csrf_exempt
def handle_text_request(request):
    # JsonResponse normally returns HTTP 200, which is the status code for 'OK'
    # 400 means bad request and 404 means resource not found
    # 500 means an internal server error

    if request.content_type == 'text/plain':
        text = request.body.decode("utf-8")
    else:
        try:
            requestData = json.loads(request.body.decode())
            text = requestData["text"]
            lm_name = requestData['language_model']
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

@csrf_exempt
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
@api_view(("GET","POST","DELETE"))
@authentication_classes([])
@permission_classes([])
def handle_LMs_request(request):
    method = request.method.upper()

    if method == "GET":
        return get_LMs(request)
    elif method == "POST":
        lmUploadView = LM_Upload.as_view()
        return lmUploadView(request._request)
    elif method == "DELETE":
        return delete_LM(request)

    return Response(status=500)

@authentication_classes([])
@permission_classes([])
class LM_Upload(APIView):
    parser_classes = (parsers.MultiPartParser,)

    @authentication_classes([])
    @permission_classes([])
    def post(self, request):
        try:
            process_lm(request)
        except:
            return Response(status=500)  # Internal server error

        return Response(status=200)  # Ok


@csrf_exempt
def get_LMs(request):
    filter_param = request.GET.get('filter', None)
    lm_type_filter = request.GET.get('type', None)
    include_type = False

    if filter_param:
        filter_fields = filter_param.split(',')
    else:
        filter_fields = ['name', 'author', 'description']
        include_type = True

    if 'type' in filter_fields:
        include_type = True
        filter_fields.remove('type')

    lms = []

    for model in [LM_Script, LM_API]:
        if lm_type_filter and lm_type_filter.lower() != model.TYPE:
            continue
        for lm in model.objects.all():
            lm_dict = {field: getattr(lm, field) for field in filter_fields if hasattr(lm, field)}
            if include_type:
                lm_dict['type'] = model.TYPE
            lms.append(lm_dict)

    return JsonResponse(lms, safe=False, status=200, json_dumps_params={'indent': 2})

@csrf_exempt
def my_LM_as_API(request):
    try:
        text = request.body.decode("utf-8")
        if text.strip() == "":
            return JsonResponse(
                {'message': "Invalid request"},
                status=400,
                json_dumps_params={'indent': 2})
    except:
        return JsonResponse(
            {'message': "Invalid request"},
            status=400,
            json_dumps_params={'indent': 2})

    responseData = {
        "text": text,
        "probability_AI_generated": round(random.uniform(0, 1), 4)
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})

def execute_code(request):
    # insert test code here

    return JsonResponse(
        {},
        status=200,
        json_dumps_params={'indent': 2})

def process_lm(request):
    lm_name = request.data["name"]
    log("Received LM " + lm_name)

    if "script" in request.data:
        save_path = f"Docker/communicator/LMs/{lm_name}/"
        script = request.data["script"]

        store_file(save_path, 'lm_submission.py', script)
        store_file(save_path, 'requirements.txt', "")

        save_lm(lm_name, "author here", "description here", script)

        add_communicator(docker_compose_path, lm_name)

    if "API" in request.data or "api" in request.data:
        api_url = request.data["API"] if "API" in request.data else request.data["api"]
        newLM = LM_API()
        newLM.name = lm_name
        newLM.author = "author here"
        newLM.description = "description here"
        newLM.API = api_url
        newLM.save()

    print("Accepted LM d" + lm_name)
    ##print(AI.probability_AI_generated_text("Hello", lm_name))

@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def delete_LM(request):
    data = json.loads(request.body)
    if "name" not in data:
        return Response(status=500)
    lm_name = data["name"]
    try:
        lm = LM_Script.objects.get(name=lm_name)
        AI.unloadLM(lm_name)
        lm.delete()
        if os.path.exists(lm.script):
            os.remove(lm.script)
        log("Deleted LM '" + lm_name + "'")
        return Response(status=200)
    except Exception as e:
        pass

    try:
        lm = LM_API.objects.get(name=lm_name)
        lm.delete()
        log("Deleted LM '" + lm_name + "'")
        return Response(status=200)
    except:
        pass

    return Response(status=500)
