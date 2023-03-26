const DEBUG = true;
function logDebug(msg)
{
   if (DEBUG)
      console.log(msg);
}

function analysePage() {
   const relevantTags = ["div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6"];
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
      //txt = $(this).text().replace(/ +/g, ' ').trim(); // text in this element, replace many spaces with 1 space
      let sentences = textToSentences(txt);

      if (sentences == null || sentences == undefined) {
         // If failed to split into sentences, then treat the text as a whole
         txt = txt.replace(/(\r\n|\n|\r)/gm, "").trim(); // remove all line breaks
         myFetch($(this)[0], txt);
      }
      else {
         for (let i = 0; i < sentences.length; i++) {
            myFetch($(this)[0], sentences[i]);
         }
      }
   });

function textToSentences(txt) {
   // Considers all line breaks except for enter key line breaks

  // Replace enter breaks with a space
  txt = txt.replace(/\n/g, ' ');
  
  // Match sentences with sentence-ending punctuation or <br> tags
  let sentences = txt.match(/[^\.!\?]+[\.!\?]+(<br\s*\/?>)?\s*/g) || [];
  
  // If input text does not end with sentence-ending punctuation, add last sentence
  if (txt.match(/[^\.!\?]+\s*$/)) {
    let lastSentence = txt.match(/[^\.!\?]+\s*$/)[0];
    sentences.push(lastSentence);
  }
  
  // Trim whitespace from each sentence
  sentences = sentences.map(sentence => sentence.trim());
  
  return sentences;
}
   function myFetch(elem, text) {
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

               highlightText(text);

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
function highlightText(text)
{
   //text = text.replace(/(\s+)/,"(<[^>]+>|[\\r\\n\\s]+)*");
   text = text.split(' ').join('(<[^>]+>|[\\r\\n\\s]+)*')
   //alert(text);
   text = text.replace(/\?/g, "\\?");
   var pattern = new RegExp("("+text+")", "gi");

   document.body.innerHTML = document.body.innerHTML.replace(pattern, function(match){
   var re = /(^|[>])(?![^<]*?<\/y)(.*?)([<]|$)/gi; 
   match = match.replace(/(\r\n\t|\n|\r\t)/gm,"");

   match = match.replace(re, function (m,g1,g2,g3) {
     return g1+"<span style='background-color:red'>"+g2+"</span>"+g3;
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
            console.log("found txt");
           //document.getElementById("button").blur();
           document.execCommand("HiliteColor", false, "red");
           sel.collapseToEnd();
       }
       document.designMode = "off";
   } else if (document.body.createTextRange) {
      console.log("haha");
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

