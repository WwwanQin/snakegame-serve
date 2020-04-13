const ws = require('nodejs-websocket')
var wsserver;
const xAtoms = 40;
const yAtoms = 30;
const height = 20;
const width = 20;
class wbServe{
    constructor(port){
        this.port = port   
        const startQueue = new Set();
        let foodIndex = 0;
        wsserver = ws.createServer(conn => {
            conn.on('text',str => {
                let sendMessage = JSON.parse(str);
                // 等待所有玩家连接
                if(sendMessage.message == 'gameStart'){
                    startQueue.add(sendMessage.id);
                    if(startQueue.size == 1){
                        broadcast(wsserver,JSON.stringify(
                                {
                                    type:'waiting',
                                    message:`等待连接中，目前连接数：${startQueue.size} / 2`,
                                }
                            )
                        ); 
                    }
                    if(startQueue.size == 2){
                        const xDistance = Math.floor(Math.random() * xAtoms);
                        const yDistance = Math.floor(Math.random() * yAtoms);
                        broadcast(wsserver,JSON.stringify(
                                {
                                    type:'startGame',
                                    message:`已连接到游戏，目前连接数：${startQueue.size} / 2`,
                                    xDistance: xDistance * width,
                                    yDistance: yDistance * height
                                }
                            )
                        );
                        startQueue.clear();
                    }
                }
                // 广播蛇的位置
                if(sendMessage.message == 'snakeRun'){
                    broadcast(wsserver,JSON.stringify(
                            {
                                type:'snakeRun',
                                message: sendMessage.position,
                            }
                        )
                    );
                }
                // 判断食物被吃
                if(sendMessage.message == 'eatFood'){
                    foodIndex ++ ;
                    if(foodIndex == 1){
                        const xDistance = Math.floor(Math.random() * xAtoms);
                        const yDistance = Math.floor(Math.random() * yAtoms);
                        broadcast(wsserver,JSON.stringify(
                                {
                                    type:'eatFood',
                                    xDistance: xDistance * width,
                                    yDistance: yDistance * height
                                }
                            )
                        );
                    }
                    if(foodIndex == 2){
                        foodIndex = 0;
                    }
                }
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
        function broadcast(server,msg){
            server.connections.forEach(conn => {
                conn.sendText(msg)
            })
        }
        console.log('服务器开启');
    }
}
module.exports = {
    wbServe
}