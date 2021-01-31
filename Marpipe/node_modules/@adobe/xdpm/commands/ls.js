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
const localXdPath = require("../lib/localXdPath");
const getPluginMetadata = require("../lib/getPluginMetadata");

function ls (opts, args) {
    const folder = localXdPath(opts);
    if (!folder) {
        console.fatal(`Could not determine Adobe XD folder.`);
    }
    cli.info(`Listing plugins inside ${folder}`);
    const folders = shell.ls("-d", path.join(folder, "*"));
    const plugins = folders.filter(pluginPath => {
        const base = path.basename(pluginPath);
        const metadata = getPluginMetadata(pluginPath);
        if (args.length > 0 && metadata && (!args.includes(base) && !args.includes(metadata.id))) {
            return false;
        }
        if (metadata && !opts.json) {
            cli.output(`${base}: "${metadata.name}"@${metadata.version} [${metadata.id}]`);
        }
        return !!metadata;
    });
    if (opts.json) {
        cli.output(JSON.stringify(plugins.map(pluginPath => ({
            path: pluginPath,
            metadata: getPluginMetadata(pluginPath)
        })), null, 2));
    }
    if (plugins.length === 0) {
        cli.error(`No valid plugins installed.`);
    }
}

module.exports = ls;