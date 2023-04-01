import mysql.connector

connection = mysql.connector.connect(user='root', password='root', host='mysql', port='3306', database='ai')
print("DB connected")

cursor = connection.cursor()
cursor.execute('SELECT * FROM Accounts')
accounts = cursor.fetchall()
connection.close()

print(accounts)