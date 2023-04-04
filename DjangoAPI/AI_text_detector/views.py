from typing import List
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
import json
from .AI.AI2 import AI2
from datetime import datetime
from rest_framework.views import APIView
from rest_framework import parsers
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import *

AI = AI2()

def log(msg):
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + msg)

@csrf_exempt
def handle_request(request):
    # JsonResponse normally returns HTTP 200, which is the status code for 'OK'
    # 400 means bad request and 404 means resource not found
    # 500 means an internal server error

    try:
        requestData = json.loads(request.body.decode())
        text = requestData["text"]
        lm_name = requestData["language_model"]
    except:
        log("Received invalid request")
        return JsonResponse(
            {'message': "Invalid request"},
            status=400,
            json_dumps_params={'indent': 2})

    log("Received request with LM " + lm_name + " for \"" + text + "\"")

    try:
        probability_AI_generated = AI.probability_AI_generated_text(text, lm_name)
    except:
        return JsonResponse(
            {'message': "Invalid request"},
            status=400,
            json_dumps_params={'indent': 2})
    if probability_AI_generated == None:
        return JsonResponse(
            {'message': "Invalid request"},
            status=400,
            json_dumps_params={'indent': 2})

    responseData = {
        "text": text,
        "language_model": lm_name,
        "probability_AI_generated": probability_AI_generated
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})




@authentication_classes([]) 
@permission_classes([])
class LM_Upload(APIView):
    parser_classes = (parsers.MultiPartParser,)

    @authentication_classes([]) 
    @permission_classes([])
    def post(self, request):
        try: 
            lm_name = request.data["name"]
            print("Received LM " + lm_name)

            if "script" in request.data:
                save_path = "AI_text_detector/AI/language_models/"
                script = request.data["script"]
                newFile = open(save_path + script.name, "w")
                newFile.write(script.read().decode("utf-8"))
                newFile.close()
                AI.loadLM(lm_name, script.name)

                newLM = LM_Script()
                newLM.name = lm_name
                newLM.author = "author here"
                newLM.description = "description here"
                newLM.script = script
                newLM.save()

            if "API" in request.data or "api" in request.data:
                api_url = request.data["API"] if "API" in request.data else request.data["api"]
                newLM = LM_API()
                newLM.name = lm_name
                newLM.author = "author here"
                newLM.description = "description here"
                newLM.API = api_url

            print("Accepted LM " + lm_name)
            #print(AI.probability_AI_generated_text("Hello", lm_name))
        except:
            return Response(status=500) # Internal server error

        return Response(status=200) # Ok

@csrf_exempt
def get_LMs(request):
    filter_param = request.GET.get('filter', None)
    lm_type_filter = request.GET.get('type', None)

    if filter_param:
        filter_fields = filter_param.split(',')
    else:
        filter_fields = ['name', 'author', 'description']

    lms = []

    for model in [LM_Script, LM_API]:
        lm_type = model.__name__
        if lm_type_filter and lm_type != lm_type_filter:
            continue
        lms += [
            {
                field: getattr(lm, field) for field in filter_fields
            } | {'type': lm_type} for lm in model.objects.all()
        ]

    return JsonResponse(lms, safe=False, status=200, json_dumps_params={'indent': 2})
