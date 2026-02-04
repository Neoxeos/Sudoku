const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

// Sudoku Solver Performance Chart
const chart = Highcharts.chart('graph', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Sudoku Solver Performance'
    },
    xAxis: {
        title: {
            text: 'Generation'
        },
        resize : {
            enabled: true
        },
        min: 0
    },
    yAxis: {
        title: {
            text: 'Fitness Score'
        },
        resize : {
            enabled: true
        },
        min : 0
    },
    series: [{
        name: 'Best Fitness',
        data: [{x:0, y:10}]
    }, {
        name: 'Average Fitness',
        data: [{x:0, y:5}]
    }]
});

function updateChart (x,y) {
    chart.series[0].addPoint([x,y], true, false);
    chart.series[1].addPoint([y,x], true, false);
}

class GUI {
    constructor() {
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

// generate initial population
function generatePop(size, populationSize) {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
        const sudoku = new Sudoku(size);
        sudoku.randomize();
        // calculate fitness
        let fitness = sudokuFitness(sudoku.board);
        population.push({ gene: sudoku.board, fitness: fitness });
    }
    return population;
}

// select best fit individual to display
function selectIndividual(population) {
    let selected = null;
    let max = 0;
    for (let i = 0; i < population.length; i++) {
        let currentFitness = population[i].fitness;
        if (currentFitness > max) {
            max = currentFitness;
            selected = population[i];
        }
    }
    return selected;
}

function run(){
    let settings = new Settings(9);
    let population = generatePop(9, 200);
    let bestIndividual = selectIndividual(population);
    let sudoku = new Sudoku(9);
    sudoku.setArray(bestIndividual.gene);
    let gui = new GUI(sudoku);
    gui.drawBoard(sudoku);
    console.log("Initial best fitness: " + bestIndividual.fitness);

    // here we run the genetic algorithm loop until we hit the best solution
/*     while (bestIndividual.fitness < 243) {
        population= GAEvolve(population, settings);
        bestIndividual = selectIndividual(population);
        sudoku = new Sudoku(9);
        sudoku.setArray(bestIndividual.gene);
        gui.drawBoard(sudoku);
    } */
}


document.addEventListener('DOMContentLoaded', () => {
    // Initialize GUI and Sudoku here
    run();
    setInterval(() => {
        updateChart(Math.random() * 10, Math.random() * 10);
    }, 1000);
});