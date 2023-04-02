import time
from typing import Union, List
import pandas as pd
import sys

from .language_models.chatgpt_detector_roberta import ChatGPTRobertaDetectorModel
from .language_models.roberta_openai_detector import OpenAIBaseRobertaGPT2DetectorModel, OpenAILargeRobertaGPT2DetectorModel

language_models = {
        #"chatGPT": ChatGPTRobertaDetectorModel,
        "openAIBase": OpenAIBaseRobertaGPT2DetectorModel,
        #"openAILarge": OpenAILargeRobertaGPT2DetectorModel
    }

class LanguageModel:
    def __init__(self):
        # Warning: Takes time to load
        print("Loading models")
        self.models = {language_model_name:language_model() for language_model_name, language_model in list(language_models.items())}
        self.models_name = [model.__class__.__name__ for model in self.models]

    def probability_AI_generated_text(self, text:Union[str, List[str]], model_name):
        if model_name not in self.models.keys():
            raise ValueError(f"The model {model_name} does not exist.")

        ret = [round(prob*100) for prob in self.models[model_name](text)]
        if len(ret) == 1:
            return ret[0]
        if len(ret) == 0:
            return None
        return ret

class IsolatedLanguageModel:
    def __init__(self, className, lm_name):
        # Warning: Takes time to load
        print("Loading model")
        self.model = className()
        self.name = lm_name



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
    def test_while_loop(model: LanguageModel):
        while True:
            input_text = input("Input text: ")
            if not input_text:
                break
            print(f"Probability of being computer-generated: {model.probability_AI_generated_text(input_text, 'openAIBase')[0]}")


    """
    #model = LanguageModel()

    # the first is an abstract for the paper GAN Goodfellow et al that was generated by chatgpt
    # the second is the true abstract of the same paper
    batched_input_text = [
        "Generative Adversarial Networks (GANs) are a type of deep learning model that have gained significant attention in recent years for their ability to generate realistic data samples. GANs are composed of two neural networks, a generator and a discriminator, that are trained simultaneously in a competitive manner. The generator network is tasked with generating samples that can fool the discriminator network into thinking they are real, while the discriminator network is trained to distinguish between real and generated data.\nThis paper provides a comprehensive overview of GANs, including their architecture, training procedure, and applications. We discuss the theoretical foundations of GANs, including the concept of adversarial training and the objective functions used to optimize the generator and discriminator networks. We also review recent advancements in GANs, such as conditional GANs and progressive GANs, that have enabled the generation of high-quality images, videos, and other types of data.\nIn addition to discussing the technical aspects of GANs, we also explore their practical applications, including image synthesis, data augmentation, and style transfer. We highlight the potential of GANs for generating synthetic data for training machine learning models, and discuss their implications for privacy and security.\nOverall, this paper provides a comprehensive overview of Generative Adversarial Networks, and their potential for advancing the field of artificial intelligence.",
        "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G. The training procedure for G is to maximize the probability of D making a mistake. This framework corresponds to a minimax two-player game. In the space of arbitrary functions G and D, a unique solution exists, with G recovering the training data distribution and D equal to 1/2 everywhere. In the case where G and D are defined by multilayer perceptrons, the entire system can be trained with backpropagation. There is no need for any Markov chains or unrolled approximate inference networks during either training or generation of samples. Experiments demonstrate the potential of the framework through qualitative and quantitative evaluation of the generated samples."]
    
    probs = model.probability_AI_generated_text(batched_input_text, "openAIBase")
    for i, text in enumerate(batched_input_text):
        print(f"Input text: {text[:100]}...")
        print(f"Probability of being computer-generated: {probs[i]}")
    

    # test_while_loop(model)
    """

    for model_class in list(language_models.values()):
        test_model = TestLanguageModel(model_class)
        test_model.test_model("LMs/train.tsv")
