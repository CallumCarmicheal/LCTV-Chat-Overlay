// Stores every module that is loaded
// Allows cross module talk!
var modules;

// Socket IO
var io;

// SocketIO sockets
var sockets = {};

function socketio_evt_Disconnection(socket) {
    if(socket == null) return;

    console.log(socket.id + ' disconnected');

    // TODO: Remove user from sockets

    // Remove user from socketio
    /*(for(var x = 0; x < Object.keys(sockets).length; x++) {
        if(Object.keys(sockets)[x] == socket.id) {
            sockets.splice(x, 1);
            break;
        }
    }*/

    delete sockets[socket.id];

    // TODO: Remove user from XMPP
    //modules.Modules.XMPP.Module.SendCommand("ioDisconnect", socket.id);
}

function socketio_evt_Connection(socket) {
    if(socket == null) return;

    console.log("[SIOHandler.js] Socket Connected with ID: " + socket.id);

    for(var x = 0; x < Object.keys(sockets).length; x++) {
        console.log("[" + x + "] ID: " + Object.keys(sockets)[x]);
    }


    // Setup disconnect callback
    socket.on('disconnect', function() {socketio_evt_Disconnection(socket);});

    // Track user
    sockets[socket.id] = socket;
}

function setupSocketIO() {
    // TODO: Store each Session with a SESSION ID
    //          to allow unique calls to each session
    //          this will allow multiple chat lobbies from
    //          one server, EG. PUBLIC WEB SERVICE etc.

    /*io.sockets.on('connection', function (socket) {
        socket.on('disconnect', function() {
            console.log(socket.id + ' disconnected');
            //remove user from db
        })
    });*/

    // TODO: Setup each event
    io.sockets.on('connection', socketio_evt_Connection);
}


// Handles cross module commands
//      Pass null for no args
function recieveModuleCommand(Name, Args) {
    var useArgs = (Args != null);

    // TODO: Socket commands
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
