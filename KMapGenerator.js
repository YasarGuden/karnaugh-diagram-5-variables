
//----------------------------- MATRİSİ OLUŞTURMA VE RENKLENDİRME-------------------


var varNames = new Array("A","B","C","D","E");

var KSeviye = new Array(0,1,1,1,1,2);

var KWid  = new Array(0,2,2,4,4,4);

var KHei = new Array(0,1,2,2,4,4);

var KVarX  = new Array(0,1,1,2,2,2);

var KVarY = new Array(0,0,1,1,2,2);

var bitOrd = new Array(0,1,3,2,4,5,7,6);

var normalColor = "white";

var selectColor = "red";



//-----------------------------DEĞİŞKEN ÖZELLİKLERİ --------------------------------



var numVar = 4;

var allowDC = false;

var KMap = [];

var coverList = [];

var nCubeList = [];


initKMap(numVar);



//---------------------Basite Çevirme Fonksiyonu--------------------------


/**
* matriste seçilen kutuların sayılarını binary'e dönüştürme
*/
function toBinString (val, b){
    var str = val.toString(2);
    for (var i=0; i<b; i++){
        if (str.length<b) str = "0" + str;
    }
    if (b===0) str = "";
    return str;
}

/**
 = 1 (true), "0" if bool = 0 (false), and "_"  keyfi.
*/
function boolToBin (bool){
    if (bool === 1) return "1";
    else if (bool === 0) return "0";
    else return "-";
}



//-----------------------------Ana Algoritma ---------------------------------------



/**

*/
function checkCube(coords, sizes){
    var no0val = true;
    var has1val = false;
    for (var d=coords[2]; d<sizes[2]+coords[2] && no0val; d++){
    for (var w=coords[0]; w<sizes[0]+coords[0] && no0val; w++){
    for (var h=coords[1]; h<sizes[1]+coords[1] && no0val; h++){
        no0val = no0val && KMap[d][w%KMap.Width][h%KMap.Height].Value;
        has1val = has1val || KMap[d][w%KMap.Width][h%KMap.Height].Value == 1;
    }}}
    return (no0val && has1val);
}


function makeCube(coords, sizes){
    var newCube = [];
    for (var d=coords[2]; d<sizes[2]+coords[2]; d++){
    for (var w=coords[0]; w<sizes[0]+coords[0]; w++){
    for (var h=coords[1]; h<sizes[1]+coords[1]; h++){
        newCube.push([w%KMap.Width,h%KMap.Height,d]);
    }}}
    return newCube;
}
//Seçilen matris indisleri eğer oluşan küpten farklı ise clause durumlarına sokuluyor
function checkForCollisions(nCubeArray) {
	var newCubeArray = [];
    var toKeep = [];
    var contained = false;
    for (var i=0; i<nCubeArray.length; i++){
        contained = false;
        for (var j=0; j<nCubeArray.length; j++){
			if ( i!=j &&  nCubeArray[i].length < nCubeArray[j].length){
				contained = contained || isContainedIn(nCubeArray[i],nCubeArray[j]);
			}
            else if ( j<i && nCubeArray[i].length == nCubeArray[j].length ){
				contained = contained || isContainedIn(nCubeArray[i],nCubeArray[j]);
			}
		}
        if (!contained) {toKeep.push(i);}
    }
    for (var k=0; k<toKeep.length; k++){
        newCubeArray.push(nCubeArray[toKeep[k]]);
    }
    return newCubeArray;
}

function isContainedIn(nCube1,nCube2){
    var check = 0; var found = false;
    for (var i=0; i<nCube1.length; i++){
		found = false;
        for (var j=0; j<nCube2.length; j++){
            if(nCube1[i][0] == nCube2[j][0] && nCube1[i][1] == nCube2[j][1] && nCube1[i][2] == nCube2[j][2]){
                found = true;
            }
        }
		if(found){check += 1;}
    }
    return (check == nCube1.length);
}


function alreadyCovered(space, cover){
    var covered = false;
    for (var i=0; i<cover.length; i++){
        if(space[0] == cover[i][0] && space[1] == cover[i][1] && space[2] == cover[i][2]) covered = true;
    }
    return covered;
}


function getCoverList(nCubeArray){
    cover = [];
    for (var i=0; i<nCubeArray.length; i++){
        for (var j=0; j<nCubeArray[i].length; j++){
            if(!alreadyCovered(nCubeArray[i][j], cover)) cover.push(nCubeArray[i][j]);
    }}
    return cover;
}


function coversAll1(cover){
    var check = true;
    for (var d=0; d<KMap.nSeviye; d++){
    for (var w=0; w<KMap.Width; w++){
    for (var h=0; h<KMap.Height; h++){
        if(KMap[d][w][h].Value == 1 && !alreadyCovered([w,h,d], cover)) check = false;
    }}}
    return check;
}

// Editing by Alica Lopez
function EspressoExpand() {
	var newCubeSet = []; // All of the expanded n-cubes created from a single space, regardless of wether some cubes contain others.

    var w = 0; var h = 0; var d = 0;

	while(d<KMap.nSeviye){
        // For 1-level deep n-cubes (cover either E or notE in the 5 variable case).
        while(h<KMap.Height){
            while(w<KMap.Width){
				newCubeSet = [];

	            if( checkCube([w,h,d], [1,1,1]) ) newCubeSet.push(makeCube([w,h,d], [1,1,1]));

				//Expanding for n-cubes oriented along the width.
                if( checkCube([w,h,d], [2,1,1]) ) newCubeSet.push(makeCube([w,h,d], [2,1,1]));
                //In case a cube takes the whole width.
                if( KMap.Width==4 && w===0 ){
                    if( checkCube([w,h,d], [4,1,1]) ) newCubeSet.push(makeCube([w,h,d], [4,1,1]));
                    if( checkCube([w,h,d], [4,2,1]) ) newCubeSet.push(makeCube([w,h,d], [4,2,1]));
                }
                newCubeSet = checkForCollisions(newCubeSet);

                //Expanding for n-cubes oriented along the height.
                if( checkCube([w,h,d], [1,2,1]) ) newCubeSet.push(makeCube([w,h,d], [1,2,1]));
                //In case a cube takes the whole height.
                if( KMap.Height==4 && h===0 ){
                    if( checkCube([w,h,d], [1,4,1]) ) newCubeSet.push(makeCube([w,h,d], [1,4,1]));
                    if( checkCube([w,h,d], [2,4,1]) ) newCubeSet.push(makeCube([w,h,d], [2,4,1]));
                }
                newCubeSet = checkForCollisions(newCubeSet);

                //Expanding for square n-cubes.
                if( checkCube([w,h,d], [2,2,1]) ) newCubeSet.push(makeCube([w,h,d], [2,2,1]));
                //In case a cube takes the whole width and height.
				if( w===0 && h===0 && KMap.Width==4 && KMap.Height==4){
                    if( checkCube([w,h,d], [4,4,1]) ) newCubeSet.push(makeCube([w,h,d], [4,4,1]));
                }
                newCubeSet = checkForCollisions(newCubeSet);

	            for (var i=0; i<newCubeSet.length; i++){ nCubeList.push(newCubeSet[i]); }
	            w += 1;
	        }
	        w = 0; h += 1;
		}
		w = 0; h = 0;

        // For 2-levels deep n-cubes (cover E AND notE in the 5 variable case).
        if(d===0 && KMap.nSeviye==2){
            while(h<KMap.Height){
                while(w<KMap.Width){
                    newCubeSet = [];

                    if( checkCube([w,h,d], [1,1,2]) ) newCubeSet.push(makeCube([w,h,d], [1,1,2]));

                    //Expanding for n-cubes oriented along the width.
                    if( checkCube([w,h,d], [2,1,2]) ) newCubeSet.push(makeCube([w,h,d], [2,1,2]));
                    //In case a cube takes the whole width.
                    if( KMap.Width==4 && w===0 ){
                        if( checkCube([w,h,d], [4,1,2]) ) newCubeSet.push(makeCube([w,h,d], [4,1,2]));
                        if( checkCube([w,h,d], [4,2,2]) ) newCubeSet.push(makeCube([w,h,d], [4,2,2]));
                    }
                    newCubeSet = checkForCollisions(newCubeSet);

                    //Expanding for n-cubes oriented along the height.
                    if( checkCube([w,h,d], [1,2,2]) ) newCubeSet.push(makeCube([w,h,d], [1,2,2]));
                    //In case a cube takes the whole height.
                    if( KMap.Width==4 && w===0 ){
                        if( checkCube([w,h,d], [1,4,2]) ) newCubeSet.push(makeCube([w,h,d], [1,4,2]));
                        if( checkCube([w,h,d], [2,4,2]) ) newCubeSet.push(makeCube([w,h,d], [2,4,2]));
                    }
                    newCubeSet = checkForCollisions(newCubeSet);
					//Editing By Micheal Shaw
                    //Expanding for square n-cubes.
                    if( checkCube([w,h,d], [2,2,2]) ) newCubeSet.push(makeCube([w,h,d], [2,2,2]));
                    //In case a cube takes the whole width and height.
                    if( w===0 && h===0 && KMap.Width==4 && KMap.Height==4){
                        if( checkCube([w,h,d], [4,4,2]) ) newCubeSet.push(makeCube([w,h,d], [4,4,2]));
                    }
                    newCubeSet = checkForCollisions(newCubeSet);

                    for (var j=0; j<newCubeSet.length; j++){ nCubeList.push(newCubeSet[j]); }
                    w += 1;
                }
                w = 0; h += 1;
            }
            w = 0; h = 0;
        }
        w = 0; h = 0; d +=1;
    }
    nCubeList = checkForCollisions(nCubeList);
}


/**

*/
function EspressoIrredundantCover() {
    coverList = getCoverList(nCubeList);
    var lastIter = false;
    var newNCubeList = [];
    var newCover = [];
    while(lastIter === false){
        //onceki küpten yeni küpe geçerken oluşan taşmaları düzenelemek için
        lastIter = true;
        for (var i=0; i<nCubeList.length; i++){

            newNCubeList = JSON.parse(JSON.stringify(nCubeList));
            newNCubeList.splice(i, 1);
            newCover = getCoverList(newNCubeList);

            if( isContainedIn(coverList,newCover) ){
                nCubeList = newNCubeList; coverList = newCover;
                lastIter = false;
            }

            else if (allowDC && coversAll1(newCover)) {
                nCubeList = newNCubeList; coverList = newCover;
                lastIter = false;
            }
        }
    }
}



/**

*/
function EspressoSolve() {
	nCubeList = [];
	coverList = [];
    EspressoExpand();
    EspressoIrredundantCover();
}


//-------------------Karnaough harita Düzeni ---------------------------------------



function initKMap (nVar){
    KMap = [];
    KMap.nSeviye = KSeviye[nVar];
    KMap.Width = KWid[nVar];
    KMap.Height = KHei[nVar];
    KMap.nVarX = KVarX[nVar];
    KMap.nVarY = KVarY[nVar];
    for (var d=0; d<KMap.nSeviye; d++){
        KMap[d] = [];
        for (var w=0; w<KMap.Width; w++){
    		KMap[d][w] = [];
    		for (var h=0; h<KMap.Height; h++){
    			KMap[d][w][h] = [];
    			KMap[d][w][h].Value = 0; // False is default
    			valueStr = toBinString(bitOrd[d],KMap.nSeviye-1) + toBinString(bitOrd[w],KMap.nVarX) + toBinString(bitOrd[h],KMap.nVarY);
    			value = parseInt(valueStr,2);

    			KMap[d][w][h].Button_id = "KM" + valueStr;
    			KMap[d][w][h].TD_id = "TD" + valueStr;
    	}}
    }
}


/**
* @method resetKMap
*/
function resetKMap(){
    initKMap(numVar); redraw();
}


/**

* @method changeNumVar
* @param Num {Integer} 
*/
function changeNumVar(Num){
    if(Num != numVar){
        numVar = Num; initKMap(Num);
        document.getElementById("Var2").checked = (Num==2)?true:false;
        document.getElementById("Var3").checked = (Num==3)?true:false;
        document.getElementById("Var4").checked = (Num==4)?true:false;
        document.getElementById("Var5").checked = (Num==5)?true:false;
    }
    redraw();
}


/**
* @method switchDontCare
*/
function switchDontCare(){
    allowDC = !allowDC;
    for (var d=0; d<KMap.nSeviye; d++){
    for (var w=0; w<KMap.Width; w++){
    for (var h=0; h<KMap.Height; h++){
        if(KMap[d][w][h].Value === 2) KMap[d][w][h].Value = 0;
    }}}
    redraw();
}


/**

* @method modifyKMEntry
* @param entry {Variable} 
*/
function modifyKMEntry(entry){
    if (entry.Value === 0) entry.Value = 1;
    else if (entry.Value === 1 && allowDC) entry.Value = 2;
    else entry.Value = 0;
    redraw();
}

//----------------------Arayüz Fonksiyonu-------------------------------------------

/**

 * @method setAllToNormalColor
 */
function setAllToNormalColor(){
    for (d=0; d<KMap.nSeviye; d++){
        for (h=0; h<KMap.Height; h++){
            for (w=0; w<KMap.Width; w++){
                    document.getElementById(KMap[d][w][h].Button_id).style.backgroundColor = normalColor;
    }}}
}


/**

 * @method setColor
 * @param nCube {Array} 
 * @param color {String}
 */
function setColor(nCube,color){
    for(var i=0; i<nCube.length; i++){
        document.getElementById(KMap[nCube[i][2]][nCube[i][0]][nCube[i][1]].Button_id).style.backgroundColor = color;
    }
}

/**

 * @method redraw
 */
function redraw(){
    document.getElementById("KMapMaker");
    document.getElementById("KMapDiv").innerHTML = generateKMapHTML();
    document.getElementById("SolutionDiv").innerHTML = generateSolutionHTML();
    document.getElementById("LaTeXCode").value = generateLaTeXCode();
}


/**
 *
 *
 * @method generateKMapHTML
 * @return {String}
 */
 function generateKMapHTML() {
     var text = "<center></center>";
     text += "\n<center></center>";
     text += "<center><small>Bu proje Mantık devreleri için hazırlanmıştır .</small></center><br /><center>";
     var h,w,d;



     text += "<table>";

 	//Width of the matrix
 	text += "<tr><th></th><th></th><th colspan="+KMap.Width*KMap.Height+2+">";
 	for (var i=0; i<KMap.nVarX+KMap.nSeviye-1; i++){
 		text += varNames[i];
 	}

 	text += "</th></tr>";
 	text += "<tr>";
 	text += "<th></th><th></th><th></th>";
    for (d=0; d<KMap.nSeviye; d++){
 	for (w=0; w<KMap.Width; w++){
        if (w===0 && d==1) text += "<th style='width:1mm'></th>";
 		text += "<th>"+toBinString(bitOrd[d*4+w],KMap.nVarX+KMap.nSeviye-1)+"</th>";
    }}
 	text+="</tr>";

 	//Height of the matrix
 	for (h=0; h<KMap.Height; h++){
 		text = text + "<tr>";
 		if (h===0){
            text += "<th rowspan="+KMap.Height+">";
 			for (var j=0; j<KMap.nVarY; j++){
 				text += varNames[j+KMap.nVarX+KMap.nSeviye-1];
 			}
            text += "<th rowspan="+KMap.Height+">";
 		}
 		text += "<th>"+toBinString (bitOrd[h],KMap.nVarY)+"</th>";

 		//Filling the matrix with buttons
        for (d=0; d<KMap.nSeviye; d++){
 		for (w=0; w<KMap.Width; w++){
            if (w===0 && d==1) text += "<th style='width:1mm'></th>";
 			text += "<td  ID='"+KMap[d][w][h].TFD_id+"'; style='background-color:0xFF'>";
 			text += "<input ID="+KMap[d][w][h].Button_id +" name="+KMap[d][w][h].Button_id;
            text += " type='button'  style='height:6mm;width:8mm' value=' "+ boolToBin(KMap[d][w][h].Value);
            text += " '; onClick=modifyKMEntry(KMap["+d+"]["+w+"]["+h+"]);></td>";
 		}}
 		text += "</tr>";
 	}
    text += "</table>";
 	text+="</center></td></tr>";

 	return text;
}


/**

* @method getFunctionHTML
* @param nCube {Array}
* @param cubeId {Integer}
* @return {String}
*/
function getFunctionHTML(nCube, cubeId){
	var ref = toBinString(bitOrd[nCube[0][2]],KMap.nSeviye-1) + toBinString(bitOrd[nCube[0][0]],KMap.nVarX) + toBinString(bitOrd[nCube[0][1]],KMap.nVarY);
	var logicFunct = [];
	for(var x=0; x<ref.length; x++) logicFunct[x] = parseInt(ref[x]);

	if (nCube.length >= 2){

		for (var i=1; i<nCube.length; i++){
			ref = toBinString(bitOrd[nCube[i][2]],KMap.nSeviye-1) + toBinString(bitOrd[nCube[i][0]],KMap.nVarX) + toBinString(bitOrd[nCube[i][1]],KMap.nVarY);
			for (var j=0; j<ref.length; j++){
				if (logicFunct[j] != parseInt(ref[j])) logicFunct[j] = 2;
		}}
	}

	var funct = "<span ID=" + cubeId;
    funct += " onMouseOver='setColor(nCubeList["+cubeId+"],selectColor);'";
    funct += " onMouseOut='setColor(nCubeList["+cubeId+"],normalColor);'>";
    var wholeMap = true;
	for (var k=0; k<logicFunct.length; k++){
		if (logicFunct[k] === 0){
			wholeMap = false;
			funct += "<span style='text-decoration: overline'>" + varNames[k] + "</span>";
		}
		else if (logicFunct[k] == 1){
			wholeMap = false;
			funct += varNames[k];
		}
	}
	if (wholeMap) funct += "1";
    else funct += "</span>";
	return funct;
}


/**

* @method generateSolutionHTML
* @return {String} The new HTML code
*/
function generateSolutionHTML(){
    setAllToNormalColor();
    EspressoSolve();
    var text = "<h4><center>İndirgeme Çıktısı:</center></h4>";
    text+="<h2><center>F(";
    for (var x=0; x<(KMap.nVarX+KMap.nVarY+KMap.nSeviye-1); x++){
        text += varNames[x]; if(x!=(KMap.nVarX+KMap.nVarY+KMap.nSeviye-2)) text += ",";
    }
    text+=") = ";
    if (nCubeList.length === 0){ text += "0"; }
    else{ for (var i=0; i<nCubeList.length; i++){
        text += getFunctionHTML(nCubeList[i], i);
        if (i<nCubeList.length-1) text += " + ";

    }}
    text+="</center></h2>";


    return text;
}

