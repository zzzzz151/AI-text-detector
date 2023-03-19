from LMs.language_models.core import BaseHFRobertaDetectorModel

class OpenAIBaseRobertaGPT2DetectorModel(BaseHFRobertaDetectorModel):
    """
        Paper: https://d4mucfpksywv.cloudfront.net/papers/GPT_2_Report.pdf#page=12
        Hub: https://huggingface.co/roberta-base-openai-detector
        """
    def __init__(self):
        super().__init__("roberta-base-openai-detector")

class OpenAILargeRobertaGPT2DetectorModel(BaseHFRobertaDetectorModel):
    """
    Paper: https://d4mucfpksywv.cloudfront.net/papers/GPT_2_Report.pdf#page=12
    Hub: https://huggingface.co/roberta-large-openai-detector
    """
    def __init__(self):
        super().__init__("roberta-large-openai-detector")
    

