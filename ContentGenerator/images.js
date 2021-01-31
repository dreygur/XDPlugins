var scenegraph = require("scenegraph");
var fs = require("uxp").storage.localFileSystem;
var sm = require("./selectionManagement.js"),
    fm = require("./fileManagement.js");

// Generate a random int from the interval [min, max]
function getRandomIntInARange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Choose a random photo and set it as fill of a shape
function generateImageBitmapFill(photos, shape) {
    var imageNumber = getRandomIntInARange(0, photos.length - 1),
        bitmap = new scenegraph.BitmapFill.create();
        bitmap.loadFromURL(photos[imageNumber].nativePath);
    bitmap = bitmap.cloneWithOverrides({
        scaleBehavior: scenegraph.BitmapFill.SCALE_COVER,
        scale: (bitmap.scaleX + bitmap.scaleY) / 2
    });
    if (shape)
        shape.fill = bitmap;
    else {
        var image = new scenegraph.Rectangle();
        image.width = bitmap.width / 15;
        image.height = bitmap.height / 15;
        image.fill = bitmap;
        return image;
    }
}

function fillShapes(selection, landscapePhotos, portraitPhotos) {
    for (var i = 0; i < selection.items.length; i++) {
        if (selection.items[i] instanceof scenegraph.Rectangle || selection.items[i] instanceof scenegraph.Path) {
            if (selection.items[i].height > selection.items[i].width) {
                generateImageBitmapFill(portraitPhotos, selection.items[i]);
            } else if (selection.items[i].height < selection.items[i].width) {
                generateImageBitmapFill(landscapePhotos, selection.items[i]);
            } else {
                var photos = portraitPhotos.concat(landscapePhotos);
                generateImageBitmapFill(photos, selection.items[i]);
            }
        } else if (selection.items[i] instanceof scenegraph.Ellipse) {
            if (selection.items[i].radiusX < selection.items[i].radiusY) {
                generateImageBitmapFill(portraitPhotos, selection.items[i]);
            } else if (selection.items[i].radiusX > selection.items[i].radiusY) {
                generateImageBitmapFill(landscapePhotos, selection.items[i]);
            } else {
                var photos = portraitPhotos.concat(landscapePhotos);
                generateImageBitmapFill(photos, selection.items[i]);
            }
        } else {
            var photos = portraitPhotos.concat(landscapePhotos);
            var image = generateImageBitmapFill(photos);
            selection.insertionParent.addChild(image);
            image.placeInParentCoordinates(image.globalBounds, selection.items[i].globalBounds);
        }
    }
}

// Generate RANDOM IMAGES from Unsplash
async function unsplash(selection) {
    var pluginFolder = await fs.getPluginFolder(),
        pluginEntries = await pluginFolder.getEntries(),
        unsplashEntries = await fm.getFilesFromSpecificFolder(pluginEntries, 'unsplash'),
        landscapePhotos = sm.getImages(await fm.getFilesFromSpecificFolder(unsplashEntries, 'landscape')),
        portraitPhotos = sm.getImages(await fm.getFilesFromSpecificFolder(unsplashEntries, 'portrait'));
    fillShapes(selection, landscapePhotos, portraitPhotos);
}

// Generate PROFILE IMAGES (source is also Unsplash)
async function avatar(selection, gender) {
    var pluginFolder = await fs.getPluginFolder(),
        pluginEntries = await pluginFolder.getEntries(),
        avatarEntries = await fm.getFilesFromSpecificFolder(pluginEntries, 'avatars'),
        landscapePhotos, portraitPhotos;
    if (gender == 'mixed') {
        var ladiesEntries = await fm.getFilesFromSpecificFolder(avatarEntries, 'ladies'),
            landscapePhotosLadies = sm.getImages(await fm.getFilesFromSpecificFolder(ladiesEntries, 'landscape')),
            portraitPhotosLadies = sm.getImages(await fm.getFilesFromSpecificFolder(ladiesEntries, 'portrait')),
            gentlemansEntries = await fm.getFilesFromSpecificFolder(avatarEntries, 'gentlemans'),
            landscapePhotosGentlemans = sm.getImages(await fm.getFilesFromSpecificFolder(gentlemansEntries, 'landscape')),
            portraitPhotosGentlemans = sm.getImages(await fm.getFilesFromSpecificFolder(ladiesEntries, 'portrait'));
        landscapePhotos = landscapePhotosGentlemans.concat(landscapePhotosLadies);
        portraitPhotos = portraitPhotosGentlemans.concat(portraitPhotosLadies);
    } else {
        var genderEntries = await fm.getFilesFromSpecificFolder(avatarEntries, gender);
        landscapePhotos = sm.getImages(await fm.getFilesFromSpecificFolder(genderEntries, 'landscape'));
        portraitPhotos = sm.getImages(await fm.getFilesFromSpecificFolder(genderEntries, 'portrait'));
    }
    fillShapes(selection, landscapePhotos, portraitPhotos);
}

// MALE PROFILE IMAGES
async function maleImages(selection) {
    await avatar(selection, 'gentlemans');
}

// FEMALE PROFILE IMAGES
async function femaleImages(selection) {
    await avatar(selection, 'ladies');
}

// MIXED PROFILE IMAGES
async function mixedImages(selection) {
    await avatar(selection, 'mixed');
}

module.exports = {
    unsplash,
    maleImages,
    femaleImages,
    mixedImages
}