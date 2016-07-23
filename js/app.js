(function(){

  "use strict";

  var http = require("http");

  http.createServer( createServer ).listen( 8090 );

  function createServer( request, response ){
    response.writeHead( 200, { 'Content-Type': 'text/plain' } );

    response.end( 'Hello World\n' );
  }

  console.log('Server running at http://127.0.0.1:8090/');

})();
