import { Context, HttpContext, IFunctionRequest } from "azure-functions-typescript";
import { AfterFunc, BeforeFunc, HttpBinding, HttpTrigger } from "../../../src/index";

function before(context: Context | any) {
    this.beforeCalled++;
    context.next();
}

function after(context: Context | any) {
    this.afterCalled++;
    context.next();
}

function B(context: Context | any) {
    this.callArray.push("B");
    context.next();
}

export class MiddlewareTests {
    public beforeCalled: number = 0;
    public afterCalled: number = 0;
    public functionCalled: number = 0;

    public callArray: any[] = [];

    public noMiddleware(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    @BeforeFunc(before)
    public oneBeforeMiddleware(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    @BeforeFunc(before)
    @BeforeFunc(before)
    public twoBeforeMiddleware(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    @AfterFunc(after)
    public oneAfterMiddleware(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    @AfterFunc(after)
    @AfterFunc(after)
    public twoAfterMiddleware(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    @BeforeFunc(before)
    @AfterFunc(after)
    public oneAfterOneBeforeMiddleware(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    @BeforeFunc(before)
    @AfterFunc(after)
    @BeforeFunc(before)
    @AfterFunc(after)
    public twoAfterTwoBeforeMiddleware(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    // TODO: Should think hard about if this is a good thing to support...
    @BeforeFunc("A") // Because A is defined in the class, we cannot directly reference it before hand
    @AfterFunc(B)
    public AThenB(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    @BeforeFunc(B)
    @BeforeFunc(B)
    @AfterFunc(MiddlewareTests.prototype.A) // can also use prototype
    public BBThenA(context: Context | any, @HttpTrigger() req: IFunctionRequest) {
        this.functionCalled++;
        context.next(null, this);
    }

    private A(context: Context | any) {
        this.callArray.push("A");
        context.next();
    }
}
