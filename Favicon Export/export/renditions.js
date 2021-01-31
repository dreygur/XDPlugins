const { selection } = require("scenegraph");
const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const { msg, styleClass } = require("../ui/message");
const { getSelectedColor } = require("../color/index");
const { selectionHasBackground } = require("../ui/validate");

const renditionSizes = {
  web: {
    platformName: "Web",
    sizes: [16, 32, 96, 128, 192]
  },
  ios: {
    platformName: "iOS",
    sizes: [120, 152, 167, 180]
  },
  android: {
    platformName: "Android",
    sizes: [196]
  }
};

const exportRenditions = async () => {
  const selectedDir = await fs.getFolder();
  if (!selectedDir)
    return {
      message: msg.opInfo.folderPickerCancel,
      styleClass: styleClass.info,
      withTimeout: true
    };

  const entries = await getEntries(selectedDir);
  if (!entries)
    return {
      message: msg.opInfo.errorDirRead,
      styleClass: styleClass.error,
      withTimeout: true
    };

  const destDir = await getDestDir(selectedDir, entries);
  if (!destDir)
    return {
      message: msg.opInfo.errorDirCreate,
      styleClass: styleClass.error,
      withTimeout: true
    };

  const filesWithDetails = await createFiles(destDir);
  const renditionOpts = await getRenditionOpts(filesWithDetails);

  try {
    await application.createRenditions(renditionOpts);

    const msgOpts = {
      message: msg.opInfo.success,
      styleClass: styleClass.success,
      withTimeout: true,
      filesWithDetails
    };

    return msgOpts;
  } catch (error) {
    const msgOpts = {
      message: msg.opInfo.error,
      styleClass: styleClass.error,
      withTimeout: true
    };

    console.log(error);
    return msgOpts;
  }
};

const getEntries = async selectedDir => {
  try {
    const entries = await selectedDir.getEntries();
    return entries;
  } catch (error) {
    return null;
  }
};

const getDestDir = async (selectedDir, entries) => {
  const destDirSlug = "Favicons";

  const faviconDirs = entries
    .filter(entry => entry.isFolder && entry.name.startsWith(destDirSlug))
    .map(entry => entry.name);

  const destDirName = createDestDirName(faviconDirs, destDirSlug);

  try {
    const destDir = await selectedDir.createFolder(destDirName);
    return destDir;
  } catch (error) {
    return null;
  }
};

const createDestDirName = (faviconDirs, destDirSlug) => {
  let destDirName;

  if (!faviconDirs.length || !faviconDirs.includes(destDirSlug)) {
    destDirName = destDirSlug;
  } else {
    let nameCreated = false;
    let count = 1;

    while (!nameCreated) {
      const subDirName = `${destDirSlug} ${count}`;

      if (!faviconDirs.includes(subDirName)) {
        nameCreated = true;
        destDirName = subDirName;
      } else {
        count++;
      }
    }
  }

  return destDirName;
};

const createFiles = async destDir => {
  const platforms = Object.values(renditionSizes);

  const filesToCreate = platforms
    .map(platform => {
      return platform.sizes.map(size => {
        return {
          platformName: platform.platformName,
          size
        };
      });
    })
    // The reduce call is equivalent to Array.flat(), which isn't available in UXP yet.
    .reduce((acc, val) => {
      return acc.concat(val);
    }, []);

  const filePromises = filesToCreate.map(async fileDetails => {
    const { platformName, size } = fileDetails;
    const file = await destDir.createFile(
      `favicon-${platformName}-${size}.png`,
      {
        overwrite: true
      }
    );
    return file;
  });
  const renditionFiles = await Promise.all(filePromises);

  return renditionFiles.map((file, i) => {
    return { file, details: filesToCreate[i] };
  });
};

const getRenditionOpts = async filesWithDetails => {
  const renditionOpts = filesWithDetails.map(file => {
    const selectedItem = selection.items[0];

    const options = {
      node: selectedItem,
      outputFile: file.file,
      type: application.RenditionType.PNG,
      scale: file.details.size / selectedItem.width
    };

    const isOS = () => {
      return file.details.platformName === renditionSizes.ios.platformName;
    };

    if (isOS() && !selectionHasBackground()) {
      options.background = getSelectedColor();
    } else {
      options.background = selectedItem.fill;
    }

    return options;
  });

  return renditionOpts;
};

module.exports = {
  exportRenditions,
  renditionSizes
};
