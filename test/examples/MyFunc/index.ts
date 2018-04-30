import { Context } from "azure-functions-typescript";
import {
    AfterFunc,
    BeforeFunc,
    Binding,
    FunctionHost,
    Fx,
    HttpTrigger,
    HttpTriggerBinding,
    IBinding,
    IFunctionConfig,
} from "../../../src";

import * as jwt from "jsonwebtoken";

export class MyFunc {
    private myproperty = "Hello";
    private jwtSecret: string;

    constructor(jwtSecret: string) {
        // tslint:disable-next-line:no-console
        console.log("Constructor called");
        this.jwtSecret = jwtSecret || process.env.JWTSECRET;
    }

    private auth(context: Context | any) {
        jwt.verify(context.res.get("x-zumo-auth"), this.jwtSecret, {}, (err: any, token: any) => {
            if (err) {
                context.res.set("location", "/login").status(301).send();
                return;
            } else {
                context.token = token.payload;
                context.next();
            }
        });
    }

    private failedLogin(context: Context | any, err: Error) {
        context.res.status(401).json({
            message: "Failed to log you in...",
            error: err.message,
        });
    }

    private fetchUserInfo(context: Context | any) {
        if (context.token) {
            // fetch user info from db
            context.user = {};
            context.next();
        } else {
            context.next(new Error("Could not find user...."));
        }
    }

    @BeforeFunc(this.auth)
    @BeforeFunc(this.fetchUserInfo)
    private protected(context: Context, @HttpTrigger("req") req: any) {
        context.log("I'm protected by middleware!");
        context.done();
    }

    @AfterFunc(this.failedLogin)
    private login(context: Context | any, @Binding(new HttpTriggerBinding()) req: any) {
        context.log("I'm giving a user a token");
        /*
            DO WORK TO DETERMINE IF USER SHOULD GET TOKEN... 
            OR BETTER YET, USE A SERVICE THAT MINTS TOKENS FOR YOU...
            THIS ISN'T A GOOD EXAMPLE OF JWT BEST PRACTICES
            JUST USING JWTs IN GENERAL
        */
        const options: object = { sub: "protected" };
        jwt.sign(options, this.jwtSecret, {}, (err: any, token: any) => {
            if (err) {
                context.next(err);
            } else {
                context.res.status(200).json({
                    token,
                });
            }
        });
    }

    @Fx({
        name: "herobrine",
        bindings: [new HttpTriggerBinding("req")],
    })
    private myMethod(context: Context, req: any) {
        context.log("My method called");
        context.done();
    }

    @Fx({
        excluded: true,
        bindings: [{
            name: "item",
            type: "queueTrigger",
            direction: "in",
            connection: "AzureWebJobsStorage",
        }],
    })
    private foobar(context: Context) {
        context.log("foobar");
        context.done();
    }
}

const host: FunctionHost = new FunctionHost();
host.register(MyFunc);

export default host;
