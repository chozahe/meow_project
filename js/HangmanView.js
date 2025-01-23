export class HangmanView {
    constructor(wordDisplay, livesDisplay, keyboardContainer, gameArea) {
        this.wordDisplay = wordDisplay;
        this.livesDisplay = livesDisplay;
        this.keyboardContainer = keyboardContainer;
        this.gameArea = gameArea;
    }

    updateDisplay(model) {
        this.wordDisplay.textContent = model.guessedWord.join(' ');
        this.livesDisplay.textContent = `Lives: ${model.lives}`;
    }

    createKeyboard(buttonStates, onLetterClick) {
        this.keyboardContainer.innerHTML = '';
        this.keyboardContainer.classList.remove('is-hidden');
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

                if (buttonStates[letter]) {
                    const { disabled, status } = buttonStates[letter];
                    button.disabled = disabled;
                    if (status === 'correct') {
                        button.classList.replace('is-info', 'is-success');
                    } else if (status === 'incorrect') {
                        button.classList.replace('is-info', 'is-danger');
                    }
                }

                button.addEventListener('click', () => onLetterClick(letter, button));
                block.appendChild(button);
            }
        }
    }

    showGameArea() {
        this.gameArea.classList.remove('is-hidden');
    }

    showAlert(message) {
        alert(message);
    }
}