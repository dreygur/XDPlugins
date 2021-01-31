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

const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
const manifestScema = require("./manifestSchema");

function validate(manifest, { root, id } = {}) {
    let errors = [];
    var validate = ajv.compile(manifestScema);
    var valid = validate(manifest);
    if ( id && manifest.id !== id ) {
        errors.push(
            `F1001: Manifest 'id' does not match expected id. Saw '${manifest.id}', expected '${id}'.`
        );
    }
    if (!valid) {
        errors = validate.errors.map(
            e => `${e.dataPath} (${JSON.stringify(e.params)}) -> ${e.message} `
        );
    }
    manifest.icons.forEach((icon, idx) => {
        if (!fs.existsSync(path.join(root || ".", icon.path))) {
            errors.push(
                `W2004: Icon ${idx} has path ${icon.path}, but no icon was found there.`
            );
        }
    });
    return errors;
}

module.exports = validate;
