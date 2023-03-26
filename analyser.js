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

      if ($(this).text().startsWith("Artificial")) {
         /*
         console.log("---");
         let x = $(this).text().replace(/(\r\n|\n|\r)/gm, "");
         console.log(x);
         console.log("---");
         console.log("*******");
         console.log("Artificial intelligence (AI) has revolutionized the way we interact with technology and has become an integral part of our daily lives. AI-powered virtual assistants like Siri and Alexa have made it easier for us to access information and manage our daily tasks. Machine learning algorithms are helping businesses improve their products and services by analyzing customer data and predicting future trends. AI is also being used in healthcare to develop more accurate diagnostic tools and personalized treatment plans. As AI continues to advance, it has the potential to create even more opportunities and solve complex problems in fields like climate change and energy conservation.");
         console.log("*******");
         */
      }

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
      txt = txt.replace(/(\r\n|\n|\r)/gm, "").trim(); // remove all line breaks
      let sentences = textToSentences(txt);

      if (sentences == null || sentences == undefined) {
         // If failed to split into sentences, then treat the text as a whole
         myFetch($(this)[0], txt);
      }
      else {
         for (let i = 0; i < sentences.length; i++) {
            myFetch($(this)[0], sentences[i]);
         }
      }
   });

   function textToSentences(txt) {
      let sentences = txt.match(/[^\.!\?]+[\.!\?]+[\s]*/g) || [];
      if (txt.match(/[^\.!\?]+$/)) {
         let newLen = sentences.push(txt.match(/[^\.!\?]+$/)[0]);
         sentences[newLen - 1] = sentences[newLen - 1].trim();
      }
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
            if (text.startsWith("Got rid"))
               console.log("Analyzing " + text);
            if (data.probability_AI_generated > HIGHLIGHT_THRESHOLD_PROBABILITY) {
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
               if (text.startsWith("Got rid"))
                  console.log("AI " + text);
               $.each($(elem).findText({ query: [text] }), function () {
                  $(this).css("background-color", "red")
               });
               sumCharacters += text.length;
               weightedSum += text.length * data.probability_AI_generated;
            }
         })
         .catch(error => console.error(error));

      promises.push(promise);
   }

   Promise.all(promises).then(() => {
      // all fetches done
      let weightedAvg = weightedSum / sumCharacters;
      weightedAvg = Math.round(weightedAvg); // round to nearest int
      console.log("Overall evaluation: " + weightedAvg + "%");
      //alert("Overall evaluation: " + weightedAvg + "%");
   });
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
   var space = '( )?(<span[^>]*>)?(</span[^>]*>)?( )?';
   var result = s.replace(/\s/gi, space);
   result = new RegExp(space + result + space, "gi");
   return (result);
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
   //console.log("plain: " + plainPiece);
   var start = '<span search="xxxxx">',
      stop = '</span>';
   return (start + plainPiece + stop);
}


