func("getString",function(p){

	var str = prompt(p[0],p[1]);
	return str;

},[["Question","string"],["Default answer","string"]]);

func("getFile",function(p){

	var xhr = new XMLHttpRequest;
	xhr.open("GET",p[0],false);
	/*xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			if(xhr.status === 200 || xhr.status === 0){
				console.log(xhr.responseText);
				return xhr.responseText;
			}
			else{
				return "The given host could not be found!";
			}
		}
	};*/
	xhr.send();
	return xhr.responseText;

},[["File name","string"]]);

func("saveFile",function(p){

	var text = [p[1]];
	var file = new Blob(
		[text],
		{type : "text/plain"}
		);
	var url = URL.createObjectURL(file);

	var a = document.getElementById("downloadHelper");
	a.download = p[0];
	a.href = url;
	a.click();
	return 1;

},[["File name","string"],["File contents","string"]]);