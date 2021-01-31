const commands = require("commands");
const { alert, error } = require("/lib/dialogs");

// Generate and show the dialog and get user's input
async function showDialog() {
    let buttons = [
        { label: 'Cancel', variant: 'primary' },
        { label: 'Find and replace', variant: 'cta', type: 'submit' }
    ];

    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <form method="dialog">
            <h1>Find and replace</h1>
            
            <label>
                <span>Find what</span>
                <input type="text" id="find" name="find" />
            </label>

            <label>
                <span>Replace with</span>
                <input type="text" id="replace" name="replace" />
            </label>
            <footer>
                ${buttons.map(({label, type, variant} = {}, idx) => `<button id="btn${idx}" type="${type}" uxp-variant="${variant}">${label}</button>`).join('')}
            </footer>
        </form>
    `;

    let okBtnIdx = -1;
    let cancelBtnIdx = -1;
    let clickedBtnIdx = -1;

    const form = dialog.querySelector('form');
    form.onsubmit = () => dialog.close('ok');

    buttons.forEach(({type, variant} = {}, idx) => {
        const button = dialog.querySelector(`#btn${idx}`);
        if (type === 'submit' || variant === 'cta') {
            okBtnIdx = idx;
        }
        if (type === 'reset') {
            cancelBtnIdx = idx;
        }

        button.onclick = e => {
            e.preventDefault();
            clickedBtnIdx = idx;
            dialog.close( idx === cancelBtnIdx ? 'reasonCanceled' : 'ok');
        }
    });

    try {
        document.appendChild(dialog);
        const response = await dialog.showModal();
        if (response === 'reasonCanceled') {
            return {which: cancelBtnIdx, value: ''};
        } else {
            if (clickedBtnIdx === -1) {
                clickedBtnIdx = okBtnIdx;
            }

            return {
                which: clickedBtnIdx,
                values: {
                    findValue: dialog.querySelector("#find").value || "",
                    replaceValue: dialog.querySelector("#replace").value || "",
                }
            };
        }
    } catch (err) {
        return {which: cancelBtnIdx, value: ''};
    } finally {
        dialog.remove();
    }
}

// Check selection and user's input, and if all okay replace
async function findAndReplace (selection) {
    const totalObjCount = selection.items.length;
    
    if (totalObjCount === 0) {
        await error(
            "Selection error",
            "Please select at least one text layer to proceed."
            );
        return ;
    }

    if ((totalObjCount === 1) && (selection.items[0].constructor.name !== "Text")) {
        await error(
        "Selection error",
        "Please select at least one text layer to proceed."
        );
        return ;
    }

    const response = await showDialog();
    if (response.which === 0) {
        return ;
    }

    const findUser = response.values.findValue;
    const replaceUser = response.values.replaceValue;

    if (findUser !== '') {
        for (let node of selection.items) {
            if (node.constructor.name === "Text") {
                let str = node.text;
                str = str.split(findUser).join(replaceUser);
                node.text = str;
            }
        }
    }

    else {
        await error(
            "Input error",
            "Please enter a value to be found."
            );
        return ;
    }
}

module.exports = {
    commands: {
        findAndReplace
    }
}