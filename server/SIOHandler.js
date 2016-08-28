// Stores every module that is loaded
// Allows cross module talk!
var modules;

// Socket IO
var io;

// SocketIO sockets
var sockets = {};

var SocketIO_Events = {
    evtJoinChannel: function (self, socket, data) {
        // Error checking
        if (data == null)           return;
        if (data.channel == null)   return;
        
        socket.join(data.channel);
        modules.Modules.LCTV.Module.SendCommand("channelJoin", data.channel);
        console.log("[SIOHandler.js] SID: " + socket.id + " joined channel - " + data.channel);
    }
};

var SocketIO_Client = {
	onDisconnect: function(self, socket) {
		if(socket == null) return;
		console.log("[SIOHandler.js] SID:" + socket.id + " disconnected");

		// TODO: Remove user from sockets
		// Delete our socket object!
		delete sockets[socket.id];
	},
	
	onConnect: function(self, socket) {
		// Just in case check if the socket is null
		if(socket == null) return;

		console.log("[SIOHandler.js] Socket Connected with SID:" + socket.id);

		// For DEBUGGING, Show every socket connected!
		for(var x = 0; x < Object.keys(sockets).length; x++) 
			console.log("[" + x + "] ID: " + Object.keys(sockets)[x]);
		
		// Setup the socket's events
		self.setupEvents(self, socket);
		
		// Store user
		sockets[socket.id] = socket;
	},
	
	setupEvents: function(self, socket) {
		// IO: Disconnect
        socket.on('disconnect',   function () { self.onDisconnect(self, socket); });

        socket.on('channel join', function (data) {
            console.log('EVT: Channel Join - ', data);

            if (data == null)           { console.log("Data == null");return; }
            if (data.channel == null)   { console.log("Data.channel == null"); return; }
            console.log("");
            SocketIO_Events.evtJoinChannel(SocketIO_Events, socket, data);
        });
	}
};

var SocketIO_Server = {
	init: function(self) {
		// TODO: Setup each event
		io.sockets.on('connection', function (socket) { SocketIO_Client.onConnect(SocketIO_Client, socket); });
	} 
}

// SERVER SIDED CONNECTION EVENT
function setupSocketIO() {
	// Init socket stuff
    SocketIO_Server.init();
}


// Handles cross module commands
//      Pass null for no args
function recieveModuleCommand(Name, Args) {
    var useArgs = (Args != null);

    if (useArgs) {
        
    } else {
        console.log("Invalid Args passed to function");
    }
}

// Our module exports
module.exports = {

    Module: {
        Name:   "server/SIOHandler.js",
        Handle: "SocketIO",
        Desc:   "Handles stealing bank details and hacking super computers!",
        SendCommand: recieveModuleCommand
    },

    InitModule: function() {
        setupSocketIO();
    },

    SetBinds: function(bindObject) {
        io = bindObject.Libs.SocketIO;
        modules = bindObject;
    }
};
