import { Binding, BindingDirection, IBinding } from "../index";

export interface IHttpTriggerConfig {
    name: string;
    route?: string;
    authLevel?: string;
}

export function HttpTrigger(nameOrConfig?: string | IHttpTriggerConfig) {
    let config: IBinding;
    if (nameOrConfig === undefined || nameOrConfig === null) {
        nameOrConfig = "req";
    }
    if (typeof nameOrConfig === "string") {
        config = {
            name: nameOrConfig,
            type: "httpTrigger",
            direction: "in",
        };
    } else {
        config = {
            name: nameOrConfig.name,
            type: "httpTrigger",
            direction: "in",
        };
        if (nameOrConfig.route) {
            config.route = nameOrConfig.route;
        }
        if (nameOrConfig.authLevel) {
            config.authLevel = nameOrConfig.authLevel;
        }
    }
    return Binding(config);
}

export function Http(nameOrConfig?: string | IHttpTriggerConfig) {
    let config: IBinding;
    if (nameOrConfig === undefined || nameOrConfig === null) {
        nameOrConfig = "res";
    }
    if (typeof nameOrConfig === "string") {
        config = {
            name: nameOrConfig,
            type: "http",
            direction: "out",
        };
    } else {
        config = {
            name: nameOrConfig.name,
            type: "http",
            direction: "out",
        };
        if (nameOrConfig.route) {
            config.route = nameOrConfig.route;
        }
        if (nameOrConfig.authLevel) {
            config.authLevel = nameOrConfig.authLevel;
        }
    }
    return Binding(config);
}

export class HttpTriggerBinding implements IBinding {
    public type = "httpTrigger";
    public direction: BindingDirection = "in";
    public name: string = "req";
    constructor(name?: string) {
        this.name = name;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class HttpBinding implements IBinding {
    public type = "http";
    public direction: BindingDirection = "out";
    public name: string = "res";
    constructor(name?: string) {
        if (this.name) {
            this.name = name;
        }
    }
}
