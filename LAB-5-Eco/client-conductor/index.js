document.getElementById('login-button').addEventListener('click', loginUser);

async function loginUser() {
	try {
		const username = document.getElementById('username_input').value;
		const password = document.getElementById('password_input').value;

		const conductor = {
			name: username,
			password: password, // if you want to generate random images for user profile go to this link: https://avatar-placeholder.iran.liara.run/
		};

		const response = await fetch('http://localhost:5050/conductores', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Specify the content type as JSON
			},
			body: JSON.stringify(conductor), // Convert the data to a JSON string
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		localStorage.setItem('conductorName', username);
		console.log(username, password);
		window.location.href = 'vehiculos.html';
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
