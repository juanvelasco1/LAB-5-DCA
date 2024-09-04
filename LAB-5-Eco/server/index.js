const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
	path: '/real-time',
	cors: {
		origin: '*',
	},
});

let conductoresOnline = [];

const dbc = {
	conductores: [],
};

const dbp = {
	pasajeros: [],
};

io.on('connection', (socket) => {
	console.log('Un cliente se ha conectado', socket.id);

	socket.on('conductorOnline', (conductor) => {
		const existingConductor = conductoresOnline.find((c) => c.id === conductor.id);

		if (!existingConductor) {
			const newConductor = { id: conductor.id, name: conductor.name, placa: conductor.placa };
			conductoresOnline.push(newConductor);
			console.log('Conductor en línea:', newConductor);
			io.emit('updatedUserList', conductoresOnline);
		} else {
			console.log('Conductor ya está en línea:', conductor.name);
		}
	});

	socket.on('conductorOffline', (conductor) => {
		conductoresOnline = conductoresOnline.filter((conductorOnline) => conductorOnline.id !== conductor.id);
		console.log('Conductor desconectado:', conductor);
		io.emit('updatedUserList', conductoresOnline);
	});

	socket.on('solicitarViaje', (data) => {
		console.log('Solicitud de viaje recibida:', data);

		//guardar datos del pasajero que solicitó el viaje
		dbp.pasajeros.push({ id: socket.id, nombre: data.pasajero.nombre });

		conductoresOnline.forEach((conductor) => {
			io.to(conductor.id).emit('notificacionViaje', { ...data, pasajeroId: socket.id });
			console.log(data);
		});
	});

	socket.on('aceptarSolicitud', (data) => {
		console.log('Solicitud de viaje aceptada:', data);
		const pasajeroSocket = dbp.pasajeros.find((pasajero) => pasajero.id === data.id);

		if (pasajeroSocket) {
			const conductor = conductoresOnline.find((conductor) => conductor.id === socket.id);
			console.log(conductor);

			io.to(pasajeroSocket.id).emit('viajeAceptado', {
				...data.viaje,
				conductor: conductor,
				estado: 'Aceptado',
			});
			console.log('conductor:', conductor);
		} else {
			console.log('Pasajero no encontrado');
		}
	});

	socket.on('iniciarViaje', (data) => {
		console.log('Viaje iniciado:', data);

		const pasajero = dbp.pasajeros.find((pasajero) => pasajero.id === data.id);
		console.log('data', dbp);

		if (pasajero) {
			console.log('Emitiendo estadoViaje a pasajero con ID:', pasajero.id);
			io.emit('estadoViaje', {
				estado: 'iniciado',

				viaje: data.viaje,
			});

			console.log('Estado del viaje actualizado y enviado al pasajero');
		} else {
			console.log('Pasajero no encontrado');
		}
	});

	socket.on('finalizarViaje', (data) => {
		console.log('Viaje finalizado:', data);

		const pasajero = dbp.pasajeros.find((pasajero) => pasajero.id === data.id);
		console.log('data', dbp);

		if (pasajero) {
			console.log('Emitiendo viaje finalizado a pasajero con ID:', pasajero.id);
			io.emit('estadoViajeFianlizado', {
				estado: 'Viaje finalizado',
				viaje: data.viaje,
			});

			console.log('Estado del viaje actualizado y enviado al pasajero');
		} else {
			console.log('Pasajero no encontrado');
		}
	});

	socket.on('disconnect', () => {
		conductoresOnline = conductoresOnline.filter((conductorOnline) => conductorOnline.id !== socket.id);
		io.emit('updatedUserList', conductoresOnline);
	});
});

app.get('/pasajeros', (request, response) => {
	response.send(dbp);
});

app.post('/pasajeros', (request, response) => {
	const { body } = request;
	dbp.pasajeros.push(body);
	console.log('Pasajero guardado:', body);
	response.status(201).send(body);
});

app.get('/conductores', (request, response) => {
	response.send(dbc);
});

app.post('/conductores', (request, response) => {
	const { body } = request;
	dbc.conductores.push(body);
	console.log('Conductor guardado:', body); // Aquí se guarda y se imprime el conductor
	response.status(201).send(body);
});

app.put('/conductores/:name', (request, response) => {
	const { name } = request.params;
	const { vehicle } = request.body;

	console.log(dbc.conductores);

	const conductor = dbc.conductores.find((conductor) => conductor.name === name);

	if (conductor) {
		conductor.vehicle = vehicle;
		response.send(conductor);
	} else {
		response.status(404).send({ error: 'Conductor not found' });
	}
});

app.get('/conductores/:name', (request, response) => {
	const { name } = request.params;

	const conductor = dbc.conductores.find((conductor) => conductor.name === name);

	if (conductor) {
		response.send(conductor);
	} else {
		response.status(404).send({ error: 'Conductor not found' });
	}
});

httpServer.listen(5050, () => {
	console.log(`Server is running on http://localhost:5050`);
});
