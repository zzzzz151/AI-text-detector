import time
from typing import Union, List
import pandas as pd
import sys
import importlib.util
import requests

from AI_text_detector.models import LM_Script, LM_API

# Clear database
#LM_Script.objects.all().delete()
#LM_API.objects.all().delete()
"""
lm = LM_Script()
lm.name = "chatgpt-roberta"
lm.author = "OpenAI"
lm.description = "ChatGPT Roberta by OpenAI"
lm.script = "chatgpt_detector_roberta.py"
#lm.save()

lm = LM_Script()
lm.name = "openai-roberta-base"
lm.author = "OpenAI"
lm.description = "Base Roberta by OpenAI"
lm.script = "openai_base_roberta.py"
lm.save()

lm = LM_Script()
lm.name = "openai-roberta-large"
lm.author = "OpenAI"
lm.description = "Large Roberta by OpenAI"
lm.script = "openai_large_roberta.py"
#lm.save()
"""
class AI2:
    def __init__(self):
        # Load language models
        self.scriptLMs = {}
        for lm_script in LM_Script.objects.all():
            print("Loading LM " + lm_script.name)
            self.loadLM(lm_script.name, lm_script.script.name)

        print()
        print("Script LMs loaded:")
        for lm_name in self.scriptLMs.keys():
            print(lm_name)

        print()
        print("API LMs loaded:")
        for lm in LM_API.objects.all():
            print(lm.name)
        print()
        
    def probability_AI_generated_text(self, text:Union[str, List[str]], lm_name):
        if text.strip() == "":
            return None

        if lm_name in self.scriptLMs.keys():
            # the requested LM is of type script
            ret = self.scriptLMs[lm_name].predict(text)
            if type(ret) != list:
                return round(ret*100)
            # At this point, ret is a list
            ret = [round(prob*100) for prob in ret]
            if len(ret) == 1:
                return ret[0]
            elif len(ret) == 0:
                return None
            else:
                return ret
        
        try:
            api_url = LM_API.objects.get(pk=lm_name).API
            response = requests.post(api_url, data = text)
            probability = response.json()["probability_AI_generated"]
            probability *= 100
            probability = round(probability)
            return probability
        except Exception as e:
            return None
        
        # The requested lm_name doesnt exist, return None
        return None
    

    def loadLM(self, lm_name : str, fileName : str):
        # Get last 3 character
        ext = fileName[-3:]
        if ext != ".py":
            fileName += ".py"
        spec = importlib.util.spec_from_file_location(lm_name, "AI_text_detector/AI/language_models/" + fileName)
        newLM = importlib.util.module_from_spec(spec)
        sys.modules[lm_name] = newLM
        spec.loader.exec_module(newLM)
        self.scriptLMs[lm_name] = newLM.LM()
