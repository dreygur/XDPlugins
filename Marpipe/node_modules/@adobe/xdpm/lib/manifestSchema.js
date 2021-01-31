const manifestScema = {
    required: ["id", "name", "version", "host", "uiEntryPoints"],
    properties: {
        id: {
            type: "string",
            pattern: "(\\l|\\w|\\d){8}"
        },
        name: {
            type: "string",
            minLength: 3,
            maxLength: 45
        },
        version: {
            type: "string",
            pattern: "^[1-9]?[0-9].[1-9]?[0-9].[1-9]?[0-9]$"
        },
        icons: {
            type: "array",
            maxItems: 2,
            minItems: 2,
            uniqueItems: true,
            items: {
                required: ["path", "width", "height"],
                properties: {
                    path: {
                        type: "string"
                    },
                    width: {
                        type: "integer",
                        enum: [24, 48]
                    },
                    height: {
                        type: "integer",
                        enum: [24, 48]
                    }
                }
            }
        },
        host: {
            type: "object",
            required: ["app", "minVersion"],
            properties: {
                app: {
                    type: "string",
                    enum: ["XD"]
                },
                minVersion: {
                    type: "string",
                    pattern: "^([1-9][0-9]+|[0-9])\.([0-9]+[1-9]|[0-9])$"
                },
                maxVersion: {
                    type: "string",
                    pattern: "^([1-9][0-9]+|[0-9])\.([0-9]+[1-9]|[0-9])$"
                }
            }
        },
        uiEntryPoints: {
            oneOf: [
                {
                    type: "array",
                    minItems: 1,
                    maxItems: 1,
                    uniqueItems: true,
                    items: {
                        required: ["type"],
                        properties: {
                            type: {
                                type: "string",
                                enum: ["menu", "panel"]
                            },
                            label: {
                                type: ["string", "object"]
                            },
                            commandId: {
                                type: "string"
                            },
                            panelId: {
                                type: "string"
                            },
                            shortcut: {
                                type: "object",
                                properties: {
                                    mac: { type: "string" },
                                    win: { type: "string" }
                                }
                            }
                        }
                    }
                },
                {
                    type: "array",
                    minItems: 2,
                    uniqueItems: true,
                    items: {
                        required: ["type", "label"],
                        properties: {
                            type: {
                                type: "string",
                                enum: ["menu", "panel"]
                            },
                            label: {
                                type: ["string", "object"]
                            },
                            commandId: {
                                type: "string"
                            },
                            panelId: {
                                type: "string"
                            },
                            shortcut: {
                                type: "object",
                                properties: {
                                    mac: { type: "string" },
                                    win: { type: "string" }
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
};

module.exports = manifestScema;
