export class HandleError extends Error{
    constructor(error) {
        super(error.Message);
    
        this.name = error.Name;
        this.code = error.Code;
        this.stackTrace = error.stack_trace;
      }

    static getMessage(){
        return this.message;
     }
    
      get message() {
        return this.message;
      }
}