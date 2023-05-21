import $ from 'jquery';
import findAndReplaceDOMText from './findAndReplaceDOMText'

/* API */

interface HTTPOptions {
    method: string,
    headers: { [key: string]: string },
    body?: string | FormData | Blob | ArrayBufferView | ArrayBuffer | ReadableStream<Uint8Array> | null
}

function convertToJSON(str) {
    return JSON.stringify(str, (key, value) => {
      if (typeof value === 'string') {
        return value.replace(/[\u007F-\uFFFF]/g, (match) =>
          '\\u' + ('0000' + match.charCodeAt(0).toString(16)).slice(-4)
        );
      }
      return value;
    });
}
  

function callApi(url, bodyObject, type = 'application/json', method = 'POST') {
    const methodsWithRequestBody = ['POST', 'PUT', 'PATCH'];
    const options: HTTPOptions = {
        method: method,
        headers: {
            'Content-Type': type
        }
    };

    if (methodsWithRequestBody.includes(method.toUpperCase())) {
        options.body = type == 'application/json' ? convertToJSON(bodyObject) : bodyObject;
    };

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                return {probability_AI_generated: -1};
                //throw Error(response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            throw error
        });
}

/* Analyzer */

function analysePage(model) {
    const URL = process.env.PLASMO_PUBLIC_API_URL;
    const HIGHLIGHT_THRESHOLD_PROBABILITY = 50;
    const MIN_WORDS = 8;
    const ANALYSE_BY_PARAGRAPH = true; // if false, it will analyse by sentence

    const exclude = ['base', 'head', 'meta', 'title', 'link', 'style',
        'script', 'noscript', 'audio', 'video', 'source',
        'track', 'canvas', 'svg', 'img', 'iframe',
        'embed', 'object', 'param', 'map', 'area',
        'menu', 'menuitem'
    ];
    const strExclude = exclude.join(", ")

    let promises = []; // array to save fetch promises

    // Iterate elements with relevant tag
    //console.log(document.documentElement.outerHTML);
    document.querySelectorAll("body, div, p, h1, h2, h3, h4, h5, h6").forEach((elem) => {

        let newElem = (<any>$(elem)).ignore("*:not(a, span, strong, b, i, s, u, tt, sup, sub)")[0];
        const clone = newElem.cloneNode(true);
        clone.querySelectorAll(strExclude).forEach(function (v) {
            v.remove();
        });
        let text = clone.textContent;

        if (ANALYSE_BY_PARAGRAPH && window.location.href != "https://mozilla.github.io/pdf.js/web/viewer.html")
        {
            text = text.trim();
            if (text.length == 0)
                return;
            if (text.split(/\s+/).length < MIN_WORDS) // split by spaces
                return;
            let promise = analyseText(URL, model, text, elem, HIGHLIGHT_THRESHOLD_PROBABILITY);
            promises.push(promise);
            return;
        }

        let lines = splitByLines(text);
        for (let line of lines) {
            let sentences = textToSentences(line);
            for (let sentence of sentences) {
                sentence = sentence.trim();
                if (sentence.length == 0)
                    continue;
                if (sentence.split(" ").length < MIN_WORDS)
                    continue;

                let promise = analyseText(URL, model, sentence, elem, HIGHLIGHT_THRESHOLD_PROBABILITY);
                promises.push(promise);
            }
        }
    });

    return Promise.all(promises)
        .then((results) => {
            let sumCharacters = 0;
            let weightedSum = 0;

            for (let i = 0; i < results.length; i++) {
                sumCharacters += results[i].length;
                weightedSum += results[i].length * results[i].probability;
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

const cache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function generateCacheKey(model, text) {
    const hash = hashCode(text)
    return `${model}-${hash}`;
}

function highlightElement(elem, text, probability) {
    let newText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // ignore special chars
    newText = newText.replace(/\s+/g, '\\s+'); // replace whitespace with \s+ pattern, this matches even with many spaces or line breaks between words
    let pattern = RegExp("\\b" + newText + "\\b");
    let before = elem.innerHTML;

    findAndReplaceDOMText(elem, {
        find: pattern,
        wrap: 'highlighted-text',
        wrapAttributes: {
            'probability': probability
        },
    });

    if (elem.innerHTML == before) {
        pattern = RegExp(newText);
        findAndReplaceDOMText(elem, {
            find: pattern,
            wrap: 'highlighted-text',
            wrapAttributes: {
                'probability': probability
            },
        });
    }
}

function analyseText(url, model, text, elem, threshold) {
    const cacheKey = generateCacheKey(model, text);

    if (cache.has(cacheKey)) {
        const result = cache.get(cacheKey);
        highlightElement(elem, text, result.probability);
        return Promise.resolve(result);
    }

    return new Promise((resolve, reject) => {
        callApi(url, { model, text })
            .then(data => {
                const probability = data.probability_AI_generated  
                if (probability < threshold) {
                    console.log("Not AI (" + probability + "%): '" + text + "'");
                } else {
                    console.log("AI (" + probability + "%): '" + text + "'");

                    highlightElement(elem, text, probability)
                }

                let result;
                if (probability >= 0) {
                    result = {
                      "length": text.length,
                      "probability": probability
                    };
                  } else {
                    result = {
                      "length": text.length,
                      "probability": 0
                    };
                  }
          
                  if (cache.size >= MAX_CACHE_SIZE) {
                    const firstKey = cache.keys().next().value;
                    cache.delete(firstKey);
                  }
          
                  cache.set(cacheKey, result);
                  resolve(result);
            })
            .catch(error => {
                reject(error);
                //console.log("Error fetching data, ", error)
            });
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
        //lines[i] = lines[i].replaceAll("\n", "").trim();
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

/* Clean page */

function cleanPage() {
    var highlightedTextElements = document.querySelectorAll("highlighted-text");
    for (var i = 0; i < highlightedTextElements.length; i++) {
      var element = highlightedTextElements[i];
      element.outerHTML = element.innerHTML;
    }
}


/* Other */

const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

/* Exports */

export {
    callApi,
    analysePage,
    cleanPage,
    generateRandomColor,
};