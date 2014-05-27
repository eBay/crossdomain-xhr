(function($cXHR, listener) {
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

}).call(this, window, window.cXHR.sifrMessenger);