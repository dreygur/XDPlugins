# Adobe XD Resources

**A collection of resources from Adobe for XD extension**

### XD Dev Days

- [XD Dev Days Slack Channel](https://join.slack.com/t/xddevdays/shared_invite/enQtNDA5MzIxMzYyNDgxLTNjNjA1Y2I2YmFjN2Y2N2U4MGQ4ZDQyNmE5NjA0Zjg2NDgwMmZkOGI4ZmE4Yjk5NmIxM2FjMDI2YWYzMTI0MTE)
- [XD Prerelease](https://www.adobeprerelease.com/)

### Documentation

- [XD Github Repo External](https://github.com/AdobeXD)
- [XD Prerelease Forum Discussion](https://forums.adobeprerelease.com/newxdprerelease/categories/xdplugindev)
- [XD Gitbook space](https://www.gitbook.com/@adobe-xd/spaces)
- [XD Gitbook Guide/Getting Started](https://adobe-xd.gitbook.io/plugin-guides/)
- [XD API Reference](https://adobe-xd.gitbook.io/plugin-api-reference/)

### Useful highlights

To add multiple options on plugin (UI Entry Points) add to `uiEntryPoints` on `manifest.json` file. Example:

```
"uiEntryPoints": [
        {
            "type": "menu",
            "label": "Fit It (Demo)",
            "menuItems": [
                {
                    "type": "menu",
                    "label": "Fit It As Is",
                    "commandId": "fitItem"
                },
                {
                    "type": "menu",
                    "label": "Fit It Clockwise",
                    "commandId": "rotatateClockFitItem"
                },
                {
                    "type": "menu",
                    "label": "Fit It Counter-clockwise",
                    "commandId": "rotateCounterClockFitItem"
                }
            ]
        }
    ]
```
