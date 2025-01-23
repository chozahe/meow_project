import { HangmanController } from './HangmanController.js';
import { HangmanModel } from './HangmanModel.js';
import { HangmanView } from './HangmanView.js';

document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('wordDisplay');
    const livesDisplay = document.getElementById('livesDisplay');
    const keyboardContainer = document.getElementById('keyboard');
    const gameArea = document.getElementById('gameArea');
    const startGameButton = document.getElementById('startGameButton');

    const model = new HangmanModel();
    const view = new HangmanView(wordDisplay, livesDisplay, keyboardContainer, gameArea);
    const controller = new HangmanController(model, view);

    startGameButton.addEventListener('click', () => controller.startNewGame());
    document.addEventListener('keydown', (event) => controller.handleKeydown(event));
});