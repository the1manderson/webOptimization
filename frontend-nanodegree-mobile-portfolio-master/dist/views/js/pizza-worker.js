//Pizza making code
importScripts("pizza-generator.js");

onmessage = function(e) {
	var dataFromMain = e.data;
	console.log('Data received from main: ', dataFromMain);
	var result = {
		status: "",
		allThesePizzas: "not set"
	};
	var pizzaReady, rngNamedPizza = "";
	if (dataFromMain.status === "START"){
		result = {status: "STARTED"};
	}else if (dataFromMain.status === "STOP"){
		result = {status: "STOPPED"};
	}else if (dataFromMain.status === "PIZZA-NAME"){
		result.status = "PIZZA-NAMED";
		result.allThesePizzas = makeAllPizzasAsString();
		console.log('This is all the pizza: \n',result.allThesePizzas);
	}else{
		result = {status: "NOTHING"};
	}
	postMessage(result);
};