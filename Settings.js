class Settings {
    constructor(size) {
        this.fitnessFunction = sudokuFitness;
        this.individualSize = size * size;
        this.mutationRate = 0.30;
        this.fullMutate = 0.10;
        this.populationSize = 200;
        this.elitism = 0.15;
        this.eliteMutate = false;
        this.elitePointMutate = 0.05;
        this.Policy = "square"; 
        this.Final = false;
        this.randomRatio = 0.05;
        this.individualValues = [];
        for (let i = 1; i <= size; i++) {
            this.individualValues.push(i);
        }
    }

    getRandomGeneValue = function () {
        return this.individualValues[Math.floor(Math.random() * this.individualValues.length)];
    }
}

// Fitness functions for Sudoku

    function sumFitness(fitnessArray) {
        let sum = 0;
        for (i = 0; i < fitnessArray.length; i++) {
            sum += fitnessArray[i];
        }   
        return sum;
    }

    function checkerFitness(fitnessArray) {
        let count = 0;
        let size = Math.sqrt(fitnessArray.length);
        for (let i = 0; i < fitnessArray.length; i++) {
            for (let j = 0; j<size; j++) {
                if ((i+j)%2===0) {
                    if (fitnessArray[i*size + j] == 1) {
                        count += 1;
                    } else {
                        if (fitnessArray[i*size + j] == size) {
                            count += 1;
                        }
                    }
                }
            }
        }
        return count;
    }