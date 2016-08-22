// Stores every module that is loaded
// Allows cross module talk!
var modules;
var fs;

// Options
var XMPPServer = {
    Address: "127.0.0.1",
    Port:    5222,
}

var XMPPCreditentials = {
    Username:   "test@localhost",
    Password:   "test",

    ReadFile:   false,
    fUsername:  "Z:/SuperSecretUserCreditentials.txt",
    fPassword:  "Z:/SuperSecretPasswodardo.txt",
}


// Handles cross module commands
//      Pass null for no args
function recieveModuleCommand(Name, Args) {
    var useArgs = (Args != null);

    // TODO: Apply same structure as used on Console.JS
    if(Name == "getUsername")   return XMPPCreditentials.Username;
    if(Name == "getPassword")   return XMPPCreditentials.Password;

    if(Name == "getHost")       return XMPPServer.Address;
    if(Name == "getPort")       return XMPPServer.Port;
}

// Our module exports
module.exports = {

    Module: {
        Name:   "server/Authentication.js",
        Handle: "Config",
        Desc:   "Stores sensitive data such as Passwords that we stole MEWHAHAA",
        SendCommand: recieveModuleCommand
    },

    InitModule: function () { 
        // If we are reading the username and password from a file
        if (XMPPCreditentials.ReadFile) {
            // Read the files via sync, so the thread is blocked and waits for the file to be
            // finished reading
            XMPPCreditentials.Username = fs.readFileSync(XMPPCreditentials.fUsername).toString();
            XMPPCreditentials.Password = fs.readFileSync(XMPPCreditentials.fPassword).toString();
        }

        console.log("[Config.js] InitModule: Loaded Auth - Username = " + XMPPCreditentials.Username);
    },

    SetBinds: function (bindObject) {
        fs      = bindObject.Libs.FileSystem;
        modules = bindObject;
    }
};
