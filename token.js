"use strict";
var Token = function(value,arity,from,to){
	if(!isNaN(+value)){
		this.value = +value;
	}
	else{
		this.value = value;
	}
	this.arity = arity;
	this.from = from;
	this.to = to;
};
//Prototype to allow chaining: token(...).error(...)
//When there is no message given, return
Token.prototype.error = function(msg){
	var code = txt.value;
	if(msg === ""){
		return this;
	}
	var line = 1; //First line is line 1
	var beginLine = 0; //first index of a new line. Will be updated with each line.
	var endLine = 0;
	for(var i = 0; i <= this.to;i++){
		if(code[i] === "\n"){
			line++;
			beginLine = i + 1;
		}
	}

	//Generate error message
	var errorMessage = 
		//Show what went wrong and where it went wrong
		msg + " on row " + line + "\n\n" + 

		//Change all tabs into spaces
		code.replace(/\t/g," ")
			//Show the line where it went wrong
			//Add a newline character so the indexOf will never return -1
			//	Instead, if no newline is present in de source, the second 
			//	parameter will give the length of the code
			.substr(beginLine,(code + "\n").indexOf("\n",beginLine) - beginLine) + "\n" +

		//Make an arrow to point at the error
		//String.prototype.repeat is currently only supported in Firefox
		Array(i - beginLine).join("-") + "^";
	solution.innerHTML = errorMessage;
	solution.style.color = "#F00";
	throw new PScriptError(errorMessage);
};

//No need to type new
var token = function(value,arity,from,to){
	return new Token(value,arity,from,to);
};

var PScriptError = function(msg) {
	this.name = "P-Script Error";
	this.message = msg;
};
PScriptError.prototype = new Error();