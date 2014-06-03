describe('Test 1+1==2', function() {

    it("Should Work on Affix" ,function(){
       expect(window).not.toBeNull();
    });

     it('Should be equal', function() {
        expect("jim").toBe("jim");
    });
});

describe('cXHR name space should exist', function() {
     it('Should be exist', function() {
         expect(window.cXHR).not.toBeNull();
     });
});

describe('cXHR.http name space should exist', function() {
     it('Should be exist', function() {
         expect(window.cXHR.http).not.toBeNull();
     });
});

describe('cXHR.http module split length should match', function() {
     it('Should be exist', function() {
         var expected = ["http:", "", "www.ebay.com"];
         var actual = window.cXHR.http.urlParts("http://www.ebay.com");
         expect(expected.length).toBe(actual.length);
     });
});

describe('ebay.http name space should exist', function() {
     it('Should be exist', function() {
         var expected = "http://www.ebay.com";
         var actual = window.cXHR.http.urlScheme("http://www.ebay.com");
         expect(expected).toBe(actual);
     });
});


describe('ebay.http name space should exist', function() {
     it('Should be exist', function() {
         var expected = "http://www.ebay.com";
         var actual = window.cXHR.http.urlScheme("http://www.ebay.com");
         expect(expected).toBe(actual);
     });
});

describe('ebay.urlhelper', function() {
     it('Is url CorssDomain Request', function() {
         var expected = true;
         var actual = window.cXHR.http.request.isCrossDomain("http://www.ebay.com", "https://www.ebay.com");
         expect(expected).toBe(actual);
     });
});

describe('ebay.urlhelper.issamedomain', function() {
     it('Is url sameorigin Request', function() {
         var expected = false;
         var actual = window.cXHR.http.request.isCrossDomain("http://ramahadevan.github.io/crossdomain-xhr/demo.html", "http://ramahadevan.github.io/crossdomain-xhr/demo.html");
         expect(expected).toBe(actual);
     });
});

describe('message-listener', function() {
    it('Message Listener Exists', function() {
        expect(window.cXHR.messagelistener).not.toBeNull();
    });
});

describe('message-listener', function() {
    it('Should listen to messages ', function() {
        var messageListener = window.cXHR.messagelistener;
        messageListener.listen(123,function(){
            return "hello world!!!";
        });
        var listener = messageListener.all.hasOwnProperty(123);
        expect(listener).not.toBeNull();
    });
});



describe('sifr-messenger', function() {

    it('SIFR Messenger Should Exist', function() {
        expect(window.cXHR.sifrMessenger).not.toBeNull();
    });

    it("PostMessageData Should Exist", function(){
        expect(window.cXHR.postMessageData).not.toBeNull();
    });

    it("PostMessageData Should Match", function(){
        var now = Date.now();
        var postMessageData = new window.cXHR.postMessageData(now,{});
        var expected = now;
        var actual = postMessageData.messageId;
        expect(expected).toBe(actual);
    });

    it("SIFR Should Exist", function(){
        expect(window.cXHR.sifr).not.toBeNull();
    });

});

describe('cXHR-Config', function() {
    it("cXHR Exists", function(){
        expect(window.cXHR.config).not.toBeNull();
    });


    it("Cors Type", function(){
        window.cXHR.config.set({
            'useCORSPolyfill' : true
        });
        var expected = "cors-polyfill";
        expect(window.cXHR.config.getCorsType()).toBe(expected);
    });


    it("Should set allow origin", function(){
        window.cXHR.config.set({
            'allowedOrigins' : '*,localhost'
        });

        var allowedOrigins = window.cXHR.config.getByKey('allowedOrigins');
        var allowedDomains = window.cXHR.config.getAllowedOrigins();
        var expectedLength =  2;

        expect(allowedOrigins).not.toBeNull();
        expect(allowedOrigins.split(",").length).toBe(expectedLength);
        expect(allowedDomains.hasOwnProperty("localhost")).toBe(true);
    });

});
