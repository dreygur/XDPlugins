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
const platform = require("./platform.js");
const { FOLDERS, MODES, WHICH } = require("./constants.js");

const path = require("path");
const fs = require("fs");

function localXdPath({which = "r", mode="d"} = {}) {

    const folderRoot = path.resolve(FOLDERS[platform][which], ".");
    const folder = path.resolve(folderRoot, MODES[mode]);

    if (!fs.existsSync(folderRoot)) {
        cli.fatal(`Could not locate ${folderRoot}. Do you have the ${WHICH[which]} version of Adobe XD CC installed?`);
        return;
    }

    if (!fs.existsSync(folder)) {
        // folder doesn't exist. Go ahead and create it.
        try {
            fs.mkdirSync(folder);
        } catch(err) {
            cli.fatal(`Could not create ${folder}. Check that you have permissions.`);
        }
    }

    return folder;
}

module.exports = localXdPath;