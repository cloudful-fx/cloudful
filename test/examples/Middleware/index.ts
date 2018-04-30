import { Context, HttpContext, IFunctionRequest } from "azure-functions-typescript";
import { FunctionHost, Fx, HttpBinding, HttpTrigger, BeforeFunc, AfterFunc } from "../../../src/index";
import { MiddlewareTests } from "./MiddlewareTest";

const host: FunctionHost = new FunctionHost();
host.register(MiddlewareTests);

export default host;
