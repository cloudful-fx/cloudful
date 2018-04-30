import { Context } from "azure-functions-typescript";
import * as debug from "debug";
import "reflect-metadata";
import { Middleware } from "../middleware/Middleware";
import { IFunctionConfig } from "./index";

const log = debug("functs:FunctionHost");

export class FunctionHost {
    private static listenerFactory(method: Function, config: IFunctionConfig, clazz?: any) {
        log("listener created");
        const middleware = new Middleware(method, config.beforeMiddleware, config.afterMiddleware, clazz);
        const listener = middleware.listen();
        return (context: any) => {
            log("listener called");
            const args: any[] = new Array(method.length);
            for (const binding of config.bindings) {
                if (binding.index !== undefined) {
                    if (binding.name === "req") {
                        args[binding.index] = context.req;
                    } else if (binding.name === "res") {
                        args[binding.index] = context.res;
                    } else {
                        args[binding.index] = context.bindings[binding.name];
                    }
                }
            }
            args.shift(); // remove the front of the array, since that's the context object
            listener(context, ...args);
        };
    }

    private static extractClassConfig(clazz: any): IFunctionConfig[] {
        const configs: IFunctionConfig[] = [];
        for (const prop of Object.getOwnPropertyNames(clazz.prototype)) {
            const values = Reflect.getMetadata(Symbol.for("functions"), clazz.prototype, prop);
            if (values) {
                configs.push(values);
            }
        }
        return configs;
    }

    private classes: any[];

    constructor() {
        this.classes = [];
    }

    public register(clazz: any) {
        this.classes.push(clazz);
    }

    public listen() {
        const endpoints: { [id: string]: any } = {};
        for (const clazz of this.classes) {
            const configs: IFunctionConfig[] = FunctionHost.extractClassConfig(clazz);
            const c = new clazz();
            for (const config of configs) {
                const endpointName = config.entryPoint || `${clazz.name}_${config.methodName}`;
                endpoints[endpointName] = FunctionHost.listenerFactory(c[config.methodName], config, c);
            }
        }
        return (context: any, ...inputs: any[]) => {
            endpoints[context.executionContext.functionName](context);
        };
    }

    public getConfig() {
        let config: IFunctionConfig[] = [];
        for (const clazz of this.classes) {
            config = config.concat(FunctionHost.extractClassConfig(clazz));
        }
        return config;
    }
}
