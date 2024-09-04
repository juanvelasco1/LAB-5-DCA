let socket = io('http://localhost:5050', { path: '/real-time' });

socket.on('updatedUserList', (users) => {
	const userList = document.getElementById('user-list');
	console.log(userList);

	userList.innerHTML = '';
	users.forEach((user) => {
		const div = document.createElement('div');
		div.classList.add('user-item');

		const nameP = document.createElement('p');
		nameP.classList.add('user-name');
		nameP.textContent = `Conductor: ${user.name}`;

		const placaP = document.createElement('p');
		placaP.classList.add('user-placa');
		placaP.textContent = `Placa: ${user.placa}`;

		div.appendChild(nameP);
		div.appendChild(placaP);

		userList.appendChild(div);
	});
});

socket.on('viajeAceptado', (data, conductor) => {
	console.log('Solicitud de viaje aceptada:', data, conductor);
	localStorage.setItem('viajeEnProgreso', JSON.stringify(data));
	localStorage.setItem('conductor', JSON.stringify(conductor));
	window.location.href = 'progreso.html';
});

document.getElementById('solicitar').addEventListener('click', function () {
	const origen = document.getElementById('origen').value;
	const destino = document.getElementById('destino').value;
	const name = localStorage.getItem('pasajeroName');
	const datosViaje = {
		origen,
		destino,
		pasajero: {
			id: socket.id,
			nombre: name,
		},
	};

	console.log(datosViaje);
	socket.emit('solicitarViaje', datosViaje);

	document.getElementById('buscando').style.display = 'block';
	document.getElementById('buscador').style.display = 'none';
	document.getElementById('cancelar').style.display = 'block';
});

document.getElementById('cancelar').addEventListener('click', function () {
	document.getElementById('buscando').style.display = 'none';
	document.getElementById('buscador').style.display = 'block';
	document.getElementById('cancelar').style.display = 'none';
});
