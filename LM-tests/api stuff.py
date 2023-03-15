import socket


# Note: Class created to be flexible. If we have user-specific requests, we can just easily add self.user to it
class API_message:

	def __init__(self, message_type:str):
		self.argument_dictionary = {'message_type': message_type}

	def type(self)->str:
		return self.argument_dictionary['message_type']

	def add(self, name:str, obj):
		self.argument_dictionary[name] = obj

	def add_multiple(self, names:list[str], objs:list):
		if len(names) != len(objs):
			raise ValueError("Both lists must have the same size")

		for i in range(len(names)):
			self.add(names[i], objs[i])




	# The requests

	@staticmethod
	def URL_request(url:str)->'API_message':
		request = API_message("url")
		request.add('url', url)
		return request

	@staticmethod
	def text_request(text:str)->'API_message':
		request = API_message("text")
		request.add('text', text)
		return request

	# what arguments does this take? a pdf file class?
	# TODO: Figure that out
	@staticmethod
	def PDF_request(pdf:...)->'API_message':
		request = API_message("pdf")
		request.add('pdf', pdf)
		return request


	# The responses

	@staticmethod
	def text_highlight_response(text_highlight:str)->'API_message':
		response = API_message("text_highlight")
		response.add('text_highlight', text_highlight)
		return response

	@staticmethod
	def index_highlight_response(starting_index:int, ending_index:int)->'API_message':
		response = API_message("index_highlight")
		response.add_multiple(['starting_index', 'ending_index'], [starting_index, ending_index])
		return response

# Can django handle this for us?
def create_socket(ip)->socket.socket:
	test_socket = socket.socket()
	test_socket.bind(ip)
	test_socket.connect(ip)
	return test_socket

# How the server sends messages to the users
def send_message(message:API_message):
	connection_socket = create_socket("localhost")
