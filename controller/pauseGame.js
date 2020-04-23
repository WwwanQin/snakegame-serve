module.exports = {
    pauseGame: class{
        constructor(wsserver,sendMessage,callBackFunction){
            this.wsserver = wsserver;
            this.sendMessage = sendMessage;
            this.callBackFunction = callBackFunction;
        }
        pause(){
            this.callBackFunction(this.wsserver,JSON.stringify(
                {
                    type: 'pause'
                }
            ))
        }
    }
}