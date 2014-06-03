(function($cXHR) {
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
}).call(this, window.cXHR);