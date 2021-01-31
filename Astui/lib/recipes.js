const environment = require("./storage-helper");

class recipes {


    static async callRecipesApi(api_token, actions, path) {
        let requestBody;

        requestBody = "api_token=" + api_token + "&path=" + path + "&actions=" + JSON.stringify(actions);
        this.endpoint = await environment.get("server") + "recipe";
        let response = await fetch(this.endpoint, {
            method: "post",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: requestBody,
        });
        const status = response.status;
        let error = response.statusText;

        if (status == 200) {
            let data = await response.json();
            data = {
                "path": data.path,
            };
            return data;
        } else {
            if ((status == 401) || (status == 402)) {
                await environment.set("api_token", "");
                error = "Unauthorised or expired. Check your token.";
            }

            let data = {
                "path": path,
                "error": status,
                "message": error,
            };
            return data;
        }
    }

}

module.exports = recipes;