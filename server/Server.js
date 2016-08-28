// Setup our libs
var app                 = require('express')();
var http                = require('http').Server(app);
var io                  = require('socket.io')(http);
var express             = require("express");
var lctvbot             = require('lctvbot');
var constamp            = require('console-stamp')(console, 'HH:MM:ss.l');
var fs                  = require('fs');

// Setup our Modules
var modConsole          = require("./Console.js");
var modLCTV             = require("./LCTV.js");
var modSIOHandler       = require("./SIOHandler.js");

// Other Variables
var debug               = false;

// Prototypes
if(!String.prototype.startsWith){
    String.prototype.startsWith = function (str) {
        return !this.indexOf(str);
    }
}

function sendRebinds(callInit) {
    // Send rebind call to each module
    var libs = {
        APP:            app,
        HTTP:           http,
        SocketIO:       io,
        Express:        express,
        LCTV:           lctvbot,
        ConsoleStampt:  constamp,
        FileSystem:     fs,
    };

    // Load modules in requirement order
    var modules = {
        // 0.
            Console:        modConsole,
        // 2.
            LCTV:           modLCTV,
        // 3.
            SIOHandler:     modSIOHandler
    };
    
    var binds = {
        Libs:    libs,
        Modules: modules
    };

    // HACK: Loop through modules and send the binds that way!
    // Check if command exists
    for(var x = 0; x < Object.keys(modules).length; x++) {
        var key = Object.keys(modules)[x];

        modules[key].SetBinds(binds);
        if (debug) console.log("[Server.js] Modules (" + modules[key].Module.Name + "): Set binds");

        if (callInit) {
            modules[key].InitModule();
            if (debug) console.log("[Server.js] Modules (" + modules[key].Module.Name + "): Called init");
        }

        console.log("[Server.js] Modules: Loaded - " + modules[key].Module.Name + " (" + modules[key].Module.Desc + ")");
    }
}

// Setup our http directory
app.use('/', express.static('../public'));
http.listen(8080, function() {
    console.log("[Server.js] HTTP: Listening to http requests on *:8080");
});

// TODO: Setup express logging
// TODO: Error handling


sendRebinds(true);
console.log("[Server.js] Init: Finished bootstrap process");