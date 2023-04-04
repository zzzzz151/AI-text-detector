from typing import List
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
import json
from .AI.AI2 import *
from datetime import datetime
from rest_framework.views import APIView
from rest_framework import parsers
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response

AI = AI2()

def log(msg):
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + msg)

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

    try:
        probability_AI_generated = AI.probability_AI_generated_text(text, "openAIBase")
    except:
        probability_AI_generated = 0
    if probability_AI_generated == None:
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




@authentication_classes([]) 
@permission_classes([])
class LM_Upload(APIView):
    parser_classes = (parsers.MultiPartParser,)

    @authentication_classes([]) 
    @permission_classes([])
    def post(self, request):
        lm_name = request.data["name"]
        print("Received LM " + lm_name)

        if "script" in request.data:
            save_path = "AI_text_detector/AI/language_models/"
            script = request.data["script"]
            newFile = open(save_path + script.name, "w")
            newFile.write(script.read().decode("utf-8"))
            newFile.close()
            AI.loadLM(lm_name, script.name)

        if "API" in request.data or "api" in request.data:
            api_url = request.data["API"] if "API" in request.data else request.data["api"]

        print(AI.probability_AI_generated_text("Hello", "myLM"))

        return Response(status=200)
