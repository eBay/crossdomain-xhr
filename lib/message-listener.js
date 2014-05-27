(function($cXHR) {
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
}).call(this, window.cXHR);