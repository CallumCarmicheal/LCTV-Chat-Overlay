// Stores every module that is loaded
// Allows cross module talk!
var res;

// Our xmpp module
var xmpp;
var client;

// Store a list of chat rooms
//      each chat room is a array of socket id's
//      THIS IS A OBJECT NOT AN ARRAY, LENGTH DOES NOT WORK!
var chats;

var handlerSocketIO = {
    socketAdd: function(id, chatroom) {
        // TODO: Check if connected to chat room
        //          if connected, check if array exists
        //              if not add it
        //          if not Connect to chat room
        //          Add socket id to chatroom in array

        console.log("[XMPPChat.js] hSIO.sA: Socket(" + id + ") joined chatroom (" + chatroom + ")");
    },

    socketRemove: function(id, chatroom) {
        // TODO: Remove client from specified room
        console.log("[XMPPChat.js] hSIO.sR: Socket(" + id + ") left chatroom (" + chatroom + ")");
    },

    socketDisconnect: function(id) {
        // TODO: Remove client id from every chat room.
        console.log("[XMPPChat.js] hSIO.sD: Socket(" + id + ") disconnected from all chat rooms!");
    }
}

var handlerChat = {

    // Returns bool stating connection status
    checkChatRoom: function(chatroom) {},

    // Connect to chat room
    Connect: function(chatroom) {
        // TODO: Connect(chatroom)
        // 0. Check connection
        // 1. Check if chatroom is added
        // 2. Check if chatroom is connected
        // 3. If none of the above, connect, add chatroom.
    },

    // Recusively send out messages from chat rooms
    dispatchMessages: function(chatroom, user, message) {}
}

var handlerXMPP = {
    handleStanza: function (self, data) {
        console.log(data);



    },

    onlineState: function(data) {

    },

    chatMessage: function(from, message) {
        console.log("%s says ")
    },

    groupMessage: function(group, from, message, stamp) {
        console.log('%s says %s on %s on %s at %s', from, message, conference, stamp.substr(0,9), stamp.substr(10));
    },

    errorOccured: function(err) {
        console.error(err);
    }
}

// Handles cross module commands
//      Pass null for no args
function recieveModuleCommand(Name, Args) {
    var useArgs = (Args != null);
    
    if(Name == "ioDisconnect") {
        if(!useArgs) {
            console.log("[XMPPChat.js] rMC.iD: Expecting args but none passed!");
            return;
        } else if (Args.length != 0) {
            console.log("[XMPPChat.js] rMC.iD: Invalid Arg count");
            return;
        }

        // ID = Args[0]
        var sid = Args[0];
        handlerSocketIO.socketDisconnect(sid);
    } else if(Name == "ioJoin") {
        if(!useArgs) {
            console.log("[XMPPChat.js] rMC.iD: Expecting args but none passed!");
            return;
        } else if (Args.length != 1) {
            console.log("[XMPPChat.js] rMC.iJ: Invalid Arg count");
            return;
        }

        // ID   = Args[0]
        // Room = Args[1]
        var sid  = Args[0];
        var room = Args[1];
        handlerSocketIO.socketAdd(sid, room);
    } else if(Name == "xmppSendMessage") {
        // Type     = Args[0]  |  0 = Direct Message, 1 = Room Message
        // To       = Args[1]
        // Message  = Args[2]
        
        // Direct Message
        if (Args[0].toLowerCase() == "dm") {
            var to      = Args[1];
            var message = Args[2];
            xmpp.send(to, message, false);
            console.log("[XMPPChat.js] Sending %s to %s", message, to);
        }
    }
}

// Our module exports
module.exports = {

    Module: {
        Name:        "server/XMPPChat.js",
        Handle:      "XMPP",
        Desc:        "XMPP Chat handler",
        SendCommand: recieveModuleCommand
    },

    InitModule: function () {
        /* Setup the XMPP Events / {
            xmpp.on('online', function (data) {
                console.log('[XMPPChat.js] Connected with JID: ' + data.jid.user);

                xmpp.send("admin", "Connected!", false);
            });
        } //*/
        
        // Connect to the server
        var cfgMod = res.Modules.Config.Module;
        var connect_creds = {
            jid:        cfgMod.SendCommand("getUsername", null),
            password:   cfgMod.SendCommand("getPassword", null),
            host:       cfgMod.SendCommand("getHost",     null),
            reconnect:  true
        };
        
        
        client = new xmpp(connect_creds);

        client.on('online', function () {
            console.log('Connected to xmpp server!');

            client.send(new xmpp.Stanza('presence', {})
                .c('show').t('chat').up()
                .c('status').t('Happily echoing your <message/> stanzas')
            );
        });

        client.on('stanza', function (stanza) {
            console.log(stanza);

            if (stanza.is('message') &&
                // Important: never reply to errors!
                (stanza.attrs.type !== 'error')) {
                
                // Swap addresses...
                //stanza.attrs.to = stanza.attrs.from
                //delete stanza.attrs.from
                
                // and send back
                //console.log('Sending response: ' + stanza.root().toString())
                //client.send(stanza)
                //console.log(stanza.)
                
                handlerXMPP.handleStanza(stanza);
            }
        });
        
        // Error handling
        client.on('error', function (e) {
            console.error(e)
        });

        // Setup a keep alive
        setInterval(function () {
            client.send(' ');
        }, 30000);
    },

    SetBinds: function(bindObject) {
        xmpp = bindObject.Libs.XMPP;
        res  = bindObject;
    }
};
