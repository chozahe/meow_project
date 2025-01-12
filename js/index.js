class HangmanGame {
    constructor() {
        this.wordToGuess = '';
        this.guessedWord = [];
        this.lives = 6;
        this.buttonStates = {};
        this.keyboardContainer = document.getElementById('keyboard');
        this.wordDisplay = document.getElementById('wordDisplay');
        this.livesDisplay = document.getElementById('livesDisplay');
        this.startGameButton = document.getElementById('startGameButton');
        this.gameArea = document.getElementById('gameArea');

    }

     init() {
         this.loadGameState();
         document.addEventListener('keydown', (event) => this.handleKeydown(event));
         this.startGameButton.addEventListener('click', () => this.startNewGame());
    }

    loadGameState() {
        const savedState = localStorage.getItem('hangmanGameState');
        if (savedState) {
            const { word, guessed, remainingLives, buttonStates } = JSON.parse(savedState);
            this.wordToGuess = word;
            this.guessedWord = guessed;
            this.lives = remainingLives;
            this.buttonStates = buttonStates || {};

            this.createKeyboard();
            this.updateGameDisplay();
            this.showGameArea();
        }
    }

    saveGameState() {
        const gameState = {
            word: this.wordToGuess,
            guessed: this.guessedWord,
            remainingLives: this.lives,
            buttonStates: this.buttonStates
        };
        localStorage.setItem('hangmanGameState', JSON.stringify(gameState));
    }

    resetGameState() {
        localStorage.removeItem('hangmanGameState');
        this.wordDisplay.textContent = '';
        this.livesDisplay.textContent = '';
        this.keyboardContainer.innerHTML = '';
        this.keyboardContainer.classList.add('is-hidden');
        this.wordToGuess = '';
        this.guessedWord = [];
        this.lives = 6;
        this.buttonStates = {};
        this.hideGameArea();
    }

    async startNewGame() {
        try {
            this.resetGameState();
            const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
            if (!response.ok) throw new Error('Failed to fetch random word');
            const [newWord] = await response.json();
            this.wordToGuess = newWord.toLowerCase();
            this.guessedWord = Array(this.wordToGuess.length).fill('_');
            this.createKeyboard();
            this.updateGameDisplay();
            this.showGameArea();
            this.saveGameState();
            console.log("New game started with word:", this.wordToGuess);
        } catch (error) {
            console.error('Error:', error);
            alert('Unable to start a new game. Please try again.');
        }
    }

    createKeyboard() {
        this.keyboardContainer.classList.remove('is-hidden');
        this.keyboardContainer.innerHTML = '';
        const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

        for (const row of rows) {
            const block = document.createElement('div');
            this.keyboardContainer.appendChild(block);
            block.classList.add('block', 'buttons', 'are-medium', 'is-centered');

            for (let j = 0; j < row.length; j++) {
                const letter = row[j];
                const button = document.createElement('button');
                button.textContent = letter;
                button.classList.add('button', 'is-info', 'is-responsive');

                // Применяем состояние кнопки из buttonStates
                if (this.buttonStates[letter]) {
                    const { disabled, status } = this.buttonStates[letter];
                    button.disabled = disabled;
                    if (status === 'correct') {
                        button.classList.replace('is-info', 'is-success');
                    } else if (status === 'incorrect') {
                        button.classList.replace('is-info', 'is-danger');
                    }
                }

                button.addEventListener('click', () => this.handleGuess(letter, button));
                block.appendChild(button);
            }
        }
    }



    updateGameDisplay() {
        this.wordDisplay.textContent = this.guessedWord.join(' ');
        this.livesDisplay.textContent = `Lives: ${this.lives}`;
    }

    handleGuess(guessedLetter, button) {
        if (!guessedLetter || this.guessedWord.includes(guessedLetter) || this.lives <= 0) {
            return;
        }

        button.disabled = true;

        if (this.wordToGuess.includes(guessedLetter)) {
            button.classList.replace('is-info', 'is-success');
            this.wordToGuess.split('').forEach((char, index) => {
                if (char === guessedLetter) this.guessedWord[index] = guessedLetter;
            });
            this.buttonStates[guessedLetter] = {
                disabled: true,
                status: 'correct',
            };
        } else {
            button.classList.replace('is-info', 'is-danger');
            this.lives -= 1;
            this.buttonStates[guessedLetter] = {
                disabled: true,
                status: 'incorrect',
            };
        }

        this.updateGameDisplay();
        this.saveGameState();

        if (!this.guessedWord.includes('_')) {
            alert(`You won! The word was "${this.wordToGuess}".`);
            this.resetGameState();
        } else if (this.lives <= 0) {
            alert(`Game over! The word was "${this.wordToGuess}".`);
            this.resetGameState();
        }
    }


    handleKeydown(event) {
        const key = event.key.toLowerCase();
        if (/^[a-z]$/.test(key)) {
            const button = Array.from(document.querySelectorAll('#keyboard button'))
                .find(btn => btn.textContent === key);
            if (button && !button.disabled) {
                this.handleGuess(key, button);
            }
        }
    }

    showGameArea() {
        this.gameArea.classList.remove('is-hidden');
    }

    hideGameArea() {
        this.gameArea.classList.add('is-hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new HangmanGame();
    game.init();
});