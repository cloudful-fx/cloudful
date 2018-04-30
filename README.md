# cloudful

`cloudful` is a more optimistic way of building services on fully managed cloud services (aka serverless). The `cloudful` framework uses metadata backed types to generate all the information it needs to create services using fully managed cloud services, such as Azure Functions and Azure Cosmos DB. It is currently focused on Node.js and TypeScript/JavaScript developers. It uses some experimental features like [`system-metadata`](https://github.com/rbuckton/reflect-metadata) and [@decorators](http://www.typescriptlang.org/docs/handbook/decorators.html).

**🐉 This is an experimental project, both in terms of quality and direction. It might not work. It might not be the same type of project between minor releases (patches are safe) 🐉**

```typescript
import { Binding, FunctionHost, Fx, HttpTrigger, HttpTriggerBinding, IBinding, IFunctionConfig, } from "@cloudful/cloudful";

class MyFunc {
    private myhttp(context: Context, @HttpTrigger("req") req: any) {
        context.log("I'm an http function");
        context.done();
    }
}

const host: FunctionHost = new FunctionHost();
host.register(MyFunc);

export default host;
```

## Getting started

See the [hello world sample](./sample/hello) for a simple intro

* package.json

```json
{
  "dev-dependencies":{
    "@cloudful/cloudful":"*",
    "typescript":"*"
  },
  "build":"tsc && cloudful build ./lib"
}
```

* tsconfig.json

```json
{
  "compilerOptions": {
    "declaration": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "noImplicitAny": true,
    "outDir": "./lib",
    "preserveConstEnums": true,
    "removeComments": true,
    "target": "es6",
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "**/*-spec.ts"
  ]
}
```

* ./index.ts

```typescript
import { Binding, FunctionHost, Fx, HttpTrigger, HttpTriggerBinding, IBinding, IFunctionConfig, } from "@cloudful/cloudful";

class MyFunc {
    private myhttp(context: Context, @HttpTrigger("req") req: any) {
        context.log("I'm an http function");
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
```

## License

[MIT](LICENSE)
