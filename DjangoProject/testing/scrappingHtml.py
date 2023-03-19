"""
print(html2text.html2text("<p><strong>Zed's</strong> dead baby, <em>Zed's</em> dead.</p>"))
**Zed's** dead baby, _Zed's_ dead.

"""


import requests
from bs4 import BeautifulSoup
from cssselect import HTMLTranslator
import html2text
from urllib.request import urlopen
import copy
import sys
import re
import random

# specify the URL to fetch
newsUrl = "https://www.jn.pt/nacional/rui-nabeiro-partiu-o-homem-que-vivia-para-as-pessoas-e-para-a-sua-terra-16031690.html"
articleUrl = "https://www.theguardian.com/commentisfree/2023/mar/11/users-advertisers-we-are-all-trapped-in-the-enshittification-of-the-internet"

# send a GET request to the URL
#response = requests.get(articleUrl)
response = requests.get(newsUrl)

websiteHtml = response.content

myHtml = """
<html>
<head>
  <title>Example Document</title>
</head>
<body>
  <h1>Welcome to my website</h1>
  <div class="content">
    <p>before span <span style="color:blue">inside span</span> after span </p>
    <a href="https://www.example.com">Click here</a>
    <p>This is my complex p <span>oh look a span</span> and a link next <a href="mylink.com">click here</a></p>
    <h1>Text in h1 <h2>Text in h2</h2></h1>
  </div>
</body>
</html>
"""

# parse the HTML content using BeautifulSoup
#soup = BeautifulSoup(websiteHtml, 'html.parser')
soup = BeautifulSoup(myHtml, 'html.parser')

def v1():
    elements = []
    relevantTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"]
    for tag in relevantTags:
        elements += soup.find_all(tag)

    def isUselessElement(elem) -> bool:
        elementCopy = copy.copy(elem)
        while elementCopy.parent:
            if elementCopy.parent.name in relevantTags and elementCopy.text in elementCopy.parent.text:
                return True
        return False

    def getCompleteSelector(elem) -> str:
        elementCopy = copy.copy(elem)
        while element.parent:
            if element.parent.name == "[document]":
                break
            selector = element.parent.name + " > " + selector
            element = element.parent

    for element in elements:
        if isUselessElement(element):
            pass

        selector = element.name
        text = element.text.strip()
        numWords = len(re.split("\s+", text))
        if text == "" or numWords <= 5:
            continue
        while element.parent:
            if element.parent.name == "[document]":
                break
            selector = element.parent.name + " > " + selector
            element = element.parent
        print(selector)
        print(text)
        print(str(get_AI_generated_probability(text)) + "%")
        print("--------")

def get_AI_generated_probability(text : str):
    return random.randint(1,99)

if __name__ == "__main__":
    v1()