// Stores every module that is loaded
// Allows cross module talk!
var modules;

// Our xmpp module
var xmpp;

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

        console.log("[XMPPChat.js] handlerSocketIO.socketAdd: Socket(" + id + ") joined chatroom (" + chatroom + ")");
    },

    socketRemove: function(id, chatroom) {
        // TODO: Remove client from specified room
        console.log("[XMPPChat.js] handlerSocketIO.socketRemove: Socket(" + id + ") left chatroom (" + chatroom + ")");
    },

    socketDisconnect: function(id) {
        // TODO: Remove client id from every chat room.
        console.log("[XMPPChat.js] handlerSocketIO.socketDisconnect: Socket(" + id + ") disconnected from all chat rooms!");
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
    DispatchMessages: function(chatroom, user, message) {}
}

var handlerXMPP = {
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
            console.log("[XMPPChat.js] recieveModuleCommand.ioDisconnect: Expecting args but none passed!");
            return;
        } else if (Args.length != 0) {
            console.log("[XMPPChat.js] recieveModuleCommand.ioDisconnect: Invalid Arg count");
            return;
        }

        // ID = Args[0]
        var sid = Args[0];
        handlerSocketIO.socketDisconnect(sid);
    } else if(Name == "ioJoin") {
        if(!useArgs) {
            console.log("[XMPPChat.js] recieveModuleCommand.ioDisconnect: Expecting args but none passed!");
            return;
        } else if (Args.length != 1) {
            console.log("[XMPPChat.js] recieveModuleCommand.ioJoin: Invalid Arg count");
            return;
        }

        // ID   = Args[0]
        // Room = Args[1]
        var sid  = Args[0];
        var room = Args[1];
        handlerSocketIO.socketAdd(sid, room);
    } else if(Name == "xmppSendMessage") {
        // Type     = Args[0]  |  0 = Direct Message, 1 = Room Message
        // Location = Args[1]
        // Message  = Args[2]


    }
}

// Our module exports
module.exports = {

    Module: {
        Name: "server/XMPPChat.js",
        Desc: "I dont know you tell me!",
        SendCommand: recieveModuleCommand
    },

    InitModule: function() {
        // Setup the XMPP Chat
        xmpp.on('online', function(data) {
            console.log('[XMPPChat.js] Connected with JID: ' + data.jid.user);
        });

        xmpp.on('chat', function(from, message) {
            xmpp.send(from, 'echo: ' + message);
        });

        xmpp.on('error', function(err) {
            console.error(err);
        });

        // TODO: Add rest of XMPP EVENTS

    },

    SetBinds: function(bindObject) {
        var xmpp = modules.Libs.XMPP;
        modules = bindObject;
    }
};
