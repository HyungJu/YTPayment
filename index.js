const Config = require('./config.js')
const PushBullet = require('pushbullet');
const pusher = new PushBullet(Config.api_key);
const stream = pusher.stream();
const request = require('request')


function payment_received(from, amount, sender, timestamp, message = null){
    let options = {
        uri : Config.uri,
        method : 'POST',
        form: {
            'from' : from,
            'amount' : amount,
            'sender': sender,
            'timestamp': timestamp,
            'message': message
        }
    }
  
    try{
        request(options, null, (error)=> {
            throw new Error('이상한 에러가 발생했어')
        })
    }catch (e){
        console.log(e)
    }
    
  
}





let re =  /\[Web발신\]\n\(KDB\)성형주님\n020\*\*\*\*4566328\n입금\n(\d)원\n([a-z가-힣]*)\n([0-2][0-9]:[0-5][0-9]:[0-5][0-9])/

stream.connect();

stream.on('push', function(message){
    if(message.type == 'sms_changed' ){
       // console.log("sms");
        let re =  /\[Web발신\]\n\(KDB\)성형주님\n020\*\*\*\*4566328\n입금\n(\d*)원\n([a-z가-힣]*)\n([0-2][0-9]:[0-5][0-9]:[0-5][0-9])/g
        let res = re.exec(message.notifications[0].body); 
        var amount = res[1]
        var sender = res[2]
        var timestamp = message.notifications[0].timestamp
        
        payment_received(1, amount, sender, timestamp)
    }else if(message.type=='mirror' && message.package_name == 'viva.republica.toss'){
        //Toss Message Detected 
        let re = /([a-zA-Z가-힣]*)님이 (\d*)원을 송금했습니다\. '([\S\s]*)'/
        let res  = re.exec(message.body)
        var sender =   res[1]
        var amount = res[2]
        var message = res[3]
        var timestamp = new Date().getTime()

        payment_received(2, amount,sender, timestamp, message)

    }
});


