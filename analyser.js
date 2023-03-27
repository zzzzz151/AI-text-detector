//import "./findAndReplaceDOMText.js"

const DEBUG = true;
function logDebug(msg) {
   if (DEBUG)
      console.log(msg);
}

function analysePage() {
   const relevantTags = ["div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "b"];
   const jquerySearch = relevantTags.join(", "); // "div, p, span, h1, h2, h3, h4, h5, h6"

   const URL = "http://localhost:8000/api/v1";
   const HIGHLIGHT_THRESHOLD_PROBABILITY = 50;
   let sumCharacters = 0, weightedSum = 0;
   let promises = []; // array to save fetch promises

   // Iterate elements with relevant tag
   $(jquerySearch).each(function () {
      //console.log("tag: " + $(this)[0].tagName + " text: " + $(this).text());

      // Skip elements without text
      var hasText = $(this).text().length != 0;
      if (!hasText)
         return;

      // If any of this element's ancestors are a relevant tag, skip this element 
      // since that ancestor element contains this element's text
      let elem = $(this);
      while (elem.parent().length != 0) {
         elem = elem.parent();
         let thisTag = elem.prop("tagName");
         if (thisTag == null || thisTag == undefined)
            continue;
         thisTag = elem.prop("tagName").toLowerCase();
         if (relevantTags.includes(thisTag))
            return;
      }

      let txt = $(this).text().replace(/ +/g, ' ').trim(); // text in this element, replace many spaces with 1 space
      //txt = txt.replace(/(\r\n|\n|\r)/gm, "").trim(); // remove all line breaks
      let sentences = textToSentences(txt);

      if (sentences == null || sentences == undefined) {
         // If failed to split into sentences, then treat the text as a whole
         txt = txt.replace(/(\r\n|\n|\r)/gm, "").trim(); // remove all line breaks
         myFetch(txt, $(this)[0]);
      }
      else {
         for (let i = 0; i < sentences.length; i++) {
            myFetch(sentences[i], $(this)[0]);
         }
      }
   });

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
      for (i of indexToList.keys()) {
         sentences.splice(i + x, 0, ...indexToList.get(i));
         x += indexToList.get(i).length;
      }
      for (let i = 0; i < sentences.length; i++) {
         sentences[i] = sentences[i].trim();
         sentences[i] = sentences[i].replace(/ +/g, ' ').trim(); // replace many spaces with 1 space
         sentences[i] = sentences[i].replaceAll("\n", "");
      }

      return sentences;
   }


   function myFetch(text, elem) {
      let promise = fetch(URL, {
         method: "POST",
         headers: {
            "Content-Type": "text/plain"
         },
         body: text
      })
         .then(response => response.json())
         .then(data => {
            if (data.probability_AI_generated < HIGHLIGHT_THRESHOLD_PROBABILITY)
               logDebug("Not AI: '" + text + "'");
            else {
               logDebug("AI: '" + text + "'");

               /*
               elem.innerHTML = elem.innerHTML.replace(/ +/g, ' ').trim(); // replace many spaces with 1 space
               elem.innerHTML = elem.innerHTML.replace(/(\r\n|\n|\r)/gm, "").trim(); // remove line beraks
               let before = elem.innerHTML;
               elem.innerHTML = elem.innerHTML.replace(text, "<span style=\"background-color:red\">" + text + "</span>");
               if (elem.innerHTML == before) {
                  // At this point, we are probably trying to replace text that is in more than 1 element
                  console.log("Error replacing text '" + text + "'");
                  let repl = "<span style=\"background-color:red\">" + text + "</span>";
                  elem.innerHTML = repl;
               }
               */

               /*
               $.each($(elem).findText({ query: [text] }), function () {
                  $(this).css("background-color", "red")
               });
               */

               //highlightText(text, elem);

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

               sumCharacters += text.length;
               weightedSum += text.length * data.probability_AI_generated;
            }
         })
         .catch(error => console.error(error));

      promises.push(promise);
   }

   return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
         // all fetches done
         let weightedAvg = weightedSum / sumCharacters;
         weightedAvg = Math.round(weightedAvg); // round to nearest int
         console.log("Overall evaluation: " + weightedAvg + "%");
         //alert("Overall evaluation: " + weightedAvg + "%");
         resolve(weightedAvg); // resolve the new Promise with the value of weightedAvg
      }).catch((err) => {
         reject(err); // if any of the Promises in the Promise.all() chain reject, reject the new Promise with the same error
      });
   });
}

// https://stackoverflow.com/questions/49565116/javascript-need-help-in-highlight-across-tags-text-in-html
function highlightText(text, elem = document.body) {
   //text = text.replace(/(\s+)/,"(<[^>]+>|[\\r\\n\\s]+)*");
   text = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // add an '\' before every regex symbol
   text = text.split(' ').join('(<[^>]+>|[\\r\\n\\s]+)*');
   //alert(text);
   var pattern = new RegExp("(" + text + ")", "gi");

   elem.innerHTML = elem.innerHTML.replace(pattern, function (match) {
      var re = /(^|[>])(?![^<]*?<\/y)(.*?)([<]|$)/gi;
      match = match.replace(/(\r\n\t|\n|\r\t)/gm, "");

      match = match.replace(re, function (m, g1, g2, g3) {
         return g1 + "<span style='background-color:red'>" + g2 + "</span>" + g3;
      });
      //alert(match);
      return match;
   });
}


// https://stackoverflow.com/questions/19710158/jquery-highlight-pieces-of-text-in-an-element-across-tags
function highlightText2(text) {
   if (window.find && window.getSelection) {
      document.designMode = "on";
      var sel = window.getSelection();
      sel.collapse(document.body, 0);
      while (window.find(text)) {
         //document.getElementById("button").blur();
         document.execCommand("HiliteColor", false, "red");
         sel.collapseToEnd();
      }
      document.designMode = "off";
   } else if (document.body.createTextRange) {
      var textRange = document.body.createTextRange();
      while (textRange.findText(text)) {
         textRange.execCommand("BackColor", false, "red");
         textRange.collapse(false);
      }
   }
}


$.fn.findText = function (params) {
   var phrases = params.query,
      ignorance = params.ignorecase;
   wrapper = $(this);
   var source = wrapper.html();
   selection_class_name = params.style;
   source = source.replace(/[\n|\t]+/gi, '');
   source = source.replace(/\s+/gi, ' ');
   source = source.replace(/> /gi, '>');
   source = source.replace(/(\w)</gi, function (m, w) { return (w + " <"); });

   phrases.forEach(function (str) {

      var regexp = makeRegexp(str);
      source = source.replace(regexp, function (m) {
         return (emulateSelection(m));
      });

   });

   wrapper.html(source);
   var res_array = wrapper.find("[search=xxxxx]")
   return (res_array);
};



function makeRegexp(s) {
   var space = '(\\s|<[^>]*>)*';
   var result = s.replace(/\s+/gi, space);
   result = new RegExp(space + result + space, 'gi');
   return result;
}

function emulateSelection(htmlPiece) {
   htmlPiece = htmlPiece.replace(/(?!=>)[^><]+(?=<)/g, function (w) {
      return (wrapWords(w));
   }
   );
   htmlPiece = htmlPiece.replace(/^[^><]+/, function (w) {
      return (wrapWords(w));
   }
   );
   htmlPiece = htmlPiece.replace(/[^><]+$/, function (w) {
      return (wrapWords(w));
   }
   );
   htmlPiece = htmlPiece.replace(/^[^><]+$/, function (w) {
      return (wrapWords(w));
   }
   );

   return (htmlPiece);
}

function wrapWords(plainPiece) {
   var start = '<span search="xxxxx">',
      stop = '</span>';

   var regex = /<[^>]*>|[^<]+/gi;
   var matches = plainPiece.match(regex);
   var result = '';
   for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      if (match.charAt(0) === '<') {
         result += match;
      } else {
         result += start + match + stop;
      }
   }

   return result;
}

