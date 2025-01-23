export class HangmanModel {
    constructor() {
        this.wordToGuess = '';
        this.guessedWord = [];
        this.lives = 6;
        this.buttonStates = {};
    }

    reset(word) {
        this.wordToGuess = word.toLowerCase();
        this.guessedWord = Array(word.length).fill('_');
        this.lives = 6;
        this.buttonStates = {};
    }

    updateButtonState(letter, disabled, status) {
        this.buttonStates[letter] = { disabled, status };
    }

    isWordGuessed() {
        return !this.guessedWord.includes('_');
    }

    isGameOver() {
        return this.lives <= 0;
    }

    saveToLocalStorage() {
        const gameState = {
            wordToGuess: this.wordToGuess,
            guessedWord: this.guessedWord,
            lives: this.lives,
            buttonStates: this.buttonStates
        };
        localStorage.setItem('hangmanGameState', JSON.stringify(gameState));
    }

    loadFromLocalStorage() {
        const savedState = localStorage.getItem('hangmanGameState');
        if (savedState) {
            const { wordToGuess, guessedWord, lives, buttonStates } = JSON.parse(savedState);
            this.wordToGuess = wordToGuess || '';
            this.guessedWord = guessedWord || Array(this.wordToGuess.length).fill('_');
            this.lives = lives ?? 6;
            this.buttonStates = buttonStates || {};
        }
    }


}