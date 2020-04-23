module.exports = {
    unsuspend: class{
        constructor(wsserver,sendMessage,callBackFunction){
            this.wsserver = wsserver;
            this.sendMessage = sendMessage;
            this.callBackFunction = callBackFunction;
        }
        again(){
            this.callBackFunction(this.wsserver,JSON.stringify(
                {
                    type: 'start'
                }
            ));
        }
    }
}