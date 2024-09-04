let socket = io('http://localhost:5050', { path: '/real-time' });

document.addEventListener('DOMContentLoaded', function () {
	const viajeData = localStorage.getItem('viajeEnProgreso');

	if (viajeData) {
		const data = JSON.parse(viajeData);

		const detallesViaje = document.getElementById('detalles-viaje');

		detallesViaje.innerHTML = `
          <p><strong>Origen:</strong> ${data.origen}</p>
          <p><strong>Destino:</strong> ${data.destino}</p>

          <p><strong>Nombre del Pasajero:</strong> ${data.pasajero.nombre}</p>
      `;
	} else {
		console.error('No se encontraron datos del viaje en localStorage.');
	}
});

document.getElementById('iniciar').addEventListener('click', function () {
	document.getElementById('finalizar').style.display = 'block';
	document.getElementById('iniciar').style.display = 'none';

	const viajeData = JSON.parse(localStorage.getItem('viajeEnProgreso'));

	if (viajeData) {
		socket.emit('iniciarViaje', {
			id: viajeData.pasajero.id,
			viaje: {
				...viajeData,
				estado: 'viaje iniciado',
			},
		});

		localStorage.setItem(
			'viajeEnProgreso',
			JSON.stringify({
				...viajeData,
				estado: 'viaje iniciado',
			})
		);
	} else {
		console.error('No se encontraron datos del viaje en localStorage.');
	}
});

document.getElementById('finalizar').addEventListener('click', function () {
	document.getElementById('iniciar').style.display = 'block';
	document.getElementById('finalizar').style.display = 'none';

	const viajeData = JSON.parse(localStorage.getItem('viajeEnProgreso'));

	if (viajeData) {
		socket.emit('finalizarViaje', {
			id: viajeData.pasajero.id,
			viaje: {
				...viajeData,
				estado: 'Viaje finalizado',
			},
		});

		localStorage.setItem(
			'viajeEnProgreso',
			JSON.stringify({
				...viajeData,
				estado: 'Viaje finalizado',
			})
		);

		window.location.href = 'online.html';
	} else {
		console.error('No se encontraron datos del viaje en localStorage.');
	}
});
