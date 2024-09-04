let selectedVehicle = null;

function selectVehicle(vehicleId) {
	const vehicleButton = document.getElementById(vehicleId);

	if (!vehicleButton) {
		console.error(`No se encontró el botón con ID: ${vehicleId}`);
		return;
	}

	const previouslySelectedButton = document.querySelector('button.selected');
	if (previouslySelectedButton) {
		previouslySelectedButton.classList.remove('selected');
	}

	selectedVehicle = vehicleButton.querySelector('h2').textContent;

	vehicleButton.classList.add('selected');
	console.log('Vehículo seleccionado:', selectedVehicle);
	localStorage.setItem('selectedVehicle', selectedVehicle);
}

// Agregar los eventos de clic a los botones de vehículos
document.getElementById('vehiculo1').addEventListener('click', () => selectVehicle('vehiculo1'));
document.getElementById('vehiculo2').addEventListener('click', () => selectVehicle('vehiculo2'));
document.getElementById('vehiculo3').addEventListener('click', () => selectVehicle('vehiculo3'));

// Manejar el clic en el botón 'siguiente'
document.getElementById('siguiente').addEventListener('click', async () => {
	if (selectedVehicle) {
		const conductorName = localStorage.getItem('conductorName');

		if (conductorName) {
			try {
				const response = await fetch(`http://localhost:5050/conductores/${conductorName}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ vehicle: selectedVehicle }),
				});

				if (response.ok) {
					window.location.href = 'online.html';
					console.log('Continuando con el vehículo:', selectedVehicle);
				} else {
					console.error('Error al actualizar el vehículo:', await response.text());
				}
			} catch (error) {
				console.error('Error de red:', error);
			}
		} else {
			console.error('Nombre del conductor no encontrado');
		}
	} else {
		const warning = document.createElement('p');
		warning.textContent = 'Por favor, selecciona un vehículo';
		document.body.appendChild(warning);

		console.log('Por favor, selecciona un vehículo.');
	}
});
