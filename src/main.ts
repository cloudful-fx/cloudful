#!/usr/bin/env node

import * as program from "commander";
import * as winston from "winston";
import { build, IBuildConfig } from "./build/index";

async function runCli() {
    const p = program
        .version("0.0.1");

    p.command("build <path>")
        .description("Build your cloudful project")
        .option("-f, --entryFile <path>", "Path to entry file ('./index.js' by default)")
        .option("-p, --entryPoint <name>", "Name of object that contains your classes ('default' by default)")
        .option("-o, --outputFolderName <name>", "Name of the output folder ('.functs' by default)")
        .action(buildCmd);

    p.parse(process.argv);

    if (!process.argv.slice(2).length) {
        p.help();
    }
}

async function buildCmd(name: string, options: any) {
    const config: IBuildConfig = {};
    if (name) {
        config.projectRoot = name;
    }
    if (options.entryFile) {
        config.entryFile = options.entryFile;
    }
    if (options.entryPoint) {
        config.entryPoint = options.entryPoint;
    }
    if (options.outputFolderName) {
        config.outputFolderName = options.outputFolderName;
    }
    winston.info("Building project: Starting...");
    await build(config);
    winston.info("Builing project: Completed!");
}

runCli();
