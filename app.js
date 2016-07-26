(function(){

  "use strict";

  const app = require('express')(handler);
  const http = require('http').createServer(app);
  const io = require('socket.io')(http);
  const fs = require('fs');
  const port = 8098;

  var users = [];
  var user = { id: undefined, userName: undefined };

  http.listen( port );

  function handler (req, res) {
    //fs.readFile( __dirname + '/index.html', readFile );
  }

  function readFile( err, data ){
    if ( err ) {
      res.writeHead( 500 );
      return res.end( 'Error loading index.html' );
    }

    res.writeHead( 200 );
    res.end( data );
  }

  app.get( '/', get );

  function get( req, res ){
    res.sendFile( __dirname + '/index.html' );
  };

  io.on( 'connection', userConnected );

  function userConnected( socket ){
    //console.log('a user connected', socket.id );
    socket.on( 'disconnect', userDisconnect );
    socket.on( 'setdata', setData );
    socket.on('chat message', function( msg ){
      //console.log('message: ' + msg);
      //console.log(socket.id);
      let client = getClient( socket.id );
      socket.broadcast.emit('chat message', { user: client.user, msg: msg } );
    });
  };

  function getClient( socketId ){
    for( let i = 0; i < users.length; i++ ){
      var actual = users[ i ];
      if( actual.id == socketId ){
        return { user: actual.userName, index: i };
      }
    }
    return false;
  }

  function setData( data ){
    let currentUser = getClient( this.id );
    console.log( currentUser );
    if( !currentUser ){
      let client = user.constructor();
      client.id = this.id;
      client.userName = data.user;

      users.push( client );
    }else{
      users[ currentUser.index ].userName = data.user;
    }
    console.log( users );
  }

  function userDisconnect(){
    for( let i = 0; i < users.length; i++ ){
      var actual = users[ i ];
      if( actual.id == this.id ){
        users.splice( i, 1 );
        break;
      }
    }

    console.log( 'user disconnected', this.id );
    console.log( users );
  }

})();
