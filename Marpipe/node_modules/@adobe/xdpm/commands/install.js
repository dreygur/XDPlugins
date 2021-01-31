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
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const localXdPath = require("../lib/localXdPath");
const getPluginMetadata = require("../lib/getPluginMetadata");
const ignoreWalk = require("ignore-walk");
const mkdirp = require("mkdirp");
const filterAlwaysIgnoredFile = require("../lib/filterAlwaysIgnoredFile");

/**
 * Installs one or more plugins.
 */
function install(opts, args) {
    const folder = localXdPath(opts);
    if (!folder) {
        console.fatal(`Could not determine Adobe XD folder.`);
        return;
    }

    if (args.length === 0) {
        args.push("."); // assume we want to install the plugin in the cwd
    }

    const results = args.map(pluginToInstall => {
        const sourcePath = path.resolve(pluginToInstall);
        const result = {
            path: sourcePath
        };

        const metadata = getPluginMetadata(sourcePath);
        if (!metadata) {
            return Object.assign({}, result, {
                "error": "Can't install a plugin that doesn't have a valid manifest.json"
            });
        }

        const id = metadata.id;
        if (!id) {
            return Object.assign({}, result, {
                "error": "Can't install a plugin without a plugin ID in the manifest"
            });
        }

        const rootFolder = localXdPath(opts);
        const targetFolder = path.join(rootFolder, id);
        if (fs.existsSync(targetFolder)) {
            if (!opts.overwrite) {
                return Object.assign({}, result, {
                    "error": "Plugin exists already; use -o to overwrite"
                });
            }
            if (opts.clean) {
                cli.debug(`(Cleaning) Removing files inside ${targetFolder}`);
                shell.rm("-Rf", path.join(targetFolder, "*"));
            }
        } else {
            shell.mkdir(targetFolder);
        }
        
        // the comment below doesn't respect .xdignore (or other ignore files)
        // but this is the gist of what we're trying to accomplish
        // shell.cp("-R", path.join(sourcePath, "*"), targetFolder)

        const walkConfig = {
            path: sourcePath,
            ignoreFiles: [".gitignore", ".xdignore", ".npmignore"],
            includeEmpty: false,
        }
        if (opts.ignoreFiles !== null) {
            walkConfig.ignoreFiles = opts.ignoreFiles
                .split(/,|\s/)
                .map((f) => f.trim())
                .filter(Boolean);
        }

        const files = ignoreWalk
          .sync(walkConfig)
          .filter(filterAlwaysIgnoredFile);

        files.forEach(file => {
            const srcFile = path.join(sourcePath, file);
            const tgtFile = path.join(targetFolder, file);
            const tgtDir = path.dirname(tgtFile);
            if (!fs.existsSync(tgtDir)) {
                mkdirp.sync(tgtDir);
            }
            shell.cp(srcFile, tgtFile);
        });

        return Object.assign({}, result, {
            "ok": `"${metadata.name}"@${metadata.version} [${metadata.id}] installed successfully.`
        });
    });

    if (opts.json) {
        return results;
    }

    results.forEach(result => {
        if (result.ok) {
            cli.ok(result.ok);
        } else {
            cli.error(result.error);
        }
    });

    return results;
}

module.exports = install;