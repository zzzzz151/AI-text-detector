from transformers import RobertaForSequenceClassification, RobertaTokenizer
from typing import Union, List
import torch

    
class ChatGPTRobertaDetectorModel:

    def __init__(self):
        """
        Paper: https://arxiv.org/abs/2301.07597
        Hub: https://huggingface.co/Hello-SimpleAI/chatgpt-detector-roberta
        """
        # uses GPU if available
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        self.model = RobertaForSequenceClassification.from_pretrained("Hello-SimpleAI/chatgpt-detector-roberta").to(self.device)
        self.tokenizer = RobertaTokenizer.from_pretrained("Hello-SimpleAI/chatgpt-detector-roberta")

    def __call__(self, input_text: Union[str, List[str]]):
        return self.predict(input_text)

    def predict(self, input_text: Union[str, List[str]]):
        
        inputs = self.tokenizer(input_text if isinstance(input_text, List) else [input_text], 
                                padding="longest",
                                return_tensors="pt")
        
        # do not perform the autodiff
        with torch.no_grad():
            logits = self.model(inputs.input_ids.to(self.device), attention_mask=inputs.attention_mask.to(self.device))[0]
            probs = logits.softmax(dim=-1) # first is human, second logit is fake
        
        return list(map(float, probs.detach().cpu()[:,1]))

