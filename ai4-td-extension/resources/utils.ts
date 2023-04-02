import $ from 'jquery';

/* API */

function callApi(url, bodyObject, type = 'application/json') {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': type
        },
        body: type == 'application/json' ? JSON.stringify(bodyObject) : bodyObject
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching data: ', error);
            throw error;
        });
}

/* Analyzer */

import findAndReplaceDOMText from './findAndReplaceDOMText'

/*
function isPDF(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const bytes = new Uint8Array(reader.result).subarray(0, 4);
        const header = Array.from(bytes).map(byte => byte.toString(16)).join('');
        resolve(header === '25504446');
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
}
*/

function analysePage() {
    const exclude = ['base', 'head', 'meta', 'title', 'link', 'style',
        'script', 'noscript', 'audio', 'video', 'source',
        'track', 'canvas', 'svg', 'img', 'iframe',
        'embed', 'object', 'param', 'map', 'area',
        'menu', 'menuitem'
    ];
    const strExclude = exclude.join(", ")

    const URL = "http://127.0.0.1:8000/api/v1";
    const HIGHLIGHT_THRESHOLD_PROBABILITY = 50;
    const MIN_WORDS = 7;
    let promises = []; // array to save fetch promises

    // Iterate elements with relevant tag
    document.querySelectorAll("body, div, p, h1, h2, h3, h4, h5, h6").forEach((elem) => {

        /*
        // If this elem has a relevant ancestor elem, skip this elem 
        for (relevantTag of relevantTags) {
            let relevantRoots = getParents(elem, relevantTag);
            if (relevantRoots.length == 0)
                continue;
            let relevantRoot = relevantRoots[relevantRoots.length - 1];
            if (relevantRoot != elem)
                return;
        }

        clone = elem.cloneNode(true);
        clone.querySelectorAll(strExclude).forEach(function(v) {
            v.remove()
        });
        let text = clone.textContent;
        */

        let newElem = (<any>$(elem)).ignore("*:not(a, span, strong, b, i, s, u, tt, sup, sub)")[0];
        const clone = newElem.cloneNode(true);
        clone.querySelectorAll(strExclude).forEach(function (v) {
            v.remove();
        });
        let text = clone.textContent;

        let lines = splitByLines(text);
        for (let line of lines) {
            let sentences = textToSentences(line);
            for (let sentence of sentences) {
                sentence = sentence.trim();
                if (sentence.length == 0)
                    continue;
                if (sentence.split(" ").length < MIN_WORDS)
                    continue;

                let promise = analyseText(URL, sentence, elem, HIGHLIGHT_THRESHOLD_PROBABILITY);
                promises.push(promise);
            }
        }
    });

    return Promise.all(promises).then((results) => {
        let sumCharacters = 0;
        let weightedSum = 0;

        for (let i = 0; i < results.length; i++) {
            sumCharacters += results[i].length;
            weightedSum += results[i].weight;
        }

        let weightedAvg = sumCharacters > 0 ? weightedSum / sumCharacters : 0;
        weightedAvg = Math.round(weightedAvg); // round to nearest int
        console.log("Overall evaluation: " + weightedAvg + "%");
        return weightedAvg;
    })
        .catch((err) => {
            console.error(err);
        });
}

function analyseText(url, text, elem, threshold) {
    return new Promise((resolve, reject) => {
        callApi(url, text, 'text/plain')
            .then(data => {
                if (data.probability_AI_generated < threshold) {
                    console.log("Not AI (" + data.probability_AI_generated + "%): '" + text + "'");
                } else {
                    console.log("AI (" + data.probability_AI_generated + "%): '" + text + "'");

                    let newText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // ignore special chars
                    newText = newText.replace(/\s+/g, '\\s+'); // replace whitespace with \s+ pattern, this matches even with many spaces or line breaks between words
                    let pattern = RegExp("\\b" + newText + "\\b");
                    let before = elem.innerHTML;
                    
                    findAndReplaceDOMText(elem, {
                        find: pattern,
                        wrap: 'highlighted-text',
                        wrapAttributes: {
                            'probability': data.probability_AI_generated
                        },
                    });

                    if (elem.innerHTML == before) {
                        pattern = RegExp(newText);
                        findAndReplaceDOMText(elem, {
                            find: pattern,
                            wrap: 'highlighted-text',
                            wrapAttributes: {
                                'probability': data.probability_AI_generated
                            },
                        });
                    }
                }
                resolve({
                    "length": text.length,
                    "weight": text.length * data.probability_AI_generated
                });
            })
            .catch(error => reject(error));
    });
};

(<any>$.fn).ignore = function (sel) {
    return this.clone().find(sel || ">*").remove().end();
};

function splitByLines(text) {
    text = text.trim();
    text = text.replace(/ +/g, ' ').trim();
    let lines = text.split("\n \n") // <br />
    let ret = [];
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replaceAll("\n", "").trim();
        if (lines[i].length > 0)
            ret.push(lines[i]);
    }
    return ret;
}

function textToSentences(text) {
    let sentences = text.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");
    let indexToList = new Map();
    for (let i = 0; i < sentences.length; i++) {
        sentences[i] = sentences[i].trim();
        sentences[i] = sentences[i].replace(/ +/g, ' ').trim(); // replace many spaces with 1 space
        let splitBrBreaks = sentences[i].split("\n \n");
        if (splitBrBreaks.length > 1) {
            sentences[i] = splitBrBreaks[0];
            indexToList.set(i + 1, splitBrBreaks.slice(1));
        }
    }
    let x = 0;
    for (let idx of indexToList.keys()) {
        sentences.splice(idx + x, 0, ...indexToList.get(idx));
        x += indexToList.get(idx).length;
    }
    for (let i = 0; i < sentences.length; i++) {
        sentences[i] = sentences[i].trim();
        sentences[i] = sentences[i].replace(/ +/g, ' ').trim(); // replace many spaces with 1 space
        sentences[i] = sentences[i].replaceAll("\n", "");
    }

    return sentences;
}

/* Other */

const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

/* Exports */

export {
    callApi,
    analysePage,
    generateRandomColor,
};