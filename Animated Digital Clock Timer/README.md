# Animated Digital Clock Timer

I created this plugin to easily add custom animated countdown timers to your artboards using auto-animate transitions. It is useful if you design mobile apps that rely on time-based interactions supported by an actual timer or stopwatch in the UI. More specifically, it creates and masks a bunch of vertical text strips used to display the time remaining in a game, in minutes and seconds, or hours and minutes (eg. 13:37). Once animated, it should look like flight departure times on those big mechanical timetables in the hallways of airports (or a time-lapse of an alarm clock from the 70s). Based on original work by [Howard Pinsky](https://twitter.com/pinsky).

![Timer GIF](https://cdn.dribbble.com/users/2864445/screenshots/5673255/timer-black-800-600-9.gif)

## How to use

1. Install the package by double-clicking on the file with xdx extension.
2. In _Design_ mode, select a first  artboard, then shift-select a second one.
3. In the menus go to Plugins > Animated Digital Clock Timer.
4. Leave the defaults as they are to simply get an idea of the plugin's capabilities.
5. Click on "Create Timer Elements", you should now have:
    - the start time on your first artboard
    - the end time on the second artboard
6. Switch to _Prototype_ mode.
7. Add a transition between the first artboard and the second one:
    - Use any trigger you like (_Time_ with no delay works well for this demo), 
    - _Auto-animate_
    - _Ease-In-Out_
    - 5 seconds long
8. [Optional] Add a similar, reverse transition between the second artboard and the first one.
8. De-select all elements by clicking anywhere on the canvas.
9. Click on the Play icon in the top right to play the animation.

From there you can repeat that procedure between any 2 selected artboards, making changes to the font color, font family and horizontal spacing.

## Good to know

1. To move your timer groups, simply shift-select them both in design mode and move them around.
2. XD does not have a comprehensive Fonts API that I know of, so I decided to let users type the name of their font rather than lock them in a predefined list of common fonts.
3. The plugin modal dialog will remember the last values you used by storing them in a plugin-specific, extremely tiny file locally on your computer. If you ever run out of storage space, that caching feature will silently fail and the dialog will always show the plugin defaults.
4. If you ever needed to rename the masked groups created by the plugin, make sure to give them the same name on both artboards, or auto-animate will fail.


## Contributing

Please use the [Issues](https://github.com/lelayf/AdobeXD-animated-digital-clock-timer/issues) page to report bugs, contribute fixes and make feature requests.



