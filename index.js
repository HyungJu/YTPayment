var PushBullet = require('pushbullet');
var pusher = new PushBullet('o.R9jaHVgoGdOwjmD31xPdPCRD8B9ITrs7');
 
var stream = pusher.stream();


let re =  /\[Web발신\]\n\(KDB\)성형주님\n020\*\*\*\*4566328\n입금\n(\d)원\n([a-z가-힣]*)\n([0-2][0-9]:[0-5][0-9]:[0-5][0-9])/
console.log(re.exec("[Web발신]\n(KDB)성형주님\n020****4566328\n입금\n1원\n성형주\n18:42:00"))

stream.connect();

stream.on('push', function(message){
    if(message.type == 'sms_changed' ){
       // console.log("sms");
        let re =  /\[Web발신\]\n\(KDB\)성형주님\n020\*\*\*\*4566328\n입금\n(\d*)원\n([a-z가-힣]*)\n([0-2][0-9]:[0-5][0-9]:[0-5][0-9])/g
        let res = re.exec(message.notifications[0].body); 
        var amount = res[1]
        var sender = res[2]
        var timestamp = message.notifications[0].timestamp
        var message = ""

        console.log("입금 확인됨!"+amount+sender+timestamp)
    }else if(message.type=='mirror' && message.package_name == 'viva.republica.toss'){
        //Toss Message Detected 
        let re = /([a-zA-Z가-힣]*)님이 (\d*)원을 송금했습니다\. '([\S\s]*)'/
        let res  = re.exec(message.body)
        var sender =   res[1]
        var amount = res[2]
        var message = res[3]
        var timestamp = new Date().getTime()
        console.log("입금 확인됨!"+amount+sender+timestamp+message)

    }
});


