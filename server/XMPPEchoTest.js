var xmpp = require("simple-xmpp");

function init() {
    var argv = process.argv;
    
    var options = {
        jid         : argv[2],
        password    : argv[3],
        host        : argv[4],
        nick        : argv[2].substr(0, argv[2].indexOf('@')),
    }; 
    
    xmpp.on('online', function () {
        console.log('Yes, I\'m connected!');
        xmpp.join('test@conference.' + options.host + '/' + options.nick);
    });
    
    xmpp.on('groupchat', function (conference, from, message, stamp) {
        console.log('%s says %s on %s', from, message, conference);
        if (from != options.nick)
            xmpp.send(conference, from + ': echo: ' + message, true);
    });
    
    xmpp.on('error', function (err) {
        console.error(err);
    });
    
    xmpp.connect({
        jid         : options.jid,
        password    : options.password,
        host        : options.host,
        port        : 5222
    });
}

init();