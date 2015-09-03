/*
arg: 	-1 = unlimited
		 0 = no arguments
		 n = n amount of arguments
*/

var functions = {};

var func = function(name,body,arguments){
	var f = {};
	f.name = name;
	f.func = body;
	f.arg = arguments ? (arguments.length === 0 ? 0 : arguments) : -1;
	functions[name] = f;
};

func("showMessage",function(p){
	alert(p[0]);
	return 1;
},[["message","string"]]);

func("choose",function(p){
	return p[Math.floor(Math.random() * p.length)];
});

func("sin",function(p){
	return Math.sin(p[0]);
},[["number","number"]]);

func("cos",function(p){
	return Math.cos(p[0]);
},[["number","number"]]);

func("abs",function(p){
	return Math.abs(p[0]);
},[["number","number"]]);

func("setTitle",function(p){
	return document.title = p[0];
},[["Title","string"]]);