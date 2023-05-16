import json
import os
import random
import shutil
import sys
from datetime import datetime

import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import parsers
from rest_framework.decorators import authentication_classes, permission_classes, renderer_classes, api_view
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from AI_text_detector.AI_LMs import AI
from Docker.test import add_communicator, delete_container
from .AI_LMs.AI import docker_compose_path, get_prediction
from .models import *


AI.start_stored_LMs()

def log(msg):
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + str(msg))
    sys.stdout.flush()

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
        lm_name = ""
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
    if lm_name:
        if lm_name in [x.name for x in LM_API.objects.all()]:
            probability_AI_generated = get_LM_API_prediction(text, lm_name)
        else:
            probability_AI_generated = get_prediction(text, lm_name)
    else:
        probability_AI_generated = random.randint(0, 100)
    if probability_AI_generated is None:
        probability_AI_generated = 0

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
            lm_name = request.data["name"]
            lm_author = request.data["author"]
            lm_description = request.data["description"]
            log("Received LM '" + lm_name + "'")
            assert len(LM_Script.objects.filter(name=lm_name)) == 0  # Assert this LM name doesnt exist in database
            assert len(LM_API.objects.filter(name=lm_name)) == 0  # Assert this LM name doesnt exist in database

            if "script" in request.data:
                save_path = f"Docker/communicator/LMs/{lm_name}/"
                script = request.data["script"]

                store_file(save_path, 'lm_submission.py', script)
                store_file(save_path, 'requirements.txt', "")
                add_communicator(docker_compose_path, lm_name)

                # assert not Path(save_path).is_file() # Assert a file with this name doesnt exist
                save_lm(lm_name, lm_author, lm_description, save_path)


            if "API" in request.data or "api" in request.data:
                api_url = request.data["API"] if "API" in request.data else request.data["api"]
                newLM = LM_API()
                newLM.name = lm_name
                newLM.author = lm_author
                newLM.description = lm_description
                newLM.API = api_url
                newLM.save()

            log("Accepted LM '" + lm_name + "'")
            # log(AI.probability_AI_generated_text("Hello", lm_name))
        except Exception as e:
            log(e)
            log("Refused LM '" + lm_name + "'")
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

    def whitelistByAuthor(argLm):
        if "author" not in request.GET:
            return True
        author = request.GET["author"].lower()
        if argLm.author.lower() == author.lower():
            return True
        if argLm.author.lower() == author.strip().lower():
            return True
        return False

    for model in [LM_Script, LM_API]:
        if lm_type_filter and lm_type_filter.lower() != model.TYPE:
            continue
        for lm in model.objects.all():
            if not whitelistByAuthor(lm):
                continue
            lm_dict = {field: getattr(lm, field) for field in filter_fields if hasattr(lm, field)}
            if include_type:
                lm_dict['type'] = model.TYPE
            lms.append(lm_dict)

    return JsonResponse(lms, safe=False, status=200, json_dumps_params={'indent': 2})

def get_LM_API_prediction(text, lm_name):
    if text.strip() == "":
        return None

    try:
        api_url = LM_API.objects.get(pk=lm_name).API
        response = requests.post(api_url, data=text)
        probability = response.json()["probability_AI_generated"]
        probability *= 100
        probability = round(probability)
        return probability
    except Exception as e:
        return None

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

@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def delete_LM(request):
    data = json.loads(request.body)
    if "name" not in data:
        return Response(status=500)
    lm_name = data["name"]
    try:
        lm = LM_Script.objects.get(name=lm_name)
        delete_container(lm_name)
        lm.delete()
        if os.path.exists(lm.script):
            shutil.rmtree(lm.script)
        log("Deleted LM '" + lm_name + "'")
        return Response(status=200)
    except Exception as e:
        log(e)
        pass

    try:
        lm = LM_API.objects.get(name=lm_name)
        lm.delete()
        log("Deleted LM '" + lm_name + "'")
        return Response(status=200)
    except:
        pass

    return Response(status=500)
