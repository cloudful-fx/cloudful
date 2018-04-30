import { Context, HttpContext, IFunctionRequest } from "azure-functions-typescript";

export class MockContext {
    public invocationId: string;
    public bindingData: any[] = [];
    public bindings: any[] = [];
    public executionContext: any = {};

    constructor(functionName: string, private $done: any, private $logger?: any) { 
        this.executionContext.functionName = functionName;
    }

    public done(err: any, $return: any) {
        this.$done(err, $return);
    }

    public log(message: any, ...more: any[]) {
        if (this.$logger) {
            this.$logger.apply(this, [message, ...more]);
        } else {
            console.log(message, ...more);
        }
    }
}