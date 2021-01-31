# Adobe XD Custom export
Export SVG icons from the selected Artboard to the TTF font with accompanied Flutter wrapper-class.

# Plugin Installation
- First of all, you need a copy of Adobe XD. Available for free here: https://www.adobe.com/products/xd.html
- Double click dist/flutter-icons-export.xdx file
- XD will ask you to confirm the plugin installation
- Within Adobe XD, you can find Flutter Icons Export by opening Plugins -> Flutter Icons Export, or by pressing option + command + e

# Developers
If you want to test modifications, follow these steps:
- Within Adobe XD, select Plugins -> Development -> Show Develop Folder
- Make sure to name your repo (parent) folder 'flutter-icons-export'
- Drag and drop 'flutter-icons-export' folder within the Develop folder that just showed up
- Find the plugin under Plugins -> Flutter Icons Export
- Within the flutter-icons-export develop folder, type these to get started with developing
- Install yarn (if needed) with
    npm install -g yarn
- Install required yarn modules:
    yarn install
- Watch and automaticaly rebuild with
    yarn watch
- Remember to hit shift + command + R to reload XD plugins every time you want to re-test.
