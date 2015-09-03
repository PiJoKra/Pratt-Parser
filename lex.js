"use strict";
var lex = function(code){
	/*if(code == "" || code == null || code == undefined){
		return false;
	}*/

	var tokens = []; //Container

	/**
	 * Get next character
	 * @param  {int} index The current index
	 * @return {char|-1}       Gives back a character. -1 if end off string
	 */
	var advance = function(index){
		if(index + 1 >= code.length){
			return -1;
		}
		return code[index + 1];
	};

	var i = 0; //current location cursor
	var c = ""; //current character
	var currentToken = "";
	var type = "";

	var from = 0;
	var to = 0;

	var q = ""; //Can be a double or a single quote

	var dotFound = false; //Only one "." permitted in a number

	var err = "";

//BEGIN DETECTION

	for(i = 0; i < code.length;i++){ //0 is the first index; every step go one forward in the code whilst not at the end

		if((c = code.charAt(i)) > " "){ //If current index is not on a non-printable character or whitespace, give its value to c
			
			from = i;

			currentToken = ""; //Reset for new token

			switch(true){
			
				//I use conditional operators, instead of regex, since it is much faster
				//See: http://jsperf.com/matchgroup-vs-equal/2

				//Names: can be variables, functions or keywords
				//Structure: ^[a-zA-Z$][a-zA-Z$_]$
				case (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "$" :
					currentToken = c;
					while(true){
						c = advance(i);
						if(c != -1 && (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || (c >= "0" && c <= "9") || c === "_" || c === "$"){
							currentToken += c;
							i++;
						}
						else{
							break;
						}
					}
					type = "name";
					break;



				//Strings
				//TODO: escaping
				case c === "\"" || c === "\'" :
					q = c;
					while((c = advance(i)) !== q){ //As long as we didn't encounter the same quote used in the beginning of the string
						if(c === -1){
							err = "Unterminated string";
							break;
						}
						currentToken += c;
						i++; //Go to the next character
					}
					i++; //Skip the ending quote
					type = "string";
					break;



				//Single line comments
				case c === "/" && advance(i) === "/" :
					i++; //Skip the second /
					while((c = advance(i)) !== "\n" && c !== -1){ //As long we didn't encounter a newline or an end of code
						currentToken += c;
						i++;
					}
					type = "comment";
					break;



				//Multi line comments
				case c === "/" && advance(i) === "*" :
					i++; //Skip the second /
					while((c = advance(i)) !== "*" && advance(i + 1) !== "/"){ //As long we didn't encounter "*/"
						if(c === -1){ //When there is no "*/" anymore
							err = "Unterminated multiline comment";
							break;
						}
						currentToken += c;
						i++; //Go to the next character
					}
					i += 2; //Skip the "*/"
					type = "comment";
					break;



				//Numbers
				//Hexadecimal number
				//Structure: ^0x[a-fA-F0-9]+$
				case c === "0" && advance(i) === "x" :
					currentToken = "0x";
					if(c = advance(++i), (c >= "a" && c <= "f") || (c >= "A" && c <= "F") || (c >= "0" && c <= "9")){ //(/[a-fA-F0-9]/).test(c = advance(++i))){
						currentToken += c;
						while(c = advance(++i), (c >= "a" && c <= "f") || (c >= "A" && c <= "F") || (c >= "0" && c <= "9")){//(/[a-fA-F0-9]/).test(c = advance(++i))){
							currentToken += c;
						}
					}
					else{
						err = "Hexadecimal number is not finished";
						break;
					}
					type = "number";
					break;

				//Decimal number
				//Structure: ^\d*\.?\d*([eE][-+]?\d*$
				case (c >= "0" && c <= "9") || (dotFound = (c === ".")) : 
					currentToken = c;
					while(c = advance(i++), ((c >= "0" && c <= "9") || c === ".") && c !== -1){
						if(c === "."){
							if(dotFound){
								err = "Malformed number: more than one dot";
								break;
							}
							else{
								dotFound = true;
							}
						}
						currentToken += c;
					}

					if(c === "e" || c === "E"){
						currentToken += "e";
						c = advance(i);
						if(c === "-" || c === "+"){
							currentToken += c
							i++;
						}
						while(c = advance(i++), c != -1 && c >= "0" && c <= "9"){
							currentToken += c;
						}
					}
					else{
						if((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")){
							err = "Identifier starts immediatly after number";
							break;
						}
					}
					c = advance(--i);
					dotFound = false;
					type = "number";
					break;


				//Operators
				
				//Check if multicharacter operator to prevent "+=" be interpreted as a "+" and a "=", instead of a whole operator
				//^[=<>!+-*&|/%^][=<>&|]*$
				case "=<>!+-*&|/%^".indexOf(c) >= 0 :
					currentToken = c;
					while("=<>&|".indexOf(c = advance(i)) >= 0 && c != -1){
						currentToken += c;
						i++;
					}
					type = "operator";
					break;


				default :
					if(c[0].charCodeAt(0) > 0xFF){
						err = "Illegal character detected";
						break;
					}
					currentToken = c;
					type = "operator";
					break;
			}

			to = i;

			tokens.push(token(currentToken,type,from,to).error(err));

		}
	}
	tokens.push(token("end","end",code.length,code.length));
	return tokens;
}