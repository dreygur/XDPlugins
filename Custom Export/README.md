<img width="300" height="240" src="https://raw.githubusercontent.com/chrometaphore/custom-export/master/32b4e7d2e0b1992e09f8fc5cca71da25.png" alt="Custom Export" />

# Adobe XD Custom export
Adobe XD Plugin to export selected Layers and Artboards to any custom scale.

# Plugin Installation
- First of all, you need a copy of Adobe XD. Available for free here: https://www.adobe.com/products/xd.html
- Double click dist/custom-export.xdx file
- XD will ask you to confirm the plugin installation
- Within Adobe XD, you can find Custom Export by opening Plugins -> Custom Export, or by pressing option + command + e

# Developers
If you want to test modifications, follow these steps:
- Within Adobe XD, select Plugins -> Development -> Show Develop Folder
- Make sure to name your repo (parent) folder 'custom-export'
- Drag and drop 'custom-export' folder within the Develop folder that just showed up
- Find the plugin under Plugins -> Custom Export
- Within the custom-export develop folder, type these to get started with developing
- Install yarn (if needed) with
    npm install -g yarn
- Install required yarn modules:
    yarn install
- Watch and automaticaly rebuild with
    yarn watch
- Remember to hit shift + command + R to reload XD plugins every time you want to re-test.
