"use strict";
var parser = function(problem){



var ctoken;
var counter = 0;

//Goto next token
var advance = function(value){

	if(value && ctoken.value !== value){
		ctoken.error("'" + value + "' expected");
	}

	if(counter >= problem.length){
		return;
	}

	ctoken = problem[counter++];


};

var parse = function(rbp){
	rbp = rbp || 0;
	var t = ctoken;
	advance();
	if(!t.nud){
		t.error("Expected expression, got '" + t.value + "'");
	}
	var left = t.nud();

	//As long as the right binding power is smaller than the left binding power
	//	OR when left binding power is not given
	//	1 < undefined === false
	while(rbp < ctoken.lbp && ctoken.value !== ";"){
		t = ctoken;
		advance();
		left = t.led(left);
	}

	return left;
};

var symbols = {};

var symbol = function(value,lbp){
	var s = symbols[value];
	if(!s){
		s = symbols[value] = {};
	}
	s.lbp = lbp || s.lbp;
	return s;
};

var infix = function(value,lbp,led){
	var s = symbol(value,lbp);
	s.led = led || function(left){
		this.left = left;
		this.right = parse(this.lbp);
		return this;
	};
	s.nud = s.nud || function(){
		this.error("'" + this.value + "' is an infix, and cannot be used as an prefix-operator");
	}
	return s;
};

var infixR = function(value,lbp,led){
	return infix(value,lbp - 1,led);
};

var prefix = function(value,nud){
	var s = symbol(value);
	s.nud = nud || function(){
		this.nud = parse(100);
		return this;
	};
	s.led = s.led || function(){
		this.error("'" + this.value + "' is a prefix, and cannot be used as an infix-operator");
	}
	return s;
};

var block = function(){
	advance("{");
	var t = statements();
	advance("}");
	return t;
};

var stmt = function(value,nud){
	var s = symbol(value);
	s.st = true;
	s.nud = nud;
	s.led = function(){
		return this.error("Expected expression, got '" + this.valuee + "'");
	}
	return s;
};

var tokenUpgrade = function(t){
	var s = symbols[t.value];
	if(s){
		for(var p in s){
			if(s.hasOwnProperty(p)){
				t[p] = s[p];
			}
		}
	}
	else{
		if(t.arity === "number" || t.arity === "string" || t.arity === "name"){
			t.led = function(){
				this.error("Missing ';' before statement near '" + this.value + "'");
			};
			t.nud = function(){
				return this;
			};
		}
		else{
			if(t.arity === "end"){
				t.led = function(){
					this.error("Trying to execute end");
				};
				t.nud = function(){
					this.error("Trying to execute end");
				};
				t.lbp = 0;
			}
		}
	}
};

var statements = function(){
	var stmts = [];
	while(ctoken.value !== "}" && ctoken.value !== "end"){
		if(ctoken.st){
			var t = ctoken;
			advance();
			stmts[stmts.length] = t.nud();
			continue;
		}
		stmts[stmts.length] = parse();
		advance(";");
	}
	return stmts.length === 1 ? stmts[0] : stmts.length === 0 ? null : stmts;
};

[":",";","}","{",")"].forEach(function(e){
	symbol(e);
});

infixR("=",10);
infixR("+=",10);
infixR("-=",10);
infixR("*=",10);
infixR("/=",10);

infix("==",20);
infix("!=",20);

infix("<",25);
infix(">",25);
infix("<=",25);
infix(">=",25);

infix("+",30); prefix("+");
infix("-",30); prefix("-");

infix("*",40);
infix("/",40);

infixR("^",50);

infix("?",15,function(left){
	this.cond = left;
	this.left = parse();
	advance(":");
	this.right = parse();
	return this;
});

//Normal parenthesis eg. 1 + (2 * 3)
prefix("(",function(){
	var p = parse();
	advance(")");
	return p;
});
//Function call eg. alert(param)
infix("(",80,function(left){
	if(ctoken.value !== ")"){
		for(var i = 1;;i++){
			this["" + i] = parse();
			if(ctoken.value !== ","){
				break;
			}
			advance(",");
		}
	}
	advance(")");
	this.value = left.value;
	this.arity = "function";
	return this;
});

stmt("if",function(){
	advance("(");
	this.cond = parse();
	advance(")");
	this.true = block();
	if(ctoken.value === "else"){
		advance("else");
		this.false = block();
	}
	return this;
});

stmt("while",function(){
	advance("(");
	this.cond = parse();
	advance(")");
	this.body = block();
	return this;
});

stmt("var",function(){
	for(var i = 1;;i++){
		var name, value;
		if(ctoken.arity !== "name"){
			ctoken.error("Expected a variable name");
		}
		name = ctoken;
		advance();
		if(ctoken.value === "="){
			var t = ctoken;
			advance("=");
			value = parse();
			t.left = name;
			t.right = value;
			this["" + i] = t;
		}
		else{
			this["" + i] = ctoken;
		}
		if(ctoken.value !== ","){
			break;
		}
		advance(",");
	}
	advance(";");
	return this;
});


problem.forEach(function(e){
	tokenUpgrade(e);
});









advance();
return statements();

};