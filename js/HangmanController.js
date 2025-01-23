
export class HangmanController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        if (localStorage.getItem('hangmanGameState')) {
            this.model.loadFromLocalStorage();
            this.view.createKeyboard(this.model.buttonStates, (letter, button) => this.handleGuess(letter, button));
            this.view.updateDisplay(this.model);
            this.view.showGameArea();
        }

    }

    async startNewGame() {
        try {
            const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
            if (!response.ok) throw new Error('Failed to fetch random word');
            const [newWord] = await response.json();

            this.model.reset(newWord);
            this.view.createKeyboard(this.model.buttonStates, (letter, button) => this.handleGuess(letter, button));
            this.view.updateDisplay(this.model);
            this.view.showGameArea();
            this.model.saveToLocalStorage();
            console.log("New game started with word:", this.model.wordToGuess);
        } catch (error) {
            console.error('Error:', error);
            this.view.showAlert('Unable to start a new game. Please try again.');
        }
    }


    handleGuess(letter, button) {
        if (!letter || this.model.guessedWord.includes(letter) || this.model.isGameOver()) {
            return;
        }

        button.disabled = true;

        if (this.model.wordToGuess.includes(letter)) {
            button.classList.replace('is-info', 'is-success');
            this.model.wordToGuess.split('').forEach((char, index) => {
                if (char === letter) this.model.guessedWord[index] = letter;
            });
            this.model.updateButtonState(letter, true, 'correct');
        } else {
            button.classList.replace('is-info', 'is-danger');
            this.model.lives -= 1;
            this.model.updateButtonState(letter, true, 'incorrect');
        }

        this.view.updateDisplay(this.model);
        this.model.saveToLocalStorage(); // Сохранение состояния

        if (this.model.isWordGuessed()) {
            this.view.showAlert(`You won! The word was "${this.model.wordToGuess}".`);
            this.startNewGame();
        } else if (this.model.isGameOver()) {
            this.view.showAlert(`Game over! The word was "${this.model.wordToGuess}".`);
            this.startNewGame();
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
}