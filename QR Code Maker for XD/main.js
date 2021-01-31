const {Text, Color, Artboard, Rectangle, Group} = require("scenegraph");

function creQR (txt, selection, documentRoot){
   'use strict';
	var data = txt;
	var erjct = [];
	erjct["L"]=0;
	erjct["M"]=1;
	erjct["Q"]=2;
	erjct["H"]=3;
	var lvl = 0;
	var msk = "";
	var mxVer = 40;
	var mxMd = 17+mxVer*4;
	var code = [];
	code.length = 3706;
	var idCd;
	var reg;
	var rgBt;

	var eccCWLen = [
		[  7, 10, 13, 17],  //1
		[10, 16, 22, 28],  //2
		[15, 26, 18, 22],  //3
		[20, 18, 26, 16],  //4
		[26, 24, 18, 22],  //5
		[18, 16, 24, 28],  //6
		[20, 18, 18, 26],  //7
		[24, 22, 22, 26],  //8
		[30, 22, 20, 24],  //9
		[18, 26, 24, 28],  // 10
		[20, 30, 28, 24],  // 11
		[24, 22, 26, 28],  // 12
		[26, 22, 24, 22],  // 13
		[30, 24, 20, 24],  // 14
		[22, 24, 30, 24],  // 15
		[24, 28, 24, 30],  // 16
		[28, 28, 28, 28],  // 17
		[30, 26, 28, 28],  // 18
		[28, 26, 26, 26],  // 19
		[28, 26, 30, 28],  // 20
		[28, 26, 28, 30],  // 21
		[28, 28, 30, 24],  // 22
		[30, 28, 30, 30],  // 23
		[30, 28, 30, 30],  // 24
		[26, 28, 30, 30],  // 25
		[28, 28, 28, 30],  // 26
		[30, 28, 30, 30],  // 27
		[30, 28, 30, 30],  // 28
		[30, 28, 30, 30],  // 29
		[30, 28, 30, 30],  // 30
		[30, 28, 30, 30],  // 31
		[30, 28, 30, 30],  // 32
		[30, 28, 30, 30],  // 33
		[30, 28, 30, 30],  // 34
		[30, 28, 30, 30],  // 35
		[30, 28, 30, 30],  // 36
		[30, 28, 30, 30],  // 37
		[30, 28, 30, 30],  // 38
		[30, 28, 30, 30],  // 39
		[30, 28, 30, 30]	// 40
	];

	var RSblks = [
		[  1,   1,   1,   1],  //1
		[  1,   1,   1,   1],  //2
		[  1,   1,   2,   2],  //3
		[  1,   2,   2,   4],  //4
		[  1,   2,   4,   4],  //5
		[  2,   4,   4,   4],  //6
		[  2,   4,   6,   5],  //7
		[  2,   4,   6,   6],  //8
		[  2,   5,   8,   8],  //9
		[  4,   5,   8,   8],  // 10
		[  4,   5,   8, 11],  // 11
		[  4,   8, 10, 11],  // 12
		[  4,   9, 12, 16],  // 13
		[  4,   9, 16, 16],  // 14
		[  6, 10, 12, 18],  // 15
		[  6, 10, 17, 16],  // 16
		[  6, 11, 16, 19],  // 17
		[  6, 13, 18, 21],  // 18
		[  7, 14, 21, 25],  // 19
		[  8, 16, 20, 25],  // 20
		[  8, 17, 23, 25],  // 21
		[  9, 17, 23, 34],  // 22
		[  9, 18, 25, 30],  // 23
		[10, 20, 27, 32],  // 24
		[12, 21, 29, 35],  // 25
		[12, 23, 34, 37],  // 26
		[12, 25, 34, 40],  // 27
		[13, 26, 35, 42],  // 28
		[14, 28, 38, 45],  // 29
		[15, 29, 40, 48],  // 30
		[16, 31, 43, 51],  // 31
		[17, 33, 45, 54],  // 32
		[18, 35, 48, 57],  // 33
		[19, 37, 51, 60],  // 34
		[19, 38, 53, 63],  // 35
		[20, 40, 56, 66],  // 36
		[21, 43, 59, 70],  // 37
		[22, 45, 62, 74],  // 38
		[24, 47, 65, 77],  // 39
		[25, 49, 68, 81]   // 40
	];

	var eccpAp = new Array();
	eccpAp.length = 30;
	eccpAp[ 6] = [87, 229, 146, 149, 238, 102, 21];
	eccpAp[ 9] = [251, 67, 46, 61, 118, 70, 64, 94, 32, 45];
	eccpAp[12] = [74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78];
	eccpAp[14] = [8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105];
	eccpAp[15] = [120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120];
	eccpAp[16] = [43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136];
	eccpAp[17] = [215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153];
	eccpAp[19] = [17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190];
	eccpAp[21] = [210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231];
	eccpAp[23] = [229, 121, 135, 48, 211, 117, 251, 126, 159, 180, 169, 152, 192, 226, 228, 218, 111, 0, 117, 232, 87, 96, 227, 21];
	eccpAp[25] = [173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53,161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70];
	eccpAp[27] = [168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123];
	eccpAp[29] = [41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130, 156, 37, 251, 216, 238, 40, 192, 180];

	var posRsvdPt = [
		[0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x41],
		[0x80, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x80, 0x40],
		[0x80, 0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x81, 0x80, 0x40],
		[0x80, 0x81, 0x80, 0x81, 0x81, 0x81, 0x80, 0x81, 0x80, 0x40],
		[0x80, 0x81, 0x80, 0x81, 0x81, 0x81, 0x80, 0x81, 0x80, 0x40],
		[0x80, 0x81, 0x80, 0x81, 0x81, 0x81, 0x80, 0x81, 0x80, 0x40],
		[0x80, 0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x81, 0x80, 0x40],
		[0x80, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x80, 0x40],
		[0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x40]
	];

	var pstng = [
		[],										 //1
		[  6,  18],								//2
		[  6,  22],								//3
		[  6,  26],								//4
		[  6,  30],								//5
		[  6,  34],								//6
		[  6,  22,  38],						  //7
		[  6,  24,  42],						  //8
		[  6,  26,  46],						  //9
		[  6,  28,  50],						  // 10
		[  6,  30,  54],						  // 11
		[  6,  32,  58],						  // 12
		[  6,  34,  62],						　// 13
		[  6,  26,  46,  66],					// 14
		[  6,  26,  48,  70],					// 15
		[  6,  26,  50,  74],					// 16
		[  6,  30,  54,  78],					// 17
		[  6,  30,  56,  82],					// 18
		[  6,  30,  58,  86],					// 19
		[  6,  34,  62,  90],					// 20
		[  6,  28,  50,  72,  94],			　// 21
		[  6,  26,  50,  74,  98],			　 // 22
		[  6,  30,  54,  78, 102],			　// 23
		[  6,  28,  54,  80, 106],			　// 24
		[  6,  32,  58,  84, 110],			　// 25
		[  6,  30,  58,  86, 114],			　// 26
		[  6,  34,  62,  90, 118],			　// 27
		[  6,  26,  50,  74,  98, 122],		 // 28
		[  6,  30,  54,  78, 102, 126],		// 29
		[  6,  26,  52,  78, 104, 130],		// 30
		[  6,  30,  56,  82, 108, 134],		// 31
		[  6,  34,  60,  86, 112, 138],		// 32
		[  6,  30,  58,  86, 114, 142],		// 33
		[  6,  34,  62,  90, 118, 146],		// 34
		[  6,  30,  54,  78, 102, 126, 150],  // 35
		[  6,  24,  50,  76, 102, 128, 154],  // 36
		[  6,  28,  54,  80, 106, 132, 158],  // 37
		[  6,  32,  58,  84, 110, 136, 162],  // 38
		[  6,  26,  54,  82, 110, 138, 166],  // 39
		[  6,  30,  58,  86, 114, 142, 170]	// 40
	];
	var frmInf = [
		[0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976],  //L
		[0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0],  //M
		[0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed], //Q
		[0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b] //H
	];
	var vrInf = [0x07c94, 0x085bc, 0x09a99, 0x0a4d3, 0x0bbf6, 0x0c762, 0x0d847, 0x0e60d,
			 0x0f928, 0x10b78, 0x1145d, 0x12a17, 0x13532, 0x149a6, 0x15683,
			 0x168c9, 0x177ec, 0x18ec4, 0x191e1, 0x1afab, 0x1b08e, 0x1cc1a,
			 0x1d33f, 0x1ed75, 0x1f250, 0x209d5, 0x216f0, 0x228ba, 0x2379f,
			 0x24b0b, 0x2542e, 0x26a64, 0x27541, 0x28c69];

	var exToN = new Array();
	exToN.length = 255;
	var nToEx = new Array();
	nToEx.length = 256;
	var n = 0x01;
	for(var i=0;i<255;i++) {
		exToN[i] = n;
		nToEx[n] = i;
		n <<= 1;
		if(n & 0x100){
			n = n & 0xff ^ 0x1d;
			}
		}

	var symArry = [];
	symArry.length = mxMd;
	var bitArry = [];
	bitArry.length = mxMd;
	for(i=0;i<mxMd;i++) {
		symArry[i] = [];
		symArry[i].length = mxMd;
		bitArry[i] = [];
		bitArry[i].length = mxMd;
		}


		if(!data.length)  return;
		var strs = Array();
		var lfCd = String.fromCharCode(10);
		var crCd = String.fromCharCode(13);
		if (data.indexOf (lfCd)>=0){
			strs = data.split (lfCd);
			data = "";
			for (var loop=0;loop<strs.length;loop++){
				data += strs[loop] + crCd + lfCd;
				}
			}
		var lvChr = 2;
		var mskNm = 0;
		var level = 0;
		var mode;
		var datLen = 0;
		var fNm, fLatin, fSjis, uni;
		fNm =  fLatin= fSjis = 1;
		mode = 4;
		var version;
		var chrLenBt;
		var cdWrds;
		var maxChar;
		idCd = 0;
		reg = 0;
		rgBt = 0;
		switch(mode) {
			case 0:
				for(version=1; version<=mxVer;version++) {
					if (version<=9) {
						chrLenBt = 10;
					} else if (version<=26) {
						chrLenBt = 12;
					} else {
						chrLenBt = 14;
						}
					cdWrds = get_cdWrds(version, level);
					var num1 = cdWrds * 8 - 4 - chrLenBt;
					maxChar = Math.floor(num1 / 10) * 3;
					num1 %= 10;
					if (num1>= 4) {
						if (num1>=7) {
							maxChar = maxChar + 2;
						} else {
							maxChar++;
							}
						}
					if(datLen<=maxChar)
						break;
					}
				if(version>mxVer) {
					alert("Too long text length.");
					data = null;
					return;
					}
				put_code(0x1, 4);
				put_code(datLen, chrLenBt);
				//data
				for(i=0;;i+=3) {
					if(i+2<datLen) {
						put_code(Number(data.substr(i, 3)), 10);
					} else {
						if (i+1<datLen) {
							put_code(Number(data.substr(i, 2)), 7);
						} else if (i<datLen) {
							put_code(Number(data.charAt(i)), 4);
							}
						break;
						}
					}
				break;
			case 1:
				for(version=1;version<=mxVer;version++) {
					if (version<=9){
						chrLenBt = 9;
					} else if (version<=26){
						chrLenBt = 11;
					} else {
						chrLenBt = 13;
						}
					cdWrds = get_cdWrds(version, level);
					var n1 = cdWrds * 8 - 4 - chrLenBt;
					maxChar = Math.floor(n1 / 11) * 2;
					if (n1%11>=6){
						maxChar++;
						}
					if (datLen <= maxChar) break;
					}
				if(version > mxVer) {
					alert("Too long text length.");
					data = null;
					return;
					}
				put_code(0x2, 4);
				put_code(datLen, chrLenBt);
				for(i=0;i<datLen; ) {
					if(i+1<datLen) {
						put_code(ltn_val(data.charAt(i)) * 45 + ltn_val(data.charAt(i+1)), 11);
						i += 2;
					} else {
						put_code(ltn_val(data.charAt(i)), 6);
						i++;
						}
					}
				break;
			case 2:
				for(version=1;version<=mxVer;version++) {
					if (version<=9) {
						chrLenBt = 8;
					} else {
						chrLenBt = 16;
						}
					cdWrds = get_cdWrds(version, level);
					maxChar = Math.floor((cdWrds * 8 - 4 - chrLenBt) / 8);
					if(datLen<=maxChar) break;
					}
				if(version>mxVer) {
					alert("Too long text length.");
					data = null;
					return;
					}
				put_code(0x4, 4);
				put_code(datLen, chrLenBt);
				for (i=0;i<data.length;i++) {
					var chrCd = data.charCodeAt(i);
					if (chrCd<0x80) {
						put_code(chrCd, 8);
					} else if (chrCd==0xa5) {
						put_code(0x5c, 8);
					} else if (chrCd==0x203e) {
						put_code(0x7e, 8);
					} else if (chrCd>=0xff61&&chrCd<=0xff9f) {
						put_code(chrCd-0xfec0, 8);
					} else {
						put_code((sjisCd[chrCd]), 16);
						}
					}
				break;
			case 3:
				datLen = data.length;
				for (version=1;version<=mxVer;version++) {
					if (version<=9) {
						chrLenBt = 8;
					} else if (version<=26) {
						chrLenBt = 10;
					} else {
						chrLenBt = 12;
						}
					cdWrds = get_cdWrds(version, level);
					maxChar = Math.floor((cdWrds * 8 - 4 - chrLenBt) / 13);
					if (datLen <= maxChar) break;
					}
				if (version > mxVer) {
					alert ("Too long text length.");
					data = null;
					return;
					}
				put_code (0x8, 4);
				put_code (datLen, chrLenBt);
				for (i=0;i<datLen;i++) {
					var chrCd = sjisCd[data.charCodeAt(i)]-0;
					if (chrCd<0xe000) {
						chrCd = chrCd - 0x8140;
					} else {
						chrCd = chrCd - 0xc140;
						}
					put_code((chrCd >>> 8) * 0xc0 + (chrCd & 0xff), 13);
					}
				break;
			case 4:
				var cd = [];
				var scd,j;
				for (var i=0;i<data.length;i++){
					scd = u16to8(data.charCodeAt(i));
					for (j=0;j<scd.length/2;j++){
						cd.push("0x"+scd.substr(2*j,2));
						}
					}
				var datLen = cd.length;
				var version;
				var chrLenBt;
				var cdWrds;
				var maxChar;
				idCd = 0;
				reg = 0;
				rgBt = 0;
				for(version=1;version<=mxVer;version++) {
					if (version<=9) {
						chrLenBt = 8;
					} else {
						chrLenBt = 16;
						}
					cdWrds = get_cdWrds(version, level);
					maxChar = Math.floor((cdWrds * 8 - 4 - chrLenBt) / 8);
					if(datLen<=maxChar) break;
					}
				if(version>mxVer) {
					alert("Too long text length.");
					data = null;
					return;
					}
				put_code(0x4, 4);
				put_code(datLen, chrLenBt);
				for (i=0;i<cd.length;i++) put_code(cd[i], 8);
				break;
			}

		if (datLen < maxChar) {
			if (rgBt<=4 || idCd<cdWrds-1) {
				put_code(0x0, 4);
				}
			}
		if (rgBt) {
			code[idCd++] = (reg << (8 - rgBt)) & 0xff;
			}
		for(;;) {
			if (idCd == cdWrds) break;
			code[idCd++] = 0xec;
			if (idCd == cdWrds) break;
			code[idCd++] = 0x11;
		}

		var numBlcks = RSblks[version-1][level];
		var numEccw = eccCWLen[version-1][level];
		var alpExpNm = eccpAp[numEccw-1];

		var numDat = 0;
		var numEcc = cdWrds;

		var num1 = Math.floor(cdWrds / numBlcks);
		var num2 = numBlcks - cdWrds % numBlcks;

		for (var numBlks=0;numBlks<numBlcks;numBlks++) {
			if (numBlks == num2) {
				num1++;
				}
			var datEcc = code.slice(numDat, numDat+num1);
			datEcc.length = num1 + numEccw;
			for (i=0;i<numEccw;i++) {
				datEcc[num1+i] = 0;
				}
			for (i=0;i<num1;i++) {
				if (datEcc[i]) {
					var exp1 = nToEx[datEcc[i]];
					for (j=0;j<numEccw;j++) {
						datEcc[i+1+j] ^= exToN[(alpExpNm[j]+exp1) % 255];
						}
					}
				}
			for (i=0;i<numEccw;i++) {
				code[numEcc+i] = datEcc[num1+i];
				}
			numDat = numDat + num1;
			numEcc = numEcc + numEccw;
			}
		var mdlsNum = 21 + (version - 1) * 4;
		for (i=0;i<mdlsNum;i++) {
			for (j=0;j<mdlsNum;j++) {
				symArry[i][j] = 0;
				}
			}
		for (i=0;i<8;i++) {
			for (j=0;j<9;j++) {
				symArry[i][j] = posRsvdPt[i+1][1+j];
				}
			for (j=0;j<8;j++) {
				symArry[i][mdlsNum-8+j] = posRsvdPt[i+1][j];
				}
			for (j=0;j<9;j++) {
				symArry[mdlsNum-8+i][j] = posRsvdPt[i][1+j];
				}
			}

		symArry[8].splice(0, 9, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40);
		symArry[8].splice(mdlsNum - 8, 8, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40);
		if (version>=7) {
			for (i=11;i>=9;i--) {
				symArry[mdlsNum-i].splice(0, 6, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40);
				}
			for (i=0;i<=5;i++) {
				symArry[i].splice(mdlsNum-11, 3, 0x40, 0x40, 0x40);
				}
			}
		for (i=8;i<mdlsNum-9;i+=2) {
			symArry[6][i] = symArry[i][6] = 0x81;
			symArry[6][i+1] = symArry[i+1][6] = 0x80;
			}
		symArry[6][i] = symArry[i][6] = 0x81;
		var x,y;
		num1 = pstng[version-1].length;
		for (i=0;i<num1;i++) {
			y = pstng[version-1][i];
			for (j=0;j<num1;j++) {
				if ((i==0&&j==0)||(i==0&&j==num1-1)||(i==num1-1&& j==0)) {
				} else {
					x = pstng[version-1][j];
					symArry[y-2].splice(x-2, 5, 0x81, 0x81, 0x81, 0x81, 0x81);
					symArry[y-1].splice(x-2, 5, 0x81, 0x80, 0x80, 0x80, 0x81);
					symArry[y].splice(x-2, 5, 0x81, 0x80, 0x81, 0x80, 0x81);
					symArry[y+1].splice(x-2, 5, 0x81, 0x80, 0x80, 0x80, 0x81);
					symArry[y+2].splice(x-2, 5, 0x81, 0x81, 0x81, 0x81, 0x81);
					}
				}
			}

		num1 = Math.floor(cdWrds / numBlcks);
		num2 = numBlcks - cdWrds % numBlcks;
		numBlks = 0;
		idCd = 0;

		var fstCd = code[0];
		var b1 = 0x80;
		i = j = mdlsNum - 1;
		var direction = 0;
		var orientation = 0;
		var k, b2;
		for (;;) {
			if (!symArry[i][j]) {
				symArry[i][j] = (fstCd & b1) ? 1 : 0;
				if (!(b1 >>= 1)) {
					if (++numBlks==numBlcks) {
						numBlks = 0;
						idCd++;
						if (num1) {
							if (idCd==num1) {
								if (num2==numBlcks) {
									num1 = 0;
									idCd = 0;
								} else {
									numBlks = num2;
									}
							} else if (idCd>num1) {
								num1 = 0;
								idCd = 0;
								}
						} else {
							if (idCd==numEccw) break;
							}
						}
					if (num1) {
						k = numBlks * num1;
						if (numBlks>num2) {
							k = k + numBlks - num2;
							}
					} else {
						k = cdWrds + numBlks * numEccw;
						}
					fstCd = code[k+idCd];
					b1 = 0x80;
					}
				}
			if (orientation) {
				if (direction) {
					if (i<mdlsNum-1) {
						i++;
						j++;
					} else {
						direction = 0;
						if (--j==6) {
							j = 5;
							}
						}
				} else {
					if (i) {
						i--;
						j++;
					} else {
						direction = 1;
						if (--j==6) {
							j = 5;
							}
						}
					}
				orientation = 0;
			} else {
				j--;
				orientation = 1;
				}
			}

		var mask;
		var minPenalty = 0x7fffffff;
		var m;
		var p_md,md_f;
		for (m=0x0;m<=0x7;m++) {
			masking(mdlsNum, m, level, version);
			var penalty = 0;
			for (i=0;i< mdlsNum;i++) {
				// 行
				b1 = bitArry[i][0];
				num1 = 1;
				b2 = bitArry[0][i];
				num2 = 1;
				for (j=1;j< mdlsNum;j++) {
					if (bitArry[i][j] == b1) {
						num1++;
						}
					else {
						if (num1 >= 5) penalty = penalty + 3 + (num1 - 5);
						b1 = bitArry[i][j];
						num1 = 1;
						}
					if (bitArry[j][i] == b2) {
						num2++;
						}
					else {
						if (num2>=5) penalty = penalty + 3 + (num2 - 5);
						b2 = bitArry[j][i];
						num2 = 1;
						}
					}
				if (num1>=5) {
					penalty = penalty + 3 + (num1 - 5);
				}
				if (num2>=5) {
					penalty = penalty + 3 + (num2 - 5);
					}
				}
			for (i=0;i<mdlsNum-1;i++) {
				for (j=0;j<mdlsNum-1;j++) {
					b1 = bitArry[i][j];
					if (bitArry[i][j+1]==b1 && bitArry[i+1][j]==b1 && bitArry[i+1][j+1]==b1) {
						penalty = penalty + 3;
						}
					}
				}
			var cnt = new Array();
			cnt.length = 7;
			for (i=0;i<mdlsNum;i++) {
				k = 0;
				for (j=0;;) {
					for (;k<7;k++) {
						x = j;
						for (;j<mdlsNum;j++) {
							if (bitArry[i][j]^(k&0x01)) break;
							}
						cnt[k] = j - x;
						if (j==mdlsNum) break;
						}
					if (k>=5) {
						if (k==5) {
							cnt[6] = 0;
							}
						if (cnt[2]==cnt[1] && cnt[3]==cnt[1]*3 && cnt[4]==cnt[1] && cnt[5]==cnt[1]
							&& (cnt[0]>=cnt[1]*4 || cnt[6]>=cnt[1]*4)) {
							penalty = penalty + 40;
							if (j<mdlsNum) {
								cnt[0] = cnt[4];
								cnt[1] = cnt[5];
								cnt[2] = cnt[6];
								k = 3;
								continue;
								}
							}
						}
					if (j==mdlsNum) break;
					cnt[0] = cnt[2];
					cnt[1] = cnt[3];
					cnt[2] = cnt[4];
					cnt[3] = cnt[5];
					cnt[4] = cnt[6];
					k = 5;
					}
				}
			for (j=0;j<mdlsNum;j++) {
				k = 0;
				for (i=0;;) {
					for (;k<7;k++) {
						y = i;
						for (;i<mdlsNum;i++) if (bitArry[i][j]^(k&0x01)) break;
						cnt[k] = i - y;
						if (i==mdlsNum) break;
						}
					if (k>=5) {
						if (k==5)
							cnt[6] = 0;
						if (cnt[2]==cnt[1]&&cnt[3]==cnt[1]*3&&cnt[4]==cnt[1]&&cnt[5]==cnt[1]
							&&(cnt[0]>=cnt[1]*4||cnt[6]>=cnt[1]*4)) {
							penalty = penalty + 40;
							if (i<mdlsNum) {
								cnt[0] = cnt[4];
								cnt[1] = cnt[5];
								cnt[2] = cnt[6];
								k = 3;
								continue;
								}
							}
						}
					if (i==mdlsNum) break;
					cnt[0] = cnt[2];
					cnt[1] = cnt[3];
					cnt[2] = cnt[4];
					cnt[3] = cnt[5];
					cnt[4] = cnt[6];
					k = 5;
				}
			}
			num1 = 0;
			for (i=0;i<mdlsNum;i++) {
				for (j=0;j<mdlsNum;j++) {
					if (bitArry[i][j]) {
						num1++;
						}
					}
				}
			num2 = mdlsNum * mdlsNum;
			p_md = Math.round(num1 / num2 * 100);
			if (p_md!=50) {
				md_f = Math.ceil ((Math.abs (50 - p_md)) / 5);
				penalty = penalty + 10 * md_f;
				}
			if (penalty<minPenalty) {
				mask = m;
				minPenalty = penalty;
				}
			}

		if (mskNm!=null) mask = Number(mskNm);
		masking(mdlsNum, mask, level, version);

		var dgt = "'[[";
		for (i=0;i<mdlsNum;i++) {
			for(j=0;j<mdlsNum;j++) {
				dgt += bitArry[i][j].toString() + ",";
				}
			dgt += "],[";
			}
		dgt = dgt.replace(/,]/g,"]");
		dgt = dgt.substr(0,dgt.length-2) + "]"

//----post process  charactor Generate--------------------------------------------------------------------------------------------------------------------
	//const ab = new Artboard();
	var cSize = 3;
	var xPos = 12;
	var yPos = 12;
	var dfxPos = xPos

	var xQ = xPos - cSize * 4;
	var yQ = yPos + cSize * 4;
	var rect = new Rectangle;
	rect.width = cSize*mdlsNum + cSize*8;
	rect.height = rect.width;
	rect.fill = new Color("#fffff");
	rect.name = "QRCode";
	documentRoot.addChild(rect);
	
	for (i=0;i<mdlsNum;i++) {
		for (j=0;j<mdlsNum;j++) {
			if (bitArry[i][j]) {
				rect= new Rectangle;
				rect.width = cSize;
				rect.height = cSize;
				rect.moveInParentCoordinates(yPos, xPos);
				rect.fill = new Color("#000000");
				documentRoot.addChild(rect)
				}
			xPos = xPos + cSize;
			}
		xPos = dfxPos;
		yPos = yPos + cSize;
		}
//---end post process.

	function get_cdWrds(version, level) {
		var numMdls;
		var n;
		numMdls = 21 + (version-1) * 4;
		numMdls = numMdls*numMdls -3 * (8 * 8) - 2 * (numMdls - 2 * 8) - 1 - 2 * 15;
		n = pstng[version-1].length;
		if (n) {  // n > 0
			numMdls =  numMdls - (n * n - 3) * (5 * 5);
			if (n>2) {
				numMdls = numMdls + 2 * (n - 2) * 5;
				}
			}
		if (version>=7) {
			numMdls = numMdls - 2 * 18;
			}
		return (numMdls >> 3) - RSblks[version-1][level] * eccCWLen[version-1][level];
		}

	function put_code(code1, code1_bits) {
		reg = (reg << code1_bits) | code1;
		rgBt = rgBt + code1_bits;
		while (rgBt>=8) {
			code[idCd++] = (reg >> (rgBt-8)) & 0xff;
			rgBt = rgBt - 8;
			}
		}

	function ltn_val(slCar) {
		switch (slCar) {
			case " ":
				return 36;
			case "$":
				return 37;
			case "%":
				return 38;
			case "*":
				return 39;
			case "+":
				return 40;
			case "-":
				return 41;
			case ".":
				return 42;
			case "/":
				return 43;
			case ":":
				return 44;
		}
		if (slCar <= "9") {
			return slCar.charCodeAt(0) - "0".charCodeAt(0);
		}
		return slCar.charCodeAt(0) - "A".charCodeAt(0) + 10;
	}

	function masking(mdlsNum, mask, level, version) {
		var i, j;

		for (i=0;i<mdlsNum;i++) {
			for (j=0;j<mdlsNum;j++) {
				bitArry[i][j] = symArry[i][j] & 0x1;
				if (!(symArry[i][j] & 0xc0)) {
					switch (mask) {
						case 0x0:
							if ((i+j) % 2 == 0) {
								bitArry[i][j] ^= 0x1;
							}
							break;
						case 0x1:
							if ((i % 2)==0) {
								bitArry[i][j] ^= 0x1;
							}
							break;
						case 0x2:
							if ((j % 3)==0) {
								bitArry[i][j] ^= 0x1;
							}
							break;
						case 0x3:
							if (((i+j) % 3)==0) {
								bitArry[i][j] ^= 0x1;
							}
							break;
						case 0x4:
							if (((Math.floor(i/2)+Math.floor(j/3)) % 2)==0) {
								bitArry[i][j] ^= 0x1;
							}
							break;
						case 0x5:
							if ((i*j % 2+i*j % 3)==0) {
								bitArry[i][j] ^= 0x1;
							}
							break;
						case 0x6:
							if (((i*j % 2+i*j % 3) % 2)==0) {
								bitArry[i][j] ^= 0x1;
							}
							break;
						case 0x7:
							if (((i*j % 3+(i+j) % 2) % 2)==0) {
								bitArry[i][j] ^= 0x1;
							}
							break;
					}
				}
			}
		}
		var code1 = frmInf[level][mask];
		var b1 = 0x4000;
		for (i=0;i<7;i++) {
			bitArry[8][(i<6) ? i : i+1] = bitArry[mdlsNum-1-i][8] = (code1 & b1) ? 1 : 0;
			b1 >>= 1;
			}
		for (i=7; i>=0;i--) {
			bitArry[(i<6) ? i : i + 1][8] = bitArry[8][mdlsNum-1-i] = (code1 & b1) ? 1 : 0;
			b1 >>= 1;
			}
		if (version >= 7) {
			var x,y;
			code1 = vrInf[version-7];
			b1 = 0x20000;
			for (i=0;i<18;i++) {
				y = mdlsNum - 9 - i % 3;
				x = 5-Math.floor(i / 3);
				bitArry[y][x] = bitArry[x][y] = (code1 & b1) ? 1 : 0;
				b1 >>= 1;
			}
		}
	}

	function u16to8(cd) {
			var out =
				(cd < 0x80
				 ? toHex2(cd)
				 : (cd < 0x800
					? toHex2(cd >> 6 & 0x1f | 0xc0)
					: toHex2(cd >> 12 | 0xe0) +
					toHex2(cd >> 6 & 0x3f | 0x80)
				   ) + toHex2(cd & 0x3f | 0x80)
				);
			return out;
		}

	function toHex2(num) {
			var out = '0' + num.toString(16);
			return out.slice(-2);
		}
	}


let dlg = document.createElement("div");
dlg.style.minWidth = 450;
dlg.style.padding = 40;
let title = document.createElement("h3");
title.textContent = "Input QR Code String.";
dlg.appendChild(title);
let textInput = document.createElement("input");
textInput.style.padding = 20;
dlg.appendChild(textInput);
let submitButton = document.createElement("button");
submitButton.textContent = "Submit";
dlg.appendChild(submitButton);
let closeButton = document.createElement("button");
closeButton.textContent = "Close";
dlg.appendChild(closeButton);
let md = document.createElement("dialog");
md.appendChild(dlg);

async function dialogCall(selection, documentRoot) {
    document.body.appendChild(md);
    const txt = await showDialog();
    creQR(txt, selection, documentRoot);
}

function showDialog() {
	return new Promise((resolve, reject) => {
		md.showModal()
		submitButton.onclick = (e) => {
			md.close();
			resolve(textInput.value)
			}
		closeButton.onclick = (e) => {
			md.close();
			reject("close");
			}
		})
	}

module.exports = {
	commands: {
		makeQR: dialogCall
	}
};