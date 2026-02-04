/* population: [{gene: [], fitness: number} ... ] 
    settings: {elitism: number, mutationRate: number ...}
    returns next population array
*/
function GAEvolve(population, settings) {
    let nextPop = [];

    // sort old pop descending by fitness but keep a copy for roulette selection 
    let proxyPop = [];
    for (let i = 0; i < population.length; i++) {
        proxyPop.push({ gene: population[i].gene, fitness: population[i].fitness });
    }

    population.sort((a,b) =>  b.fitness-a.fitness);

    // add elites
    for (let i = 0; i < Math.floor(settings.elitism * population.length); i++) {
        nextPop.push({ gene: population[i].gene, fitness: population[i].fitness });
    }


    // add randoms
    for (let i = 0; i < Math.floor(settings.randomRatio * proxyPop.length); i++) {
        nextPop.push({ gene: proxyPop[Math.floor(Math.random() * proxyPop.length)].gene, fitness: settings.fitnessFunction(proxyPop[Math.floor(Math.random() * proxyPop.length)].gene) });
    }

    //generate rest of population
    let fitnessSum = 0;
    for (let i = 0; i < proxyPop.length; i++) {
        fitnessSum += proxyPop[i].fitness;
    }

    while (nextPop.length < proxyPop.length) {
        // select parents
        let parent1 = rouletteSelection(proxyPop, fitnessSum);
        let parent2 = rouletteSelection(proxyPop, fitnessSum);
        // crossover
        let child1 = crossover(parent1.gene, parent2.gene, settings);
        let child2 = crossover(parent2.gene, parent1.gene, settings);
        // mutate
        mutateIndividual(child1, settings);
        mutateIndividual(child2, settings);
        nextPop.push({ gene: child1.gene, fitness: child1.fitness });
        if (nextPop.length >= proxyPop.length) break;
        nextPop.push({ gene: child2.gene, fitness: child2.fitness });
    }

    return nextPop;
}


/*roulette wheel selection helper*/
function rouletteSelection(population, fitnessSum) {
    let pick = Math.random() * fitnessSum;
    let sum = 0;
    for (let i = 0; i < population.length; i++) {
        sum += population[i].fitness;
        if (sum >= pick) return population[i];
    }
    return population[0];
}

/*crossover of two parents*/
function crossover(parent1, parent2, settings) {
    let childGene = [];
    let crossOverPoint = Math.floor(parent1.length / 2);
    for (let i =0; i < parent1.length; i++) {
        if (i < crossOverPoint) {
            childGene.push(parent1[i]);
        } else {
            childGene.push(parent2[i]);
        }
    }
    return { gene: childGene, fitness: settings.fitnessFunction(childGene) };
}

/*mutation function*/
function mutateIndividual(individual, settings) {
    for (let index = 0; index < individual.gene.length; index++) {
        let pick = Math.random();
        if (pick <= settings.mutationRate) {
            individual.gene[index] = settings.getRandomGeneValue();
            individual.fitness = settings.fitnessFunction(individual.gene);
        }
    }
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