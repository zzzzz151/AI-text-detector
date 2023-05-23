import selectors
import socket
import sys
import os

#import docker

import messages as m


def log(text):
	print(text)
	sys.stdout.flush()

container_id = [0]
def increment_and_return_ID():
	ID = container_id[0]
	container_id[0] = ID + 1
	return ID

lm_name_dictionary = {
	# "lm_name_in_database": (corresponding_socket, "corresponding_docker_container_name")
	# or
	# "django": django_socket
}

django_sockets = {
	# id: corresponding_socket
}



def initialize(sock):
	sock.setblocking(False)
	selector = selectors.DefaultSelector()
	selector.register(sock, selectors.EVENT_READ, data=None)
	return selector
def accept_sockets(server_socket, selector, key):
	if key.fileobj == server_socket:
		clt_socket, clt_addr = server_socket.accept()
		clt_socket.setblocking(True)

		# Add it to the sockets under scrutiny
		selector.register(clt_socket, selectors.EVENT_READ, data=None)
		log('Client added')
def handle_events(server_socket, events, selector):
	for key, mask in events:
		# Check for a new client connection
		accept_sockets(server_socket, selector, key)

		client_socket = key.fileobj
		if client_socket != server_socket:
			# Handle the messages
			handle_messages(client_socket, selector)
def start(server_socket):
	selector = initialize(server_socket)

	while True:
		# There is a 10 second window between users joining the game. If it expires, the game starts
		events = selector.select(timeout=None)
		if not events:
			# Someone exited?
			log("A socket exited")
			break

		handle_events(server_socket, events, selector)
	log("Ending")
def get_django_socket(ID):
	return django_sockets.pop(ID)

def handle_messages(client_socket, selector):
	message_obj = m.receive_message_object(client_socket, selector)
	if not message_obj:
		return

	print(message_obj)
	ID = message_obj.identification
	message_type = message_obj.message_type
	lm = message_obj.language_model
	text = message_obj.text
	probability = message_obj.probability

	# Django server is asking us to create a container
	if message_type == 'create_container':
		...
		#create_container(lm)
	# At this point, container is setup and working.
	elif message_type == 'connect':
		add_lm(lm, client_socket)
	# We have received the output probability
	elif message_type == 'probability':
		log(f"Prob: {probability}")
		django_socket  = get_django_socket(ID)
		m.send_message_object(django_socket, m.create_probability_message(ID, lm, probability))
	elif message_type == 'django':
		django_sockets[ID] = client_socket
	elif message_type == 'predict':
		predict(ID, text, lm)

def predict(ID, text, lm_name):
	if lm_name in lm_name_dictionary.keys():
		predict_message = m.create_predict_message(ID, lm_name, text)
		lm_socket = lm_name_dictionary[lm_name][0]
		m.send_message_object(lm_socket, predict_message)
	else:
		sock = django_sockets.pop(ID)
		prob_message = m.create_probability_message(ID, lm_name, 0)
		m.send_message_object(sock, prob_message)

def add_lm(lm_name, client_socket):
	log(f"Submitting {lm_name}")
	if lm_name:
		lm_name_dictionary[lm_name] = (client_socket, lm_name + "_" + str(increment_and_return_ID()))





if __name__ == "__main__":
	try:
		port = int(os.getenv('SEND_PORT'))
	except TypeError:
		port = int(sys.argv[1])
	try:
		host = os.getenv('SEND_HOST')
		if not host:
			host = sys.argv[2]
	except TypeError:
		host = sys.argv[2]

	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
		server_socket.bind((host, port))
		server_socket.listen()
		start(server_socket)