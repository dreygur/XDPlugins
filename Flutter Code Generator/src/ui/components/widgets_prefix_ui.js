function widgetsPrefixUi() {
    const title = '<H2>Widget name prefix</H2>';
    const input = '<input class="uiTextField" type="TextField" id="widgetsPrexix" name="widgetsPrexix">';
    return title + input;
}

module.exports = {
    widgetsPrefixUi: widgetsPrefixUi,
};
