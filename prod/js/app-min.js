!function(){"use strict";var e=!1;if("undefined"!=typeof process&&!process.browser){e=!0;var t=require("request".trim())}var s=!1,o=!1;try{var n=new XMLHttpRequest;"undefined"!=typeof n.withCredentials?s=!0:"XDomainRequest"in window&&(s=!0,o=!0)}catch(i){}var r=Array.prototype.indexOf,a=function(e,t){var s=0,o=e.length;if(r&&e.indexOf===r)return e.indexOf(t);for(;s<o;s++)if(e[s]===t)return s;return-1},l=function(t){return this&&this instanceof l?("string"==typeof t&&(t={key:t}),this.callback=t.callback,this.wanted=t.wanted||[],this.key=t.key,this.simpleSheet=!!t.simpleSheet,this.parseNumbers=!!t.parseNumbers,this.wait=!!t.wait,this.reverse=!!t.reverse,this.postProcess=t.postProcess,this.debug=!!t.debug,this.query=t.query||"",this.orderby=t.orderby,this.endpoint=t.endpoint||"https://spreadsheets.google.com",this.singleton=!!t.singleton,this.simple_url=!!t.simple_url,this.callbackContext=t.callbackContext,this.prettyColumnNames="undefined"==typeof t.prettyColumnNames?!t.proxy:t.prettyColumnNames,"undefined"!=typeof t.proxy&&(this.endpoint=t.proxy.replace(/\/$/,""),this.simple_url=!0,this.singleton=!0,s=!1),this.parameterize=t.parameterize||!1,this.singleton&&("undefined"!=typeof l.singleton&&this.log("WARNING! Tabletop singleton already defined"),l.singleton=this),/key=/.test(this.key)&&(this.log("You passed an old Google Docs url as the key! Attempting to parse."),this.key=this.key.match("key=(.*?)(&|#|$)")[1]),/pubhtml/.test(this.key)&&(this.log("You passed a new Google Spreadsheets url as the key! Attempting to parse."),this.key=this.key.match("d\\/(.*?)\\/pubhtml")[1]),this.key?(this.log("Initializing with key "+this.key),this.models={},this.model_names=[],this.base_json_path="/feeds/worksheets/"+this.key+"/public/basic?alt=",e||s?this.base_json_path+="json":this.base_json_path+="json-in-script",void(this.wait||this.fetch())):void this.log("You need to pass Tabletop a key!")):new l(t)};l.callbacks={},l.init=function(e){return new l(e)},l.sheets=function(){this.log("Times have changed! You'll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)")},l.prototype={fetch:function(e){"undefined"!=typeof e&&(this.callback=e),this.requestData(this.base_json_path,this.loadSheets)},requestData:function(t,n){if(e)this.serverSideFetch(t,n);else{var i=this.endpoint.split("//").shift()||"http";!s||o&&i!==location.protocol?this.injectScript(t,n):this.xhrFetch(t,n)}},xhrFetch:function(e,t){var s=o?new XDomainRequest:new XMLHttpRequest;s.open("GET",this.endpoint+e);var n=this;s.onload=function(){var e;try{e=JSON.parse(s.responseText)}catch(o){console.error(o)}t.call(n,e)},s.send()},injectScript:function(e,t){var s,o=document.createElement("script");if(this.singleton)t===this.loadSheets?s="Tabletop.singleton.loadSheets":t===this.loadSheet&&(s="Tabletop.singleton.loadSheet");else{var n=this;s="tt"+ +new Date+Math.floor(1e5*Math.random()),l.callbacks[s]=function(){var e=Array.prototype.slice.call(arguments,0);t.apply(n,e),o.parentNode.removeChild(o),delete l.callbacks[s]},s="Tabletop.callbacks."+s}var i=e+"&callback="+s;this.simple_url?e.indexOf("/list/")!==-1?o.src=this.endpoint+"/"+this.key+"-"+e.split("/")[4]:o.src=this.endpoint+"/"+this.key:o.src=this.endpoint+i,this.parameterize&&(o.src=this.parameterize+encodeURIComponent(o.src)),document.getElementsByTagName("script")[0].parentNode.appendChild(o)},serverSideFetch:function(e,s){var o=this;t({url:this.endpoint+e,json:!0},function(e,t,n){return e?console.error(e):void s.call(o,n)})},isWanted:function(e){return 0===this.wanted.length||a(this.wanted,e)!==-1},data:function(){if(0!==this.model_names.length)return this.simpleSheet?(this.model_names.length>1&&this.debug&&this.log("WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong."),this.models[this.model_names[0]].all()):this.models},addWanted:function(e){a(this.wanted,e)===-1&&this.wanted.push(e)},loadSheets:function(t){var o,n,i=[];for(this.googleSheetName=t.feed.title.$t,this.foundSheetNames=[],o=0,n=t.feed.entry.length;o<n;o++)if(this.foundSheetNames.push(t.feed.entry[o].title.$t),this.isWanted(t.feed.entry[o].content.$t)){var r=t.feed.entry[o].link.length-1,a=t.feed.entry[o].link[r].href.split("/").pop(),l="/feeds/list/"+this.key+"/"+a+"/public/values?alt=";l+=e||s?"json":"json-in-script",this.query&&(l+="&sq="+this.query),this.orderby&&(l+="&orderby=column:"+this.orderby.toLowerCase()),this.reverse&&(l+="&reverse=true"),i.push(l)}for(this.sheetsToLoad=i.length,o=0,n=i.length;o<n;o++)this.requestData(i[o],this.loadSheet)},sheets:function(e){return"undefined"==typeof e?this.models:"undefined"==typeof this.models[e]?void 0:this.models[e]},sheetReady:function(e){this.models[e.name]=e,a(this.model_names,e.name)===-1&&this.model_names.push(e.name),this.sheetsToLoad--,0===this.sheetsToLoad&&this.doCallback()},loadSheet:function(e){var t=this;new l.Model({data:e,parseNumbers:this.parseNumbers,postProcess:this.postProcess,tabletop:this,prettyColumnNames:this.prettyColumnNames,onReady:function(){t.sheetReady(this)}})},doCallback:function(){0===this.sheetsToLoad&&this.callback.apply(this.callbackContext||this,[this.data(),this])},log:function(e){this.debug&&"undefined"!=typeof console&&"undefined"!=typeof console.log&&Function.prototype.apply.apply(console.log,[console,arguments])}},l.Model=function(e){var t,s,o,n;if(this.column_names=[],this.name=e.data.feed.title.$t,this.tabletop=e.tabletop,this.elements=[],this.onReady=e.onReady,this.raw=e.data,"undefined"==typeof e.data.feed.entry)return e.tabletop.log("Missing data for "+this.name+", make sure you didn't forget column headers"),this.original_columns=[],this.elements=[],void this.onReady.call(this);for(var i in e.data.feed.entry[0])/^gsx/.test(i)&&this.column_names.push(i.replace("gsx$",""));for(this.original_columns=this.column_names,t=0,o=e.data.feed.entry.length;t<o;t++){var r=e.data.feed.entry[t],a={};for(s=0,n=this.column_names.length;s<n;s++){var l=r["gsx$"+this.column_names[s]];"undefined"!=typeof l?e.parseNumbers&&""!==l.$t&&!isNaN(l.$t)?a[this.column_names[s]]=+l.$t:a[this.column_names[s]]=l.$t:a[this.column_names[s]]=""}void 0===a.rowNumber&&(a.rowNumber=t+1),e.postProcess&&e.postProcess(a),this.elements.push(a)}e.prettyColumnNames?this.fetchPrettyColumns():this.onReady.call(this)},l.Model.prototype={all:function(){return this.elements},fetchPrettyColumns:function(){if(!this.raw.feed.link[3])return this.ready();var e=this.raw.feed.link[3].href.replace("/feeds/list/","/feeds/cells/").replace("https://spreadsheets.google.com",""),t=this;this.tabletop.requestData(e,function(e){t.loadPrettyColumns(e)})},ready:function(){this.onReady.call(this)},loadPrettyColumns:function(e){for(var t={},s=this.column_names,o=0,n=s.length;o<n;o++)"undefined"!=typeof e.feed.entry[o].content.$t?t[s[o]]=e.feed.entry[o].content.$t:t[s[o]]=s[o];this.pretty_columns=t,this.prettifyElements(),this.ready()},prettifyElements:function(){var e,t,s,o,n=[],i=[];for(t=0,o=this.column_names.length;t<o;t++)i.push(this.pretty_columns[this.column_names[t]]);for(e=0,s=this.elements.length;e<s;e++){var r={};for(t=0,o=this.column_names.length;t<o;t++){var a=this.pretty_columns[this.column_names[t]];r[a]=this.elements[e][this.column_names[t]]}n.push(r)}this.elements=n,this.column_names=i},toArray:function(){var e,t,s,o,n=[];for(e=0,s=this.elements.length;e<s;e++){var i=[];for(t=0,o=this.column_names.length;t<o;t++)i.push(this.elements[e][this.column_names[t]]);n.push(i)}return n}},"undefined"!=typeof module&&module.exports?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):window.Tabletop=l}(),function(){"use strict";angular.module("times.tabletop",[]).provider("Tabletop",function(){var e,t={callback:function(t,s){e.resolve([t,s])}};this.setTabletopOptions=function(e){t=angular.extend(t,e)},this.$get=["$q","$window",function(s,o){return e=s.defer(),o.Tabletop.init(t),e.promise}]})}(),function(){"use strict";angular.module("Site",["times.tabletop"]).config(["TabletopProvider",function(e){e.setTabletopOptions({key:"1uvHeB66RrTJ87hmna5SnSvBeiuCQ3PE84OLcTL6iwdI",simple_url:!0})}]).factory("DialoguePortfolioParser",[function(){var e={parse:function(e){var t={};return t.dialogue=[],_.each(e[0].Dialogue.elements,function(e){t.dialogue.push({possibleInput:e.possibleInput.split(","),response:e.response})}),t.portfolio=e[0].Portfolio.elements,t}};return e}]).factory("DialogueCache",[function(){return{dialogue:[{response:"Hello &#128522;",possibleInputs:["hello","greetings","hi","hey","wassup","whats up","ayy","hola","ni hao","hoy","eyy"]},{response:"I was born in Chattanooga, TN and raised in Huntsville, AL.",possibleInputs:["where are you from","you from","born"]},{response:"Yup",possibleInputs:["okay","oh"]},{response:"Why, thank-you &#128522;",possibleInputs:["you're","youre","you are"]},{response:"My favorite movie is <i>The Imitation Game</i>.",possibleInputs:["movie"]},{response:"My favorite novel is <i>The Brothers Karamazov</i> by Fyodor Dostoevsky.",possibleInputs:["book"]},{response:"Nikola Tesla",possibleInputs:["person in history","historical person","favorite person"]},{response:"Bay Area",possibleInputs:["place"]},{response:"Tonkatsu",possibleInputs:["food"]},{response:"Dog",possibleInputs:["animal"]},{response:"Teal",possibleInputs:["color","colour"]},{response:"I&#39;d like to someday work full-time at either a start-up or a large company as a software engineer.",possibleInputs:["want to do","plan","future","would you like to do","what do you want"]},{response:"I like jazz, hip-hop, and classical music.",possibleInputs:["music","listen","genre","what do you like","what kind of stuff do you like"]},{response:"I play the piano and violin.",possibleInputs:["instruments","play"]},{response:"I&#39;m currently majoring in computer science and music at Amherst College.",possibleInputs:["study","major","subject","degree","bachelor","college","school"]},{response:"20",possibleInputs:[" age","old"]},{response:"Grant Park",possibleInputs:["name"]},{response:"I currently live in Amherst, MA.",possibleInputs:["where","live"]},{response:"Sorry to hear that. &#128533;",possibleInputs:["not","bad","terrible"]},{response:"Sweet. &#128522;",possibleInputs:["good","fine","well","awesome","fantastic","amazing","same","me too","as well"]},{response:"I&#39;m doing pretty well, thanks! How about you?",possibleInputs:["how are you","how are you doing","how are you feeling"]},{response:"I think everyday is a nice day...",possibleInputs:["weather","cold","climate","temp","hot","warm","chill"]},{response:"&#128522;",possibleInputs:["lol","rofl","wow","woah","dang","huh","eh","hm","jeez","geez","cool"]},{response:'Tap this phone&#39;s home button or enter <span style="color:lemonchiffon">&#39;switch&#39;</span> to transition to my projects.',possibleInputs:["project","example","done"]},{response:'You can email me at <a href="mailto:gpark18@amherst.edu">gpark18@amherst.edu</a>. &#128522;',possibleInputs:["contact","email","reach"]},{response:"I&#39;m a sophomore at Amherst College and I freelance iOS. I&#39;m also a full-stack dev working with MEAN, Python, and Swift/Obj-C.",possibleInputs:["about","you do","job","occupation","now","language","work","who are you","who"]},{response:'I&#39;m an <a href="https://soundcloud.com/grant-park">indie artist</a>, rowing athlete, and <a href="https://www.behance.net/grantpark">designer</a>. Check out my <a href="https://medium.com/@grantxs">blog</a> &#128513;',possibleInputs:["do you like to do","hob","design","extracurricular","outside","fun"]},{response:'Here is my <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["linkedin"]},{response:'Here is my <a href="https://github.com/sungjp">Github</a>.',possibleInputs:["git"]},{response:'Here is my <a href="parkgrantresume.pdf" target="_blank">resume</a>.',possibleInputs:["resume"]},{response:'Here is my <a href="parkgrantresume.pdf">resume</a>, <a href="https://github.com/sungjp">Github</a>, and <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["links"]},{response:"Hello &#128522;",possibleInputs:["yo","oi"]},{response:'Try including: <span style="color:lemonchiffon"> <br/> &#39;links&#39; <br/> &#39;projects&#39; <br/> &#39;hobbies&#39; <br/> &#39;contact&#39; <br/> &#39;about&#39; </span> ',possibleInputs:["?","help"]}],portfolio:[{}]}}]).factory("GrantsAge",[function(){var e,t=new Date,s=t.getMonth()+1,o=t.getFullYear(),n=t.getDay(),i=o-1995;return 12>s?i-=1:2>n&&(i-=1),e=i,i.toString()}]).factory("Weather",["$http","$q",function(e,t){var s,o=t.defer(),n=e.get("http://api.wunderground.com/api/c1ea49b3e06dc3b3/geolookup/conditions/q/MA/Amherst.json").then(function(e){var t=e.data,o=t.location.city,n=t.current_observation.temp_f,i="The current temperature in "+o+" is: "+n+"&deg;F &#128513;";50>n&&(i="Brrr! The current temperature in "+o+" is: "+n+"&deg:F &#128559;"),s=i},function(e){console.error(e),s="I don't have a clue actually..."}),i=function(){o.resolve(s)};return s?i():n.then(function(){i()}),o.promise}]).controller("Dialogue",["$timeout","$q","$scope","Tabletop","DialoguePortfolioParser","DialogueCache","Weather","GrantsAge",function(e,t,s,o,n,i,r,a){var l=i,h=i.dialogue,u=i.portfolio,p=function(e){for(var s=t.defer(),o=0;o<h.length;o++)for(var n=0;n<h[o].possibleInput.length;n++)if(e.toLowerCase().indexOf(h[o].possibleInput[n].toLowerCase())!==-1)return s.resolve({response:h[o].response,i:o,j:n}),s.promise;return s.reject("Sorry, I can't respond to that."),s.promise};s.messageQueue=[],s.send=function(e){p(e).then(function(e){switch(e.response){case"E.AGE":s.messageQueue.push(a);break;case"E.WEATHER":r.then(function(e){s.messageQueue.push(e),console.log(s.messageQueue)});break;default:s.messageQueue.push(e.response)}},function(e){s.messageQueue.push(e),console.log(s.messageQueue)})},e(function(){s.send("hows the weather?")},1e4),o.then(function(e){var s=t.defer();return e?s.resolve(e):s.reject("Could not retrieve data"),s.promise}).then(function(e){l=n.parse(e),h=l.dialogue,u=l.portfolio},function(e){console.error(e)})}]).filter("html",["$sce",function(e){return function(t){return e.trustAsHtml(t)}}])}();