// Stores every module that is loaded
// Allows cross module talk!
var modules;

// Prototypes
var startsWith = function (text, str) {
    return !text.indexOf(str);
}



var consoleCommands = [
    {   name:   ['echo'],

        // Called with parameters
        // eg. globalMessage(hello, world) (NO QUOTES NEEDED)
        pHandler: function (self, args) {
            if (args.length == 1) console.log(args[0]);
            else                  console.log(args);
        },

        // Called without parameters
        // eg. globalMessage
        cHandler: function(self) {
            console.log("\n");
        }
    }, {
        name: ['exit'],
        pHandler: function (self, args) { console.log("exit"); process.exit(1); },
        cHandler: function (self)       { console.log("exit"); process.exit(1); }
    }, {
        name: ['cls', 'clear'], 
        pHandler: function (self, args) { process.stdout.write("\u001b[2J\u001b[0;0H"); },
        cHandler: function (self)       { process.stdout.write("\u001b[2J\u001b[0;0H"); }
    },

    // TODO: Make a command to call other modules
];

// Handles module calls
// example: mod.XMPPChat.sendMessage(args)
function processModuleCommand(cmdStr) {
    var str = "" + cmdStr;
    cmdStr = str.replace("mod.", "");

    var moduleName  = "",
        command     = cmdStr.toString().trim(),
        cmdName     = "",
        args        = [],
        useParams   = (command.indexOf('(') !== -1);
    
    // Split via '.'
    // [0] Module
    // [1] Rest of command
    var targs   = command.split('.');
    moduleName  = targs[0];
    command     = targs[1];

    // Arguments
    if (useParams) {
        // Create our command arguments
        var argsEnd = command.indexOf(")") !== -1 ? command.indexOf(')') : command.length;
        args = command.substring(command.indexOf('(') + 1, argsEnd);
        args = args.split(",");
        
        for (var x = 0; x < args.length; x++)
            args[x] = args[x].trim();

        // Used when calling a function with params
        // Eg...
        cmdName = command.substring(0, command.indexOf('('));
    } 
    
    // No Arguments
    else {
        cmdName = command;
    }

    // Check if command exists
    var found  = false;
    var keys   = Object.keys(modules.Modules);
    var object = "";
    for (var x = 0; x < keys.length; x++) {
        var key    = keys[x];
            object = modules.Modules[key].Module;

        if (object.Handle.indexOf(cmdName) > -1) {
            found = true;
            break;
        }
    }

    if (found) {
        // Call the function
        object.SendCommand(cmdName, args);
    } else {
        console.log("Module does not exist");
    }
}

// Handles STDIN from the console
function processConsoleCommand(cmdStr) {
    if (startsWith(cmdStr, "mod.")) return processModuleCommand(cmdStr);

    var cmdName     = "",
        command     = cmdStr.toString().trim(),
        args        = "",
        useParams   = (command.indexOf('(') !== -1);

    if(useParams) {
        // Create our command arguments
        var argsEnd = command.indexOf(")") !== -1 ? command.indexOf(')') : command.length;
        args = command.substring(command.indexOf('(') + 1, argsEnd);
        args = args.split(",");

        for(var x = 0; x < args.length; x++)
            args[x] = args[x].trim();


        // Used when calling a function with params
        // Eg...
        cmdName = command.substring(0, command.indexOf('('));
    } else {
        // This is when there are no braces
        // eg Just a simple call like
        // restart or exit etc.
        cmdName = command;
    }

    cmdName = cmdName.toLowerCase();
    
    

    // Check if command exists
    var x   = 0;
    var object  = consoleCommands[0];
    
    while (object.name.indexOf(cmdName) == -1) {
        x++;

        if (x >= consoleCommands.length) {
            console.log("Command does not exist");
            return;
        }

        object = consoleCommands[x];
    }

    if(useParams)
         // Call the pHandler method
         consoleCommands[x].pHandler(consoleCommands, args);
    else consoleCommands[x].cHandler(consoleCommands);
}

// Handles cross module commands
//      Pass null for no args
function recieveModuleCommand(Name, Args) {
    var useArgs = (Args != null);
    var name = Name.toLowerCase();

    if(useArgs)
        for(var x = 0; x < Args.length; x++)
            Args[x] = Args[x].trim();

    if(Name == "run" || Name == "exec") {
        if(useArgs) {
            if(Args.length > 0) {
                var name = Args[0] + "(";
                var larg = Args.slice(1, Args.length);
                var oArgs = "";
                for(var x = 0; x < args.length; x++)
                    oArgs += larg[x] + ",";

                // Remove trailing ","
                oArgs = oArgs.slice(0, oArgs.length -1);

                oArgs = name + oArgs + ")";
                processConsoleCommand(oArgs);
            } else {
                processConsoleCommand(Args[0])
            }
            //var aArgs = Args[0] Args.slice();
        }
    } else if(Name == "echo" || Name == "print") {
        if(useArgs) {
            if(Args.length > 0) {
                var name = "echo";
                var larg = Args;
                var oArgs = "";
                for(var x = 0; x < args.length; x++)
                    oArgs += larg[x] + ",";

                // Remove trailing ","
                oArgs = oArgs.slice(0, oArgs.length -1);

                oArgs = name + oArgs + ")";
                processConsoleCommand(oArgs);
            } else {
                processConsoleCommand(Args[0])
            }
        }
    }
}

// Our module exports
module.exports = {

    Module: {
        Name:   "server/Console.js",
        Handle: "Console",
        Desc:   "Handles console input",
        SendCommand: recieveModuleCommand
    },

    InitModule: function() {
        process.stdin.on('data', processConsoleCommand);
    },

    SetBinds: function(bindObject) {
        modules = bindObject;
    }

};
