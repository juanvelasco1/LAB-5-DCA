document.getElementById('login-button').addEventListener('click', loginUser);

async function loginUser() {
	try {
		const username = document.getElementById('username_input').value;
		const password = document.getElementById('password_input').value;

		const pasajero = {
			name: username,
			password: password,
		};

		const response = await fetch('http://localhost:5050/pasajeros', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Specify the content type as JSON
			},
			body: JSON.stringify(pasajero), // Convert the data to a JSON string
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		localStorage.setItem('pasajeroName', username);
		console.log(username, password);
		window.location.href = 'disponibles.html';
	} catch (error) {
		renderErrorState();
	}
}

function renderErrorState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Failed to load data</p>';
	console.log('Failed to load data');
}

function renderLoadingState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Loading...</p>';
}
