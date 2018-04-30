import * as debug from "debug";

const log = debug("functs:Middleware");

export class Middleware {

    constructor(private fn: Function,
                private before: Function[],
                private after: Function[],
                private that: any = null) { }

    // todo: context: any is lazy
    public listen() {
        return (context: any, ...inputs: any[]) => {
            this.handle(context, ...inputs);
        };
    }

    private handle(context: any, ...inputs: any[]) {
        log("handle called");
        let index: number = 0;
        let stack: Function[] = [];

        const that = this;

        stack.push(...this.before);
        stack.push(this.fn);
        stack.push(...this.after);

        let ctx = context;
        let ins = inputs;

        let origDone = context.done;
        let isDone = false;
        let done = (err?: any, $return?: any) => {
            log("done called");
            if (isDone) { return; };
            isDone = true;

            if (ctx.$return && !$return) {
                $return = ctx.$return;
            }

            context = ctx;
            try {
                origDone.apply(context, [err, $return]);
            } catch (e) {
                origDone.apply(context, [e]);
            }
        };
        ctx.done = done;

        function next(err?: Error, $return?: any): any {
            log("next called");
            const layer = stack[index++];
            const error = err;
            ctx.next = next;

            if ($return) {
                log("$return set");
                ctx.$return = $return;
            }

            // return if no new layer
            if (!layer) {
                done(error);
                return;
            }

            if (error) {
                done(error);
                return;
            }

            // try next layer, return
            try {
                return layer.apply(that.that, [ctx, ...ins]);
            } catch (e) {
                return next(e);
            }
        }

        next();
    }
}
