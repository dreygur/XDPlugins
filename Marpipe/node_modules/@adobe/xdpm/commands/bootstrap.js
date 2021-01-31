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
const shell = require("shelljs");
const sanitize = require("sanitize-filename");

const repo = "https://github.com/AdobeXD/plugin-samples.git";
const consoleLink = "https://console.adobe.io/plugins";
const defaultDirname = "my-plugin";
const sampleDirs = {
  default: "quick-start",
  headless: "quick-start",
  panel: "quick-start-panel",
  react: "quick-start-react",
  modal: "ui-html"
};

function bootstrap(opts, args) {
  shell.echo("Bootstrapping plugin:");

  const sampleRepoDirname =
    sampleDirs[args[0] || "default"] || sampleDirs.default;
  const localDirname = getLocalDirname(args);

  if (!shell.which("git")) {
    shell.echo(
      "Sorry, 'git' must be set in your PATH for xdpm bootstrap to work, but wasn't found. Please check your PATH."
    );
    shell.exit(1);
  }

  // Clone from repo
  shell.exec(
    `git clone "${repo}" "${localDirname}"`,
    (code, stdout, stderr) => {
      if (code === 0) {
        cleanupClone(sampleRepoDirname, localDirname);
      } else {
        shell.echo(
          `xdpm was unable to retrieve the boilerplate code for your plugin`
        );
        shell.echo(`See the following for more information:`);
        shell.echo(`> ${stdout}`);
        shell.echo(`> ${stderr}`);

        shell.exit(1);
      }
    }
  );
}

function getLocalDirname(args) {
  if (args[1]) return sanitize(args[1]);
  if (args[0] && !sampleDirs[args[0]]) return sanitize(args[0]);
  return defaultDirname;
}

// Remove unneeded samples and git history
function cleanupClone(sampleRepoDirname, localDirname) {
  const cdResult = shell.cd(`./${localDirname}`);

  if (cdResult.code === 0) {
    shell.exec(
      `git filter-branch --subdirectory-filter "${sampleRepoDirname}"`,
      { silent: true }
    );
    shell.rm("-rf", `.git`);

    shell.echo(`Plugin was sucessfully bootstrapped in ${localDirname}`);
    shell.echo(
      `Be sure to get your unique plugin ID at ${consoleLink} and include it in manifest.json`
    );
  } else {
    shell.echo(`Unable to find bootstrapped plugin directory ${localDirname}`);

    shell.exit(1);
  }
}

module.exports = {
  bootstrap,
  sampleDirs
};
