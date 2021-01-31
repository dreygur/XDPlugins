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

const process = require("process");

let platform;
switch(process.platform) {
    case "darwin":
        platform = "mac";
        break;
    case "win32":
        platform = "win";
        break;
    default:
        platform = null;
}

if (!platform) {
    console.warn("Unsupported platform, commands might not work as expected; Run on macOS or Windows.")
}

module.exports = platform;
