let socket = io('http://localhost:5050', { path: '/real-time' });

document.getElementById('online').addEventListener('click', function () {
	const conductorName = localStorage.getItem('conductorName');
	const conductorPlaca = localStorage.getItem('selectedVehicle');
	console.log(conductorPlaca);

	if (conductorName && conductorPlaca) {
		socket.emit('conductorOnline', { id: socket.id, name: conductorName, placa: conductorPlaca });
	}
	socket.on('updateUserList', (users) => {
		const userList = document.getElementById('user-list');
		userList.innerHTML = '';
		users.forEach((user) => {
			const li = document.createElement('li');
			li.textContent = `Usuario ID: ${user}`;
			userList.appendChild(li);
		});
	});
});

document.getElementById('offline').addEventListener('click', function () {
	const conductorName = localStorage.getItem('conductorName');
	if (conductorName) {
		socket.emit('conductorOffline', { id: socket.id, name: conductorName });
	}
});

socket.on('notificacionViaje', (data) => {
	console.log('Nueva solicitud de viaje recibida:', data);
	const notificaciones = document.getElementById('notificaciones');

	notificaciones.innerHTML = `
	<h3>Nueva solicitud de viaje</h3>

	<div class="todo">
	<div class="datos">
	<p><strong>Origen:</strong> ${data.origen}</p>
	<p><strong>Destino:</strong> ${data.destino}</p>
	<p><strong>Nombre del Pasajero:</strong> ${data.pasajero.nombre}</p>
	</div>

	<div class="aceptar">
	<button id="aceptarSolicitud">Aceptar viaje</button>
	</div>
	</div>
`;
	notificaciones.style.display = 'block';

	document.getElementById('aceptarSolicitud').addEventListener('click', function () {
		const conductorName = localStorage.getItem('conductorName');
		const conductorPlaca = localStorage.getItem('selectedVehicle');

		if (conductorName && conductorPlaca) {
			socket.emit('aceptarSolicitud', {
				id: data.pasajero.id,
				viaje: {
					...data,
					conductor: {
						name: conductorName,
						placa: conductorPlaca,
					},
				},
			});

			localStorage.setItem('viajeEnProgreso', JSON.stringify(data));
			window.location.href = 'progreso.html';
		} else {
			console.error('Faltan datos del conductor');
		}
	});
});

async function fetchData() {
	try {
		const conductorName = localStorage.getItem('conductorName');

		if (!conductorName) {
			throw new Error('No conductor name found in localStorage');
		}

		const response = await fetch(`http://localhost:5050/conductores/${conductorName}`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		renderData(data);
	} catch (error) {
		console.error(error);
		renderErrorState();
	}
}

function renderData(data) {
	const container = document.getElementById('vehiculo');
	container.innerHTML = '';

	const div = document.createElement('div');
	div.className = 'item';
	div.innerHTML = `<p id="vehicle">${data.vehicle}</p>`;

	container.appendChild(div);
}

function renderErrorState() {
	const container = document.getElementById('vehiculo');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Failed to load data</p>';
	console.log('Failed to load data');
}

function renderLoadingState() {
	const container = document.getElementById('vehiculo');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Loading...</p>';
}

window.addEventListener('load', fetchData);
