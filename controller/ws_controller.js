const ws = require('nodejs-websocket')
const { start } = require('./startController');
const { snake } = require('./snakeRunController');
const { unsuspend } = require('./unsuspend');
const { pauseGame } = require('./pauseGame');
var wsserver;
const xAtoms = 20;
const yAtoms = 15;
const height = 20;
const width = 20;
// 客户端ID
const startQueue = new Set();
// 食物触发的次数
let foodIndex = 0;
// 实例化启动游戏的类
const startGame = new start(startQueue,xAtoms,yAtoms,height,width);
// 处理所有事件的集中的对象数组
const bundleFunction = [
    // 等待所有玩家连接
    {
        type: 'gameStart',
        fn: (sendMessage,callBackFunction) => {
            startGame.setOtherObj(wsserver,sendMessage,callBackFunction);
            startGame.begin();
        }
    },
    // 获取蛇运动的方位
    {
        type: 'snakeRun',
        fn: (sendMessage,callBackFunction) => {
            const snakeRun = new snake(wsserver,sendMessage,callBackFunction);
            snakeRun.run();
        }
    },
    // 判断是否吃到了食物
    {
        type: 'eatFood',
        fn: (sendMessage,callBackFunction) => {
            foodIndex ++;
            if(foodIndex == 2){
                foodIndex = 0;
            }
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
        }
    },
    // 结束暂停开始游戏
    {
        type: 'start',
        fn: (sendMessage,callBackFunction) => {
            const un = new unsuspend(wsserver,sendMessage,callBackFunction);
            un.again();
        }
    },
    // 暂停游戏
    {
        type: 'pause',
        fn: (sendMessage,callBackFunction) => {
            const pa = new pauseGame(wsserver,sendMessage,callBackFunction);
            pa.pause();
        }
    }
]
class wbServe{
    constructor(port){
        this.port = port   
        wsserver = ws.createServer(conn => {
            conn.on('text',str => {
                let sendMessage = JSON.parse(str);
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
                console.log('连接出现异常');
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