var operators = {

	"+" : function(left,right){
		var l = execute(left),
			r = execute(right);
		if(typeof l !== "string" && typeof l !== "number"){
			left.error("Number or string expected");
		}
		if(typeof r !== "string" && typeof r !== "number"){
			right.error("Number or string expected");
		}
		return l + r;
	},
	"-" : function(left,right){
		var l = execute(left),
			r = execute(right);
		if(typeof l !== "number"){
			left.error("Number expected");
		}
		if(typeof r !== "number"){
			right.error("Number expected");
		}
		return l - r;
	},
	"*" : function(left,right){
		var l = execute(left),
			r = execute(right);
		if(typeof l !== "number" && typeof l !== "string"){
			left.error("Number or string expected");
		}
		if(typeof r !== "number"){
			right.error("Number expected");
		}
		if(typeof l === "string"){
			return Array(r + 1).join(l);
		}
		return l * r;
	},
	"/" : function(left,right){
		var l = execute(left),
			r = execute(right);
		if(typeof l !== "number"){
			left.error("Number expected");
		}
		if(typeof r !== "number"){
			right.error("Number expected");
		}
		if(r === 0){
			right.error("Division by zero");
		}
		return l / r;
	},
	"^" : function(left,right){
		return Math.pow(execute(left),execute(right));
	},
	"=" : function(left,right){
		if(variables.hasOwnProperty(left.value)){
			return variables[left.value] = execute(right);
		}
		return false;
	},
	"+=" : function(left,right){
		if(variables.hasOwnProperty(left.value)){
			return variables[left.value] += execute(right);
		}
		return false;
	},
	"-=" : function(left,right){
		if(variables.hasOwnProperty(left.value)){
			return variables[left.value] -= execute(right);
		}
		return false;
	},
	"*=" : function(left,right){
		if(variables.hasOwnProperty(left.value)){
			return variables[left.value] *= execute(right);
		}
		return false;
	},
	"/=" : function(left,right){
		var eRight = execute(right);
		if(eRight === 0){
			right.error("Division by zero");
		}
		if(variables.hasOwnProperty(left.value)){
			return variables[left.value] /= eRight;
		}
		return false;
	},
	"?" : function(cond,left,right){
		return execute(cond) ? execute(left) : execute(right);
	},
	">" : function(left,right){
		return execute(left) > execute(right);
	},
	"<" : function(left,right){
		return execute(left) < execute(right);
	},
	"<=" : function(left,right){
		return execute(left) <= execute(right);
	},
	">=" : function(left,right){
		return execute(left) >= execute(right);
	},
	"==" : function(left,right){
		return execute(left) === execute(right);
	},
	"!=" : function(left,right){
		return execute(left) != execute(right);
	},
};