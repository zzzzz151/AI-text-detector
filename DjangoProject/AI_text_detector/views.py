from typing import List
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
import json
from .AI2 import AI2
from rest_framework.views import APIView
from rest_framework import parsers
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import *
from pathlib import Path
from .logger import log

AI = AI2()

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
            {'message': "Invalid request (invalid fields or format)"},
            status=400,
            json_dumps_params={'indent': 2})

    log("Received request with LM " + lm_name + " for \"" + text + "\"")

    try:
        probability_AI_generated = AI.probability_AI_generated_text(text, lm_name)
    except:
        return JsonResponse(
            {'message': "Invalid request (probably invalid language model)"},
            status=400,
            json_dumps_params={'indent': 2})
    if probability_AI_generated == None:
        return JsonResponse(
            {'message': "Invalid request (probably invalid language model)"},
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
            lm_author = request.data["author"]
            lm_description = request.data["description"]
            log("Received LM '" + lm_name + "'")
            assert len(LM_Script.objects.filter(name=lm_name)) == 0 # Assert this LM name doesnt exist in database
            assert len(LM_API.objects.filter(name=lm_name)) == 0 # Assert this LM name doesnt exist in database

            if "script" in request.data:
                script = request.data["script"]
                save_folder = "AI_text_detector/language_models/"
                save_path = save_folder + script.name # AI_text_detector/language_models/thisNewLM.py
                if save_path[-3:] != ".py":
                    save_path += ".py"
                assert not Path(save_path).is_file() # Assert a file with this name doesnt exist
                newFile = open(save_path, "w")
                newFile.write(script.read().decode("utf-8"))
                newFile.close()
                AI.loadLM(lm_name, save_path)
                newLM = LM_Script()
                newLM.name = lm_name
                newLM.author = lm_author
                newLM.description = lm_description
                newLM.script = save_path # AI_text_detector/language_models/thisNewLM.py
                newLM.save()

            if "API" in request.data or "api" in request.data:
                api_url = request.data["API"] if "API" in request.data else request.data["api"]
                newLM = LM_API()
                newLM.name = lm_name
                newLM.author = lm_author
                newLM.description = lm_description
                newLM.API = api_url
                newLM.save()

            log("Accepted LM '" + lm_name + "'")
            #log(AI.probability_AI_generated_text("Hello", lm_name))
        except:
            log("Refused LM '" + lm_name + "'")
            return Response(status=500) # Internal server error

        return Response(status=200) # Ok

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
        "probability_AI_generated": round(random.uniform(0,1), 4)
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})

def execute_code(request):
    # insert test code here
    log(len(LM_Script.objects.filter(name="openai-roberta-base")))
    log(len(LM_Script.objects.filter(name="aogpatgta")))

    return JsonResponse(
        {},
        status=200,
        json_dumps_params={'indent': 2})

