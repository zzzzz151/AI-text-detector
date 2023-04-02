from time import sleep
import sys
import logging

import mysql.connector

def log(message:str)->None:
	sys.stdout.write(str(message) + "\n")
	sys.stdout.flush()

connection = mysql.connector.connect(user='root', password='root', host='mysql', port='3306', database='ai')
log("DB connected")

cursor = connection.cursor()
cursor.execute('SELECT * FROM Accounts')
accounts = cursor.fetchall()
log(accounts)
cursor.execute('SELECT * FROM LMs')
LMs = cursor.fetchall()
log(LMs)

i = 0
while True:
	i += 1
	log("AHHAHHAH123")
	sleep(1)
	log("after 1")
	sleep(2)
	log("after 3")
	sleep(2)
	log("after 5")
	if i == 2:
		log("closing")
		connection.close()
		sys.exit(0)
	log("Continuing")
