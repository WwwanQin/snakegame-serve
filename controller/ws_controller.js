const ws = require('nodejs-websocket')
var wsserver;
const xAtoms = 20;
const yAtoms = 15;
const height = 20;
const width = 20;
// 客户端ID
const startQueue = new Set();
// 食物触发的次数
let foodIndex = 0;
// 处理所有事件的集中的对象数组
const bundleFunction = [
    // 等待所有玩家连接
    {
        type: 'gameStart',
        fn: (sendMessage,callBackFunction) => {
            startQueue.add(sendMessage.id);
            if(startQueue.size == 1){
                callBackFunction(wsserver,JSON.stringify(
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
                callBackFunction(wsserver,JSON.stringify(
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
    },
    // 获取蛇运动的方位
    {
        type: 'snakeRun',
        fn: (sendMessage,callBackFunction) => {
            console.log(`广播蛇的方位${sendMessage.position}`);
            callBackFunction(wsserver,JSON.stringify(
                    {
                        type:'snakeRun',
                        message: sendMessage.position,
                    }
                )
            );
        }
    },
    // 判断是否吃到了食物
    {
        type: 'eatFood',
        fn: (sendMessage,callBackFunction) => {
            foodIndex ++ ;
            if(foodIndex == 1){
                const xDistance = Math.floor(Math.random() * xAtoms);
                const yDistance = Math.floor(Math.random() * yAtoms);
                callBackFunction(wsserver,JSON.stringify(
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
    },
    // 结束暂停开始游戏
    {
        type: 'start',
        fn: (sendMessage,callBackFunction) => {
            callBackFunction(wsserver,JSON.stringify(
                {
                    type: 'start'
                }
            ));
        }
    },
    // 暂停游戏
    {
        type: 'pause',
        fn: (sendMessage,callBackFunction) => {
            callBackFunction(wsserver,JSON.stringify(
                {
                    type: 'pause'
                }
            ))
        }
    }
]
class wbServe{
    constructor(port){
        this.port = port   
        wsserver = ws.createServer(conn => {
            conn.on('text',str => {
                let sendMessage = JSON.parse(str);
                console.log(sendMessage);
                console.log(bundleFunction.filter(ele => ele.type == sendMessage.message)[0]);
                bundleFunction.filter(ele => ele.type == sendMessage.message)[0].fn(sendMessage,broadcast);
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
        }).listen(8080);
        // 广播消息
        function broadcast(server,msg){
            server.connections.forEach(conn => {
                conn.sendText(msg)
            })
        }
        console.log(`服务器开启，地址是：${this.port}`);
    }
}
module.exports = {
    wbServe
}