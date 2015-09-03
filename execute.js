var variables = {};

var exeVar = function(node){
	var v;
	for(var i = 1;v = node["" + i];i++){
		if(v.value === "="){
			if(variables[v.left.value]){
				v.left.error(v.left.value + " has already been defined");
			}
			variables[v.left.value] = execute(v.right);
		}
		else{
			if(variables[v.value]){
				v.error(v.value + " has already been defined");
			}
			variables[v.value] = null;
		}
	}
};

var exeIf = function(node){
	if(execute(node.cond)){
		execute(node.true);
	}
	else{
		execute(node.false);
	}
};

var exeWhile = function(node){
	while(execute(node.cond)){
		execute(node.body);
	}
};

var execute = function(node){

	//Divide array in smaller pieces
	if(node.constructor === Array){
		node.forEach(function(node){
			execute(node);
		});
	}

	else{
		switch(node.value){
			case "+" :
			case "-" : 
			case "*" :
			case "/" :
			case "^" :
			case ">" :
			case "<" :
			case "<=" :
			case ">=" :
			case "==" :
			case "!=" :
			case "=" :
			case "+=" :
			case "-=" :
			case "*=" :
			case "/=" :
				return operators[node.value](node.left,node.right);
				break;

			case "?" :
				return operators[node.value](node.cond,node.left,node.right);

			case "if" :
				exeIf(node);
				break;

			case "while" :
				exeWhile(node);
				break;

			case "var" :
				exeVar(node);
				break;

			case "true" :
				return 1;
			case "false" :
				return 0;
			case "pi" :
				return Math.PI;
			case "e" :
				return Math.E;

			default :

				switch(node.arity){
					case "number" :
					case "string" :
						return node.value;
					case "name" :
						if(variables.hasOwnProperty(node.value)){
							return variables[node.value];
						}
						else{
							node.error("Unknown variable " + node.value);
						}
					case "function" :
						if(functions.hasOwnProperty(node.value)){
							var f = functions[node.value];
							if(f.arg == -1 || node["" + f.arg.length]){
								var param = [];
								for(var i = 1;node["" + i];i++){
									param[param.length] = execute(node["" + i]);
								}
								return f.func(param);
							}
							else{
								node.error("Wrong amount of arguments passed");
							}
						}
						else{
							node.error("Unknown function called");
						}
				}
				console.log(node);
				node.error("Unknown '" + node.value + "'");
				break;
		}
	}
};