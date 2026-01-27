class Sudoku {
    constructor(size) {
        this.size = size;
        this.sqSize = Math.sqrt(size);
        this.board = [];
        for (var i = 0; i < size*size; i++) { this.board[i] = 0; }
    }

    getIndex(row, col) {
        return (row * this.size) + col;
    }

    randomize() {
        for (let i = 0; i < this.size * this.size; i++) {
            this.board[i] = Math.floor(Math.random() * this.size) + 1;
        }
    }

    set(row, col, value) {
        this.board[this.getIndex(row, col)] = value;
    }

    get(row, col) {
        return this.board[this.getIndex(row, col)];
    }
    
}