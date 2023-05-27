import sys
import lm_submission as lm
import socket
import os

import messages as m
import tester


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
		result = self.model.predict(text)
		if type(result) == list:
			result = result[0]
		return round(result * 100)

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
			host = sys.argv[3]
	except TypeError:
		host = sys.argv[3]

	try:
		lm_name = os.getenv('LM_NAME')
	except TypeError:
		try:
			lm_name = sys.argv[4]
		except IndexError:
			lm_name = "abcd"
	log(f"NAME: {lm_name}")
	model = IsolatedLanguageModel(lm_name)
	log(f"Testing model {lm_name}")
	avg_human, avg_ai, time_taken = tester.test_given_model(model, "train.tsv")
	log(f"Testing concluded. Results:\nWhen Human: {avg_human}%\nWhen AI: {avg_ai}%\nTime Taken: {time_taken} seconds.")

	# We could insert a bigger threshold to reject this model,
	# but the dataset is bad so we don't want to falsely reject our models
	if avg_ai < 1: # above 1% detection rate (50 times worse than a coinflip) is enough for now
		status = 'rejected'

	else:
		status = 'accepted'

	log(f"Connecting LM {lm_name} with port {port}")
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
		s.connect((host, port))
		m.send_message_object(s, m.create_connect_message(lm_name, status))
		if status == 'accepted':
			while True:
				message = m.receive_message_object(s)
				if not message:
					log("Server has closed")
					exit(1)

				handle_messages(s, message, model)