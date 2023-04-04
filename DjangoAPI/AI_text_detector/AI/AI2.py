import time
from typing import Union, List
import pandas as pd
import sys
import importlib.util

from .language_models.chatgpt_detector_roberta import ChatGPTRobertaDetectorModel
from .language_models.roberta_openai_detector import OpenAIBaseRobertaGPT2DetectorModel, OpenAILargeRobertaGPT2DetectorModel

language_models = {
        #"chatGPT": ChatGPTRobertaDetectorModel,
        "openAIBase": OpenAIBaseRobertaGPT2DetectorModel,
        #"openAILarge": OpenAILargeRobertaGPT2DetectorModel
    }

class AI2:
    def __init__(self):
        # Warning: Takes time to load
        print("Loading models")
        self.models = {language_model_name:language_model() for language_model_name, language_model in list(language_models.items())}
        self.models_name = [model.__class__.__name__ for model in self.models]

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
