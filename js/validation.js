function validar() {
	const form = document.getElementById("controlPanel");

	//Validar nombre
	const nameInput = document.getElementById("nameForm"); //Nombre que se coloca en el formulario
	const name = document.getElementById("name"); //Nombre en el menú del juego
	const nameError = document.getElementById("nameError"); //Texto que se muestra en formulario en caso de insertar nombre que no cumpla requisitos

	const nameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/ //Expresión regular para validar nombre
	if (!nameRegex.test(nameInput.value)){
		nameError.textContent = "El nombre debe empezar por una letra y contener solo caracteres alfanuméricos";
		return false;
	} else {
		name.textContent = nameInput.value; //Actualiza el nombre del jugador en caso de que cumpla los requisitos
	}

	nameError.textContent = "";

	//Validar puntos por acierto
	const pointsPerHitInput = document.getElementById("pointsPerHitForm"); //Puntos que coloca usuario en el formulario
	const pointsPerHitError = document.getElementById("pointsPerHitError"); //Mensaje de error en caso de que usuario coloque valor no admitido

	const pointsPerHitRegEx = /^[1-9]\d*$/; //Expresión regular para validar que usuario solo pueda establecer un número entero positivo
	if (!pointsPerHitRegEx.test(pointsPerHitInput.value)) {
		pointsPerHitError.textContent = "Los puntos por acierto deben ser un número entero positivo";
		return false;
	} else {
		juego.puntosAcierto = parseInt(pointsPerHitInput.value); //Actualiza el valor de los aciertos en el objeto juego
	}

	pointsPerHitError.textContent = "";

	//Validar puntos por fallo
	const pointsPerMissInput = document.getElementById("pointsPerMissForm");
	const pointsPerMissError = document.getElementById("pointsPerMissError")

	const pointsPerMissRegEx = /^[1-9]\d*$/;
	if (!pointsPerMissRegEx.test(pointsPerMissInput.value)) {
		pointsPerMissError.textContent = "Los puntos por fallar deben ser un número entero positivo";
		return false;
	} else if (juego.puntosAcierto < pointsPerMissInput.value || juego.puntosAcierto < juego.puntosFallo) {
		pointsPerMissError.textContent = "Los puntos por fallos no pueden superar a los puntos por acierto";
		return false;
	} else {
		juego.puntosFallo = pointsPerMissInput.value;
	}

	pointsPerMissError.textContent = "";





	// En el caso del videojuego no queremos que el navegador cargue una nueva página,
	// pues perderíamos los valores. Por tanto, la validación siempre debe devolver falso
	return false;
}



