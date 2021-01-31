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
const getPluginMetadata = require("../lib/getPluginMetadata");
const validate = require("../lib/validate");

const validateErrCode = 1;

/**
 * validates one or more plugins
 */
function validatePlugin(opts, args) {
    if (args.length === 0) {
        args.push("."); // assume we want to package the plugin in the cwd
    }

    const results = getResults(args);  
    const errors = reportResults(opts, results);

    if (errors) {
        cli.error(`Manifest validation failed. Exiting with code ${validateErrCode}`);
        shell.exit(validateErrCode);
    }
    else {        
        shell.exit(0);
    }
}

function getResults(args) {
    const results = args.map(pluginToValidate => {
        const sourcePath = path.resolve(pluginToValidate);
        const result = {
            path: sourcePath
        };

        const metadata = getPluginMetadata(sourcePath);
        if (!metadata) {
            return Object.assign({}, result, {
                "error": `Plugin ${pluginToValidate} doesn't have a manifest.`
            });
        }

        const errors = validate(metadata, {root: sourcePath});
        if (errors.length > 0) {
            return Object.assign({}, result, {
                "error": `Plugin ${pluginToValidate} has validation errors in the manifest.json:\n` + errors.join("\n")
            });
        }

        result.ok = `"${metadata.name}"@${metadata.version} [${metadata.id}] validated successfully`;
        return result;
    });

    return results;
}

/**
 * Prints validation results for each tested plugin to command line.
 * @param {*} opts 
 * @param {*} results 
 * @returns {boolean} True if there was an error for any of the tested plugin manifests.
 */
function reportResults(opts, results) {
    if (opts.json) {
        shell.echo(JSON.stringify(results));
    }  

    let errors;

    results.forEach(result => {
        if (result.ok) {
            cli.ok(result.ok);
        } else {
            cli.error(result.error);
            errors = true;
        }
    });

    return errors;
}

module.exports = validatePlugin;