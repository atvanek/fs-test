import React from 'react';
import Row from './Row';

function Board() {
	const [letters, setLetters] = React.useState([]);
	const [wordStarted, setWordStarted] = React.useState(false);
	const [selectedBoxes, setSelectedBoxes] = React.useState(new Set());
	const [possibleMoves, setPossibleMoves] = React.useState(new Set());
	const [currentWord, setCurrentWord] = React.useState('');
	const [currentCube, setCurrentCube] = React.useState('');
	const [score, setScore] = React.useState(0);
	const [boxCoords, setBoxCoords] = React.useState({});

	function populateBoard() {
		const coordinates = {};
		const lettersGrid = [];
		let id = 1;

		for (let i = 0; i < 4; i++) {
			const letters = [];
			for (let j = 0; j < 4; j++) {
				const letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
				letters.push(letter);
				coordinates[id] = [i, j];
				id++;
			}
			lettersGrid.push(letters);
		}
		setLetters(lettersGrid);
		setBoxCoords(coordinates);
	}

	function calculatePossibleMoves(coordinates) {
		const x = coordinates[0];
		const y = coordinates[1];

		//check all surrounding squares
		const adjacent = new Set();
		for (let i = x - 1; i < x + 2; i++) {
			if (i >= 0 && i <= 3) {
				for (let j = y - 1; j < y + 2; j++)
					if (j >= 0 && j <= 3 && !(i === x && j === y)) {
						adjacent.add(String([i, j]));
					}
			}
		}
		setSelectedBoxes((prev) => {
			const newSet = prev;
			newSet.add(String(coordinates));
			return newSet;
		});
		console.log(adjacent);
		setPossibleMoves(adjacent);
	}

	function handleBoxClick(e) {
		const coordinates = boxCoords[e.target.id];
		if (selectedBoxes.has(String(coordinates))) {
			window.alert('please select new box');
			return;
		}
		if (wordStarted && !possibleMoves.has(String(coordinates))) {
			window.alert('please select adjacent box');
			return;
		}

		if (selectedBoxes.size === 0) {
			setWordStarted(true);
		}
		console.log(e.target.innerText);
		calculatePossibleMoves(coordinates);
		setCurrentWord((prev) => {
			const newWord = prev + e.target.innerText;
			return newWord;
		});
		// setSelectedBoxes((prev) => [...prev, [coordinates]]);
		e.target.classList.add('selected');

		// 	- if not, checks if target is in selectedCubes list
		// 		- if so,
		// 			- word started is false
		// 			- selectedCubes empties
		// 			- possible moves empties
		// 			- current cube empties
		// 		- if not,
		// 			- nothing happens
		// - if so, current cube is target
		// - calculatePossibleMoves is invoked
	}

	React.useEffect(() => {
		populateBoard();
	}, []);

	const rows = letters.map((arr, i) => (
		<Row
			id={`row-${i + 1}`}
			row={i + 1}
			key={i + 1}
			letters={arr}
			handleClick={handleBoxClick}
		/>
	));

	return (
		<>
			<main id='board' className='border flex'>
				{rows}
			</main>
			<div id='score'>{score}</div>
			<button
				onClick={(e) => {
					e.preventDefault();
					fetch('/testWord', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ word: currentWord.toLowerCase() }),
					})
						.then((res) => res.json())
						.then((data) => {
							const { word } = data;
							console.log(word);
							if (word === 'valid') {
								setScore((prev) => prev + 1);
							}
							setWordStarted(false);
							setCurrentCube([]);
							setPossibleMoves(new Set());
							setSelectedBoxes(new Set());
							setCurrentWord('');
							document
								.querySelectorAll('.box')
								.forEach((node) => node.classList.remove('selected'));
						});
				}}>
				Validate word
			</button>

			<button
				onClick={() => {
					console.log(currentWord);
					setWordStarted(false);
					setCurrentCube([]);
					setPossibleMoves(new Set());
					setSelectedBoxes(new Set());
					setCurrentWord('');
					document
						.querySelectorAll('.box')
						.forEach((node) => node.classList.remove('selected'));
				}}>
				Reset Word
			</button>
		</>
	);
}
export default Board;
