/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const {SceneNode} = require("scenegraph");
const debugHelper = require("../helpers/debug");
const fs = require('uxp').storage;
const lfs = fs.localFileSystem;
const error = require('../helpers/error');
const analytics = require("../helpers/analytics");

async function exportText(root) {
    analytics.verifyAcceptance({
        pluginName: 'Text Toolbox',
        privacyPolicyLink: 'https://xdplugins.pabloklaschka.de/privacy-policy'
    }).then(() => analytics.send('exportText', {}));

    const saveFile = await lfs.getFileForSaving('texts', {
        types: ['html']
    });
    debugHelper.log(saveFile, saveFile.url);

    let text = `
<!Doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Text Toolbox Text Report</title>
    <style>
    * {
    -webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;
    }
    
    body {
    margin: 0;
    transition: background-color 0.1s ease-in-out;
    }
    
    body.success {
    background: #fbfffb;
    }
    
    main, footer {
        max-width: 666px;
        width: 100%;
        padding: 8px;
        font-size: 16px;
        font-family: 'Roboto', Arial, sans-serif;
        color: #565656;
        
        margin: 0 auto;
    }
    
    header {
    background: #2D4E64;
    height: 32px;
    box-shadow: 0 3px 6px 0 rgba(0,0,0,0.16);
    }
    
    main > *, footer > * {
    padding: 0 32px;
    }
    
    article {
        box-shadow: 0 3px 6px 0 rgba(0,0,0,0.16);
        padding: 16px;
        background: white;
    }
    
    article h3 {
        margin: 0;
        padding: 0 16px;
    }
    
    article + article {
        margin-top: 16px;
    }
    
    article pre {
        padding: 16px;
        font-family: Roboto, Arial, sans-serif;
        background: #efefef;
        white-space: pre-wrap;
        cursor: copy;
    }
    
    article pre:hover {
        border: 1px solid #aaa;
        background: #eaeaea;
        padding: 15px;
    }
    </style>
</head>
<body>
<header>&nbsp;</header><main>
<h1>Text Toolbox Text Report</h1>
<p>
This is an automatically generated report containing all texts of the Adobe XD document. It was created with the
<a href="https://xdplugins.pabloklaschka.de/" target="_blank" rel="noopener">Text Toolbox</a> plugin for Adobe XD CC 
(developed by Pablo Klaschka).
</p>
<p>
You can – if your Browser supports that – simply left-click a text and it will get copied to the clipboard.
</p>
<p>
<small>Adobe, the Adobe logo, Adobe XD CC and the Adobe XD CC logo are either registered trademarks or trademarks of Adobe Systems Incorporated in the United States and/or other countries.</small>
</p>
${getText(root)}

</main>
<footer>
<p>
Report created on ${new Date().toLocaleString()}
</p>
</footer>
</body>
<script>
document.querySelectorAll('article > pre').forEach(element => {
   element.addEventListener('click', evt => {
       try {
        navigator.clipboard.writeText(evt.target.innerText).then(() => {
           document.querySelector('body').className = 'success';
           setTimeout(() => document.querySelector('body').className = '', 200);
        });      
      } catch (e) {
        alert("Unfortunately, your web browser doesn't appear to support copying contents to the clipboard.");
   }
       });
});
</script>
    </html>
    `;

    await saveFile.write(text, {append: false, format: fs.formats.utf8});

    debugHelper.log(`<a href="file:///${saveFile.nativePath.split('\\\\').join('/')}"`);

    // TODO: Find some way to open the report
    error.showErrorDialog('Text Report generated', `Your report got exported successfully. You can now find it at ${saveFile.nativePath}.`);
}

/**
 *
 * @param {SceneNode} node
 * @return {string}
 */
function getText(node) {
    let prefix = '';
    if (node.constructor.name === 'Artboard') {
        prefix = `<h2>Artboard: ${node.name}</h2>`
    }

    if (node.constructor.name === 'Text') {
        return prefix + `
        <article title="Copy text to the clipboard">
        <h3>${node.name.length > 40 ? node.name.substr(0, 39) + '…' : node.name}</h3>
        <pre>${node.text}</pre>
        </article>
        `
    } else if (node.children.length > 0) {
        const result = node.children
            .map(getText).filter(value => value)
            .reduce((previousValue, currentValue) =>
                previousValue + '\r\n' + currentValue,
                ''
            );
        return result ? prefix + result : '';
    } else {
        return prefix + '';
    }
}

module.exports = exportText;