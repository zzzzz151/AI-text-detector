import json
import sys
import base64

def encode(text):
	message_bytes = text.encode('UTF-8')
	base64_bytes = base64.b64encode(message_bytes)
	return base64_bytes
	#return text.encode('utf-8')

def decode(byte):
	message_bytes = base64.b64decode(byte)
	text = message_bytes.decode('UTF-8')
	return text
	#return byte.decode('utf-8')

def log(text):
	print(text)
	sys.stdout.flush()

def close_socket(socket, selector=None):
	log("Closing a socket")
	if selector:
		selector.unregister(socket)
	socket.close()
def receive_message_object(socketOrigin, selector=None):
	try:
		def recv_msg(src):
			def exact_recv(src, length):
				data = bytearray(0)

				while len(data) != length:
					more_data = src.recv(length - len(data))
					if len(more_data) == 0:  # End-of-File
						return None
					data.extend(more_data)
				return data

			data = exact_recv(src, 4)  # 4-byte integer, network byte order (Big Endian)
			if data is None:
				return None

			length = int.from_bytes(data, 'big')
			return exact_recv(src, length)

		# Client data is available for reading.
		bytesData = recv_msg(socketOrigin)
	except ConnectionResetError:
		bytesData = None

	# No data means the socket wants to close the connection.
	if bytesData is None:
		close_socket(socketOrigin, selector)
		return

	# Transform the bytes into a usable Message object.
	message: Message = Message.from_JSON(bytesData)
	log(f"RECEIVING:\n{message}")
	return message
def send_message_object(socketDestination, message, selector=None):
	log(f"SENDING:\n{message}")
	try:
		def send_msg(dst, msg):
			length = len(msg).to_bytes(4, 'big')  # 4-byte integer, network byte order (Big Endian)
			dst.send(length)
			dst.send(msg)

		send_msg(socketDestination, encode(message.to_JSON()))
	except ConnectionResetError:
		close_socket(socketDestination, selector)

class Message:
	def __init__(self, identification, message_type, text, language_model, probability):
		self.identification = identification
		self.message_type = message_type
		self.text = text
		self.language_model = language_model
		self.probability = probability

	def __str__(self):
		return f"Message->\n\tid:{self.identification},\n\ttype:{self.message_type}\n\t" \
			   f"'{self.text}',\n\t" \
			   f"lm:{self.language_model},\n\tprob:{self.probability}\n"

	def __repr__(self):
		return str(self)

	@classmethod
	def from_JSON(cls, bytesData):
		text = decode(bytesData)
		messageAsDictionary = json.loads(text)
		return Message(messageAsDictionary['identification'], messageAsDictionary['messageType'],
					   messageAsDictionary['text'], messageAsDictionary['language_model'],
					   messageAsDictionary['probability'])

	def to_JSON(self):
		return json.dumps(self.turn_message_into_dictionary())

	def turn_message_into_dictionary(self):
		dictionary = {'identification': self.identification, 'messageType': self.message_type, 'text': self.text,
					  'language_model': self.language_model, 'probability': self.probability}
		return dictionary

def create_connect_message(lm_name)->Message:
	return Message(None, 'connect', None, lm_name, None)
def create_predict_message(ID, lm_name, text)->Message:
	return Message(ID, 'predict', text, lm_name, None)
def create_probability_message(ID, lm_name, prob)->Message:
	return Message(ID, 'probability', None, lm_name, prob)
def create_django_message(ID)->Message:
	return Message(ID, 'django', None, None, None)


if __name__ == "__main__":
	# ignroe this, this is just for testing
	text = "hi hello"
	bytes_stuff = encode(text)
	print(bytes_stuff)
	print(decode(bytes_stuff))