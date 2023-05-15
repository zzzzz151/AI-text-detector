from transformers import RobertaForSequenceClassification, RobertaTokenizer
from typing import Union, List
import torch


class BaseHFRobertaDetectorModel:

    def __init__(self, model_name: str):

        # uses GPU if available
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        self.model = RobertaForSequenceClassification.from_pretrained(model_name).to(self.device)  
        self.tokenizer = RobertaTokenizer.from_pretrained(model_name)

    def __call__(self, input_text: Union[str, List[str]]):
        return self.predict(input_text)

    def predict(self, input_text: Union[str, List[str]]):
        
        inputs = self.tokenizer.batch_encode_plus(input_text if isinstance(input_text, List) else [input_text], 
                                        padding="longest",
                                        return_tensors="pt",
                                        pad_to_max_length=True,
                                        return_attention_mask=True)
        
        # do not perform the autodiff
        with torch.no_grad():
            logits = self.model(inputs.input_ids.to(self.device), attention_mask=inputs.attention_mask.to(self.device))[0]
            probs = logits.softmax(dim=-1) # first is human, second logit is fake
        
        return self.post_process_probs(probs.detach().cpu())
    
    def post_process_probs(self, probs):
        # In the roberta_openai model the first logits correspond to the fake class and the second is the human-class
        return list(map(float, probs[:,0])) # returns the probability of being computer-generated

class LM(BaseHFRobertaDetectorModel):
    """
        Paper: https://d4mucfpksywv.cloudfront.net/papers/GPT_2_Report.pdf#page=12
        Hub: https://huggingface.co/roberta-base-openai-detector
        """
    def __init__(self):
        super().__init__("roberta-base-openai-detector")