#!/usr/bin/env node

const { program } = require("commander");
const package_json = require("./package.json");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

program.version(
  package_json.version,
  "-v, --version",
  "Output the current version"
);

program
  .command("build")
  .description(
    "List all dependencies and create npm pack in the specified directory"
  )
  .option("-o, --output <directory>", "Specify the output directory", "packs")
  .action((options) => {
    const outputDir = path.isAbsolute(options.output)
      ? options.output
      : path.join(__dirname, options.output);

    const node_modules = path.join(__dirname, "node_modules");

    if (fs.existsSync(outputDir)) {
      const files = fs.readdirSync(outputDir);

      if (files.length > 0) {
        console.error(`Error: The directory ${outputDir} is not empty.`);
        process.exit(1);
      }
    } else {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const dirs = fs.readdirSync(node_modules).filter((dir) => {
      return !dir.startsWith(".");
    });

    let tgzCount = 0;

    dirs.forEach((dir) => {
      const modulePath = path.join(node_modules, dir);
      console.log(`Packing module: ${modulePath}`);

      try {
        const output = execSync("npm pack", { cwd: modulePath })
          .toString()
          .trim();
        const tgzFileName = output.split("\n").pop();
        const tgzFilePath = path.join(modulePath, tgzFileName);
        const destinationPath = path.join(outputDir, tgzFileName);

        if (fs.existsSync(tgzFilePath)) {
          fs.renameSync(tgzFilePath, destinationPath);
          console.log(`Moved ${tgzFileName} to ${outputDir}`);
          tgzCount++;
        }
      } catch (error) {
        console.error(`Error packing module: ${modulePath}`, error.message);
      }
    });
    console.log(`Total .tgz files created: ${tgzCount}`);
  });

program
  .command("clean")
  .description("Clean the specified output directory of .tgz files")
  .option("-o, --output <directory>", "Specify the directory to clean", "packs")
  .action((options) => {
    const outputDir = path.isAbsolute(options.output)
      ? options.output
      : path.join(__dirname, options.output);

    if (fs.existsSync(outputDir)) {
      let deletedCount = 0;
      fs.readdirSync(outputDir).forEach((file) => {
        const filePath = path.join(outputDir, file);
        if (path.extname(file) === ".tgz") {
          fs.unlinkSync(filePath);
          console.log(`Deleted ${filePath}`);
          deletedCount++;
        }
      });
      console.log(`Total .tgz files deleted: ${deletedCount}`);
    } else {
      console.log(`The directory ${outputDir} does not exist.`);
    }
  });

program.parse(process.argv);
