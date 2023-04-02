import sys
from time import sleep

import lm_submission
import socket
import os

def log(text):
	print(text)
	sys.stdout.flush()

class IsolatedLanguageModel:
	def __init__(self, lm_name):
		# Warning: Takes time to load
		print("Loading model")
		self.model = lm_submission.LanguageModel()
		self.name = lm_name

	def predict(self, text:str):
		return round(self.model.predict(text) * 100)

if __name__ == "__main__":
	lm_name = sys.argv[1]
	log(f"Loading LM: {lm_name}")
	model = IsolatedLanguageModel(lm_name)

	receiving_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	receiving_socket.connect((os.getenv('LISTEN_HOST'), int(os.getenv('LISTEN_PORT'))))

	message = receiving_socket.recv(1024).decode()
	log(f"Received: {message}")
	prob = model.predict(message)

	log(f"Sending: {prob}")
	receiving_socket.send(str(prob).encode())
	sleep(1)