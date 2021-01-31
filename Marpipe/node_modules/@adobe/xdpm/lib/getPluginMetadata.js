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
const fs = require("fs");
const path = require("path");

function getPluginMetadata(pluginPath) {
    const manifestPath = path.join(pluginPath, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
        cli.debug(`${pluginPath} does not seem to be a valid plugin (no manifest)`);
        return null; // this path isn't a valid plugin folder
    }
    const json = fs.readFileSync(manifestPath, { encoding: "utf8"} );
    try {
        const metadata = JSON.parse(json);
        return metadata;
    } catch(err) {
        cli.debug(`${pluginPath} does not contain a valid manifest.`);
        return null; // manifest is invalid, nothing to return
    }
}

module.exports = getPluginMetadata;