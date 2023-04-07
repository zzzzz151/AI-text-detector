import sys

import lm_name.lm_submission as lm
import socket
import os

from server import messages as m

def log(text):
	print(text)
	sys.stdout.flush()

class IsolatedLanguageModel:
	def __init__(self, lm_name):
		# Warning: Takes time to load
		log("Loading model")
		self.model = lm.LanguageModel()
		self.name = lm_name

	def predict(self, text:str):
		return round(self.model.predict(text) * 100)

def handle_messages(server_socket, message, model):
	if not message:
		return

	messageID = message.identification
	messageType = message.message_type

	if messageType == 'connect':
		...
	elif messageType == 'predict':
		probability = model.predict(message.text)
		m.send_message_object(server_socket, m.create_probability_message(messageID, model.name, probability))


if __name__ == "__main__":
	try:
		port = int(os.getenv('LISTEN_PORT'))
	except TypeError:
		port = int(sys.argv[2])
	try:
		host = os.getenv('LISTEN_HOST')
		if not host:
			host = sys.argv[2]
	except TypeError:
		host = sys.argv[2]

	try:
		lm_name = sys.argv[1]
	except IndexError:
		lm_name = "chatGPT_roberta"
	model = IsolatedLanguageModel(lm_name)

	log(f"Connecting with port {port}")
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
		s.connect((host, port))
		m.send_message_object(s, m.create_connect_message(lm_name))
		while True:
			message = m.receive_message_object(s)
			if not message:
				log("Server has closed")
				exit(1)

			handle_messages(s, message, model)