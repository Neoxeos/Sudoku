/* population: [{gene: [], fitness: number} ... ] 
    settings: {elitism: number, mutationRate: number ...}
    returns next population array
*/
function GAEvolve(population, settings) {
    let nextPop = [];

    // sort old pop descending by fitness 
    population.sort((a,b) =>  b.fitness-a.fitness);

    // add elites
    for (let i = 0; i < Math.floor(settings.elitism * population.length); i++) {
        nextPop.push({ gene: population[i].gene, fitness: population[i].fitness });
    }

    // add randoms
    for (let i = 0; i < Math.floor(settings.randomRatio * population.length); i++) {
        nextPop.push({ gene: settings.getRandomGeneValue(), fitness: settings.fitnessFunction(gene) });
    }

    //generate rest of population
    let fitnessSum = 0;
    for (let i = 0; i < population.length; i++) {
        fitnessSum += population[i].fitness;
    }

    while (nextPop.length < population.length) {
        // select parents
        let parent1 = rouletteSelection(population, fitnessSum);
        let parent2 = rouletteSelection(population, fitnessSum);
        // crossover
        let child1 = crossover(parent1.gene, parent2.gene, settings);
        let child2 = crossover(parent2.gene, parent1.gene, settings);
        // mutate
        mutate(child1, settings);
        mutate(child2, settings);
        nextPop.push({ gene: child1, fitness: settings.fitnessFunction(child1) });
        if (nextPop.length >= population.length) break;
        nextPop.push({ gene: child2, fitness: settings.fitnessFunction(child2) });
    }
}

function rouletteSelection(population, fitnessSum) {
    let r = Math.random() * fitnessSum;
    let sum = 0;
    for (let i = 0; i < population.length; i++) {
        sum += population[i].fitness;
        if (sum >= r) return population[i];
    }
}

function sudokuFitness(array) {
    let sudoku = new Sudoku(9);
    let size = Math.round(Math.sqrt(array.length));
    sudoku.setArray(array);
    // add unique values in each row
}