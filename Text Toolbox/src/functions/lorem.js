/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const {Text} = require("scenegraph");
const trimHeight = require('./trimHeight');
const debugHelper = require('../helpers/debug');
const SelectionChecker = require('../helpers/check-selection');

const analytics = require("../helpers/analytics");

const texts = {
    'lorem-lat': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    'cicero-lat': 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
    'cicero-en': 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.',
    'pangram-en': 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax my big quiz. Quick, Baz, get my woven flax jodhpurs! "Now fax quiz Jack!" my brave ghost pled. Five quacking zephyrs jolt my wax bed. Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart jug of bad milk. A very bad quack might jinx zippy fowls. Few quips galvanized the mock jury box. Quick brown dogs jump over the lazy fox. The jay, pig, fox, zebra, and my wolves quack! Blowzy red vixens fight for a quick jump. Joaquin Phoenix was gazed by MTV for luck. A wizard’s job is to vex chumps quickly in fog. Watch "Jeopardy!", Alex Trebek\'s fun TV quiz game.',
    'pangram-de': 'Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. "Fix, Schwyz!" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. "Fix, Schwyz!" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung.Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim.',
    'pangram-es': 'Quiere la boca exhausta vid, kiwi, piña y fugaz jamón. Fabio me exige, sin tapujos, que añada cerveza al whisky. Jovencillo emponzoñado de whisky, ¡qué figurota exhibes! La cigüeña tocaba cada vez mejor el saxofón y el búho pedía kiwi y queso. El jefe buscó el éxtasis en un imprevisto baño de whisky y gozó como un duque. Exhíbanse politiquillos zafios, con orejas kilométricas y uñas de gavilán. El cadáver de Wamba, rey godo de España, fue exhumado y trasladado en una caja de zinc que pesó un kilo. El pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y frío, añoraba a su querido cachorro. El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja. Quiere la boca exhausta vid, kiwi, piña y fugaz jamón. Fabio me exige, sin tapujos, que añada cerveza al whisky. Jovencillo emponzoñado de whisky, ¡qué figurota exhibes! La cigüeña tocaba cada vez mejor el saxofón y el búho pedía kiwi y queso. El jefe buscó el éxtasis en un imprevisto baño de whisky y gozó como un duque. Exhíbanse politiquillos zafios, con orejas kilométricas y uñas de gavilán. El cadáver de Wamba, rey godo de España, fue exhumado y trasladado en una caja de zinc que pesó un kilo. El pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y frío, añoraba a su querido cachorro. El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.Quiere la boca exhausta vid, kiwi, piña y fugaz jamón. Fabio me exige, sin tapujos, que añada cerveza al whisky. Jovencillo emponzoñado de whisky, ¡qué figurota exhibes! La cigüeña tocaba cada vez mejor el saxofón y el búho pedía kiwi y queso.',
    'pangram-fr': 'Voyez ce jeu exquis wallon, de graphie en kit mais bref. Portez ce vieux whisky au juge blond qui fume sur son île intérieure, à côté de l\'alcôve ovoïde, où les bûches se consument dans l\'âtre, ce qui lui permet de penser à la cænogenèse de l\'être dont il est question dans la cause ambiguë entendue à Moÿ, dans un capharnaüm qui, pense-t-il, diminue çà et là la qualité de son œuvre. Prouvez, beau juge, que le fameux sandwich au yak tue. L\'île exiguë, Où l\'obèse jury mûr Fête l\'haï volapük, Âne ex æquo au whist, Ôtez ce vœu déçu. Vieux pelage que je modifie : breitschwanz ou yak ? Dès Noël où un zéphyr haï me vêt de glaçons würmiens, je dîne d’exquis rôtis de bœuf au kir à l’aÿ d’âge mûr & cætera ! Fougueux, j\'enivre la squaw au pack de beau zythum. Ketch, yawl, jonque flambant neuve… jugez des prix ! Voyez le brick géant que j\'examine près du wharf. Portez ce vieux whisky au juge blond qui fume. Bâchez la queue du wagon-taxi avec les pyjamas du fakir. Voix ambiguë d\'un cœur qui, au zéphyr, préfère les jattes de kiwis. Mon pauvre zébu ankylosé choque deux fois ton wagon jaune. Perchez dix, vingt woks. Qu\'y flambé-je ? Le moujik équipé de faux breitschwanz voyage. Kiwi fade, aptéryx, quel jambon vous gâchez ! Jugez qu\'un vieux whisky blond pur malt fonce. Faux kwachas ? Quel projet de voyage zambien ! Fripon, mixez l\'abject whisky qui vidange. Vif juge, trempez ce blond whisky aqueux. Vif P-DG mentor, exhibez la squaw jockey.',
};

/**
 * Fills text area with placeholder text (Lorem Ipsum)
 * @param {Selection} selection
 * @param {object} options
 * @param {boolean} options.trim
 * @param {boolean} options.terminate
 * @param {boolean} options.includeLineBreaks
 * @param {string} options.text
 */
function lorem(selection, options) {
    // TODO: Add support for Groups inside RepeatGrids (on the other hand: forget that, it's currently unsupported by the APIs ;-))
    debugHelper.log('Lorem ipsum with options ', (options));
    let terminationString = options.terminate ? '.' : '';
    for (let element of selection.items) {
        if (SelectionChecker.checkForType(element, 'AreaText')) {
            let prevCount = 0;
            let count = 1;
            debugHelper.log('Propagating forward');
            do {
                prevCount = count;
                count *= 2;
                applyText(element, loremText(count, options.text, options.includeLineBreaks) + terminationString);
            } while (!element.clippedByArea && count < 100000);
            debugHelper.log('Propagating backwards from ', count);
            count = checkBetween(prevCount, count, (count) => {
                applyText(element, loremText(count, options.text, options.includeLineBreaks) + terminationString);
                return element.clippedByArea;
            });

            applyText(element, loremText(count, options.text, options.includeLineBreaks) + terminationString);
            debugHelper.log('Completed at ', count);

            if (options.trim) {
                trimHeight(selection);
            }
        } else if (SelectionChecker.checkForType(element, 'PointText')) {
            element.text = loremText(2, options.text, false) + terminationString;
        } else {
            debugHelper.log('Node ', element, ' is not a text area.');
        }
    }
    analytics.send('lorem', options);
}

/**
 * Applies text to the passed text layer (also, if it's e.g. inside a RepeatGrid
 * @param {Text} textLayer
 * @param {string} text
 */
function applyText(textLayer, text) {
    /*let optRepeatGridNode = textLayer;
    do {
        optRepeatGridNode = optRepeatGridNode.parent;
    } while (optRepeatGridNode.constructor.name !== 'RepeatGrid' && optRepeatGridNode);*/
    let optRepeatGridNode;
    if (textLayer.parent.parent && textLayer.parent.parent.constructor.name === 'RepeatGrid') {
        optRepeatGridNode = textLayer.parent.parent;
    }

    if (optRepeatGridNode)
        optRepeatGridNode.attachTextDataSeries(textLayer, [text]);
    else
        textLayer.text = text;
}

/**
 * @param oldCount The highest count that was clipped
 * @param newCount The lowest count that wasn't clipped
 * @param {function(count:number): boolean} isClipped
 */
function checkBetween(oldCount, newCount, isClipped) {
    debugHelper.log('Checking between ', oldCount, ' and ', newCount);

    if (Math.abs(oldCount - newCount) < 2)
        return oldCount;

    let half = Math.floor((oldCount + newCount) / 2);

    return isClipped(half) ? checkBetween(oldCount, half, isClipped) : checkBetween(half, newCount, isClipped);
}

function loremText(count, text, includeLineBreaks) {
    function trimToNWords(strText, n, includeLineBreaks) {
        // Ensure text is long enough:
        while (strText.split(" ").length < n) {
            strText = includeLineBreaks ? (strText + "\n" + strText) : (strText + " " + strText);
        }
        return strText
            .split(" ")
            .splice(0, n)
            .join(" ");
    }

    let originalString = texts[text];
    let strReturn = trimToNWords(originalString, count, includeLineBreaks).trim();
    if (strReturn.endsWith('.') || strReturn.endsWith(',') || strReturn.endsWith('?') || strReturn.endsWith(';') || strReturn.endsWith(':') || strReturn.endsWith('-') || strReturn.endsWith('–') || strReturn.endsWith('!'))
        strReturn = strReturn.substr(0, strReturn.length - 1);
    return strReturn;
}

module.exports = lorem;