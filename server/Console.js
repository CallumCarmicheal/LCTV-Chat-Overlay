// Stores every module that is loaded
// Allows cross module talk!
var modules;

var consoleCommands = [
    {
        name:   'echo',

        // Called with parameters
        // eg. globalMessage(hell"o, "world")
        pHandler: function(self, args) {
            console.log(args);
        },

        // Called without parameters
        // eg. globalMessage
        cHandler: function(self) {
            console.log("This command requires parameters!");
        }
    }, {
        name:   'exit',
        pHandler: function(self, args)  { process.exit(); },
        cHandler: function(self)        { process.exit(); }
    }

    // TODO: Make a command to call other modules
];


// Handles STDIN from the console
function processConsoleCommand(cmdStr) {
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
    var commandIndex = 0;
    while(consoleCommands[commandIndex].name != cmdName) {
        commandIndex ++;

        if(commandIndex == consoleCommands.length) {
            console.log("Console Command not found");
            return;
        }
    }

    if(useParams)
         // Call the pHandler method
         consoleCommands[commandIndex].pHandler(consoleCommands, args);
    else consoleCommands[commandIndex].cHandler(consoleCommands);
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
        Name: "server/Console.js",
        Desc: "Handles console input",
        SendCommand: recieveModuleCommand
    },

    InitModule: function() {
        process.stdin.on('data', processConsoleCommand);
    },

    SetBinds: function(bindObject) {
        modules = bindObject;
    }

};
