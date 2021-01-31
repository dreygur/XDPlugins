const Dialogs = require('./helpers/dialogs')

function isArtboard(node) {
    return node.constructor.name === "Artboard"
}

function artboards(nodes) {
    return nodes.filter(node => isArtboard(node))
}

function metaArtboards(nodes) {
    const artB = artboards(nodes)
    return artB.map(artboard => {
        return {
            artboard,
            left: artboard.globalBounds.x,
            top: artboard.globalBounds.y,
            right: artboard.globalBounds.x + artboard.globalBounds.width,
            bottom: artboard.globalBounds.y + artboard.globalBounds.height
        }
    })
}

function sequelize(selection, documentRoot) {
    const boards = metaArtboards(documentRoot.children);

    if (!boards.length) {
        return Dialogs.alert('No artboards are in document, please create some artboards.')
    }

    boards.sort(function (a, b) {
        return a.top == b.top ? a.left - b.left : a.top - b.top;
    });

    boards.forEach((board, i) => {
        let newName = board.artboard.name.trim()
        newName = newName.replace(/[0-9.\- ]*/sm, '').trim();
        newName = `${i + 1}. ${newName}`;
        board.artboard.name = newName;
    });

}

module.exports = {
    commands: {
        sequelize
    }
};
