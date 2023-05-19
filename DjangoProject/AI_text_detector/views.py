import json
import random

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import parsers
from rest_framework.decorators import authentication_classes, permission_classes, renderer_classes, api_view
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from .AI_models.prediction_models import log, startup, process_model_script_submission, \
    process_model_API_submission, is_model_valid, predict_text, delete_model_script, is_script
from .models import *

startup()

@csrf_exempt
def handle_text_request(request):
    # JsonResponse normally returns HTTP 200, which is the status code for 'OK'
    # 400 means bad request and 404 means resource not found
    # 500 means an internal server error

    model_name = ""
    try:
        if request.content_type == 'text/plain':
            text = request.body.decode("utf-8")
        else:
            request_data = json.loads(request.body.decode())
            text = request_data["text"]
            model_name = request_data['model']
    except:
        log("Received invalid request")
        return JsonResponse(
            {'message': "Invalid request"},
            status=400,
            json_dumps_params={'indent': 2})

    log("Received text request for \"" + text + "\"")
    response_data = predict_text(model_name, text)

    return JsonResponse(
        response_data,
        status=200,
        json_dumps_params={'indent': 2})

@csrf_exempt
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
@api_view(("GET","POST","DELETE"))
@authentication_classes([])
@permission_classes([])
def handle_models_request(request):
    method = request.method.upper()

    if method == "GET":
        return get_models(request)
    elif method == "POST":
        modelUploadView = model_Upload.as_view()
        return modelUploadView(request._request)
    elif method == "DELETE":
        return delete_model(request)

    return Response(status=500)

@authentication_classes([])
@permission_classes([])
class model_Upload(APIView):
    parser_classes = (parsers.MultiPartParser,)

    @authentication_classes([])
    @permission_classes([])
    def post(self, request):
        model_name = None
        try:
            model_name, model_author, model_description = request.data["name"],\
                                                          request.data["author"],\
                                                          request.data["description"]
            log("Received model '" + model_name + "'")

            assert is_model_valid(model_name)

            if "script" in request.data:
                process_model_script_submission(model_name, model_author, model_description, request)
            elif "API" in request.data or "api" in request.data:
                process_model_API_submission(model_name, model_author, model_description, request)

            log("Accepted model '" + model_name + "'")
        except Exception as e:
            log(e)
            log("Refused model '" + model_name + "'")
            return Response(status=500)  # Internal server error

        return Response(status=200)  # Ok


@csrf_exempt
def get_models(request):
    filter_param = request.GET.get('filter', None)
    model_type_filter = request.GET.get('type', None)
    include_type = False

    if filter_param:
        filter_fields = filter_param.split(',')
    else:
        filter_fields = ['name', 'author', 'description']
        include_type = True

    if 'type' in filter_fields:
        include_type = True
        filter_fields.remove('type')

    models = []

    def whitelistByAuthor(argmodel):
        if "author" not in request.GET:
            return True
        author = request.GET["author"].lower()
        if argmodel.author.lower() == author.lower():
            return True
        if argmodel.author.lower() == author.strip().lower():
            return True
        return False

    for model in [LM_Script, LM_API]:
        if model_type_filter and model_type_filter.lower() != model.TYPE:
            continue
        for model in model.objects.all():
            if not whitelistByAuthor(model):
                continue
            model_dict = {field: getattr(model, field) for field in filter_fields if hasattr(model, field)}
            if include_type:
                model_dict['type'] = model.TYPE
            models.append(model_dict)

    return JsonResponse(models, safe=False, status=200, json_dumps_params={'indent': 2})

@csrf_exempt
def my_model_as_API(request):
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
def delete_model(request):
    data = json.loads(request.body)
    if "name" not in data:
        return Response(status=500)
    model_name = data["name"]

    if is_script(model_name):
        try:
            delete_model_script(model_name)
            log("Deleted model '" + model_name + "'")
            return Response(status=200)
        except Exception as e:
            log(e)
            return Response(status=500)
    else:
        try:
            model = LM_API.objects.get(name=model_name)
            model.delete()
            log("Deleted model '" + model_name + "'")
            return Response(status=200)
        except:
            return Response(status=500)
