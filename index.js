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
  .option(
    "-i, --ignore <packages>",
    "Specify packages to ignore (comma-separated)",
    ""
  )
  .action((options) => {
    const outputDir = path.isAbsolute(options.output)
      ? options.output
      : path.join(process.cwd(), options.output);

    const node_modules = path.join(process.cwd(), "node_modules");

    const defaultIgnorePackages = ["npm-packs"];
    const ignorePackages = options.ignore
      ? defaultIgnorePackages.concat(options.ignore.split(","))
      : defaultIgnorePackages;

    const dirs = fs.readdirSync(node_modules).filter((dir) => {
      return !dir.startsWith(".") && !ignorePackages.includes(dir);
    });

    if (dirs.length === 0) {
      console.log("No modules to pack.");
      process.exit(0);
    }

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
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          fs.renameSync(tgzFilePath, destinationPath);
          console.log(`Moved ${tgzFileName} to ${outputDir}`);
          tgzCount++;
        }
      } catch (error) {
        console.error(`Error packing module: ${modulePath}`, error.message);
      }
    });

    if (tgzCount === 0 && fs.existsSync(outputDir)) {
      fs.rmdirSync(outputDir);
      console.log(`No .tgz files were created. Removed empty directory: ${outputDir}`);
    } else {
      console.log("-----");
      console.log(`Total .tgz files created: ${tgzCount}`);
    }
  });

program
  .command("clean")
  .description("Clean the specified output directory of .tgz files")
  .option("-o, --output <directory>", "Specify the directory to clean", "packs")
  .action((options) => {
    const outputDir = path.isAbsolute(options.output)
      ? options.output
      : path.join(process.cwd(), options.output);

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

      if (deletedCount === 0) {
        console.log("No .tgz files found to delete.");
      } else {
        console.log("-----");
        console.log(`Total .tgz files deleted: ${deletedCount}`);
      }
    } else {
      console.log(`The directory ${outputDir} does not exist.`);
    }
  });

program.parse(process.argv);
