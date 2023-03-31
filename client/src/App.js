import logo from './logo.svg';
import './App.css';
import React from 'react';

function App() {
	const [current, setCurrent] = React.useState('');
	return (
		<div className='App'>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log(e.target[0].value);
					fetch('/testWord', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ word: e.target[0].value }),
					})
						.then((res) => res.json())
						.then((data) => {
							const { word } = data;
							setCurrent(word === 'invalid' ? 'invalid word' : 'valid word!');
						});
				}}>
				<input type='text' />
				<button type='submit'>Validate word</button>
				{current}
			</form>
		</div>
	);
}

export default App;
