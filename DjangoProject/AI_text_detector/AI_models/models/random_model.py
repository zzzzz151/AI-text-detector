import random

class LanguageModel:
    def __init__(self):
        print("Random probability model loaded")

    def predict(self, text):
        return random.uniform(0, 1)
