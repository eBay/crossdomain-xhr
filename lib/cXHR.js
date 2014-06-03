(function($cXHR, httpModule) {
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