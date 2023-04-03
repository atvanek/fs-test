const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());
app.use('/api', (req, res) => {
	console.log('request received AGAIN');
	res.json('this is the API');
});

app.use('/other', (req, res) => {
	console.log('request received AGAIN');
	res.json('this is the OTHER');
});

app.use('/testWord', (req, res) => {
	console.log(req.body);
	const { word } = req.body;
	fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
			if (!Array.isArray(data)) {
				console.log('invalid');
				res.json({ word: 'invalid' });
			} else {
				res.json({ word: 'valid' });
			}
		});
});

const allMessages = [];
app.post('/message', (req, res) => {
	console.log('received');
	const { message } = req.body;
	console.log(req.body);
	allMessages.push(message);
	res.json(allMessages);
});

app.get('/message');

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
