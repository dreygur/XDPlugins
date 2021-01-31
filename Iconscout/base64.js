/*
 * Implements base64 decode and encode in browser that
 * it hasn't support of window.btoa and window.atob
 * methods.
 * Based in Nick Galbreath
 * http://code.google.com/p/stringencoders/source/browse/#svn/
 * and Carlo Zottmann jQuery port
 * http://github.com/carlo/jquery-base64
 * Adapted by SeViR in DIGIO
 */

if (!window.atob && !window.btoa){
 ( function( window ) {
    var _PADCHAR = "=",
      _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
   
    function _getbyte64( s, i ) { 
      var idx = _ALPHA.indexOf( s.charAt( i ) );
   
      if ( idx === -1 ) {
        throw "Cannot decode base64";
      }
   
      return idx;
    }
   
    function _decode( s ) {
      var pads = 0,
        i,
        b10,
        imax = s.length,
        x = [];
   
      s = String( s );
   
      if ( imax === 0 ) {
        return s;
      }
   
      if ( imax % 4 !== 0 ) {
        throw "Cannot decode base64";
      }
   
      if ( s.charAt( imax - 1 ) === _PADCHAR ) {
        pads = 1;
   
        if ( s.charAt( imax - 2 ) === _PADCHAR ) {
          pads = 2;
        }
   
        // either way, we want to ignore this last block
        imax -= 4;
      }
   
      for ( i = 0; i < imax; i += 4 ) {
        b10 = ( _getbyte64( s, i ) << 18 ) | ( _getbyte64( s, i + 1 ) << 12 ) | ( _getbyte64( s, i + 2 ) << 6 ) | _getbyte64( s, i + 3 );
        x.push( String.fromCharCode( b10 >> 16, ( b10 >> 8 ) & 0xff, b10 & 0xff ) );
      }
   
      switch ( pads ) {
        case 1:
          b10 = ( _getbyte64( s, i ) << 18 ) | ( _getbyte64( s, i + 1 ) << 12 ) | ( _getbyte64( s, i + 2 ) << 6 );
          x.push( String.fromCharCode( b10 >> 16, ( b10 >> 8 ) & 0xff ) );
          break;
   
        case 2:
          b10 = ( _getbyte64( s, i ) << 18) | ( _getbyte64( s, i + 1 ) << 12 );
          x.push( String.fromCharCode( b10 >> 16 ) );
          break;
      }
   
      return x.join( "" );
    }
   
    function _getbyte( s, i ) {
      var x = s.charCodeAt( i );
   
      if ( x > 255 ) {
        throw "INVALID_CHARACTER_ERR: DOM Exception 5";
      }
   
      return x;
    }
   
    function _encode( s ) {
      if ( arguments.length !== 1 ) {
        throw "SyntaxError: exactly one argument required";
      }
   
      s = String( s );
   
      var i,
        b10,
        x = [],
        imax = s.length - s.length % 3;
   
      if ( s.length === 0 ) {
        return s;
      }
   
      for ( i = 0; i < imax; i += 3 ) {
        b10 = ( _getbyte( s, i ) << 16 ) | ( _getbyte( s, i + 1 ) << 8 ) | _getbyte( s, i + 2 );
        x.push( _ALPHA.charAt( b10 >> 18 ) );
        x.push( _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) );
        x.push( _ALPHA.charAt( ( b10 >> 6 ) & 0x3f ) );
        x.push( _ALPHA.charAt( b10 & 0x3f ) );
      }
   
      switch ( s.length - imax ) {
        case 1:
          b10 = _getbyte( s, i ) << 16;
          x.push( _ALPHA.charAt( b10 >> 18 ) + _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) + _PADCHAR + _PADCHAR );
          break;
   
        case 2:
          b10 = ( _getbyte( s, i ) << 16 ) | ( _getbyte( s, i + 1 ) << 8 );
          x.push( _ALPHA.charAt( b10 >> 18 ) + _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) + _ALPHA.charAt( ( b10 >> 6 ) & 0x3f ) + _PADCHAR );
          break;
      }
   
      return x.join( "" );
    }

    window.btoa = _encode;
    window.atoa = _decode;
   
  })( window );
}