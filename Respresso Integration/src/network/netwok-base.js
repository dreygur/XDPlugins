
function sendRequest(config) {
    let aborted = false;
    const xmlHttp = new XMLHttpRequest();
    let _reject;
    const method = config.data ? "POST" : "GET"
    const promise = new Promise((resolve, reject) => {
        _reject = reject;
        xmlHttp.open(method, config.url, true);
        const headers = config.headers;
        if (headers) {
            Object.keys(headers).forEach((headerKey) => {
                xmlHttp.setRequestHeader(headerKey, headers[headerKey]);
            });
        }
        xmlHttp.setRequestHeader("Accept", "application/json");
        const progress = config.progress;
        if (progress) {
            xmlHttp.upload.onprogress = (e) => {
                if (aborted)
                    return;
                if (e.lengthComputable) {
                    console.log(`now ${loaded}/${total}`)
                    progress(e.total, e.loaded);
                }
            };
        }
        xmlHttp.onreadystatechange = function () {
            if (aborted)
                return;
            if (xmlHttp.readyState === 4) {
                aborted = true;
                try {
                    if (xmlHttp.status !== 200) {
                        const response = JSON.parse(xmlHttp.responseText)   
                        if (response.key === "teamService.project.notFound.byId") {
                            const error = Error("Project not found by token. Please check your token and try import again.");
                            error.name = "UploaderCommunicationError";
                            throw error;
                        }
                        else if (response.key === "tokenValidationFilter.notFound.xClientToken") {
                            const error = Error("Respresso import token not found. Please check your token and try import again.");
                            error.name = "UploaderCommunicationError";
                            throw error;
                        } else if(response.key === "category.is.empty"){
                            const error = Error("Cannot find reseource to upload into ");
                            error.name = "EmptyCategory";
                            throw error;
                        }else if(response.type === "LocalizedRespressoRuntimeException"){
                            const error = Error(response.key);
                            error.name = "LocalizedRespressoRuntimeException";
                            throw error;
                        } else if (response.key === "flowExecutionError") {
                            const error = Error(response.data.causeMessage);
                            error.name = "FlowExecutionError";
                            throw error;
                        }
                        else {
                            const error = Error("Server communication error. Please check your connectivity and try it again.");
                            error.name = "UploaderCommunicationError";
                            console.log(xmlHttp.responseText)
                            throw error;
                        }
                    }

                    if (xmlHttp.responseText === "OK")
                        resolve("OK")
                    const json = JSON.parse(xmlHttp.responseText);
                    resolve(json);
                }
                catch (err) {
                    reject(err);
                }
            }
        };
        xmlHttp.timeout = config.timeout;
        xmlHttp.ontimeout = function () {
            try {
                const error = Error("Server not responds. Please check server connectivity and try it again.");
                error.name = "TimeOutError";
                throw error;
            } catch (e) {
                reject(e);
            }
        }

        config.data ? xmlHttp.send(config.data) : xmlHttp.send();
    });

    return {
        abort: function (abortError) {
            if (aborted)
                return;
            aborted = true;
            if (abortError) {
                _reject(abortError);
            }
            else {
                const error = Error("Aborted");
                error.name = "UploaderAbortedError";
                _reject(error);
            }
            xmlHttp.abort();
        },
        response: promise
    };
}


exports.sendRequest = sendRequest