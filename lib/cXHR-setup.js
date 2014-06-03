(function($cXHR) {
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
}).call(this, window.cXHR);