module.exports = {
    // 处理蛇的运动
    snake: class{
        constructor(wsserver,sendMessage,callBackFunction){
            this.wsserver = wsserver;
            this.sendMessage = sendMessage;
            this.callBackFunction =callBackFunction;
        }
        run(){
            this.callBackFunction(this.wsserver,JSON.stringify(
                    {
                        type:'snakeRun',
                        message: this.sendMessage.position,
                    }
                )
            );
        }
    }
}