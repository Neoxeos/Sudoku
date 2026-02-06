/* population: [{gene: [], fitness: number} ... ] 
    settings: {elitism: number, mutationRate: number ...}
    returns next population array
*/
function GAEvolve(population, settings) {
    let nextPop = [];

    // sort old pop descending by fitness but keep a copy for roulette selection 
    population.sort((a,b) =>  b.fitness-a.fitness);

    // add elites
    for (let i = 0; i < Math.floor(settings.elitism * population.length); i++) {
        nextPop.push(population[i]);
    }

    // add randoms
    for (let i = 0; i < Math.floor(settings.randomRatio * population.length); i++) {
        let individual = population[Math.floor(Math.random() * population.length)];
        nextPop.push(individual);
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
        mutateIndividual(child1, settings);
        mutateIndividual(child2, settings);
        nextPop.push(child1);
        if (nextPop.length >= population.length) break;
        nextPop.push(child2);
    }

    return nextPop;
}


/*roulette wheel selection helper*/
function rouletteSelection(population, fitnessSum) {
    let pick = Math.random() * fitnessSum;
    let sum = 0;
    for (let i = population.length -1; i >= 0; i--) {
        sum += population[i].fitness;
        if (sum >= pick) return population[i];
    }
    return population[0];
}

/*crossover of two parents*/
function crossover(parent1, parent2, settings) {
    let childGene = [];
    let crossOverPoint1 = Math.floor( (Math.random()*parent1.length) / 3);
    let crossOverPoint2 = crossOverPoint1 + Math.floor((Math.random()*parent1.length) / 3);
    for (let i =0; i < parent1.length; i++) {
        if (i < crossOverPoint1) {
            childGene.push(parent1[i]);
        } else if (i >= crossOverPoint1 && i < crossOverPoint2) {
            childGene.push(parent2[i]);
        } else {
            let pick = Math.random();
            if (pick < 0.5) {
                childGene.push(parent2[i]);
            } else {
                childGene.push(parent1[i]);
            }
        }
    }
    return { gene: childGene, fitness: settings.fitnessFunction(childGene) };
}

/*mutation function*/
function mutateIndividual(individual, settings) {
    let sudoku = new Sudoku(9);
    sudoku.setArray(individual.gene);
    for (let index = 0; index < individual.gene.length; index++) {
        let pick = Math.random();
        if (pick <= settings.mutationRate && (sudoku.numConflicts(Math.floor(index / 9), index % 9) > 0)) {
            individual.gene[index] = settings.getRandomGeneValue();
        }
    }
    individual.fitness = settings.fitnessFunction(individual.gene);
}

/*  Fitness function for Sudoku Simple
    must return a postive fitness becaue of roulette selection
*/
function sudokuFitness(array) {
    let sudoku = new Sudoku(9);
    let size = Math.round(Math.sqrt(array.length));
    sudoku.setArray(array);
    let fitness = 0;
    for (let r = 0; r < size; r++)
    {
        let vals = new Set();
        for (let c = 0; c < size; c++)
        {
            vals.add(sudoku.get(r,c));
        }
        fitness += vals.size;
    }
    // add unique values in each row
    let sqSize = Math.round(Math.sqrt(size));
    for (let sr = 0; sr < sqSize; sr++)
    {
        for (let sc = 0; sc < sqSize; sc++)
        {
            let vals = new Set();
            for (let c = 0; c < sqSize; c++)
            {
                for (let r = 0; r < sqSize; r++)
                {
                    vals.add(sudoku.get(sr*sqSize + r, sc*sqSize + c));
                }
            }
            fitness += vals.size;
        }
    }
    return fitness;
}