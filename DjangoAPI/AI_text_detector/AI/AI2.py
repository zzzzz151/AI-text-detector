import time
from typing import Union, List
import pandas as pd
import sys
import importlib.util

from AI_text_detector.models import LM_Script, LM_API

LM_Script.objects.all().delete()
LM_API.objects.all().delete()


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

class AI2:
    def __init__(self):

        # Load language models
        self.models = {}
        for lm_script in LM_Script.objects.all():
            print("Loading LM " + lm_script.name)
            self.loadLM(lm_script.name, lm_script.script.name)

        
        
    def probability_AI_generated_text(self, text:Union[str, List[str]], model_name):
        if model_name not in self.models.keys():
            raise ValueError(f"The model {model_name} does not exist.")

        try:
            ret = self.models[model_name].predict(text)
        except RuntimeError:
            # Too many tokens
            return None

        if type(ret) != list:
            return round(ret*100)
        else:
            ret = [round(prob*100) for prob in ret]
            if len(ret) == 1:
                return ret[0]
            if len(ret) == 0:
                return None
                
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
        self.models[lm_name] = newLM.LM()
