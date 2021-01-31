
const shell = require('uxp').shell;

module.exports = createColorizeModal;

function createColorizeModal(categories, colorizeCategoriesCache) {
    let content = `
        <style>
            .checkbox-container {
                width: 300px;   

                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-start;
            }
            label {
                position: relative;
                display: inline !important;
                width: 140px;
                margin: 3px;
                text-align: left;
                padding: 2px;
                padding-left: 35px;
            }
            .checkbox {
                position: absolute;
                left: 0;
                top: -4;
            }
            #helper-link {
                position: absolute;
                left: 15;
                top: 14;
                cursor: pointer !important;
            }
            footer {
                position: relative;
            }
        </style>
        <dialog id="dialog">
            <form method="dialog">
                <h1 class="h1">
                    <span>Colorize</span>
                </h1>
                <p>Choose categories that you want to colorize.</p>
                <hr />
                <div class="checkbox-container">`;

                for(let i = 0; i < categories.length; i++) {
                    let cat = categories[i];
                    if(colorizeCategoriesCache && colorizeCategoriesCache.includes(cat)) {
                        content += `<label><input type="checkbox" class="checkbox" checked>${cat}</label>`;
                    } else {
                        content += `<label><input type="checkbox" class="checkbox">${cat}</label>`;
                    }
                }
                content += `</div>
                <hr />
                <footer>
                    <a id="helper-link">What is colorize?</a>
                    <button type="submit" uxp-variant="cta">Create</button>
                </footer>
            </form>
        </dialog>`;

        document.body.innerHTML = content;
                
    const [dialog, form] = [
    `dialog`,
    `form`
    ].map(s => document.querySelector(s));

    document.querySelector('#helper-link').addEventListener('click', () => {
        shell.openExternal('https://www.resco.net/woodford-user-guide/#_Toc483815975');
    });
    return dialog;
}