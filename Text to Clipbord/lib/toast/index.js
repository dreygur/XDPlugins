/**
 * Copyright 2019 coffee break designs.
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
const sleep = ms => new Promise(f => setTimeout(f, ms));

async function createToast({
        msgs,
        time= 3000,
    }){
    let closeTime = time / 1000;
    const messages = Array.isArray(msgs) ? msgs : [msgs];
    // console.log(messages);
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
    <style>
        .wrap {
            width: 350px;
        }
        .text {
            background: #fff;
            padding: 10px;
            border-radius: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        #closeMessage {
            text-align: right;
        }
        footer {
            align-items: center;
        }
    </style>
    <form class="wrap" method="dialog">
    <h1 class="h1">Copied!</h1>
    <hr>
    <div class="text">
    ${
        messages.map(msg => { 
            // console.log(msg);
            return `<span>${msg}</span>`}).join('')
    }
    </div>
    <footer>
        <div id="closeMessage">auto close(${closeTime}s) </div>
        <button id="closeBtn" type="submit" uxp-variant="primary">close</button>
    </footer>
    </form>
    `;
    await sleep(1);
    dialog.style.height = `auto`
    dialog.style.padding = `10px`

    document.appendChild(dialog);
    dialog.showModal();

    // console.log(closeTime);
    const timer = setInterval(()=>{
        // el_timer.innerText = `${closeTime}`
        closeTime = closeTime - 1;
        if(closeTime <= 0){
            dialog.close();
            document.removeChild(dialog);
            clearInterval(timer)
        }
    }, 1000);

    // await sleep(time);
    // dialog.close();
    // document.removeChild(dialog);
    // clearInterval(timer)
}

async function alert({
    msg
    }){
    return createToast({msgs: [msg]});
}
module.exports = {
    createToast,
    alert,
};
