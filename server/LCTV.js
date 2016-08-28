// Stores every module that is loaded
// Allows cross module talk!
var res;
var auth;   // Path to the user creditentials
var lctv;   // The LCTVBot Module
var bot;    // The LCTVBot
var tmrcl;  // Timer: Channel Loop
var chnls;  // Array of every channel that the bot should join (INCASE OF DISCONNECTION!)
var io;     // Socket IO

// Responds to pings
var DEBUG_MODE = false;


function arrContains(arr, val) {
    for (var x = 0; x < arr.length; x++)
        if (arr[x] === val) return true;
    return false;
}

function arrPushIF(arr, val, cond) {
    if(cond) arr.push(val);
}

function arrPushNEXST(arr, val) {
    arrPushIF(arr, val, arrContains(arr, val));
}

function strContains(haystack, needle) {
    //console.log("strContains(\"%s\", \"%s\") -> ", haystack, needle, haystack.indexOf(needle), " | ", (needle.indexOf(haystack) != -1));
    return (haystack.indexOf(needle) >= 0);
}

/////////////////////////////////////////////////
//      SECTION: Handler for LCTV Bot evts
var handlerSIO = {
    onChannelJoin: function (self, channel, user, stanza) {
        // TODO: Send module message to SIOHandler.js
        var data =  {
            channel: channel,
            user:    user
        };

        io.in(channel).emit('channel join', data);
    },
    
    onChannelPart: function (self, channel, user, stanza) {
        // TODO: Send module message to SIOHandler.js
        var data = {
            channel: channel,
            user: user
        };

        io.in(channel).emit('channel part', data);
    },
    
    onChannelMessage: function (self, channel, user, message, stanza) {
        var isPingMsg = (
            DEBUG_MODE &&
                message.toLowerCase() == "ping"         || 
                message.toLowerCase() == "!ping"        ||
                strContains(message.toUpperCase(), "PING MEH BRO!")
        );

        if (isPingMsg) bot.say(channel, "Pong!");
        
        var data = {
            channel:    channel,
            user:       user,
            message:    message
        };

        io.in(channel).emit('channel message', data);
    },

    // Joins a channel
    joinChannel: function (self, channel) {
        // Join the channel but also 
        // add it to the list of channels
        if (!arrContains(chnls, channel)) 
            chnls.push(channel);
        
        bot.join(channel);

        console.log("Bot joined channel: " + channel);
    }
};

var handlerLCTV = {
    evtOnline: function (data) {
        console.log("[LCTV.js] Successfully connected to LCTV's Servers");

        // Join every channel that is in the chnls list
        for (var x = 0; x < chnls.length; x++) {
            console.log("[LCTV.js] Joined channel: " + chnls[x]);
            bot.join(chnls[x]);
        }
    },
    
    evtError: function (e) {
        console.error("[LCTV.js] A error from the chat handler: ", e);
    },
    
    //////////////////////////////////////////////////////////////////
    evtChannelJoin: function (channel, nickname, stanza) {
        handlerSIO.onChannelJoin(handlerSIO, channel, nickname, stanza);
        console.log("[LCTV.js] (%s): %s joined.", channel, nickname);
    },

    evtChannelPart: function (channel, nickname, stanza) {
        handlerSIO.onChannelPart(handlerSIO, channel, nickname, stanza);
        console.log("[LCTV.js] (%s): %s left.", channel, nickname)
    },
    //////////////////////////////////////////////////////////////////

    evtMessage: function (nickname, channel, message, stanza) {
        handlerSIO.onChannelMessage(handlerSIO, channel, nickname, message, stanza);
        console.log("[LCTV.js] (%s): [%s: %s]", channel, nickname, message);
    }
};
/////////////////////////////////////////////////


function onModuleInit() {
	// Stop the timer if its still ticking
	    if(tmrcl != null) clearTimeout(tmrcl);
    
    // Setup the bot
        var cfg = require(auth);
        bot = new lctv(cfg);
    
    // Setup the events
        bot.on('online', handlerLCTV.evtOnline);
        bot.on('error',  handlerLCTV.evtError);
        bot.on('msg',    handlerLCTV.evtMessage);
        bot.on('join',   handlerLCTV.evtChannelJoin);
        bot.on('part',   handlerLCTV.evtChannelPart);

	// When finished loop through all the channels
	// every 10 seconds!
	    tmrcl = setTimeout(tmrcl_OnTick, 10000);
}

// Loop through all the channels and 
// find if any channels dont have a 
// user and close the connection to the 
// room!
function tmrcl_OnTick() {
	// TODO: Check SIO Rooms
    // TODO: Remove unused rooms

    // Loop
        tmrcl = setTimeout(tmrcl_OnTick, 10000);
}

function tmrcl_Cancel() {
	// Stops the timer from ticking
	clearTimeout(tmrcl);
	tmrcl = null; // Set to null to confirm that its been cancelled!
}

// Handles cross module commands
//      Pass null for no args
function recieveModuleCommand(Name, Args) {
    var useArgs = (Args != null);
    var lArgs = !useArgs ? -1 : Args.length;
    // TODO!

    if (Name == "channelJoin") {
        if (!useArgs) {
            if(DEBUG_MODE)
                console.log("[LCTV.js] rMC.cJ - Expecting args but none passed");
            return;
        } else if (lArgs < 0) {
            if (DEBUG_MODE)
                console.log("[LCTV.js] rMC.cJ - Args == -1 (NO ARGS)");
        }
        
        // (ARRAY)  Args[0] = Channel
        // (STRING) Args    = Channel
        var chnl = "";
        if (Object.prototype.toString.call(Args) === '[object Array]') 
             chnl = Args[0]; 
        else chnl = Args;
        handlerSIO.joinChannel(handlerSIO, chnl);
    }

    /*if(Name == "ioDisconnect") {
        
    } else if(Name == "ioJoin") {
        if(!useArgs) {
            console.log("[LCTV.js] rMC.iD: Expecting args but none passed!");
            return;
        } else if (Args.length != 1) {
            console.log("[LCTV.js] rMC.iJ: Invalid Arg count");
            return;
        }
		
        // Channel = Args[0]
        var channel = Args[1];
        
    } else if(Name == "sendMessage") {
        // To       = Args[0]
        // Message  = Args[1]
        
        // Channel Chat
		var to      = Args[1];
		var message = Args[2];
		//xmpp.send(to, message, false);
		console.log("[LCTV.js] Sending %s to %s", message, to);
    } //*/
}

// Our module exports
module.exports = {

    Module: {
        Name:        "server/LCTV.js",
        Handle:      "LCTV",
        Desc:        "LCTV Chat handler",
        SendCommand: recieveModuleCommand
    },

    InitModule: onModuleInit,
    SetBinds: function (bindObject) {
        auth  = "../../../config.json";
        lctv  = bindObject.Libs.LCTV;
        res   = bindObject;
        chnls = ['callumc']; // By default stalk me!
        io    = bindObject.Libs.SocketIO;

		// Recall the InitModule to resetup the listener
		onModuleInit();
    }
};
