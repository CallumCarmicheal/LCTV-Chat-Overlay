// Setup our libs
var app                 = require('express')();
var http                = require('http').Server(app);
var io                  = require('socket.io')(http);
var express             = require("express");
var express_morgan      = require('morgan');
var xmpp                = require('simple-xmpp');
var constamp            = require('console-stamp')(console, '[HH:MM:ss.l]');


// Setup our Modules
var modConsole          = require("./Console.js");
var modAuthentication   = require("./Authentication.js");
var modXMPP             = require("./XMPPChat.js");
var modSIOHandler       = require("./SIOHandler.js");

// Other Variables
var debug               = true;


function sendRebinds(callInit) {
    // Send rebind call to each module
    var libs = {
        APP:            app,
        HTTP:           http,
        SocketIO:       io,
        Express:        express,
        Express_Morgan: express_morgan,
        XMPP:           xmpp,
        ConsoleStampt:  constamp,
    };

    // Load modules in requirement order
    var modules = {
        // 0.
            Console:        modConsole,
        // 1.
            Authentication: modAuthentication,
        // 2.
            //XMPP:           modXMPP,
        // 3.
            SIOHandler:     modSIOHandler
        // 4.
    }

    var binds = {
        Libs:    libs,
        Modules: modules
    }

    // HACK: Loop through modules and send the binds that way!

    // Check if command exists
    for(var x = 0; x < Object.keys(modules).length; x++) {
        var key = Object.keys(modules)[x];

        modules[key].SetBinds(binds);
        if(callInit) modules[key].InitModule();

        console.log("[Modules]: Loaded - " + modules[key].Module.Name + " (" + modules[key].Module.Desc + ")");
    }
};

// Setup our http directory
app.use('/', express.static('../public'));
http.listen(8080, function() {
    console.log("[HTTP] Listening to http requests on *:8080");
});

// TODO: Setup express logging



sendRebinds(true);
console.log("[Server.js] Finished bootstrap process");
