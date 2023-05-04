// Número total de objetivos en el juego
const NUMOBJETIVOS = 56;

// Clases e IDs de los diferentes elementos HTML
const CLASEACIERTO = 'hit';
const CLASEFALLO = 'miss';
const CLASEVACIO = 'empty';
const CLASEOBJETIVO = 'target';
const IDPUNTUACION = 'score';
const IDNOMBRE = 'name';
const IDOBJETIVO = 'target';
const IDFORMULARIO = 'controlPanel';

// Valores por defecto para el estado del juego
const OBJETIVOSPORMINUTODEF = 60;
const NUMOBJETIVOCORRECTODEF = 0;
const PUNTOSDEF = 0;
const PUNTOSACIERTODEF = 5;
const PUNTOSFALLODEF = 5;
const OBJETIVOACERTADODEF = true;
const NOMBREJUGADORDEF = '';

//Agrego valores por defecto para llevar registro de bonus, aciertos y fallos
const ACIERTOSPARABONUS = 5;
const ACIERTOS = 0;
const FALLOS = 0;

//Agrego variable para guardar el objetivo por minuto anterior a que jugador haga clic y se modifique
const OBJETIVOSPORMINUTOSPREVIO = 0;

// Objeto global que contiene el estado del juego
let juego = {
	objetivosPorMinutoPrevio: OBJETIVOSPORMINUTOSPREVIO,
	objetivosPorMinuto: OBJETIVOSPORMINUTODEF, // La cantidad de objetivos que se le presentan al jugador
	numObjetivoCorrecto: NUMOBJETIVOCORRECTODEF, // El número del objetivo que el jugador debe pinchar
	puntos: PUNTOSDEF, // La cantidad total de puntos
	puntosAcierto: PUNTOSACIERTODEF, // Los puntos que se suman por cada objetivo acertado
	puntosFallo: PUNTOSFALLODEF, // Los puntos que se restan por cada objetivo acertado
	objetivoPuntuado: OBJETIVOACERTADODEF, // Marca un objetivo como puntuado, para sumar la puntuación una única vez
	nombreJugador: NOMBREJUGADORDEF, // Nombre del jugador
	bonusJugador: ACIERTOSPARABONUS, //Aciertos restantes para conseguir bonus
	aciertosJugador: ACIERTOS, //Objetivos acertados por el jugador
	fallosJugador: FALLOS //Objetivos fallados por el jugador
};

/**
 * Summary. Inicializa el juego.
 *
 * Description. Inicializa la puntuación, el objetivo siguiente, y el marcador de control, que previene
 * que un mismo objetivo se puntúe varias veces.
 */
function prepararJuego() {
	juego.numObjetivoCorrecto = NUMOBJETIVOCORRECTODEF;
	juego.puntos = PUNTOSDEF;
	juego.objetivoPuntuado = OBJETIVOACERTADODEF;
}

/**
 * Summary. Inicializa el tablero.
 *
 * Description. Elimina todos los marcadores de acierto y fallo de la pantalla, muestra el nuevo objetivo,
 * y permite que este sea puntuado.
 *
 * @param {Number}	numObjetivoAnterior	El número del objetivo marcado como válido la ronda anterior
 * @param {Number}	numObjetivoNuevo	El número del objetivo a marcar como válido
 */
function prepararTablero(numObjetivoAnterior, numObjetivoNuevo) {
	let id;
	let idObjetivoAnterior = construirIdObjetivo(numObjetivoAnterior);
	let idObjetivoNuevo = construirIdObjetivo(numObjetivoNuevo);

	// Eliminamos los posibles marcadores de fallo y acierto en todo el tablero
	for(let numId = 0; numId <  NUMOBJETIVOS; numId++) {
		id = construirIdObjetivo(numId);
		document.getElementById(id).classList.remove(CLASEACIERTO);
		document.getElementById(id).classList.remove(CLASEFALLO);
	}

	// Registramos y mostramos la nueva casilla como el objetivo actual
	juego.numObjetivoCorrecto = numObjetivoNuevo;

	// Permitimos que el usuario puntúe el nuevo objetivo
	juego.objetivoPuntuado = false;

	// Mostramos el nuevo objetivo, reemplazando el anterior
	document.getElementById(idObjetivoAnterior).classList.remove(CLASEOBJETIVO);
	document.getElementById(idObjetivoNuevo).classList.add(CLASEOBJETIVO);

	//Si los objetivos por minuto entre asignacion de objetivos se mantiene igual, es porque el jugador no ha clicado correcta o incorrectamente y se le restara un punto
	if ((juego.objetivosPorMinuto === juego.objetivosPorMinutoPrevio) && juego.puntos > 0) {
		juego.puntos -= 1; //Disminuye puntos
		juego.fallosJugador +=1; //Aumenta fallos
		juego.bonusJugador = 5; //Reinicia aciertos para bonus

		document.getElementById(IDPUNTUACION).textContent = juego.puntos;
		document.getElementById("fallos").textContent = juego.fallosJugador;
		document.getElementById("bonus").textContent = juego.bonusJugador;
	}
}

/**
 * Summary. Construye la ID HTML de una casilla objetivo a partir de una ID numérica.
 *
 * Description. Concatena el identificador almacenado en la constante IDOBJETIVO con el número
 * recibido como parámetro. Por ejemplo, si IDOBJETIVO contiene 'target', y le pasamos un 4
 * como parámetro, devolverá 'target4'.
 *
 * @param {Number}	idNum	Un identificador numérico.
 *
 * @return {String} La ID del elemento HTML objetivo
 */
function construirIdObjetivo(idNum) {
	// Si estamos trabajando con cadenas de caracteres, el operador + concatena
	return IDOBJETIVO + String(idNum);

}

/**
 * Summary. Registra un acierto en la casilla indicada.
 *
 * Description. Suma los puntos, marca el objetivo como puntuado, y marca la casilla como acertada.
 *
 * @param {Number}	numId	La ID numérica de la casilla acertada.
 */
function objetivoAcertado(numId) {
	let id = construirIdObjetivo(numId);

	//Reproduce sonido cada vez que se acierta
	const audioAcierto = document.getElementById("audioAcierto");
	audioAcierto.play();

	// Marcamos el objetivo como puntuado, y sumamos puntos
	juego.objetivoPuntuado = true;
	juego.puntos = juego.puntos + juego.puntosAcierto;

	console.log('Objetivo ' + id + ' acertado');

	// Mostramos la casilla como acertada
	document.getElementById(id).classList.add(CLASEACIERTO);
	document.getElementById(id).classList.remove(CLASEFALLO);

	//Guardo el objetivo por minutos previo para restar puntos en caso de que jugador no haga clic
	juego.objetivosPorMinutoPrevio = juego.objetivosPorMinuto;

	//Incrementa la cantidad de objetivos por minuto cada vez que se acierte
	juego.objetivosPorMinuto += 2;

	//Incrementar aciertos
	juego.aciertosJugador+= 1;
	document.getElementById("aciertos").textContent = juego.aciertosJugador;

	//Restar cantidad de aciertos restantes para bonus
	if (juego.bonusJugador > 0){
		juego.bonusJugador -=1;
		document.getElementById("bonus").textContent = juego.bonusJugador;
	} if (juego.bonusJugador == 0){
		juego.bonusJugador = 5;
		juego.puntos +=5 //Otorga 5 puntos al jugador si acierta 5 veces seguidas
		document.getElementById("bonus").textContent = juego.bonusJugador;
	}

}

/**
 * Summary. Registra un fallo en la casilla indicada.
 *
 * Description. Resta los puntos, hasta un mínimo de cero, y muestra un fallo en la casilla indicada.
 *
 * @param {Number}	numId	La ID numérica de la casilla fallida.
 */
function objetivoFallido(numId) {
	let id = construirIdObjetivo(numId);

	//Reproduce audio cada vez que se falla
	const audioFallo = document.getElementById("audioFallo");
	audioFallo.play();


	// Con Math.abs() nos aseguramos que restamos puntos, evitando posibles problemas con dobles negativos
	// Con Math.max() nos aseguramos que el total de puntos nunca es inferior a cero
	juego.puntos = Math.max(juego.puntos - Math.abs(juego.puntosFallo), 0);

	console.log('Objetivo ' + id + ' fallido');

	// Mostramos la casilla como fallida
	document.getElementById(id).classList.add(CLASEFALLO);
	document.getElementById(id).classList.remove(CLASEACIERTO);

	//Guardo el objetivo por minutos previo para restar puntos en caso de que jugador no haga clic
	juego.objetivosPorMinutoPrevio = juego.objetivosPorMinuto;

	//Disminuye la cantidad de objetivos por minuto cada vez que se falle hasta llegar a 60 (valor default)
	if (juego.objetivosPorMinuto > 60) {
		juego.objetivosPorMinuto -= 0.33;
	}

	//Si el jugador falla se reinicia la cantidad de aciertos restantes para el bonus
	juego.bonusJugador = 5;
	document.getElementById("bonus").textContent = juego.bonusJugador;

	//Aumenta contador de fallos si jugador clica en casilla incorrecta
	juego.fallosJugador +=1;
	document.getElementById("fallos").textContent = juego.fallosJugador;


}

/**
 * Summary. Registra una repetición.
 *
 * Description. En las repeticiones no hacemos nada.
 *
 */
function objetivoRepetido(numId) {
	let id = construirIdObjetivo(numId);

	console.log('Objetivo ' + id + ' repetido');
}

/**
 * Summary. Selecciona y muestra un nuevo objetivo.
 *
 * Description. Aleatoriamente genera y registra un nuevo objetivo, y limpia la pantalla de aciertos y fallos.
 * También calcula el tiempo entre objetivos y, justo antes de finalizar, agenda la generación de un nuevo
 * objetivo en función del número de objetivos por minuto.
 *
 */
function nuevoObjetivo() {
	let numObjetivoNuevo = -1;
	let tiempoEspera; // El tiempo que tiene el usuario para acertar, en milisegundos

	// Generamos un nuevo objetivo, asegurándonos que no se repite con el anterior
	while ((numObjetivoNuevo < 0) || (numObjetivoNuevo === juego.numObjetivoCorrecto)){
		// Obtenemos un número aleatorio entre 0 y 0.9999 (aprox), lo multiplicamos por el número
		// de objetivos, y redondeamos hacia abajo.
		// Así obtenemos un número entre 0 y NUMOBJETIVOS-1
		numObjetivoNuevo = Math.floor(Math.random() * NUMOBJETIVOS );
	}

	// Dividimos 60 segundos (1 segundo son 1000 milisegundos) entre el número de objetivos por minuto
	// P.ej.: Si tuviésemos 30 objetivos por minuto, habría que esperar 2000 milisegundos entre objetivos
	tiempoEspera = Math.floor((60 * 1000) / juego.objetivosPorMinuto);

	// Reseteamos el tablero, marcando las casillas como vacías, y el nuevo objetivo como no pulsado
	prepararTablero(juego.numObjetivoCorrecto, numObjetivoNuevo);

	console.log('El objetivo pasa a ser ' + String(numObjetivoNuevo));
	console.log('Nuevo objetivo en ' + String(tiempoEspera) + 'ms');

	// Esperamos los milisegundos establacidos y, pasado el tiempo, seleccionamos
	// un nuevo objetivo

	console.log(juego.objetivosPorMinuto + " actual")
	console.log(juego.objetivosPorMinutoPrevio + " previo")
	setTimeout(function(){nuevoObjetivo()}, tiempoEspera);

	//Guardamos los objetivos por minutos actuales antes de que se puedan actualizar para usarlos en la penalización por no hacer clic
	juego.objetivosPorMinutoPrevio = juego.objetivosPorMinuto;


}

/**
 * Summary. Inicializa el juego.
 *
 * Description. Inicializa la puntuación, e inicia la selección de objetivos.
 *
 */
function inicializar() {
	prepararJuego(); // Inicializamos el estado del juego a la posición de inicio
	console.log('Juego inicializado');
	nuevoObjetivo(); // Comenzamos a jugar
	document.getElementById("startButton").disabled = true; //Deshabilita el boton iniciar una vez se hace clic para que no se cree más de un objetivo
}

/**
 * Summary. Registra una pulsación en una casilla.
 *
 * Description. Compara la casilla pulsada con el objetivo, registrándolo como acierto si coinciden
 * y es el primer acierto, y como fallo si no coinciden.
 *
 * @param {Number} numObjetivoPulsado La ID numérica del objetivo pulsado.
 */
function pulsado(numObjetivoPulsado) {
	let acierto;

	acierto = numObjetivoPulsado === juego.numObjetivoCorrecto;

	// Si es la primera vez que acierta un objetivo, registramos el acierto
	if (!juego.objetivoPuntuado && acierto) {
		objetivoAcertado(numObjetivoPulsado);
	// Si es un fallo, registramos el fallo
	} else if (!acierto) {
		objetivoFallido(numObjetivoPulsado);
	// Si no, es un acierto repetido
	} else {
		objetivoRepetido(numObjetivoPulsado);
	}

	// Actualizamos el marcador con la puntuación
	document.getElementById(IDPUNTUACION).innerHTML = String(juego.puntos);

	return acierto;
}

