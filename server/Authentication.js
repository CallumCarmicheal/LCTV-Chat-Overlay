// Stores every module that is loaded
// Allows cross module talk!
var modules;
var fs;

// Options
var XMPPServer = {
    Address:    "",
    Port: 0,
}

var XMPPCreditentials = {
    Username:   "User",
    Password:   "Password",

    ReadFile:   true,
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
        Name: "server/Authentication.js",
        Desc: "Stores sensitive data such as Passwords that we stole MEWHAHAA",
        SendCommand: recieveModuleCommand
    },

    InitModule: function () { 
        if (XMPPCreditentials.ReadFile) {
            XMPPCreditentials.Username = fs.readFileSync(XMPPCreditentials.fUsername).toString();
            XMPPCreditentials.Password = fs.readFileSync(XMPPCreditentials.fPassword).toString();
        }

        console.log("");
    },

    SetBinds: function (bindObject) {
        fs      = bindObject.Libs.FileSystem;
        modules = bindObject;
    }
};
