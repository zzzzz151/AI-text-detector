FROM xela10001/ai-text-detector-communicator:0.0.4
ENV PYTHONBUFFERED=1
ARG LM_NAME
COPY communicator/LMs/${LM_NAME}/lm_submission.py ./
COPY communicator/LMs/${LM_NAME}/requirements.txt ./
COPY communicator/communicator.py ./
COPY messages.py ./
COPY communicator/tester.py ./
COPY communicator/train.tsv ./
