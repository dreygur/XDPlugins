// base64 character set, plus padding character (=)
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

class Libs {

  static quote(str) {
    if (str.includes(' ')) return `"${str.replace('"', '\\"')}"`;
    return str;
  }

  static validateKey(key) {
    const err = 'Invalid api key... check https://wakatime.com/settings for your key';
    if (!key) return err;
    const re = new RegExp(
      '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
      'i',
    );
    if (!re.test(key)) return err;
    return '';
  }

  static btoa(st) {
    st = String(st);
    var bitmap, a, b, c,
      result = "",
      i = 0,
      rest = st.length % 3; // To determine the final padding

    for (; i < st.length;) {
      if ((a = st.charCodeAt(i++)) > 255 ||
        (b = st.charCodeAt(i++)) > 255 ||
        (c = st.charCodeAt(i++)) > 255)
        throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");

      bitmap = (a << 16) | (b << 8) | c;
      result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) +
        b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
    }

    // If there's need of padding, replace the last 'A's with equal signs
    return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
  }
}

module.exports = Libs;
