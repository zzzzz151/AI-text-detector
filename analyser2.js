function callApi(url, bodyObject, type='application/json') {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': type
        },
        body: type == 'application/json'? JSON.stringify(bodyObject) : bodyObject
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
    });
 }
 
 /* Analyzer */
 
const analysePage = () => {
    const relevantTags = ["div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "b"];
    const search = relevantTags.join(", "); // "div, p, span, h1, h2, h3, h4, h5, h6"
 
    const URL = "http://localhost:8000/api/v1";
    const HIGHLIGHT_THRESHOLD_PROBABILITY = 50;
    let promises = []; // array to save fetch promises
 
    // Iterate elements with relevant tag
   document.querySelectorAll(search).forEach((el) => {
        //console.log("tag: " + $(this)[0].tagName + " text: " + $(this).text());
 
        // Skip elements without text
        let hasText = el.textContent.length != 0;
        if (!hasText)
            return;
 
        // If any of this element's ancestors are a relevant tag, skip this element 
        // since that ancestor element contains this element's text
        let elem = el;
        while (elem.parentElement != null) {
            elem = elem.parentElement;
            let thisTag = elem.tagName;
            if (thisTag == null || thisTag == undefined)
                continue;
            thisTag = thisTag.toLowerCase();
            if (relevantTags.includes(thisTag))
                return;
        }
 
        let txt = el.textContent.replace(/ +/g, ' ').trim(); // text in this element, replace many spaces with 1 space
        //txt = txt.replace(/(\r\n|\n|\r)/gm, "").trim(); // remove all line breaks
        let sentences = textToSentences(txt);
 
        if (sentences == null || sentences == undefined) {
            // If failed to split into sentences, then treat the text as a whole
            txt = txt.replace(/(\r\n|\n|\r)/gm, "").trim(); // remove all line breaks
            const promise = analyseText(URL, txt, el, HIGHLIGHT_THRESHOLD_PROBABILITY);
            promises.push(promise)
        }
        else {
            for (let i = 0; i < sentences.length; i++) {
                let promise = analyseText(URL, sentences[i], el, HIGHLIGHT_THRESHOLD_PROBABILITY);
                promises.push(promise)
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

        let weightedAvg = weightedSum / sumCharacters;
        weightedAvg = Math.round(weightedAvg); // round to nearest int
        return weightedAvg; // return the weightedAvg value
    })
    .then((weightedAvg) => {
        console.log("Overall evaluation: " + weightedAvg + "%");
    })
    .catch((err) => {
        console.error(err);
    });
}
 
const analyseText = (url, text, elem, threshold) => {
    return new Promise((resolve, reject) => {
        callApi(url, text, 'text/plain')
        .then(data => {
            if (data.probability_AI_generated < threshold) {
                // console.log("Not AI: '" + text + "'");
            } else {
                // console.log("AI: '" + text + "'");
 
                let newText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // ignore special chars
                newText = newText.replace(/\s+/g, '\\s+');  // replace whitespace with \s+ pattern, this matches even with many spaces or line breaks between words
                let pattern = RegExp("\\b" + newText + "\\b");
                let before = elem.innerHTML;
 
                findAndReplaceDOMText(elem, {
                    find: pattern,
                    wrap: 'span',
                    wrapClass: 'myMark',
                });
 
                if (elem.innerHTML == before) {
                    pattern = RegExp(newText);
                    findAndReplaceDOMText(elem, {
                        find: pattern,
                        wrap: 'span',
                        wrapClass: 'myMark',
                    });
                }
            }
            resolve({"length": text.length, "weight": text.length * data.probability_AI_generated});
         })
         .catch(error => reject(error));
    });
};

 
const textToSentences = text => {
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