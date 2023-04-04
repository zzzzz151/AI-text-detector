FROM python:3.9

WORKDIR /usr/app/src

COPY communicator.py ./
COPY lm_name/lm_submission.py ./lm_name/
COPY lm_name/requirements.txt ./lm_name/
COPY server/messages.py ./server/

RUN pip3 install -r lm_name/requirements.txt