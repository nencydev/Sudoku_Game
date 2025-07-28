// sudoku-game/src/components/SudokuBoard.jsx
import React, { useState, useEffect } from 'react';
import SudokuCell from './SudokuCell';
import SudokuControls from './SudokuControls';
import { generateFullSudoku, removeCells } from './SudokuLogic';
import Modal from './Modal';

function SudokuBoard() {
    const [board, setBoard] = useState([]);
    const [originalBoard, setOriginalBoard] = useState([]);
    const [solution, setSolution] = useState([]);
    const [difficulty, setDifficulty] = useState('easy');
    const [mistakes, setMistakes] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [canUseHint, setCanUseHint] = useState(true);
    const [hintCooldown, setHintCooldown] = useState(0);

    // Load from localStorage on first render
    useEffect(() => {
        const saved = localStorage.getItem('sudoku-game');
        if (saved) {
            const { board, originalBoard, solution, mistakes, difficulty } = JSON.parse(saved);
            setBoard(board);
            setOriginalBoard(originalBoard);
            setSolution(solution);
            setMistakes(mistakes);
            setDifficulty(difficulty);
        } else {
            generatePuzzle(difficulty);
        }
    }, []);

    // Save to localStorage every time board or mistake changes
    useEffect(() => {
        if (board.length && originalBoard.length && solution.length) {
            localStorage.setItem(
                'sudoku-game',
                JSON.stringify({ board, originalBoard, solution, mistakes, difficulty })
            );
        }
    }, [board, originalBoard, solution, mistakes, difficulty]);

    const generatePuzzle = (difficulty) => {
        localStorage.removeItem('sudoku-game');
        const fullBoard = generateFullSudoku();
        const puzzle = removeCells(fullBoard, difficulty);
        setBoard(puzzle);
        setOriginalBoard(puzzle);
        setSolution(fullBoard);
        setMistakes(0);
        setStartTime(Date.now());
        setEndTime(null);
        setIsGameOver(false);

        setCanUseHint(false);
        setHintCooldown(5);
        let countdown = 5;
        const interval = setInterval(() => {
            countdown -= 1;
            setHintCooldown(countdown);
            if (countdown <= 0) {
                clearInterval(interval);
                setCanUseHint(true);
            }
        }, 1000);

    };

    const handleChange = (row, col, value) => {
        if (!/^[1-9]?$/.test(value)) return;

        const num = value === '' ? 0 : parseInt(value);
        const updatedBoard = board.map((r, rowIndex) =>
            r.map((cell, colIndex) =>
                rowIndex === row && colIndex === col ? num : cell
            )
        );

        if (
            originalBoard[row][col] === 0 &&
            num !== 0 &&
            num !== solution[row][col]
        ) {
            setMistakes((prev) => prev + 1);
        }

        setBoard(updatedBoard);
        if (checkIfGameCompleted(updatedBoard)) {
            setIsGameOver(true);
            setEndTime(Date.now());
        }
    };

    const resetBoard = () => {
        setBoard(originalBoard);
        setMistakes(0);
    };

    const handleHint = () => {
        if (!canUseHint || isGameOver) return;

        const emptyCells = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (!board[r][c]) {
                    emptyCells.push({ r, c });
                }
            }
        }

        if (emptyCells.length === 0) return;

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { r, c } = emptyCells[randomIndex];
        const newBoard = board.map((row, i) =>
            row.map((val, j) => (i === r && j === c ? solution[i][j] : val))
        );
        setBoard(newBoard);

        // ✅ Check if the hint completed the game
        if (checkIfGameCompleted(newBoard)) {
            setIsGameOver(true);
            setEndTime(Date.now());
        }

        // 🔁 Start cooldown
        setCanUseHint(false);
        setHintCooldown(5);
        let countdown = 5;
        const interval = setInterval(() => {
            countdown -= 1;
            setHintCooldown(countdown);
            if (countdown <= 0) {
                clearInterval(interval);
                setCanUseHint(true);
            }
        }, 1000);
    };



    const checkIfGameCompleted = (updatedBoard) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (updatedBoard[i][j] !== solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleDifficultyChange = (e) => {
        const level = e.target.value;
        setDifficulty(level);
        generatePuzzle(level);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-2">Sudoku Game</h1>

            <div className="flex space-x-4 items-center">
                <select
                    onChange={handleDifficultyChange}
                    value={difficulty}
                    className="p-2 rounded border"
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <span className="text-lg font-semibold text-red-600">Mistakes: {mistakes}</span>
            </div>

            <div className="grid grid-cols-9 border-4 border-black bg-white">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isTopBold = rowIndex % 3 === 0;
                        const isLeftBold = colIndex % 3 === 0;
                        const isBottomBold = rowIndex === 8;
                        const isRightBold = colIndex === 8;

                        const borderClasses = `
                            ${isTopBold ? 'border-t-4' : 'border-t'}
                            ${isLeftBold ? 'border-l-4' : 'border-l'}
                            ${isBottomBold ? 'border-b-4' : 'border-b'}
                            ${isRightBold ? 'border-r-4' : 'border-r'}
                            border-gray-700
                            `;

                        const hasError =
                            cell !== 0 &&
                            cell !== solution[rowIndex][colIndex] &&
                            originalBoard[rowIndex][colIndex] === 0;

                        return (
                            <div key={`${rowIndex}-${colIndex}`} className={borderClasses}>
                                <SudokuCell
                                    value={cell}
                                    row={rowIndex}
                                    col={colIndex}
                                    onChange={handleChange}
                                    readOnly={originalBoard[rowIndex][colIndex] !== 0}
                                    hasError={hasError}
                                    isUserInput={originalBoard[rowIndex][colIndex] === 0 && cell !== 0}
                                />
                            </div>
                        );
                    })
                )}
            </div>

            <SudokuControls
                onReset={resetBoard}
                onNewGame={() => generatePuzzle(difficulty)}
                onHint={handleHint}
                canUseHint={canUseHint}
                hintCooldown={hintCooldown} />

            {isGameOver && (
                <Modal onClose={() => generatePuzzle(difficulty)}>
                    <h2 className="text-3xl font-bold text-green-700 mb-4">🎉 Puzzle Solved!</h2>
                    <p className="text-gray-700">
                        You solved the puzzle in{" "}
                        <span className="font-semibold text-blue-600">
                            {Math.floor((endTime - startTime) / 60000)} minutes{" "}
                            {Math.floor(((endTime - startTime) % 60000) / 1000)} seconds
                        </span>.
                    </p>
                    <p className="text-gray-600 mt-4">Want to play again?</p>
                </Modal>
            )}
        </div>
    );
}

export default SudokuBoard;
