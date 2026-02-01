const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

// Function to handle chart load and add new data points dynamically
const onChartLoad = function () {
    const chart = this,
        series = chart.series[0];

    setInterval(function () {
        const x = (new Date()).getTime(), // current time
            y = Math.random();

        series.addPoint([x, y], true, true);
    }, 1000);
};

// Create the initial data
const data = (function () {
    const data = [];
    const time = new Date().getTime();

    for (let i = -19; i <= 0; i += 1) {
        data.push({
            x: time + i * 1000,
            y: Math.random()
        });
    }
    return data;
}());

// Create the chart
Highcharts.chart('graph', {
    chart: {
        type: 'spline',
        events: {
            load: onChartLoad()
        }
    },

    time: {
        useUTC: false
    },

    title: {
        text: 'Live random data'
    },

    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        maxPadding: 0.1
    },

    yAxis: {
        title: {
            text: 'Value'
        },
        plotLines: [
            {
                value: 0,
                width: 1,
                color: '#808080'
            }
        ]
    },

    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },

    legend: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    series: [
        {
            name: 'Random data',
            lineWidth: 2,
            color: Highcharts.getOptions().colors[2],
            data
        }
    ]
});

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
    // initialize with random values
    sudoku.randomize();
    const gui = new GUI(sudoku);
    gui.drawBoard(sudoku);
}

run();