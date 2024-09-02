#!/usr/bin/env node

const { program } = require("commander");
const { version } = require("./package.json");

console.log("npm-packs", version);

program.version(version, "-v, --version", "Output the current version");

program.parse(process.argv);
