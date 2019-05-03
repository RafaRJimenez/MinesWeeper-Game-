

var bugs; //número de bugs que queremos tener en el juego.
var arr = new Array; // Array general de la aplicación, almacena todo el contenido de las casillas ('clear', 'bomb' o la posición)
var points = 0; // puntos del jugador
var seconds = 0; // tiempo de la partida
var totalClicksToWin = 0; // total de aciertos (clicks) necesarios para ganar, esto permite acabar la partida y dar los resultados
var totalClicks=0; // total de aciertos (clicks) que acumula el jugaddor durante la partido
var minutes = 0; // nos permite contabilizar los minutos 
var columns , rows;
var cellProperties = {
	"imgUrl":"./img/normal.png",
	"isABug":false,
	"score": 1
}
var panel = new Array(); //nuestro panel que al principio es un Array vacio y que posteriormente deberemos convertir en un array de arrays.

/**Esta función pregunta al usuario todos los datos necesarios para poder comenzar el juego, estableciendo que sea  mayor que 0 y que sea un número para no provocar bugs*/
var askForParams = function(){
	
	bugs = prompt("introduce el número de bugs");
	while (bugs < 1 || isNaN(bugs)) {
		alert("el número de bugs debe ser mayor que 0");
		bugs = prompt("introduce el número de bugs");
	}
	rows = prompt("introduce el número de filas");
	while (rows < 1 || isNaN(rows)) {
		alert("el número de filas debe ser mayor que 0");
		rows = prompt("introduce el número de filas");
	}
	columns = prompt("introduce el número de columnas");
	while (columns < 1 || isNaN(columns)) {
		alert("el número de columnas debe ser mayor que 0");
		columns = prompt("introduce el número de columnas");
	}
}

/**Inicializa el panel. Para ello crea un array bidimensional. Cada posición del array será una casilla que deberá rellenarse por defecto con un cellProperties**/
var initPanel = function (col,row){

	var divGame = $("#tablero"); // divGame almacena el div donde se va a generar la matriz en el cliente con una tabla
	
		var matrix="<table>";
			for (i=0;i<row;i++){ // durante este for genero la matriz en el cliente según los datos indicados por el usuario,
				matrix += "<tr>"; // y al mismo tiempo genero la matriz bidimensional que va a trabajar con el contenido
				arr[i] = new Array;
				for (z=0;z<col;z++){	
					arr[i][z] = i + "-" + z	; // Asigno a cada TD una id única, de esta forma asocio ambas matrices  (id y posición del array)
					matrix+="<td onclick='checkBox(this);' id='"+i+"-"+z+"'><img src='img/normal.png'></td>";
				}
				matrix+="</tr>";
			}
		matrix +="</table>";
		divGame.append(matrix);
		console.log(matrix)
}

/**Aquí deberás rellenar de manera aleatoria tantos bugs como el usuario haya especificado. Nota: la imagen estará en la misma ruta, pero será  bomb.png*/
var makeRandomBugsInPanel = function (bugsChoosen){
	var totalBoxes = rows * columns; // calculo el número total de casillas para la comparación con los bugs
	// Comprobamos que el número de bugs no sea mayor que el de casillas totales, y si es así
	//los igualamos
	if (bugsChoosen >= totalBoxes) {bugs = totalBoxes}; 
	totalClicksToWin = totalBoxes - bugs;
	for (i = 0; i<bugs; i++){ // mediante este for llamo a la función que genera los bugs tantas veces como bugs haya elegido el usuario
	getRandomArbitrary(rows, columns);
	}
	$('.showBombs').html(arr); // agrego la información del array a la pestaña "ver bombas"
}


var timer = setInterval(function(){ // esta función me permite mostrar y generar el tiempo, es ejecutada cada segundo
  if (seconds === 59){
  	minutes+=1;
  	seconds=0;
  }
  $('#tiempo').html(minutes + ':' + (seconds += 1));
}, 1000);


function getRandomArbitrary(rows, columns) {
    var positionX =  Math.round(Math.random() * (rows-1)); // genero una posición aleatoria según las filas asignadas
   	var positionY =  Math.round(Math.random() * (columns-1)); // genero una posición aleatoria según las columnas asignadas
   	

   	 // El siguiente while me permite que no se repitan dos bombas en la misma casilla, de esta forma se generan todas las bombas

   	while (arr[positionX][positionY] === 'bomb'){ 
   		positionX =  Math.round(Math.random() * (rows-1));
   		positionY = Math.round(Math.random() * (columns-1));
   	}
   	arr[positionX][positionY] = 'bomb'; // asigno las bombas a las posiciones generadas
}

/**Pinta en el elemento con id="tablero" el array que has construído en forma de tablero (bidimensional) **/

function checkBox(e) { // esta función se activa al pulsar una casilla, si no es una bomba continuamos jugando, si es una bomba se termina el juego
	var td = $('#' + e.id); //  almaceno la casilla pulsada
	var positions = e.id.split('-');  // para obtener la posición del array asociado a la casilla pulsada necesito extraer el guión y obtener sus dos posiciones
	
	console.log(e);
	if (arr[positions[0]][positions[1]] === 'bomb'){ // si el array pulsado contiene un bug lo mostramos y terminamos el juego, 
		td.html("<img src='img/bomb.png'>");		 // mostrando el div que nos da la información de la partida y la opción de reiniciar	
			$('.gameFinished').css('visibility', 'visible'); 
			$('.gameFinished').css('background-color', 'red');
			$('html, body').animate({ scrollTop: 0 }, 'slow');
			$('.stats').html('LO SENTIMOS!! HAS ENCONTRADO UN BUG! TU PUNTUACIÓN HASTA EL MOMENTO: <br> ' + points + ' puntos <br><br>'
			+ 'Tu partida ha durado: ' + $('#tiempo').html() + ' minutos <br><br>' );
			$('#contenedorTablero').css('pointer-events', 'none'); // Bloqueo que el jugador pueda seguir pulsando casillas en la matriz hasta que reinicie la partida
	} else if(arr[positions[0]][positions[1]] != ('bomb' && 'clear')) { // si la casilla no contiene un bug o ya ha sido abierta mostramos el acierto en pantalla
		totalClicks +=1;												  // sumamos puntos y sumamos otro click para el total de aciertos
		td.html("<img src='img/clear.png'>");
		$('#puntuacion').html(points += 10);
		arr[positions[0]][positions[1]] = 'clear'; 
		if (totalClicks === totalClicksToWin) { // cuando el jugador alcanza el número total de aciertos aparece mediante
			$('#contenedorTablero').css('pointer-events', 'none'); // una animación el div que muestra la info de la partida
			$('.gameFinished').css('visibility', 'visible');	   	
			$('.gameFinished').css('background-color', 'green');
			$('html, body').animate({ scrollTop: 0 }, 'slow'); // como el panel puede ser muy grande hacemos scroll hasta arriba para ver el mensaje
			$('.stats').html('ENHORABUENA!! HAS CONSEGUIDO ACABAR CON UNA PUNTUACIÓN DE: <br> ' + points + ' puntos <br><br>'
			+ 'Tu tiempo ha sido: ' + $('#tiempo').html() + ' minutos <br><br>' );
		}
	}
}

/*
function showBombs(){
	alert(arr);
}
*/

function restartGame(){ // esta función me permite reiniciar el juego, para ello reinicio puntuaciones, el panel, el array de contenido, 
						//desaparece el div de puntuaciones, permito clickar de nuevo en las casillas e inicio el juego de nuevo
	$("#tablero").html("");
	$('#contenedorTablero').css('pointer-events', 'auto');
	$('.gameFinished').css('visibility', 'hidden');
	points = 0;
	seconds = 0;
	totalClicks=0;
	arr = [];
	$('#puntuacion').html(points);
	initContent();
}

/**Aquí se inicializa la aplicación*/
var initContent = function(){
	askForParams();
	initPanel(columns,rows);
	makeRandomBugsInPanel(bugs);
}

document.addEventListener('DOMContentLoaded', initContent, false);

