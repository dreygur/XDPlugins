const clipboard = require("clipboard");
const { msg } = require("../ui/message");
const { renditionSizes } = require("./renditions");

// TODO: Add Windows support
// A browserconfig.xml file in the site's root directory
// <?xml version="1.0" encoding="utf-8"?>
// <browserconfig>
//   <msapplication>
//     <tile>
//       <square70x70logo src="mstile-70x70.png"/>
//       <square150x150logo src="mstile-270x270.png"/>
//       <square310x310logo src="mstile-310x310.png"/>
//       <wide310x150logo src="mstile-310x150.png"/>
//       <TileColor>#2b5797</TileColor>
//     </tile>
//   </msapplication>
// </browserconfig>

// <!-- Windows 8 IE 10-->
// <meta name="msapplication-TileColor" content="#FFFFFF">
// <meta name="msapplication-TileImage" content="favicon-144.png">

// <!— Windows 8.1 + IE11 and above —>
// <meta name="msapplication-config" content="/browserconfig.xml" />

const exportMarkup = filesWithDetails => {
  const generatedMarkup = filesWithDetails
    .map((file, i) => {
      const fileName = file.file.name;
      const { platformName, size } = file.details;
      const sizes = `${size}x${size}`;
      const prevPlatformName = filesWithDetails[i - 1]
        ? filesWithDetails[i - 1].details.platformName
        : null;

      const comment = `\n<!-- ${platformName} -->\n`;

      const isFirst = () => platformName !== prevPlatformName;

      const decorateWithComments = markup => {
        return isFirst() ? comment + markup : markup;
      };

      let markup;
      switch (platformName) {
        case renditionSizes.web.platformName:
          markup = `<link rel="icon" type="image/png" href="${fileName}" sizes="${sizes}" />`;
          return decorateWithComments(markup);
          break;
        case renditionSizes.ios.platformName:
          markup = `<link rel="apple-touch-icon" href="${fileName}" sizes="${sizes}" />`;
          return decorateWithComments(markup);
          break;
        case renditionSizes.android.platformName:
          markup = `<link rel="shortcut icon" href="${fileName}" sizes="${sizes}" />`;
          return decorateWithComments(markup);
          break;
        default:
          console.log(
            `A new rendition platform (${platformName}) has been added but export markup is not yet being generated for it.`
          );
          break;
      }
    })
    .join("\n");

  clipboard.copyText(generatedMarkup);

  return { message: msg.opInfo.clipboard };
};

module.exports = {
  exportMarkup
};
