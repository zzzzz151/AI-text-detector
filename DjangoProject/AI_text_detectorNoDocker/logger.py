from datetime import datetime

def log(msg=None):
    if not msg:
        print()
        return
    strDateTimeNow = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print(strDateTimeNow + " " + msg)