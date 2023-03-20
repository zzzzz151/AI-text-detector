"""
print(html2text.html2text("<p><strong>Zed's</strong> dead baby, <em>Zed's</em> dead.</p>"))
**Zed's** dead baby, _Zed's_ dead.
"""

import requests
from bs4 import BeautifulSoup
import re

def getSelectorsAndTextFromHtml(html : str):
    soup = BeautifulSoup(html, 'html.parser')
    soupCopy = BeautifulSoup(html, 'html.parser')

    elements = []
    relevantTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a"]
    for tag in relevantTags:
        elements += soup.find_all(tag)

    def isUselessElement(argElement) -> bool:
        while argElement.parent:
            if argElement.parent.name in relevantTags and argElement.text in argElement.parent.text:
                return True
            argElement = argElement.parent
        return False

    def getCompleteSelector(argElement) -> str:
        # elementCopy = copy.copy(argElmement)
        selector = argElement.name
        if not argElement.parent:
            return selector
        while argElement.parent.name != "[document]":
            selector = argElement.parent.name + " > " + selector
            argElement = argElement.parent
        return selector

    selectorsAndText = []
    for element in elements:
        if isUselessElement(element):
            pass

        text = element.text.strip()
        numWords = len(re.split("\s+", text))
        if text == "" or numWords <= 5:
            continue

        selectorAndText = {"selector": getCompleteSelector(element), "text": text}
        selectorsAndText.append(selectorAndText)

    return selectorsAndText

def getSelectorsAndTextFromURL(url : str):
    response = requests.get(url) # send a GET request to the URL
    html = response.content
    return getSelectorsAndTextFromHtml(html)


def test():
    html = """
    <html>
    <head>
      <title>Example Document</title>
    </head>
    <body>
    <h1>Welcome to my website</h1>
    <div>
        <p>before span <span style="color:blue">inside span</span> after span </p>
        <a href="https://www.example.com">Click here pls its my independent a</a>
        <p>This is my complex p <span>oh look a span</span> and a link next <a href="mylink.com">click here</a></p>
        <h1>Text in h1 <h2>Text inside h2</h2></h1>
    </div>
    <span> Normal indepndent span with some text </span>
    <span>Hello<span> World, I love programming :D</span></span>
    <p>Artificial intelligence (AI) has revolutionized the way we interact with technology and has become an integral part of our daily lives. AI-powered virtual assistants like Siri and Alexa have made it easier for us to access information and manage our daily tasks. Machine learning algorithms are helping businesses improve their products and services by analyzing customer data and predicting future trends. AI is also being used in healthcare to develop more accurate diagnostic tools and personalized treatment plans. As AI continues to advance, it has the potential to create even more opportunities and solve complex problems in fields like climate change and energy conservation.</p>
    </body>
    </html>
    """

    def printResultFormatted(res):
        if len(res) <= 1:
            print(res)
        print("[")
        for elem in res:
            print(str(elem) + ",")
        print("]")

    newsUrl = "https://www.jn.pt/nacional/rui-nabeiro-partiu-o-homem-que-vivia-para-as-pessoas-e-para-a-sua-terra-16031690.html"
    articleUrl = "https://www.theguardian.com/commentisfree/2023/mar/11/users-advertisers-we-are-all-trapped-in-the-enshittification-of-the-internet"
    print()
    res = getSelectorsAndTextFromURL(newsUrl)
    printResultFormatted(res)
    print()
    res = getSelectorsAndTextFromHtml(html)
    printResultFormatted(res)

if __name__ == "__main__":
    test()