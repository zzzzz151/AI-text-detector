import socket
import sys
import os

def log(text):
	print(text)
	sys.stdout.flush()

if __name__ == "__main__":
	server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	server_socket.bind((os.getenv('SEND_HOST'), int(os.getenv('SEND_PORT'))))
	server_socket.listen(1)

	try:
		while True:
			log("Server connected")
			conn, info = server_socket.accept()
			string = "According to all known laws of aviation, there is no way a bee should be able to fly."
			conn.send(string.encode())
			data = conn.recv(1024).decode()
			while data:
				log(f"Received: {data}")
				data = conn.recv(1024)
	except KeyboardInterrupt:
		server_socket.close()