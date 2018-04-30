import * as debug from "debug";
import * as path from "path";
import { IBinding } from "../index";
import { FunctionHost } from "../metadata";
import { IFunctionConfig } from "../metadata/";
import { FileHelper } from "../utils";

const log = debug("functs:build");

export interface IBuildConfig {
    projectRoot?: string;
    entryFile?: string;
    entryPoint?: string;
    outputFolderName?: string;
}

export async function build(config?: IBuildConfig) {
    // Defaults
    if (config.projectRoot === undefined) {
        config.projectRoot = "./";
    }
    if (config.entryFile === undefined) {
        config.entryFile = "./";
    }
    if (config.entryPoint === undefined) {
        config.entryPoint = "default";
    }
    if (config.outputFolderName === undefined) {
        config.outputFolderName = ".func-ts";
    }
    log("Config object: %O", config);

    // Create output directory
    const outputFolderPath = path.join(process.cwd(), config.projectRoot, config.outputFolderName);
    if (await FileHelper.exists(outputFolderPath)) {
        log("Deleting directory: %s", outputFolderPath);
        await FileHelper.rimraf(outputFolderPath);
    }
    log("Creating output directory: %s", outputFolderPath);
    await FileHelper.mkdir(outputFolderPath);

    // Get Function Config
    const packagePath = path.relative(__dirname, path.join(config.projectRoot, config.entryFile));
    log("Loading FunctionHost from %s", packagePath);
    const host = require(packagePath)[config.entryPoint];
    const fxs: IFunctionConfig[] = host.getConfig();

    // Create entry point file
    log("Creating index.js in output directory");
    const content = generateEntryFileContents(
        path.relative(outputFolderPath, path.join(config.projectRoot, config.entryFile)).replace(/\\/gi, "\\\\")
        , config.entryPoint);
    await FileHelper.writeFileUtf8(path.join(outputFolderPath, "index.js"), content);

    // Create functions + function.json
    for (const fx of fxs) {
        const functionPath = path.join(config.projectRoot, fx.entryPoint);
        const fxjson: any = fx;
        fxjson.scriptFile = `../${config.outputFolderName}/index.js`;
        fxjson.bindings = fxjson.bindings.filter((b: IBinding) => !b.exclude);
        delete fxjson.methodName;
        delete fxjson.className;
        delete fxjson.name;
        log("Creating directory for %s.%s at %s", fx.className, fx.name, functionPath);
        await FileHelper.mkdir(functionPath);
        log("Creating function.json for %s.%s", fx.className, fx.name);
        log("%O", fxjson);
        await FileHelper.writeFileUtf8(path.join(functionPath, "function.json"), JSON.stringify(fx, null, " "));
    }
}

function generateEntryFileContents(entryFile: string, entryPoint: string): string {
    return `module.exports = require("${entryFile}")["${entryPoint}"].listen()`;
}
