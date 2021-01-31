class Export {

    initArrays(){
        this.exportObj = { categoryImportRequests: [] }
        this.previewObj = { categoryImportRequests: [] }
    }

    constructor() {
        this.initArrays()
    }

    preview(resources, versions) {
        this.initArrays();
        const localization = this.getLocalizations(resources.localization, versions.localization, versions.lang)
        const image = this.getImages(resources.image, versions.image, true);
        const color = this.getColor(resources.color, versions.color);
        const appicon = this.getAppicon(resources.appicon, versions.appicon, true);


        this.previewObj.categoryImportRequests.length = 0;
        if (localization !== undefined) this.previewObj.categoryImportRequests.push(localization);
        if (image !== undefined) this.previewObj.categoryImportRequests.push(image);
        if (color !== undefined) this.previewObj.categoryImportRequests.push(color);
        if (appicon !== undefined) this.previewObj.categoryImportRequests.push(appicon);

        return this.previewObj;
    }

    export(resources, versions, status) {
        const localization = status.localization !== undefined ? this.getLocalizations(resources.localization, versions.localization, versions.lang) : undefined
        const image = status.image !== undefined ? this.getImages(resources.image, versions.image, false) : undefined;
        const color = status.color !== undefined ? this.getColor(resources.color, versions.color) : undefined;
        const appicon = status.appIcon !== undefined ? this.getAppicon(resources.appicon, versions.appicon, false) : undefined;

        if (localization !== undefined) this.exportObj.categoryImportRequests.length = 0;
        if (localization !== undefined) this.exportObj.categoryImportRequests.push(localization);
        if (image !== undefined) this.exportObj.categoryImportRequests.push(image);
        if (color !== undefined) this.exportObj.categoryImportRequests.push(color);
        if (appicon !== undefined) this.exportObj.categoryImportRequests.push(appicon);

        return this.exportObj;
    }

    getLocalizations(resource, version, lang) {
        if (version === undefined || resource.length === 0) return undefined;
        const localization = {
            categoryId: "localization",
            version: version,
            data: {
                keys: []
            }
        }

        resource.forEach(loc => {
            var object = {
                key: loc.key,
                translations: {
                },
                externalId: loc.id
            };

            object.translations[lang] = loc.value;
            localization.data.keys.push(object);
        });

        return localization;
    }

    getImages(resource, version, isPreview) {
        if (version === undefined || resource.length === 0) return undefined;
        const image = {
            categoryId: "image",
            version: version,
            data: {
                images: []
            }
        }

        resource.forEach(img => {
            var object = {
                externalId: img.id,
                name: img.name,
                sha256Hex: img.sha.toLowerCase(),
                mimeType: img.mimetype
            };

            if (!isPreview) object["image"] = img.file;
            image.data.images.push(object);
        });

        return image;
    }

    getColor(resource, version) {
        if (version === undefined || resource.length === 0) return undefined;
        const color = {
            categoryId: "color",
            version: version,
            data: {
                colors: []
            }
        }

        resource.forEach(img => {
            var object = {
                key: img.key,
                color: {
                    red: img.argb.r,
                    green: img.argb.g,
                    blue: img.argb.b,
                    alpha: img.argb.a,
                }
            };

            color.data.colors.push(object);
        });

        return color;
    }

    getAppicon(resource, version, isPreview) {
        if (version === undefined || resource.length === 0) return undefined;
        const appicon = {
            categoryId: "appIcon",
            version: version,
            data: {
                mode: resource.length > 1 ? "multi" : "single",
                files: []
            }
        }

        resource.forEach(icon => {
            var object = {
                type: resource.length > 1 ? icon.name === "App icon foreground" ? "foreground" : "background" : "singleIcon",
                fileName: icon.name,
                sha256Hex: icon.sha.toLowerCase(),
                externalId: icon.id,
                mimeType: icon.mimetype
            };

            if (!isPreview) object["image"] = icon.file;
            appicon.data.files.push(object);
        });

        return appicon;
    }

    parsePreviewResponse(response) {
        const status = {}

        response.categoryImportPreviews.forEach(previews => {
            Object.values(previews.importPreview.change.resourceChanges).forEach(changes => {
                if (!status[previews.categoryId]) status[previews.categoryId] = {}
                const resource = status[previews.categoryId]

                if (changes.type === 'OVERRIDE') resource['create'] = resource['create'] + 1 || 1;
                else if (changes.type === 'PATCH') resource['update'] = resource['update'] + 1 || 1;
                else if (changes.type === 'DELETE') resource['delete'] = resource['delete'] + 1 || 1;
                else resource['none'] = resource['none'] + 1 || 1;
            });
        });
        return status;
    }
}

module.exports = Export;