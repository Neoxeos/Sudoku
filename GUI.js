const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;

class GUI {
    constructor(sudoku) {
    }

    drawBoard(sudoku) {
        const size = sudoku.size;
        const cellSize = canvas.width / size;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        for (let i = 0; i <= size; i++) {
            ctx.lineWidth = (i % sudoku.sqSize === 0) ? 3 : 1;
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }
        this.drawNumbers(sudoku);
    }

    drawNumbers(sudoku) {
        const size = sudoku.size;
        const cellSize = canvas.width / size;
        ctx.font = `${cellSize / 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const num = sudoku.get(r, c);
                if (num !== 0) {
                    ctx.fillText(num, c * cellSize + cellSize / 2, r * cellSize + cellSize / 2);
                }
            }
        }
    }
        
}

function run(){
    const sudoku = new Sudoku(9);
    sudoku.randomize();
    const gui = new GUI(sudoku);
    gui.drawBoard(sudoku);
}

run();