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

const path = require ("path");
const os = require("os");

const home = os.homedir();

module.exports = {
    FOLDERS: {
        "mac": {
            "r": path.join(home, "Library", "Application Support", "Adobe", "Adobe XD"),
            "p": path.join(home, "Library", "Application Support", "Adobe", "Adobe XD (Prerelease)"),
            "d": path.join(home, "Library", "Application Support", "Adobe", "Adobe XD (Dev)")
        },
        "win": {
            "r": path.join(home, "AppData", "Local", "Packages", "Adobe.CC.XD_adky2gkssdxte", "LocalState"),
            "p": path.join(home, "AppData", "Local", "Packages", "Adobe.CC.XD.Prerelease_adky2gkssdxte", "LocalState"),
            "d": path.join(home, "AppData", "Local", "Packages", "Adobe.CC.XD.Dev_adky2gkssdxte", "LocalState")
        }
    },
    MODES: {
        "d": "develop",
        "p": "plugins"
    },
    WHICH: {
        "r": "release",
        "p": "prerelease",
        "d": "dev"
    },
    ALWAYS_IGNORE: [
        /\.DS\_STORE/,
        /\.git/
    ]
};
