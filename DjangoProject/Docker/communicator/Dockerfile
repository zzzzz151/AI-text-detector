FROM xela10001/ai-text-detector-communicator-nvidia:latest
ENV PYTHONBUFFERED=1
ARG LM_NAME=chat-gpt-roberta
COPY communicator/LMs/${LM_NAME}/lm_submission.py ./
COPY communicator/LMs/${LM_NAME}/requirements.txt ./
COPY communicator/communicator.py ./
COPY messages.py ./
COPY communicator/tester.py ./
COPY communicator/train.tsv ./
