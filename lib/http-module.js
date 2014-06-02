(function($win, cXHR) {
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

}).call(this,window, window.cXHR);