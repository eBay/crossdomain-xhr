(function($win){
    "use strict";
    if(typeof $win.cXHR === "undefined"){
        $win.cXHR = {};
    }
}).call(this, window);

;(function($cXHR) {
    "use strict";

    var __isFeaturesDetected = false;
    var __isXhrEnabled = false;
    var __isCorsEnabled = false;
    var __isPostMessageEnabled = false;

    function detectFeatures() {
        if (!__isFeaturesDetected) {
            __isXhrEnabled = isXhrEnabled();
            __isCorsEnabled = isCorsEnabled(__isXhrEnabled);
            __isPostMessageEnabled = isPostMessageEnabled();
        }

        return {
            isXhrEnabled: __isXhrEnabled,
            isCorsEnabled: __isCorsEnabled,
            isPostMessageEnabled: __isPostMessageEnabled
        };
    }

    function isXhrEnabled() {
        return 'XMLHttpRequest' in window;
    }

    function isCorsEnabled(isXhrEnabled) {
        if (isXhrEnabled) {
            return "withCredentials" in new XMLHttpRequest();
        }
    }

    function isPostMessageEnabled() {
        return typeof window.postMessage === 'function';
    }

    $cXHR.features =  {
        get: function() {
            return detectFeatures();
        }
    };
}).call(this, window.cXHR);
;(function($cXHR) {
    "use strict";
    var _cXHRConfigKeys = {
        useCORSPolyfill: 'useCORSPolyfill',
        useCORS: 'useCORS',
        useSIFR: 'useSIFR',
        allowedOrigins: 'allowedOrigins',
        sifrGateway: 'sifrGateway'
    };
    $cXHR.XHRConfigKeys = _cXHRConfigKeys;
    var _cXHRConfigs = {};
    var _defaultSifrGateway = "sifr.html";

    function setConfig(configParams) {
        for (var key in _cXHRConfigKeys) {
            if (configParams.hasOwnProperty(key)) {
                _cXHRConfigs[key] = configParams[key];
            }
        }
    }

    function getConfig(key) {
        if (_cXHRConfigs.hasOwnProperty(key)) {
            return _cXHRConfigs[key];
        } else {
            return null;
        }
    }

    cXHR.config = {
        set: function(configParams) {
            setConfig(configParams);
        },
        get: function() {
            return _cXHRConfigs;
        },
        getByKey: function(key) {
            return getConfig(key);
        },
        getAllowedOrigins: function(){
            var allowedOrigins = null;

            if(typeof this.getByKey(_cXHRConfigKeys.allowedOrigins) !== "undefined" && this.getByKey(_cXHRConfigKeys.allowedOrigins) != null ){
                allowedOrigins = this.getByKey(_cXHRConfigKeys.allowedOrigins).split(",");
            }

            if(allowedOrigins === null || allowedOrigins.length ===0){
                return {"*" : "All"};
            }else{
                var max = allowedOrigins.length;
                var kvp = {};
                for(var i=0; i<max;i ++){
                    kvp[allowedOrigins[i]] = allowedOrigins[i];
                }
                return kvp;
            }
        },
        getSifrGateway: function(){
            var sifrGateway = this.getByKey(_cXHRConfigKeys.sifrGateway);
            if(sifrGateway === null){
                return _defaultSifrGateway;
            }else{
                return sifrGateway;
            }
        },
        getCorsType: function(){
            var isCors = this.getByKey(_cXHRConfigKeys.useCORS);
            var isSifr = this.getByKey(_cXHRConfigKeys.useSIFR);
            if(isCors){
                return "cors";
            }
            if(isSifr){
                return "sifr";
            }
            return "cors-polyfill";
        }

    };
}).call(this, window.cXHR);;(function($cXHR) {
    "use strict";
    var __defaultTimeoutInMs = 200;

    function bindEvent(ctx, eventName, eventHandler) {

        if (ctx.attachEvent) {
            ctx.attachEvent(eventName, function() {
                eventHandler();
            });
        } else {
            ctx["onload"] = function() {
                eventHandler();
            };
        }
    }

    function clear(timeoutId) {
        window.clearTimeout(timeoutId);
    }

    function loadContent(contentConfig, onLoadHandler) {
        var loadTimeoutId = null;

        if (typeof contentConfig.client !== "undefined" && typeof contentConfig.context !== "undefined") {
            contentConfig.context.appendChild(contentConfig.client);

            loadTimeoutId = window.setTimeout(function() {
                $cXHR.contentLoader.abort();
            }, contentConfig.timeout);

            bindEvent(contentConfig.client, "onload", function() {
                if (loadTimeoutId != null) {
                    clear(loadTimeoutId);
                }
                if (typeof onLoadHandler === "function") {
                    onLoadHandler();
                }
            });
        }
    }

    cXHR.contentLoader = {
        load: function($client, timeout, $context, onLoadHandler) {
            var contentConfig = {
                client: $client,
                timeout: (timeout || __defaultTimeoutInMs),
                context: $context
            };
            loadContent(contentConfig, onLoadHandler);
        },
        abort: function() {
            if (window.stop) {
                window.stop();
            } else {
                document.execCommand('Stop');
            }
        }
    };
}).call(this, window.cXHR);;(function($win, cXHR) {
    "use strict";

    var _urlSchemes = {
        "HTTP": "HTTP",
        "HTTPS": "HTTPS"
    };

    function getUrlParts(urlString) {
        if (typeof urlString !== "undefined" && urlString !== null && urlString.indexOf("/") >= 0) {
            return urlString.split("/");
        } else {
            return null;
        }
    }

    function getUrlDomain(urlString) {
        var urlParts = getUrlParts(urlString);
        if (urlParts !== null && urlParts.length >= 3) {
            return urlParts[2];
        } else {
            return null;
        }
    }

    function getUrlProtocol(urlString) {
        var urlParts = getUrlParts(urlString);

        if (urlParts !== null && urlParts.length > 0) {
            return urlParts[0];
        } else {
            return null;
        }
    }

    function getUrlProtocolAndDomain(urlString) {
        var urlParts = getUrlParts(urlString);
        var min = 0,
            max = 0;
        var urlSchemeList = [];

        if (urlParts !== null && urlParts.length > 0) {
            max = urlParts.length;
            for (var i = min; i < max; i++) {
                if (urlParts[i] === "") {
                    continue;
                }
                urlSchemeList.push(urlParts[i].toLowerCase().replace(/ /gi, ""));

                if (urlSchemeList.length === 2) {
                    return urlSchemeList.join("//");
                }
            }
            return null;
        } else {
            return null;
        }

    }

    cXHR.http = {
        currentUrl: function() {
            if (typeof $win !== "undefined" && $win !== null) {
                return $win.location.href;
            } else {
                return null;
            }
        },
        currentDomain: function() {
            if (typeof $win !== "undefined" && $win !== null) {
                return $win.location.hostname;
            } else {
                return null;
            }
        },
        urlParts: function(url) {
            return getUrlParts(url);
        },
        urlScheme: function(url) {
            return getUrlProtocolAndDomain(url);
        },
        request: {
            isCrossDomain: function(srcUrl, destUrl) {
                var srcUrlScheme = cXHR.http.urlScheme(srcUrl);
                var destUrlScheme = cXHR.http.urlScheme(destUrl);
                return srcUrlScheme !== destUrlScheme;
            },
            isCrossDomainRequest: function(destUrl) {
                return this.isCrossDomain(cXHR.http.currentUrl(), destUrl);
            }
        }
    };

}).call(this,window, window.cXHR);;(function($cXHR) {
    "use strict";

    var listeners = {};
    var Listener = function() {};

    $cXHR.messagelistener = {
        listenerObject: function() {
            return new Listener();
        },
        subscribe: function(messageId){
            if(listeners.hasOwnProperty(messageId)){
                listeners[messageId]();
            }
        },
        listen: function(messageId, messageHandler) {
            listeners[messageId] = messageHandler;
        },
        all: listeners
    };
}).call(this, window.cXHR);;(function($cXHR) {
    cXHR.postMessageData = function(messageId, message){
        this.messageId = messageId;
        this.data = message;
    };
}).call(this, window.cXHR);

;(function($cXHR) {
    "use strict";
    var _contentLoader = $cXHR.contentLoader;

    function SIFR(url) {

        var $sifrContainer = null;
        var normalizedUrl = url.toLowerCase().replace(/ /gi, "");
        this.targetUrl = normalizedUrl;

        if (SIFR.Containers.hasOwnProperty(normalizedUrl)) {
            $sifrContainer = SIFR.Containers[normalizedUrl];
            this.isReady = true;
        } else {
            $sifrContainer = document.createElement("iframe");
            $sifrContainer.src = url;
            this.isReady = false;
            SIFR.Containers[normalizedUrl] = $sifrContainer;
        }
        this.client = $sifrContainer;

    }

    function bindEvent(ctx, eventName, eventHandler) {
        if (ctx.attachEvent) {
            ctx.attachEvent(eventName, function() {
                eventHandler();

            });
        } else {
            ctx["onload"] = function() {
                eventHandler();
            };
        }
    }

    function memoizeSifr($sifrClient, sifrUrl) {
        if (SIFR.Containers.hasOwnProperty(sifrUrl)) {
            return SIFR.Containers[sifrUrl];
        } else {
            SIFR.Containers[sifrUrl] = $sifrClient;
            return $sifrClient;
        }
    }


    function postMessage($client, postMessageData) {
        if (typeof $client !== "undefined" && typeof $client.src !== "undefined") {
            if ($client.contentWindow != null && typeof window.postMessage !== "undefined") {
                $client.contentWindow.postMessage(postMessageData, $client.src);
            }
        }
    }

    SIFR.Containers = {};
    SIFR.prototype = {
        send: function(postMessageData) {
            var $client = memoizeSifr(this.client, this.targetUrl);
            var messageDataRaw = JSON.stringify(postMessageData);

            $client.style.display = "none";
            $client.style.width = "0px";
            $client.style.height = "0px";
            var sifrUrl = this.targetUrl;
            if (typeof _contentLoader !== "undefined") {

                if(!this.isReady){
                    _contentLoader.load(this.client, 500, document.body, function() {
                        memoizeSifr($client, sifrUrl);
                        postMessage($client, messageDataRaw);
                    });
                }else{
                    memoizeSifr($client, sifrUrl);
                    postMessage($client, messageDataRaw);
                }
            }
        },
        receive: function(message) {

        }
    };

    function getSIFRClientInstance(url) {
        return new SIFR(url);
    }

    $cXHR.sifr = {
        getClient: function(url) {
            var sifrInstance = getSIFRClientInstance(url);
            return sifrInstance;
        }
    };
}).call(this, window.cXHR);;(function($cXHR, listener) {
   "use strict";

   function Messenger(rawMessage, senderArgs) {
       this.sourceMessageId = null;
       this.rawMessage = rawMessage;
       this.sender = senderArgs;
       this.isOneWay = false;
       this.Id = Date.now();

       this.rawMessage = rawMessage;
       this.sender = senderArgs;
       this.isOneWay = false;
       this.publishToListener = function(listener, message) {
           listener(message);
       };
   }

   Messenger.HTTPVERBS = {
       "get": "GET",
       "put": "PUT",
       "post": "POST",
       "delete": "DELETE"
   };
   if (typeof listener !== "undefined") {
       Messenger.listeners = listener.all;
   }

   Messenger.prototype = {
       packMessageHeaders: function(messageData) {

       },
       post: function(isRestful, messageData) {
           var that = this;
           var messageId = messageData.messageId;
           var callbackResult = {
               status: null,
               result: null,
               xhr: null
           };
           $cXHR.ajax.execute(messageData.data.method, messageData.data.url, messageData.data.settings,
               function(status, result, xhr) {
                   callbackResult.status = status;
                   callbackResult.result = result;
                   callbackResult.xhr = xhr;
                   that.onPostComplete(messageId, callbackResult, false);
               },
               function(status, result, xhr) {
                   that.onPostComplete(messageId, result, true);
               });
       },
       onPostComplete: function(messageId, callbackResult, hasError) {
           var statusCode = !hasError ? 200 : (typeof callbackResult.status === "undefined") ? 500 : callbackResult.status;
           this.notifySender({
               messageId: messageId,
               status: statusCode,
               data: callbackResult
           });
       },
       parseMessage: function(rawMessage) {

           var message = (rawMessage);
           if (typeof rawMessage === "string") {
               message = JSON.parse(rawMessage);
           }
           if (message) {
               if (message.hasOwnProperty("isOneWay")) {
                   this.isOneWay = message.isOneWay;
               }
               message.isRestful = false;

               if (message.hasOwnProperty("data")) {
                   if (message.data.hasOwnProperty("method") && message.data.hasOwnProperty("url")) {
                       message.isRestful = Messenger.HTTPVERBS
                           .hasOwnProperty(message.data.method
                               .toLowerCase());
                   } else {
                       message.isRestful = false;
                   }
               }
               if (message.hasOwnProperty("messageId") && Messenger.listeners.hasOwnProperty(message.messageId)) {
                   if (Messenger.listeners.hasOwnProperty(message.messageId)) {
                       this.publishToListener(Messenger.listeners[message.messageId], message);
                   }
               }
               return message;
           } else {
               return {};
           }
       },
       notifySender: function(message) {
           if (this.isOneWay) {
               return false;
           } else {
               this.sender.source.postMessage(JSON.stringify(message), "*");
           }
       }
   };

   $cXHR.sifrMessenger = {
       process: function(rawMessage, senderArgs) {
           var messenger = new Messenger(rawMessage, senderArgs);
           messenger.message = messenger.parseMessage(messenger.rawMessage);
           if (messenger.message.isRestful) {
               messenger.post(messenger.message.isRestful, messenger.message);
           }
       }
   };
}).call(this, window.cXHR, window.cXHR.messagelistener);


(function($win, $messenger) {
    "use strict";

    var allowedOrigins = null;

    if(typeof $win.cXHR !== "undefined" && typeof $win.cXHR.config !== "undefined"){
        allowedOrigins = $win.cXHR.config.getAllowedOrigins();
    }

    function isValidMessage(origin) {
        if (allowedOrigins !== null) {
            if (allowedOrigins.hasOwnProperty("*")) {
                return true;
            } else {
                return allowedOrigins.hasOwnProperty(origin);
            }
        } else {
            return false;
        }
    }

    function hasMessageListener() {
        if (typeof $win !== "undefined" && typeof $win.onmessage !== "undefined") {
            return true;
        } else {
            return false;
        }
    }

    function setupMessageListener() {
        if (hasMessageListener()) {
            if(window.attachEvent){
                window.attachEvent("onmessage" , function(e){
                    handleMessage(e);
                });
            }else{
                $win.onmessage = function(e) {
                    handleMessage(e);
                };
            }

        }
    }

    function handleMessage(e) {
        if (typeof e !== "undefined" && typeof $messenger !== "undefined") {
            if(isValidMessage(e.origin)){
                $messenger.process(e.data, {
                    origin: e.origin,
                    source: e.source
                });
            }else{
                var error = {"status": 401,"data": {"error": "Unauthorized Request"}};
                e.source.postMessage(JSON.stringify(error), "*");
            }
        }
    }

    setupMessageListener();

}).call(this, window, window.cXHR.sifrMessenger);;(function($cXHR, httpModule) {
    "use strict";

    function _xhrResponse(actualXhr) {
        if (typeof actualXhr === "undefined" || actualXhr === null) {
            return {};
        }
        var responseHeaders = {};
        try {
            if (typeof actualXhr.getAllResponseHeaders() === "function") {
                responseHeaders = actualXhr.getAllResponseHeaders();
            }
        } catch (e) {
            //wierd IE Exception for GetResponseHEaders();
        }

        var xhrResponse = {
            response: actualXhr.response,
            responseType: actualXhr.responseType,
            status: actualXhr.status,
            statusText: actualXhr.statusText,
            allResponseHeaders: responseHeaders,
            getAllResponseHeaders: function() {
                return responseHeaders;
            }
        };
        return xhrResponse;
    }


    function XmlHttpRequestClient(method, url, settings) {
        this.targetUrl = url;
        this.inputArgs = null;
        this.httpRequest = null;
        this.httpVerb = method || "GET";
        this.headers = null;
        this.responseType = "text";
        this.clientToken = null;
        this.corsType = $cXHR.config.getCorsType();
        this.sifrGateway = $cXHR.config.getSifrGateway();
        this.xhrFeatures = $cXHR.features.get();
        this.prepareRequest(url, settings, $cXHR.http);
    }

    function getInputs(inputParams) {
        var inputString = null;
        if (inputParams !== null) {
            if (typeof inputParams === 'object') {
                inputString = JSON.stringify(inputParams);
            } else {
                inputString = inputParams;
            }
        }
        return inputString;
    }

    function setupRequestHeaders(httpRequest, headers) {
        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                httpRequest.setRequestHeader(key, headers[key]);
            }
        }
    }

    function parseResult(result, responseType) {
        if (typeof responseType === "undefined") {
            return result;
        } else if (responseType === "text") {
            return result;
        } else if (responseType === "json") {
            return JSON.parse(result);
        } else {
            return result;
        }

    }

    XmlHttpRequestClient.prototype = {
        prepareRequest: function(requestUrl, settings, httpModule) {
            var xmlHttpRequest = new XMLHttpRequest();
            this.SIFR = null;
            if (typeof settings !== "undefined") {
                if (typeof settings.data !== "undefined") {
                    this.inputArgs = getInputs(settings.data);
                }

                if (typeof settings.headers !== "undefined") {
                    this.headers = settings.headers;
                }

                if (settings.dataType !== "undefined") {
                    this.responseType = settings.dataType;
                }

                if (settings.timeout !== "undefined") {
                    this.timeout = settings.timeout;
                }
            }
            this.settings = settings;
            this.isCrossDomainRequest = httpModule.request.isCrossDomainRequest(requestUrl);
            if(this.isCrossDomainRequest){
                if(this.corsType === "sifr" || (this.corsType === "cors-polyfill" && !this.xhrFeatures.isCorsEnabled)){
                    this.SIFR = $cXHR.sifr.getClient(httpModule.urlScheme(requestUrl) + "/" + this.sifrGateway);
                }
            }
            this.httpRequest = xmlHttpRequest;
        },
        execute: function(onSuccessCallback, onErrorCallback) {
            var xhrTimeOut = null;
            var that = this;

            if (this.SIFR !== null) {
                this.executeSIFR(onSuccessCallback, onErrorCallback);
                return;
            }

            this.httpRequest.onreadystatechange = function() {
                if (this.readyState === XmlHttpRequestClient.readyStates.complete) {
                    if (xhrTimeOut != null) {
                        window.clearTimeout(xhrTimeOut);
                    }
                    that.onComplete(that.httpRequest.status, that.httpRequest.responseText, onSuccessCallback, onErrorCallback);
                }
            };
            this.httpRequest.open(this.httpVerb, this.targetUrl);

            setupRequestHeaders(this.httpRequest, this.headers);


            if (this.clientToken != null) {
                setupRequestHeaders(this.httpRequest, {
                    "Authorization": this.clientToken
                });
            }
            if (this.inputArgs === null) {
                this.httpRequest.send();
            } else {
                this.httpRequest.send(this.inputArgs);
            }

            if (this.timeout != null) {
                xhrTimeOut = window.setTimeout(function() {
                    that.httpRequest.abort();
                    that.onComplete(408, {
                        "error": "TimeOut",
                        "errorMessage": "Your Request Has Timed Out"
                    }, onSuccessCallback, onErrorCallback);
                }, this.timeout);
            }
        },
        onComplete: function(status, result, onSuccessCb, onErrorCb) {
            if (status === 0) {
                return;
            }
            this.xhrResponse = this.patchResponse(this.httpRequest);
            if (status === 200) {
                if (typeof onSuccessCb === "function") {
                    onSuccessCb.call(this, status, parseResult(result, this.responseType), this.xhrResponse);
                }
            } else {
                var errorResult = {
                    "status": status,
                    "errorMessage": result
                };

                if (typeof onErrorCb === "function") {
                    onErrorCb.call(this, status, errorResult, this.xhrResponse);
                }

            }
        },
        patchResponse: function(actualXhr) {
            if (typeof actualXhr !== "undefined" && actualXhr !== null) {
                return _xhrResponse(actualXhr);
            } else {
                return null;
            }
        },
        onSifrRequestComplete: function(status, callbackResult, sifrXhr, onSuccessCb, onErrorCb) {
            if (status === 200) {
                if (typeof onSuccessCb === "function") {
                    onSuccessCb.call(this, status, callbackResult.data, sifrXhr);
                }
            } else {
                if (typeof onErrorCb === "function") {
                    onErrorCb.call(this, status, callbackResult.data, sifrXhr);
                }
            }
        },
        executeSIFR: function(onSuccessCallback, onErrorCallback) {
            var isPostMessage = typeof window.postMessage === 'function' || typeof window.postMessage === "object";
            if (isPostMessage && typeof JSON === "undefined") {
                isPostMessage = false;
            }

            if (!isPostMessage) {
                this.onSifrRequestComplete(405, {
                    "error": "Method Not Allowed",
                    "errorMessage": "Cross Domain Requests are not allowed"
                }, null, onSuccessCallback, onErrorCallback);
                return false;
            } else {
                var that = this;
                var postMessageData = new $cXHR.postMessageData(Date.now(), {
                    method: this.httpVerb,
                    url: this.targetUrl,
                    settings: this.settings
                });
                this.SIFR.send(postMessageData, null);
                $cXHR.messagelistener.listen(postMessageData.messageId, function(callbackResult) {
                    var xhrReq = null;
                    if (typeof callbackResult !== "undefined") {
                        xhrReq = typeof callbackResult.data !== "undefined" ? callbackResult.data.xhr : null;
                        that.onSifrRequestComplete(callbackResult.status, callbackResult, xhrReq, onSuccessCallback, onErrorCallback);
                    }
                });
            }

        }
    };

    XmlHttpRequestClient.readyStates = {
        "uninitialized": 0,
        "loading": 1,
        "loaded": 2,
        "interactive": 3,
        "complete": 4
    };


    $cXHR.ajax = {
        GET: function(url, settings, onSuccess, onError) {
            this.execute("GET", url, settings, onSuccess, onError);
        },
        PUT: function(url, settings, onSuccess, onError) {
            this.execute("PUT", url, settings, onSuccess, onError);
        },
        POST: function(url, settings, onSuccess, onError) {
            this.execute("POST", url, settings, onSuccess, onError);
        },
        execute: function(method, url, settings, onSuccess, onError) {
            var ajaxClient = new XmlHttpRequestClient(method, url, settings);
            ajaxClient.execute(onSuccess, onError);
        }
    };
}).call(this, window.cXHR, window.cXHR.http);