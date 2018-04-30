import { Binding, BindingDirection, IBinding } from "../index";

export interface IQueueTriggerConfig {
    name: string;
    queueName: string;
    connection?: string;
}

export function QueueTrigger(nameOrConfig?: string | IQueueTriggerConfig, queueName?: string) {
    let config: IBinding;
    if (typeof nameOrConfig === "string") {
        config = {
            name: nameOrConfig,
            type: "queueTrigger",
            direction: "in",
        };
    } else {
        config = {
            name: nameOrConfig.name,
            type: "queueTrigger",
            direction: "in",
            queueName: nameOrConfig.queueName,
        };
        if (nameOrConfig.connection) {
            config.connection = nameOrConfig.connection;
        }
    }
    return Binding(config);
}

export class QueueTriggerBinding implements IBinding {
    public type = "queueTrigger";
    public direction: BindingDirection = "in";
    public name: string;
    public queueName: string;
    public connection: string;
    constructor(queueName: string, connection?: string, name?: string) {
        this.name = name;
        this.connection = connection;
        this.queueName = queueName;
    }
}

// Queue Out

// tslint:disable-next-line:max-classes-per-file
export class QueueBinding implements IBinding {
    public type = "queue";
    public direction: BindingDirection = "out";
    public name: string;
    constructor(name?: string) {
        this.name = name;
    }
}
