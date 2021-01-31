const fs = require("uxp").storage.localFileSystem;

const Token = (function () {
  let data;

  async function readToken() {
    const settingsFolder = await fs.getDataFolder();
    const settings = await settingsFolder.getEntry('settings.json');
    const data = await settings.read();
    return data;
  }

  return {
    getToken: async function () {
      if (!data) {
        data = await readToken();
      }
      return data;
    }
  };
})();

module.exports = Token;

