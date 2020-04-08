const ws = require('nodejs-websocket')
class wbServe{
    constructor(port){
        this.port = port   
        ws.createServer(conn => {
            conn.on('text',str => {
                new JSON(str)
                console.log(`得到的消息${str}`);
                conn.sendText(str);
            })
            conn.on('close',(code,reason) => {
                if(code == 1001){
                    console.log('有台客户端关闭了');
                }else{
                    console.log('异常关闭');
                }
            })
            conn.on('error',(code,reason) => {
            })
        }).listen(8080) 
        console.log('服务器开启');
    }
}
module.exports = {
    wbServe
}