class Settings {
    constructor(size) {
        this.fitnessFuntion = sudokuFitness;
        this.individualSize = size * size;
        this.mutationRate = 0.25;
        this.populationSize = 200;
        this.elitism = 0.05;
        this.randomRatio = 0.05;
        this.individualValues = [];
        for (let i = 1; i <= size; i++) {
            this.individualValues.push(i);
        }
    }
}