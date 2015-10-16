(function($cXHR) {
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
