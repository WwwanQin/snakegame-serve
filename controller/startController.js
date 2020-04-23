module.exports = {
    // 处理游戏暂停或开始
    start: class {
        constructor(startQueue,xAtoms,yAtoms,height,width){
            this.startQueue = startQueue;
            this.xAtoms = xAtoms;
            this.yAtoms = yAtoms;
            this.height = height;
            this.width = width;
        }
        setOtherObj(wsserver,sendMessage,callBackFunction){
            this.wsserver = wsserver;
            this.sendMessage = sendMessage;
            this.callBackFunction = callBackFunction;
        }
        begin(){
            this.startQueue.add(this.sendMessage.id);
            if(this.startQueue.size == 1){
                this.callBackFunction(this.wsserver,JSON.stringify(
                        {
                            type:'waiting',
                            message:`等待连接中，目前连接数：${this.startQueue.size} / 2`,
                        }
                    )
                ); 
            }
            if(this.startQueue.size == 2){
                const xDistance = Math.floor(Math.random() * this.xAtoms);
                const yDistance = Math.floor(Math.random() * this.yAtoms);
                this.callBackFunction(this.wsserver,JSON.stringify(
                        {
                            type:'startGame',
                            message:`已连接到游戏，目前连接数：${this.startQueue.size} / 2`,
                            xDistance: xDistance * this.width,
                            yDistance: yDistance * this.height
                        }
                    )
                );
                this.startQueue.clear();
            }
        }
    }
}