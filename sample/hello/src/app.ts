import { Context, HttpContext, IFunctionRequest, IFunctionResponse } from "azure-functions-typescript";
import { AfterFunc, BeforeFunc, FunctionHost, Http, HttpTrigger } from "@cloudful/cloudful";

class Hello {
    public hello(
        context: any,
        @HttpTrigger() req: IFunctionRequest,
        @Http() res: any) {
        const name = req.query.name || "world";
        context.res.send(`hello ${name}`);
    }
}

const host: FunctionHost = new FunctionHost();
host.register(Hello);

export default host;
