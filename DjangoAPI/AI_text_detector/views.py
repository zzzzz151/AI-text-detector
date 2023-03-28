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

def log(msg):
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + msg)

@csrf_exempt
def handle_request(request):
    # JsonResponse normally returns HTTP 200, which is the status code for 'OK'
    # 400 means bad request and 404 means resource not found
    # 500 means an internal server error

    if "url" in request.GET:
        log("Received url request for \"" + request.GET["url"] + "\"")
        return handle_web_page_request(request, "url")
    elif request.content_type == 'text/plain':
        txt = request.body.decode("utf-8")
        log("Received text request for \"" + txt + "\"")
        return handle_text_request(request)
    elif request.content_type == 'text/html':
        html = request.body.decode("utf-8")
        soup = BeautifulSoup(html, 'html.parser')
        if soup.title and soup.title.string:
            log("Received html request for " + soup.title.string)
        else:
            log("Received html request")
        return handle_web_page_request(request, "html")
    else:
        return JsonResponse(
            {'message': "Invalid request"},
            status=400,
            json_dumps_params={'indent': 2})


def handle_text_request(request):
    text = request.body.decode("utf-8")

    #probability_AI_generated = model.probability_AI_generated_text(text, "openAIBase")
    probability_AI_generated = random.randint(1,99)

    responseData = {
        "text": text,
        "probability_AI_generated": probability_AI_generated
    }

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})

def handle_web_page_request(request, type):

    if type == "url":
        selectorsAndText, htmlHash = getSelectorsAndTextFromURL(request.GET["url"])
    else:
        assert type == "html"
        selectorsAndText, htmlHash = getSelectorsAndTextFromHtml(request.body.decode("utf-8"))

    responseData = {}

    responseData["html_checksum"] = htmlHash

    responseData["analysis"] = selectorsAndText
    length = len(selectorsAndText)
    sumCharacters = 0
    weightedSum = 0
    for i in range(length):
        text = selectorsAndText[i]["text"]
        #probability_AI_generated = model.probability_AI_generated_text(text, "openAIBase")
        probability_AI_generated = random.randint(1,99)
        responseData["analysis"][i]["probability_AI_generated"] = probability_AI_generated
        sumCharacters += len(text)
        weightedSum += len(text) * probability_AI_generated
        #print(str(i+1) + "/" + str(length) + " calculated")

    weightedAverage = weightedSum / sumCharacters
    responseData["overall_evaluation"] = round(weightedAverage)

    return JsonResponse(
        responseData,
        status=200,
        json_dumps_params={'indent': 2})

