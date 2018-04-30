import * as debug from "debug";
import "reflect-metadata";
import { BindingDirection, IBinding, IFunctionConfig } from "./config";

const log = debug("functs:decorators");

const functionsKey = Symbol.for("functions");
const functionListKey = Symbol.for("functionlist");

export function Binding(config: IBinding): any {
    return (target: Object, propertyKey: string, parameterIndex: number) => {
        log("(Parameter) Binding called");
        let fx: IFunctionConfig = Reflect.getMetadata(functionsKey, target, propertyKey) ||
            {
                name: propertyKey,
                excluded: false,
                disabled: false,
                bindings: [],
                methodName: propertyKey,
                className: target.constructor.name,
                beforeMiddleware: [],
                afterMiddleware: [],
                entryPoint: generateEntryPoint(propertyKey, target.constructor.name),
            };

        config.name = config.name || `arg${parameterIndex}`;
        config.index = parameterIndex;
        fx.bindings.push(config);
        Reflect.defineMetadata(functionsKey, fx, target, propertyKey);
    };
}

export function Fx(config: IFunctionConfig): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        log("(Function) Fx called");
        let fx: IFunctionConfig = Reflect.getMetadata(functionsKey, target, propertyKey) ||
            {
                name: propertyKey,
                excluded: false,
                disabled: false,
                bindings: [],
                methodName: propertyKey,
                className: target.constructor.name,
                beforeMiddleware: [],
                afterMiddleware: [],
                entryPoint: generateEntryPoint(propertyKey, target.constructor.name),
            };

        // Initialize object
        if (config.name !== undefined) {
            fx.name = config.name;
        }

        if (config.excluded !== undefined) {
            fx.excluded = config.excluded;
        }

        if (config.disabled !== undefined) {
            fx.disabled = config.disabled;
        }

        if (config.bindings !== undefined) {
            fx.bindings = fx.bindings.concat(config.bindings);
        }

        // If it is an excluded function, we should ignore it.
        if (config.excluded === true) {
            return;
        }

        // It needs to have a trigger in it
        /*
        TODO
        if (!validateBindings(config.bindings)) {
            // no op for now
        }
        */

        Reflect.defineMetadata(functionsKey, fx, target, propertyKey);
    };
}

export function BeforeFunc(middleware: Function | string): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        log("(Function) BeforeFunc called");
        let fx: IFunctionConfig = Reflect.getMetadata(functionsKey, target, propertyKey) ||
            {
                name: propertyKey,
                excluded: false,
                disabled: false,
                bindings: [],
                methodName: propertyKey,
                className: target.constructor.name,
                beforeMiddleware: [],
                afterMiddleware: [],
                entryPoint: generateEntryPoint(propertyKey, target.constructor.name),
            };

        if (typeof (middleware) === "string") {
            middleware = target[middleware as string];
        }

        fx.beforeMiddleware.push(middleware as Function);

        Reflect.defineMetadata(functionsKey, fx, target, propertyKey);
    };
}

export function AfterFunc(middleware: Function | string): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        log("(Function) AfterFunc called");
        let fx: IFunctionConfig = Reflect.getMetadata(functionsKey, target, propertyKey) ||
            {
                name: propertyKey,
                excluded: false,
                disabled: false,
                bindings: [],
                methodName: propertyKey,
                className: target.constructor.name,
                beforeMiddleware: [],
                afterMiddleware: [],
                entryPoint: generateEntryPoint(propertyKey, target.constructor.name),
            };

        if (typeof (middleware) === "string") {
            middleware = target[middleware as string];
        }

        fx.afterMiddleware.push(middleware as Function);

        Reflect.defineMetadata(functionsKey, fx, target, propertyKey);
    };
}

function generateEntryPoint(functionName: string, className: string) {
    return `${className}_${functionName}`;
}
