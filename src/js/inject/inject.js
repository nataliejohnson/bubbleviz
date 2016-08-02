/**
 * inject.js
 */


function storeResults(url, personal, anonymous, search_terms){
  var object_to_store = {
    url: url,
    anonymous: anonymous,
    personal:personal,
    terms: search_terms,
    timestamp: (new Date()).getTime(),
  };

  chrome.storage.local.get("searches", function(store){

    if(store.searches){
      store.searches.push(object_to_store);
      chrome.storage.local.set({searches: store.searches}, function(){
        console.log("storage set OK");
      })
    }else{
      chrome.storage.local.set({searches: [object_to_store]}, function(){
        console.log("storage set OK, first time.");
      });
    }
  });

}

function convert_url_to_server_url(url){
  // What we want : https://google.com/search?q=blah+blah+blah
  // two types of document URL:
  //  - http://google.com/webhp#q=abc+def
  //  - http://google.com/webhp?q=abc+def

  var PREFIX = "https://www.google.com/search"

  var server_search_url = url;


  var parser = document.createElement('a');
  parser.href =  server_search_url;

  var index = parser.href.indexOf(parser.search);
  var query = parser.search;
  var hash = parser.href.slice(index + parser.search.length, parser.href.length);

  if(hash){
    server_search_url = PREFIX + "?" + hash.slice(1,hash.length);
  }else if(query && !hash){
    server_search_url = PREFIX + query;
  }

  return server_search_url;
}


/**
 * Scrape a page for google search results on the current page
 */
function scrapeForResults(){
    var results = parseDocumentForResults(document);
    var search_terms = scrapeSearchTerms(document);

    if(results.length > 0){
      // console.log("Personal results: ", JSON.stringify(results));

      var request = {url: convert_url_to_server_url(document.URL)};

      var onResponse = function(response) {
        // console.log("Anonymous results: ", JSON.stringify(response));
        if(!response.error){
          storeResults(document.URL, results, response, search_terms);
        }else{
          console.log("ERROR: Querying server failed", response.error);
        }
      };


      chrome.runtime.sendMessage(request, onResponse );
    }
}

function main(){
  console.log("Bubbleviz starting");

  // Add visual to page to show we're active
  var bubbleviz = document.createElement("div");
  bubbleviz.className = "bubbleviz";
  document.getElementsByTagName('body')[0].appendChild(bubbleviz);

  var URL = null;

  window.setInterval(function(){
    if(URL !== document.URL){
      console.log("OLD: ["+URL+"], NEW:["+document.URL+"]")
      URL = document.URL;
      scrapeForResults();
    }
  }, 100)

  console.log("Bubbleviz initialised");
}

main();
