from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
import json

@csrf_exempt
def handle_request(request):
    # JsonResponse normally returns HTTP 200, which is the status code for 'OK'
    # 400 means bad request and 404 means resource not found
    # 500 means an internal server error
    # Function tested and working with application/json requests

    requestData = json.loads(request.body.decode()) # {'type': 'text'}

    if "type" not in requestData:
        return JsonResponse(
            {'message': "No 'type' field found in request"},
            status=400,
            json_dumps_params={'indent': 2})

    messageType = requestData["type"].strip().lower()
    if messageType == "text":
        return handle_text_request(requestData)
    elif messageType == "url":
        return handle_url_request(requestData)
    elif messageType == "pdf":
        return handle_pdf_request(requestData)
    else:
        return JsonResponse(
            {'message': "Invalid 'type' field value, please use 'text', 'url' or 'pdf'"},
            status=400,
            json_dumps_params={'indent': 2})


def handle_text_request(request):
    probability = random.randint(1, 99) # both inclusive
    responseData = {
        "probability_AI_generated": probability
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})

def handle_url_request(request):
    responseData = {
        "message" : "Format is 'selector': 'probability_AI_generated'",
        "h1 div p": random.randint(1,99), # both inclusive
        "div div h4 p-nth-child(2)": random.randint(1,99) # both inclusive
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})

def handle_pdf_request(request):
    responseData = {
        "pdf_field1": "pdf_field1_value",
        "pdf_field2": "pdf_field2_value",
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})
