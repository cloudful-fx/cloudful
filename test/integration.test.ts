import * as assert from "assert";
import { FunctionHost } from "../src/index";
import host from "./examples/Middleware/";
import { MiddlewareTests } from "./examples/Middleware/MiddlewareTest";
import { MockContext } from "./helpers/MockContext";

describe("middleware", function () {
    let functions: any = null;
    beforeEach(function () {
        functions = host.listen();
    });

    it("no middleware", function (cb) {
        const ctx = new MockContext("MiddlewareTests_noMiddleware", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.functionCalled === 1);
            assert($return.beforeCalled === 0);
            assert($return.afterCalled === 0);
            cb();
        });
        functions(ctx, null);
    });

    it("1 before", function (cb) {
        const ctx = new MockContext("MiddlewareTests_oneBeforeMiddleware", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.functionCalled === 1);
            assert($return.beforeCalled === 1);
            assert($return.afterCalled === 0);
            cb();
        });
        functions(ctx, null);
    });

    it("2 before", function (cb) {
        const ctx = new MockContext("MiddlewareTests_twoBeforeMiddleware", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.functionCalled === 1);
            assert($return.beforeCalled === 2);
            assert($return.afterCalled === 0);
            cb();
        });
        functions(ctx, null);
    });

    it("1 after", function (cb) {
        const ctx = new MockContext("MiddlewareTests_oneAfterMiddleware", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.functionCalled === 1);
            assert($return.beforeCalled === 0);
            assert($return.afterCalled === 1);
            cb();
        });
        functions(ctx, null);
    });

    it("2 after", function (cb) {
        const ctx = new MockContext("MiddlewareTests_twoAfterMiddleware", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.functionCalled === 1);
            assert($return.beforeCalled === 0);
            assert($return.afterCalled === 2);
            cb();
        });
        functions(ctx, null);
    });

    it("1 before and after", function (cb) {
        const ctx = new MockContext("MiddlewareTests_oneAfterOneBeforeMiddleware", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.functionCalled === 1);
            assert($return.beforeCalled === 1);
            assert($return.afterCalled === 1);
            cb();
        });
        functions(ctx, null);
    });

    it("2 before and after", function (cb) {
        const ctx = new MockContext("MiddlewareTests_twoAfterTwoBeforeMiddleware", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.functionCalled === 1);
            assert($return.beforeCalled === 2);
            assert($return.afterCalled === 2);
            cb();
        });
        functions(ctx, null);
    });

    it("ordering: A then B", function (cb) {
        const ctx = new MockContext("MiddlewareTests_AThenB", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.callArray[0] === "A");
            assert($return.callArray[1] === "B");
            cb();
        });
        functions(ctx, null);
    });

    it("ordering: B, B, then A", function (cb) {
        const ctx = new MockContext("MiddlewareTests_BBThenA", (err: any, $return: MiddlewareTests) => {
            if (err) { return cb(err); }
            assert($return.callArray[0] === "B");
            assert($return.callArray[1] === "B");
            assert($return.callArray[2] === "A");
            cb();
        });
        functions(ctx, null);
    });
});
