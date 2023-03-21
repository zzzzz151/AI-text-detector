from typing import List
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
import json
from .LMs.AI import LanguageModel
from .webPageScraper import *
from datetime import datetime
from bs4 import BeautifulSoup

model = LanguageModel()

def dateTimeNow():
    return str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

@csrf_exempt
def handle_request(request):
    # JsonResponse normally returns HTTP 200, which is the status code for 'OK'
    # 400 means bad request and 404 means resource not found
    # 500 means an internal server error
    # Function tested and working with application/json requests

    print()
    dateTimeNow = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    if not request.body:
        print(dateTimeNow() + " Received invalid request")
        return JsonResponse(
            {'message': "Request content cannot be null, please include the exactly 1 of the 3 fields: 'url', 'html' or 'pdf'"},
            status=400,
            json_dumps_params={'indent': 2})

    requestData = json.loads(request.body.decode())

    """
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
            {'message': "Invalid 'type' field value, please use 'text', 'url' or 'html' or 'pdf'"},
            status=400,
            json_dumps_params={'indent': 2})
    """

    if len(requestData.keys()) != 1:
        print(dateTimeNow() + " Received invalid request")
        return JsonResponse(
            {'message': "Invalid number of fields in request, please include the exactly 1 of the 3 fields: 'url', 'html' or 'pdf'"},
            status=400,
            json_dumps_params={'indent': 2})

    if "text" in requestData:
        return handle_text_request(requestData)
    elif "url" or "html" in requestData:
        return handle_web_page_request(requestData)
    elif "pdf" in requestData:
        return handle_pdf_request(requestData)
    else:
        print(dateTimeNow() + " Received invalid request")
        return JsonResponse(
            {'message': "Invalid field in request, please include the exactly 1 of the 3 fields: 'url', 'html' or 'pdf'"},
            status=400,
            json_dumps_params={'indent': 2})

def handle_text_request(requestData):
    print(dateTimeNow() + " Processing text request for text '" + requestData["text"] + "'")
    responseData = {
        "text": requestData["text"],
        "probability_AI_generated": model.probability_AI_generated_text(requestData["text"], "openAIBase")
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})

def handle_web_page_request(requestData):
    if "url" in requestData:
        print(dateTimeNow() + " Processing url request for " + requestData["url"])
        selectorsAndText = getSelectorsAndTextFromURL(requestData["url"])
    else:
        assert "html" in requestData
        soup = BeautifulSoup(requestData["html"], 'html.parser')
        if soup.title and soup.title.string:
            print(dateTimeNow() + " Processing html request for " + soup.title.string)
        else:
            print(dateTimeNow() + " Processing html request")
        selectorsAndText = getSelectorsAndTextFromHtml(requestData["html"])

    responseData = {}
    responseData["overall_evaluation"] = random.choice(["good","moderate","bad"])

    responseData["analysis"] = selectorsAndText
    length = len(selectorsAndText)
    for i in range(length):
        text = selectorsAndText[i]["text"]
        probability_AI_generated = model.probability_AI_generated_text(text, "openAIBase")
        responseData["analysis"][i]["probability_AI_generated"] = probability_AI_generated
        #print(str(i+1) + "/" + str(length) + " calculated")

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})

def handle_pdf_request(requestData):
    responseData = {
        "pdf_field_1": "pdf_field_1_value",
        "pdf_field_2": "pdf_field_2_value",
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})