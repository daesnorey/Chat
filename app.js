(function(){

  "use strict";

  const cryptico = require("cryptico");
  const app = require('express')(handler);
  const http = require('http').createServer(app);
  const io = require('socket.io')(http);
  const fs = require('fs');
  const port = 8098;

  var users = [];
  var messages = [];
  var user = { id: undefined, userName: undefined };

  http.listen( port );

  function handler (req, res) {
    console.log( req );
    console.log( res );
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
    //res.sendFile( __dirname + '/index.html' );
  };

  io.on( 'connection', userConnected );

  function userConnected( socket ){
    //socket.conn.remoteAddress
    //console.log('a user connected', socket.id );
    printMessages( socket.id );

    socket.on( 'disconnect', userDisconnect );
    socket.on( 'setdata', setData );
    socket.on( 'chat message', chatMessage );
  };

  function chatMessage( msg ){
    let client = getClient( this.id );
    this.broadcast.emit( 'chat message', { user: client.user, msg: msg } );
    addMessage( { user: client.user, msg: msg } );
  }

  function addMessage( msg ){
    messages.push( msg );
  }

  function printMessages( id ){
    for( let i = 0; i < messages.length; i++ ){
      let msg = messages[ i ];
      console.log( msg );
      io.to( id ).emit('chat message', msg );
    }
  }

  function getClient( socketId ){
    for( let i = 0; i < users.length; i++ ){
      var actual = users[ i ];
      if( actual.id == socketId ){
        actual.index = i;
        return actual;
      }
    }
    return false;
  }

  function setData( data ){
    var currentUser = getClient( this.id );
    if( !currentUser ){
      let client = user.constructor();
      client.id = this.id;
      client.user = data.user;
      //client.key = keypair( { bits: "1024", e: "010001" } );
      users.push( client );
      //io.emit('sData',
          //{ prikey: client.key.private, pubkey: client.key.public } );
    }else{
      users[ currentUser.index ].user = data.user;
    }
    console.log( 'user connected', this.id );
    //console.log( users );
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
    //console.log( users );
  }

})();
