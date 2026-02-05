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

    numConflicts(row, col) {
        let conflicts = 0;
        for (let i = 0; i < this.size; i++) {
            if ( i != col && (this.get(row,i) == this.get(row,col)) ) {
                conflicts++;
                break;
            }
        }
        for (let i = 0; i < this.size; i++) {
            if ( i != row && (this.get(i,col) == this.get(row,col)) ) {
                conflicts++;
                break;
            }
        }

        let sr = Math.floor(row / this.sqSize) * this.sqSize;
        let sc = Math.floor(col / this.sqSize) * this.sqSize;
        for (let r = 0; r < this.sqSize; r++) {
            for (let c = 0; c < this.sqSize; c++) {
                let rr = sr + r;
                let cc = sc + c;
                if ( rr != row && cc != col && (this.get(rr,cc) == this.get(row,col)) ) {
                    conflicts++;
                    break;
                }
            }
        }
        return conflicts;
    }

    setArray(array) {
        this.board = array;
        this.size = Math.round(Math.sqrt(array.length));
        this.sqSize = Math.sqrt(this.size);
    }

}