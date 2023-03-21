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
        if text == "" or numWords < 10:
            continue

        selectorAndText = {"selector": getCompleteSelector(element), "text": text}
        selectorsAndText.append(selectorAndText)

    return selectorsAndText

def getSelectorsAndTextFromURL(url : str):
    response = requests.get(url) # send a GET request to the URL
    html = response.content
    return getSelectorsAndTextFromHtml(html)

def test():
    f = open("testHtml.html","r")
    html = f.read()
    f.close()

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
    selectorsAndText = getSelectorsAndTextFromURL(newsUrl)
    printResultFormatted(selectorsAndText)
    print()
    selectorsAndText= getSelectorsAndTextFromHtml(html)
    printResultFormatted(selectorsAndText)

if __name__ == "__main__":
    test()