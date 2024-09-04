let socket = io('http://localhost:5050', { path: '/real-time' });

document.addEventListener('DOMContentLoaded', function () {
	const viajeData = localStorage.getItem('viajeEnProgreso');

	if (viajeData) {
		const data = JSON.parse(viajeData);

		const detallesViaje = document.getElementById('detalles-viaje');

		detallesViaje.innerHTML = `
            <p><strong>Origen:</strong> ${data.origen}</p>
            <p><strong>Destino:</strong> ${data.destino}</p>
			<p><strong>Conductor:</strong> ${data.conductor.name}</p>
            <p><strong>Placa:</strong> ${data.conductor.placa}</p>
      `;

		const estadoViaje = document.getElementById('estado-viaje');
		estadoViaje.innerHTML = `
		<p>Tu viaje fue <strong>${data.estado || 'Pendiente'}</strong></p>
`;
	} else {
		console.error('No se encontraron datos del viaje en localStorage.');
	}

	socket.on('estadoViaje', (data) => {
		console.log('Estado del viaje recibido:', data);
		const estadoViaje = document.getElementById('estado-viaje');

		estadoViaje.innerHTML = `
		    <p>Tu viaje ha <strong>${data.estado || 'Pendiente'}</strong></p>
      `;

		localStorage.setItem('viajeEnProgreso', JSON.stringify(data));
	});

	socket.on('estadoViajeFianlizado', (data) => {
		console.log('Estado del viaje recibido:', data);
		const estadoViaje = document.getElementById('estado-viaje');

		estadoViaje.innerHTML = `
		    <p><strong>Estado:</strong> ${data.estado || 'Pendiente'}</p>
      `;
		window.location.href = 'disponibles.html';
		localStorage.setItem('viajeEnProgreso', JSON.stringify(data));
	});
});
