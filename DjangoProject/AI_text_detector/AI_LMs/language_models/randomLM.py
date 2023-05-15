import random

class LanguageModel:
    def __init__(self):
        print("RandomLM loaded")

    def predict(self, text):
        return random.uniform(0, 1)
