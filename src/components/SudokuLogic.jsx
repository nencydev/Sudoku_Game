// sudoku-game/src/components/SudokuLogic.jsx

export function generateFullSudoku() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillSudoku(board);
    return board;
}

function fillSudoku(board) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
            const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const boxCol = 3 * Math.floor(col / 3) + i % 3;
            if (board[boxRow][boxCol] === num) return false;
        }
        return true;
    }

    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const shuffled = shuffle([...numbers]);
                    for (let num of shuffled) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solve(board);
}

export function removeCells(board, difficulty) {
    let removed = 0;
    const attempts = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 55 : 65;
    const puzzle = board.map(row => row.slice());

    while (removed < attempts) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            removed++;
        }
    }
    return puzzle;
}
