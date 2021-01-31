#! /usr/bin/env node
/*
 * Copyright 2018 Adobe Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const cli = require("cli");
const package = require("./package.json");

const terms = {
  use: "https://www.adobe.com/legal/terms.html",
  dev: "http://www.adobe.com/go/developer-terms"
};

const sampleDirs = require("./commands/bootstrap").sampleDirs;
const sampleTypes = Object.keys(sampleDirs)
  .filter(el => el !== "default")
  .join(", ");


cli.enable("status", "version");
cli.setApp(package.name, package.version);

const commands = {
  bootstrap: `Create a new plugin scaffold: ${sampleTypes}. Optionally specify the name for your new plugin's directory.`,
  install: "Install a plugin in development mode",
  ls: "List all plugins in development mode",
  package: "Package a plugin",
  validate: "Validate a plugin's manifest",
  watch:
    "Watch a plugin directory. If no directory is specified, `.` is assumed"
};

const options = {
  clean: ["c", "Clean before install", "bool", false],
  json: [
    "j",
    "If true, indicates that JSON output should be generated",
    "bool",
    false
  ],
  //  mode: ["m", "Indicates which plugin mode to use", ["d", "p"], "d"],
  overwrite: ["o", "Allow overwriting plugins", "bool", false],
  which: [
    "w",
    "Which Adobe XD instance to target",
    ["r", "p", "d", "release", "pre", "prerelease", "dev", "development"],
    "r"
  ],
  ignoreFiles: [
    "ignore-files", "List of .*ignore files to proceed. Default is \".gitignore, .xdignore, .npmignore\"", 'string'
  ]
};

const parsedOpts = cli.parse(options, commands);

if (parsedOpts.json) {
  cli.status = function() {};
} else {
  cli.info(`xdpm ${package.version} - XD Plugin Manager CLI`);
  cli.info(`Use of this tool means you agree to:
- the Adobe Terms of Use at ${terms.use}
- the Developer Additional Terms at ${terms.dev}`);
}

const { command, args } = cli;

if (parsedOpts.which) {
  parsedOpts.which = parsedOpts.which[0];
}

switch (command.toLowerCase()) {
  case "ls":
    require("./commands/ls")(parsedOpts, args);
    break;
  case "install":
    require("./commands/install")(parsedOpts, args);
    break;
  case "watch":
    require("./commands/watch")(parsedOpts, args);
    break;
  case "package":
    require("./commands/package")(parsedOpts, args);
    break;
  case "validate":
    require("./commands/validate")(parsedOpts, args);
    break;
  case "bootstrap":
    require("./commands/bootstrap").bootstrap(parsedOpts, args);
    break;
}
