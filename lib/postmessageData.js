(function($cXHR) {
    cXHR.postMessageData = function(messageId, message){
        this.messageId = messageId;
        this.data = message;
    };
}).call(this, window.cXHR);

