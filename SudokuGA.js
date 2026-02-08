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

    // improve elites and add them to next population to try and get forward progress faster
    if (settings.eliteMutate) {
        let size = nextPop.length;
        for (let i = 0; i < size; i++) {
            let newGene = mutateElite(nextPop[i], settings);
            nextPop.push(newGene);
        }
    }

    // Final improvements
    if (settings.Final) {
        for (let i = 0; i < Math.floor(settings.elitism * population.length); i++) {
            let improvedElite = improveGA(population[i], settings);
            nextPop.push(improvedElite);   
        }
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

    while (nextPop.length < settings.populationSize) {
        // select parents
        let parent1 = rouletteSelection(population, fitnessSum);
        let parent2 = rouletteSelection(population, fitnessSum);
        // crossover
        let child1 = crossover(parent1.gene, parent2.gene, settings);
        let child2 = crossover(parent2.gene, parent1.gene, settings);
        // mutate
        mutateIndividual(child1, settings);
        mutateIndividual(child2, settings);
        if (settings.Final) {
            child1 = improveGA(child1, settings);
            child2 = improveGA(child2, settings);
        }
        nextPop.push(child1);
        if (nextPop.length >= settings.populationSize) break;
        nextPop.push(child2);
    }

    return nextPop;
}


/*roulette wheel selection helper*/
function rouletteSelection(population, fitnessSum) {
    let pick = Math.random() * fitnessSum;
    let sum = 0;
    for (let i = 0; i < population.length; i++) {
        sum += population[i].fitness;
        if (sum > pick) return population[i];
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
    let pick = Math.random();
    if (pick > settings.mutationRate) {
        return;
    }
    sudoku.setArray(individual.gene);
    for (let index = 0; index < individual.gene.length; index++) {
        if (sudoku.numConflicts(Math.floor(index / 9), index % 9) > 0) {
            individual.gene[index] = settings.getRandomGeneValue();
        }
    }
    individual.fitness = settings.fitnessFunction(individual.gene);
}

/*mutation function for elites*/
function mutateElite(individual, settings) {
    let newGene = [];
    for (let i = 0; i < individual.gene.length; i++) {
        newGene.push(individual.gene[i]);
    }

    let sudoku = new Sudoku(9);
    sudoku.setArray(newGene);
    let pick = Math.random();
    if (pick > settings.elitePointMutate) {
        for (let index = 0; index < newGene.length; index++) {
            if (sudoku.numConflicts(Math.floor(index / 9), index % 9) > 0) {
                newGene[index] = settings.getRandomGeneValue();
            }
        }
    } 
    let fitness = settings.fitnessFunction(newGene);
    return { gene: newGene, fitness: fitness };
}

/* Trial function to improve best individual */
function improveGA(individual, settings) {
    let sudoku = new Sudoku(9);
    let size = Math.round(Math.sqrt(individual.gene.length));
    sudoku.setArray(individual.gene);

    // square 
        let sqSize = Math.round(Math.sqrt(size));
        for (let sr = 0; sr < sqSize; sr++)
        {
            for (let sc = 0; sc < sqSize; sc++)
            {
                // initialize values from 1 to 9 with zero occurence for now
                let vals = new Map();
                for (let i = 0; i < size; i++) {
                    vals.set(i+1, []);
                }

                for (let c = 0; c < sqSize; c++)
                {
                    for (let r = 0; r < sqSize; r++)
                    {
                        let num = sudoku.get(sr*sqSize + r, sc*sqSize + c);
                        let updatedPos = [...vals.get(num), {r: sr*sqSize + r, c: sc*sqSize + c}];
                        vals.set(num, updatedPos);
                    }
                }

                // done with square
                let swapPos = null;
                let valIn = null;
                let c1 = false;
                let c2 = false;
                for (let [key, value] of vals) {
                    let m = 0;
                    if (value.length == 0) {
                        // find a number to swap with
                        valIn = key;
                        c1 = true;
                    }
                    else if (value.length > 1) {
                        if ( value.length > m) {
                            m = value.length;
                            swapPos = value.reduce((a,b) => sudoku.numConflicts(a.r, a.c) > sudoku.numConflicts(b.r, b.c) ? a : b);
                            c2 = true;
                        }
                    }
                }
                if (c1 && c2) {sudoku.set(swapPos.r, swapPos.c, valIn);}
            }
        }
        // row
        for (let r = 0; r < size; r++)
        {
            let vals = new Map();
            for (let i = 0; i < size; i++) {
                vals.set(i+1, []);
            }
            for (let c = 0; c < size; c++)
            {
                let num = sudoku.get(r,c);
                let updatedPos = [...vals.get(num), {r: r, c: c}];
                vals.set(num, updatedPos);
            }

            // done with row
            let swapPos = null;
            let valIn = null;
            let c1 = false;
            let c2 = false;
            for (let [key, value] of vals) {
                let m = 0;
                if (value.length == 0) {
                    // find a number to swap with
                    valIn = key;
                    c1 = true;
                }
                else if (value.length > 1) {
                    if ( value.length > m) {
                        m = value.length;
                        swapPos = value.reduce((a,b) => sudoku.numConflicts(a.r, a.c) > sudoku.numConflicts(b.r, b.c) ? a : b);
                        c2 = true;
                    }
                }
            }
            if (c1 && c2) {sudoku.set(swapPos.r, swapPos.c, valIn);}
        }
        // column
        for (let c = 0; c < size; c++)
        {
            let vals = new Map();
            for (let i = 0; i < size; i++) {
                vals.set(i+1, []);
            }
            for (let r = 0; r < size; r++)
            {
                let num = sudoku.get(r,c);
                let updatedPos = [...vals.get(num), {r: r, c: c}];
                vals.set(num, updatedPos);
            }

            // done with column
            let swapPos = null;
            let valIn = null;
            let c1 = false;
            let c2 = false;
            for (let [key, value] of vals) {
                let m = 0;
                if (value.length == 0) {
                    // find a number to swap with
                    valIn = key;
                    c1 = true;
                }
                else if (value.length > 1) {
                    if ( value.length > m) {
                        m = value.length;
                        swapPos = value.reduce((a,b) => sudoku.numConflicts(a.r, a.c) > sudoku.numConflicts(b.r, b.c) ? a : b);
                        c2 = true;
                    }
                }
            }
            if (c1 && c2) {sudoku.set(swapPos.r, swapPos.c, valIn);}
        }
    return { gene: sudoku.board, fitness: settings.fitnessFunction(sudoku.board) };
}


/*  Fitness function for Sudoku Simple
    must return a postive fitness becaue of roulette selection
*/
function sudokuFitness(array) {
    let sudoku = new Sudoku(9);
    let size = Math.round(Math.sqrt(array.length));
    sudoku.setArray(array);
    let fitness = 0;

    //row
    for (let r = 0; r < size; r++)
    {
        let vals = new Set();
        let sum = 0;
        let bonus = 0;
        let noCinflitcts = 0;
        for (let c = 0; c < size; c++)
        {
            vals.add(sudoku.get(r,c));
            sum += sudoku.get(r,c);
            if (sudoku.numConflicts(r,c) == 0) {
                noCinflitcts += 1;
            }
        }
        if (sum == 45) {bonus += 1};
        fitness += vals.size + bonus + noCinflitcts;
    }

    //column
    for (let c = 0; c < size; c++)
    {
        let vals = new Set();
        let sum = 0;
        let bonus = 0;
        for (let r = 0; r < size; r++)
        {
            vals.add(sudoku.get(r,c));
            sum += sudoku.get(r,c);
        }
        if (sum == 45) {bonus += 1};
        fitness += vals.size + bonus;
    }

    //square
    let sqSize = Math.round(Math.sqrt(size));
    for (let sr = 0; sr < sqSize; sr++)
    {
        for (let sc = 0; sc < sqSize; sc++)
        {
            let vals = new Set();
            let sum = 0;
            let bonus = 0;
            for (let c = 0; c < sqSize; c++)
            {
                for (let r = 0; r < sqSize; r++)
                {
                    vals.add(sudoku.get(sr*sqSize + r, sc*sqSize + c));
                    sum += sudoku.get(sr*sqSize + r, sc*sqSize + c);
                }
            }
            if (sum == 45) {bonus += 1};
            fitness += vals.size + bonus;
        }
    }
    return fitness;
}