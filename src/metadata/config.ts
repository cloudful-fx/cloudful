export interface IFunctionConfig {
    name?: string;
    entryPoint?: string;
    bindings: IBinding[];
    disabled?: boolean;
    excluded?: Boolean;
    methodName?: string;
    className?: string;
    beforeMiddleware?: Function[];
    afterMiddleware?: Function[];
}

export interface IBinding {
    name: string;
    type: string;
    direction: BindingDirection;
    index?: number;
    exclude?: boolean;
    [id: string]: any;
}

export type BindingDirection = "in" | "out" | "inout";
