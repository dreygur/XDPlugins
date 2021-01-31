/*
**  glyphs2ttf - Generates TTF Font + Dart wrapper
*/

const { alert, error } = require("./lib/dialogs.js")

var streamBuffers = require('stream-buffers')
var svgicons2svgfont = require("svgicons2svgfont")
var svg2ttf = require("svg2ttf")


async function showAlert(errorMsg) {
    await error("Export Flutter Icons Failed", errorMsg);
}

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

async function glyphs2ttf(cfg) {

    console.log("glyphs2ttf");

    var outstream = new svgicons2svgfont({
        fontName: cfg.fontName,
        fixedwidth: false,
        fontHeight: 1000,
        descent: 150,
        normalize: true,
        centerHorizontally: true,
        round: parseFloat("10e12"),
        error: function (err) { showAlert("** ERROR: " + err) }
    })

    var myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer({
        initialSize: (100 * 1024),   // start at 100 kilobytes.
        incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
    });

    outstream.pipe(myWritableStreamBuffer).on("finish", async function () {
        const svgFile = myWritableStreamBuffer.getContentsAsString();
        var ttf = svg2ttf(svgFile, {copyright: "Fin.Design © 2019"})
        await cfg.ttfFile.write(toArrayBuffer(Buffer.from(ttf.buffer)))
        myWritableStreamBuffer.end();
    })
    .on("error", function (err) {
        console.log(err)
        showAlert("** ERROR: " + err)        
    })

    for (var i = 0; i < cfg.glyphs.length; i++) {  
        var glyph = cfg.glyphs[i];
    
        var aBuffer = await glyph.glyph.read();
        var gstream = new streamBuffers.ReadableStreamBuffer({
            frequency: 10,   // in milliseconds.
            chunkSize: 2048  // in bytes.
        });

        gstream.put(aBuffer);
        gstream.stop();
        
        gstream.metadata = {
            name: glyph.name,
            unicode: [String.fromCharCode(glyph.code)]
        }
        outstream.write(gstream)
    }
    
    /*if (cfg.glyphs.length <= 1) {
        //  ugly workaround for at least Chrome/Opera (Blink engine) browsers:
        //    generate a font with at least 2 glyphs are the font will be silently rejected 
        var gstream
        for (var i = 0; i <= cfg.glyphs.length; i++) {
            gstream = fs.createReadStream(path.join(__dirname, "empty-glyph.svg"))
            gstream.metadata = {
                name: "EMPTY" + i,
                unicode: [String.fromCharCode(0xF8FF - i)]
            }
            outstream.write(gstream)
        }
    }*/
    outstream.end()
    
    for (var i = 0; i < cfg.glyphs.length; i++) {  
        var glyph = cfg.glyphs[i];
    
        await glyph.glyph.delete();
    }
    // generate dart wrapper sample  
    var dartFile = ""
    dartFile += "/// flutter:\n"
    dartFile += "///   fonts:\n"
    dartFile += "///    - family:  " + cfg.fontClassFileName + "\n"
    dartFile += "///      fonts:\n"
    dartFile += "///       - asset: fonts/" + cfg.fontFileName + "\n"
    dartFile += "///\n"
    dartFile += "/// \n"
    dartFile += "///\n"
    dartFile += "import 'package:flutter/widgets.dart';\n"
    dartFile += "\n"    
    dartFile += "class " + cfg.fontClassFileName + " {\n";
    dartFile += "\t"+ cfg.fontClassFileName +"._();\n"
    dartFile += "\n";  
    dartFile += "\tstatic const _kFontFam = '"+ cfg.fontClassFileName +"';\n"
    dartFile += "\n"
    cfg.glyphs.forEach(function (glyph) {
        dartFile += "\tstatic const IconData " + glyph.name + " = const IconData( 0x" + glyph.code.toString(16) + ", fontFamily: _kFontFam" + ( cfg.packageName != null && cfg.packageName.length > 0 ? ", fontPackage: '"+ cfg.packageName + "'" : " " ) + ");\n" 
    })
    dartFile += "}\n"
    await cfg.classFile.write(dartFile);
}

module.exports.glyphs2ttf = glyphs2ttf;