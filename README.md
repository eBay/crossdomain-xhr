crossdomain-xhr
===============

### Summary

```crossdomain-xhr```, is a client-side javascript library with no external dependencies.  This library solves the problem of cross-domain `HttpRequest` by utilizing the standard `XMLHttpRequest`. Based on the system setup, this library can leverage either CORS or IFrame PostMessage.  For IE 8 & 9 support, it is recommended to use IFrame PostMessage.

===

### Features

* Simplicity - Maintains the standard jQuery Ajax API signature model for invoking Ajax Requests.
* No External dependencies - Plain vanilla JS.
* Ability to pick and choose between CORS or PostMessage.
* Browser support for PostMessage is well covered.

==

### Installation

* <a download="crossdomain-xhr.min.js" href="/dist/crossdomain-xhr.min.js">Get Minified & Gzipped </a>

* <a download="crossdomain-xhr.js" href="/dist/crossdomain-xhr.js">Full library </a>

===

### Usage

#### [Example](#example)
<a id="example"></a>

The following example uses "CORS" with polyfill "PostMessage".

```javascript

cXHR.config.set( {'useCORSPolyfill' : true, 'allowedOrigins' : '*', 'sifrGateway' : 'sifr.html'}); /**Prepare cXHR with default config **/

var settings = {"clientid":"Sample Client Id", "dataType" : "json", "headers" : {"Accept" : "application/json"}};
cXHR.ajax.GET(url, settings, onSuccess, onError);

/*** Success Callback will be called if the service execution returns 200 ***/
function onSuccess(status, successResponse, xhr){

}

/*** Error Callback will be raised when network Failiure | TimeOut | Incompatible Execution | Service Exception ***/
function onError(status, errorResponse, xhr){

}

```
<a id="input"></a>
#### [Input](#input)

| Name          | Type                  | Description
| ------------- | --------------------- | ---------------
| url           | `String`              | A string containing the URL to which the request is sent.
| settings      | `Plain JSON Object{}` | A set of key/value pairs to configure the Ajax request. `[Optional]`
| onSuccess     | `Callback Function`   | A callback function executes onSuccessful Ajax request.
| onError       | `Callback Function`   | A callback function executes when ajax request errors.

===

### Browser Support
* [CORS Browser Support](http://caniuse.com/#search=cors)
* [PostMessage Support](http://caniuse.com/#search=postmessage)


