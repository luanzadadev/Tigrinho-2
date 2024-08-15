const cardsArray = [
    'tiger1', 'tiger1',
    'tiger2', 'tiger2',
    'tiger3', 'tiger3',
    'tiger4', 'tiger4',
    'tiger5', 'tiger5',
    'tiger6', 'tiger6',
    'tiger7', 'tiger7',
    'tiger8', 'tiger8'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let gameTimer;
let timeRemaining = 60;
let gameStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const resultMessage = document.getElementById('result-message');
    const timerDisplay = document.getElementById('timer');

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        const shuffledCards = shuffle([...cardsArray]);
        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-back">
                        <img src="img/${card}.png" alt="${card}">
                    </div>
                    <div class="card-front"></div>
                </div>`;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (lockBoard || !gameStarted) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.querySelector('.card-back img').alt === secondCard.querySelector('.card-back img').alt;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();

        matchedPairs++;
        if (matchedPairs === cardsArray.length / 2) {
            showWinMessage();
            clearInterval(gameTimer);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard(true);
        }, 1000);
    }

    function resetBoard(reshuffle = false) {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
        if (reshuffle) {
            gameBoard.innerHTML = '';
            createBoard();
        }
    }

    function startTimer() {
        timeRemaining = 60;
        timerDisplay.textContent = `Tempo: ${formatTime(timeRemaining)}`;
        gameTimer = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Tempo: ${formatTime(timeRemaining)}`;
            if (timeRemaining <= 0) {
                clearInterval(gameTimer);
                checkGameOver();
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function resetGame() {
        gameBoard.innerHTML = '';
        matchedPairs = 0;
        resultMessage.classList.add('hidden');
        createBoard();
        startTimer();
    }

    function checkGameOver() {
        if (matchedPairs === cardsArray.length / 2) {
            resultMessage.textContent = 'Parabéns! Você encontrou todos os pares!';
        } else if (timeRemaining <= 0 && matchedPairs < cardsArray.length / 2) {
            resultMessage.textContent = 'Foi por pouco!';
        } else {
            resultMessage.textContent = 'Tente novamente!';
        }
        resultMessage.classList.remove('hidden');
    }

    function showWinMessage() {
        resultMessage.textContent = 'Parabéns! Você encontrou todos os pares!';
        resultMessage.classList.remove('hidden');
    }

    function startGame() {
        gameStarted = true;
        document.getElementById('start-button').classList.add('hidden');
        document.getElementById('game-board').classList.remove('hidden');
        document.getElementById('reset-button').classList.remove('hidden');
        document.getElementById('timer').classList.remove('hidden');
        createBoard();
        startTimer();
    }

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
});
