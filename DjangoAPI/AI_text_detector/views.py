from typing import List
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
import json
from .LMs.AI import LanguageModel
from datetime import datetime
from rest_framework.views import APIView
from rest_framework import parsers


model = LanguageModel()

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

    probability_AI_generated = model.probability_AI_generated_text(text, "openAIBase")
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





class LM_Upload(APIView):
    parser_classes = (parsers.MultiPartParser,)

    def put(self, request, filename, format=None):
        print("XXXXXXXXXXXXXXXXXXXXX")
        #file_obj = request.data['file']
        #ftype    = request.data['ftype']
        #caption  = request.data['caption']
        # ...
        # do some stuff with uploaded file
        # ...
        return Response(status=204)
