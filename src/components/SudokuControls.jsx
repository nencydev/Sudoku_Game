//sudoku-game/src/components/SudokuControls.jsx
import React from 'react';

function SudokuControls({ onReset, onNewGame, onHint, canUseHint, hintCooldown }) {
    return (
        <div className="flex space-x-4 mt-6">
            <button
                onClick={onReset}
                className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
            >
                Reset Board
            </button>
            <button
                onClick={onNewGame}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-700"
            >
                New Game
            </button>
            <button
                onClick={onHint}
                disabled={!canUseHint}
                className={`px-4 py-2 font-bold rounded text-white transition-colors duration-200 ${canUseHint
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
            > Hint
            </button>

        </div>
    );
}

export default SudokuControls;
