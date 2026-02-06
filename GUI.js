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
        data: [{x:0, y:50}]
    }, {
        name: 'Average Fitness',
        data: [{x:0, y:50}]
    }, {
        name: 'Worst Fitness',
        data: [{x:0, y:50}]
    }]
});

function updateChart (bestX,bestY, avgX, avgY, worstX, worstY) {
    chart.series[0].addPoint({x:bestX, y:bestY}, true, false);
    chart.series[1].addPoint({x:avgX, y:avgY}, true, false);
    chart.series[2].addPoint({x:worstX, y:worstY}, true, false);
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
                const conflicts = sudoku.numConflicts(r, c);
                if (conflicts > 0) {
                    if (conflicts == 1) {ctx.fillStyle = '#ffb6c1';}
                    else if (conflicts == 2) {ctx.fillStyle = '#ff7f7f';}
                    else {ctx.fillStyle = '#ff0000';}
                    ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                }
               if (num !== 0) {
                    ctx.fillStyle = 'black';
                    ctx.fillText(num, c * cellSize + cellSize / 2, r * cellSize + cellSize / 2);
                }
            }
        }
    }
}

// generate initial population
function generatePop(size, populationSize) {
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        let sudoku = new Sudoku(size);
        sudoku.randomize();
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
    let population = generatePop(9, settings.populationSize);
    let generation = 0;
    let bestIndividual = selectIndividual(population);
    let sudoku = new Sudoku(9);
    sudoku.setArray(bestIndividual.gene);
    let gui = new GUI(sudoku);
    gui.drawBoard(sudoku);

    //here we run the genetic algorithm loop until we hit the best solution
    let interval = setInterval(() => {
        population = GAEvolve(population, settings);
        generation += 1;
        bestIndividual = selectIndividual(population);
        sudoku = new Sudoku(9);
        sudoku.setArray(bestIndividual.gene);
        gui.drawBoard(sudoku);
        let avgFitness = population.reduce((sum , index) => sum + index.fitness, 0) / population.length;
        let minFitness = population.reduce((min, index) => Math.min(min, index.fitness), Infinity);
        updateChart(generation, bestIndividual.fitness, generation, avgFitness, generation, minFitness);

        if (bestIndividual.fitness >= 243) {
            clearInterval(interval);
            console.log("Solution found!");
        }
    }, 10);
}


document.addEventListener('DOMContentLoaded', () => {
    run();
});