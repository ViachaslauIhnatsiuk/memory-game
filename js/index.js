'use strict';


const CARD_FRONTSIDE = document.querySelectorAll('.main-game__card-front');
const CARD_BACKSIDE = document.querySelectorAll('.main-game__card-back');
const ROTATE_TO_BACK = "perspective(1000px) rotateY(180deg)";
const ROTATE_TO_FRONT = "perspective(1000px) rotateY(0deg)";

const SCORE = document.querySelector('.game__count');
const GAME_RESULTS = document.querySelector('.game__results');
const RESET_RESULTS = document.querySelector('.game__reset-results');
const RESET_CURRENT_GAME = document.querySelector('.game__reset-button');

const MAIN_GAME_WINDOW = document.querySelector('.game__main');

const COMPLETED_GAME_WINDOW = document.querySelector('.game__completed');
const COMPLETED_GAME_SCORE = document.querySelector('.game__completed-score');
const COMPLETED_GAME_RESET = document.querySelector('.game__completed-reset');


const gameCards = [{ 0: "angular" }, { 0: "angular" }, { 0: "jquery" }, { 0: "jquery" }, { 0: "react" }, { 0: "react" }, { 0: "js" }, { 0: "js" }, { 0: "css" }, { 0: "css" }, { 0: "typescript" }, { 0: "typescript" }, { 0: "redux" }, { 0: "redux" }, { 0: "vue" }, { 0: "vue" }, { 0: "node" }, { 0: "node" }, { 0: "html" }, { 0: "html" }]
let stack = [];
let matchingsCount = 0;

let results = JSON.parse(localStorage.getItem('storage'));
if (results == null) results = [];


function shuffleCards() {
	stack.length = 0;
	gameCards.sort(() => Math.random() - 0.5);
	for (let i = 0; i < gameCards.length; i++) {
		MAIN_GAME_WINDOW.insertAdjacentHTML("beforeend",
			`<div class="main-game__card">
			<img class="main-game__card-front" src="img/card-front.png" alt="card-front">
			<img class="main-game__card-back" src="img/cards/${gameCards[i][0]}.png" alt="${gameCards[i][0]}">
		</div>`);
	}
	document.querySelectorAll('.main-game__card-front').forEach(item => item.addEventListener('click', rotateCard));
}


window.addEventListener('load', () => {
	shuffleCards();
	results.map(item => GAME_RESULTS.insertAdjacentHTML("beforeend", `<div class="results-game__top">${item}</div>`));
})


function showCompletedGameWindow() {
	document.body.insertAdjacentHTML("afterbegin", `<div class="modal-blackout"></div>`);
	COMPLETED_GAME_WINDOW.style.display = "block";
	COMPLETED_GAME_SCORE.textContent = `Congatulations! You completed this game in ${SCORE.textContent} moves`;
}


function rotateCard(e) {
	SCORE.textContent++;
	e.target.style.transform = "perspective(1000px) rotateY(-180deg)";
	e.target.nextElementSibling.style.transform = ROTATE_TO_FRONT;
	stack.push({ 'alt': e.target.nextElementSibling.alt, 'name': e.target.parentElement });
	if (stack.length < 2) {
		return;
	} else {
		if (stack[stack.length - 1].alt === stack[stack.length - 2].alt) {
			stack.length = 0;
			matchingsCount++;
			if (matchingsCount === 10) {
				showCompletedGameWindow();
			}
		} else {
			const front = stack[stack.length - 2].name.firstElementChild;
			const back = stack[stack.length - 2].name.lastElementChild;
			setTimeout(() => {
				e.target.style.transform = ROTATE_TO_FRONT;
				e.target.nextElementSibling.style.transform = ROTATE_TO_BACK;
				front.style.transform = ROTATE_TO_FRONT;
				back.style.transform = ROTATE_TO_BACK;
			}, 1000);
			stack.length = 0;
		}
	}
}

CARD_FRONTSIDE.forEach(item => item.addEventListener('click', rotateCard));


function resetCurrentGame() {
	SCORE.textContent = 0;
	while (MAIN_GAME_WINDOW.firstElementChild) {
		MAIN_GAME_WINDOW.removeChild(MAIN_GAME_WINDOW.firstElementChild);
	}
	shuffleCards();
}

RESET_CURRENT_GAME.addEventListener('click', resetCurrentGame);


function resetCompletedGame() {
	while (GAME_RESULTS.firstElementChild) {
		GAME_RESULTS.removeChild(GAME_RESULTS.firstElementChild);
	}
	if (results.length > 10) {
		results.pop();
		results.unshift(SCORE.textContent);
		localStorage.setItem('storage', JSON.stringify(results));
		matchingsCount = 0;
	} else {
		results.unshift(SCORE.textContent);
		localStorage.setItem('storage', JSON.stringify(results));
		matchingsCount = 0;
	}
	for (let i = 0; i < results.length; i++) {
		GAME_RESULTS.insertAdjacentHTML("beforeend", `<div class="results-game__top">${results[i]}</div>`)
	}
	resetCurrentGame()
	COMPLETED_GAME_WINDOW.style.display = "none";
	document.body.firstElementChild.remove();
}

COMPLETED_GAME_RESET.addEventListener('click', resetCompletedGame);


function resetResults() {
	while (GAME_RESULTS.firstElementChild) {
		GAME_RESULTS.removeChild(GAME_RESULTS.firstElementChild);
	}
	localStorage.clear();
}

RESET_RESULTS.addEventListener('click', resetResults);