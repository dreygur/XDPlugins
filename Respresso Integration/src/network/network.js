const Constant = require('../utils/constant');
const base = require('./netwok-base');
const ProgressDialog = require('../views/progress-dialog');

const progress = new ProgressDialog();

class Network {

    getConnectionBase(url, token, listener, data, readTimeOut = 4000) {
        progress.show();
        base.sendRequest({
            url: url, headers: { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'}, timeout: readTimeOut, data: data, async function(total, loaded) {}
        }).response
            .then(function (info) {
                progress.hide();
                listener.onSuccess.call(this, info)
            })
            .catch(function (error) {
                progress.hide();
                listener.onError.call(this, error)
            })
    }

    getConnectionBase2(url, token, listener, data, bundle) {
        base.sendRequest({
            url: url, headers: { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'}, timeout: 7000, data: data, async function(total, loaded) {

            }
        }).response
            .then(function (info) {
                var localbundle = {extras : bundle}
                localbundle["data"] = info
                listener.onSuccess.call(this, localbundle)
            })
            .catch(function (error) {
                listener.onError.call(this, error)
            })
    }

    async info(token, url, listener) {
        this.getConnectionBase(`${url}${Constant.info}`, token, listener)
    }

    async config(token, url, version, listener) {
        this.getConnectionBase(`${url}${Constant.config}/localization/${version}`, token, listener)
    }

    async preview(token, url, preview, listener, versions) {
        this.getConnectionBase2(`${url}${Constant.preview}`, token, listener, JSON.stringify(preview), versions)
    }

    async export(token, url, data, listener) {
        this.getConnectionBase(`${url}${Constant.export}`, token, listener, JSON.stringify(data), 600000)
    }
}

module.exports = Network;