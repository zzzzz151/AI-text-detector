import os
import socket
import subprocess
import sys
import time
from datetime import datetime

import pandas as pd
from django.db import OperationalError

from AI_text_detector.models import LM_Script, LM_API
from Docker.test import start_communicator
import Docker.communicator.messages as m

docker_compose_path = '/DjangoProject/Docker/communicator/docker-compose.yml'

def log(msg):
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + str(msg))
    sys.stdout.flush()

def start_stored_LMs():
    lms = LM_Script.objects.all()
    if lms.exists():
        for lm_object in lms:
            start_communicator(lm_object.name)

try:
    port = int(os.getenv('SEND_PORT'))
except TypeError:
    port = int(sys.argv[2])
try:
    host = os.getenv('SEND_HOST')
    if not host:
        host = sys.argv[2]
except TypeError:
    host = sys.argv[2]

message_ID = [0]
def increment_and_return_ID():
    ID = message_ID[0]
    message_ID[0] = ID + 1
    return ID
def log(msg):
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + str(msg))
    sys.stdout.flush()
def create_socket():
    lm_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lm_socket.connect((host, port))
    lm_socket.setblocking(True)
    return lm_socket
def get_prediction(text, lm):
    lm_socket = create_socket()
    ID = increment_and_return_ID()
    m.send_message_object(lm_socket, m.create_django_message(ID))
    m.send_message_object(lm_socket, m.create_predict_message(ID, lm, text))
    response = m.receive_message_object(lm_socket)
    lm_socket.close()
    if response and response.probability:
        return int(response.probability)
    return 0

def clear_database():
    LM_Script.objects.all().delete()
    LM_API.objects.all().delete()

#clear_database()

class TestLanguageModel:
    def __init__(self, model_class):
        print("Loading model...")
        self.model = model_class()
        print(f"Model {model_class.__name__} loaded.")

    def load_dataset(self, dataset):
        print("Loading dataset...")
        pf = pd.read_table(dataset)
        print(f"Dataset {dataset} loaded.")
        return pf.values

    def test_model(self, dataset_name):
        dataset = self.load_dataset(dataset_name)
        results = [] # (probability, is_synthetic, length_in_chars, time) aka (84, 1, 283, 0.056)

        max = 100
        dataset_evaluation_time_started = time.time()
        for data_id, string, is_synthetic in dataset:
            if len(string) < 250:
                continue
            datapoint_evaluation_time_started = time.time()
            probability = round(self.model(str(string))[0] * 100)
            results.append((data_id, probability, is_synthetic, len(string), time.time() - datapoint_evaluation_time_started))
            print(f"{len(results)}/{max}")
            #print(results[-1])
            if len(results) == max:
                break
        dataset_evaluation_time_taken = time.time() - dataset_evaluation_time_started

        probability_when_human = [probability for _, probability, is_synthetic, _, _ in results if is_synthetic == "human"]
        average_when_human = round(sum(probability_when_human) / len(probability_when_human), 1)

        probability_when_AI = [probability for _, probability, is_synthetic, _, _ in results if is_synthetic == "generated"]
        average_when_AI = round(sum(probability_when_AI) / len(probability_when_AI), 1)

        print(f"When human, detected as average {average_when_human}%")
        print(f"When AI, detected as average {average_when_AI}%")
        print(f"Took {dataset_evaluation_time_taken} seconds.")



if __name__ == '__main__':
    ...
    """
    def test_while_loop(model: LanguageModel):
        while True:
            input_text = input("Input text: ")
            if not input_text:
                break
            print(f"Probability of being computer-generated: {model.probability_AI_generated_text(input_text, 'openAIBase')}")


    model = LanguageModel()
    test_while_loop(model)

    # the first is an abstract for the paper GAN Goodfellow et al that was generated by chatgpt
    # the second is the true abstract of the same paper
    batched_input_text = [
        "Generative Adversarial Networks (GANs) are a type of deep learning model that have gained significant attention in recent years for their ability to generate realistic data samples. GANs are composed of two neural networks, a generator and a discriminator, that are trained simultaneously in a competitive manner. The generator network is tasked with generating samples that can fool the discriminator network into thinking they are real, while the discriminator network is trained to distinguish between real and generated data.\nThis paper provides a comprehensive overview of GANs, including their architecture, training procedure, and applications. We discuss the theoretical foundations of GANs, including the concept of adversarial training and the objective functions used to optimize the generator and discriminator networks. We also review recent advancements in GANs, such as conditional GANs and progressive GANs, that have enabled the generation of high-quality images, videos, and other types of data.\nIn addition to discussing the technical aspects of GANs, we also explore their practical applications, including image synthesis, data augmentation, and style transfer. We highlight the potential of GANs for generating synthetic data for training machine learning models, and discuss their implications for privacy and security.\nOverall, this paper provides a comprehensive overview of Generative Adversarial Networks, and their potential for advancing the field of artificial intelligence.",
        "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G. The training procedure for G is to maximize the probability of D making a mistake. This framework corresponds to a minimax two-player game. In the space of arbitrary functions G and D, a unique solution exists, with G recovering the training data distribution and D equal to 1/2 everywhere. In the case where G and D are defined by multilayer perceptrons, the entire system can be trained with backpropagation. There is no need for any Markov chains or unrolled approximate inference networks during either training or generation of samples. Experiments demonstrate the potential of the framework through qualitative and quantitative evaluation of the generated samples."]
    
    probs = model.probability_AI_generated_text(batched_input_text, "openAIBase")
    for i, text in enumerate(batched_input_text):
        print(f"Input text: {text[:100]}...")
        print(f"Probability of being computer-generated: {probs[i]}")
    

    #test_while_loop(model)

    for model_class in list(language_models.values()):
        test_model = TestLanguageModel(model_class)
        test_model.test_model("LMs/train.tsv")
    """