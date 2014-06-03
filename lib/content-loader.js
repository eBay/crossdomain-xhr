(function($cXHR) {
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
}).call(this, window.cXHR);