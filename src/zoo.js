/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/
const { species, employees, prices, hours } = require('./data');
const data = require('./data');

function getSpeciesByIds(...ids) {
  return (ids) ? species.filter((element) => ids.includes(element.id)) : [];
}

function getAnimalsOlderThan(animal, age) {
  return species.filter((element) => element.name === animal).every((element) => element.residents.every((specie) => specie.age >= age));
}

function getEmployeeByName(employeeName) {
  return (employeeName)  ? employees.find((employee) => employee.firstName === employeeName || employee.lastName === employeeName) : {};
}

function createEmployee(personalInfo, associatedWith) {
  const employee = {
    id: personalInfo.id,
    firstName: personalInfo.firstName,
    lastName: personalInfo.lastName,
    managers: associatedWith.managers,
    responsibleFor: associatedWith.responsibleFor,
  };
  return employee;
}

function isManager(id) {
  return employees.some((manager) => manager.managers.includes(id));
}

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  const newEmployee = {
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  };
  return employees.push(newEmployee);
}

function countAnimals(animal) {
  if (!animal) {
    return species.reduce((i, spe) => Object.assign(i, { [spe.name]: spe.residents.length }), {});
  }
  const count = species.filter((spe) => spe.name === animal)[0].residents.length;
  return count;
}

function calculateEntry(entrants) {
  if ((!entrants) || Object.keys(entrants).length === 0) return 0;
  const { Adult: adults = 0, Child: childs = 0, Senior: seniors = 0 } = entrants;
  const { Adult, Senior, Child } = prices;

  const result = adults * Adult + childs * Child + seniors * Senior;

  return result;
}
// console.log(calculateEntry({ Adult: 1 }));
const createResult = (speciesName, residents, sexType, sorted) => {
  let result = [];
  if (sexType !== '') {
    result = {
      [speciesName]: residents
        .filter(({ sex }) => sex === sexType)
        .map(({ name }) => name),
    };
  } else {
    result = { [speciesName]: residents.map(({ name }) => name) };
  }
  if (sorted) result[speciesName].sort();
  return result;
};
const locations = ['NE', 'NW', 'SE', 'SW'];
const getByName = (sexType, sorted) => {
  const result = {};
  locations.forEach((loc) => {
    const locationAnimals = [];
    species
      .filter(({ location }) => location === loc)
      .forEach(({ name: speciesName, residents }) => {
        locationAnimals.push(createResult(speciesName, residents, sexType, sorted));
      });
    result[loc] = locationAnimals;
  });
  return result;
};

function getAnimalMap(options) {
  const local = species.reduce((acc, elem) => {
    const animalFilter = species.filter((item) => item.location === elem.location);
    const animalMap = animalFilter.map((item) => item.name);
    acc[elem.location] = animalMap;
    return acc;
  }, {});
  // {
  //   NE: species.filter((spe) => spe.location === 'NE').map((e) => e.name),
  //   NW: species.filter((spe) => spe.location === 'NW').map((e) => e.name),
  //   SE: species.filter((spe) => spe.location === 'SE').map((e) => e.name),
  //   SW: species.filter((spe) => spe.location === 'SW').map((e) => e.name),
  // };
  if (!options) return local;
  const { includeNames = false, sorted = false, sex = '' } = options;
  if (includeNames) return getByName(sex, sorted);
  return local;
}
 console.log(getAnimalMap());

function getSchedule(dayName) {
  const schedule = {};
  Object.keys(hours).forEach((day) => {
    const { open, close } = hours[day];
    if (day === 'Monday') {
      schedule[day] = 'CLOSED';
    } else {
      schedule[day] = `Open from ${open}am until ${close - 12}pm`;
    }
  });
  if (!dayName) return schedule;
  const result = { [dayName]: schedule[dayName] };
  return result;
}

// console.log(getSchedule('Tuesday'));

function getOldestFromFirstSpecies(id) {
  const specie = employees.find((ids) => ids.id === id).responsibleFor[0];
  const resul = species.find((element) => element.id === specie).residents;
  const animalOld = resul.sort((a, b) => b.age - a.age)[0];
  return [animalOld.name, animalOld.sex, animalOld.age];
}
// console.log(getOldestFromFirstSpecies('9e7d4524-363c-416a-8759-8aa7e50c0992'));

function increasePrices(percentage) {
  prices.Adult = (Math.round((prices.Adult * (1 + percentage / 100)) * 100) / 100);
  prices.Senior = Math.round(prices.Senior * (1 + percentage / 100) * 100) / 100;
  prices.Child = Math.round(prices.Child * (1 + percentage / 100) * 100) / 100;
}

function getEmployeeCoverage(idOrName) {
  const obj = {};
  const reducer = employees.reduce((acc, cv) => {
    const name = `${cv.firstName} ${cv.lastName}`;
    acc[name] = [];
    cv.responsibleFor.forEach((animalId) => {
      acc[name].push((species.find((specie) => animalId === specie.id).name));
    });

    if (cv.firstName === idOrName || cv.id === idOrName || cv.lastName === idOrName) {
      obj[name] = acc[name];
    }
    return acc;
  }, {});

  return (!idOrName) ? reducer : obj;
}
// console.log(getEmployeeCoverage('Stephanie'));

module.exports = {
  calculateEntry,
  getSchedule,
  countAnimals,
  getAnimalMap,
  getSpeciesByIds,
  getEmployeeByName,
  getEmployeeCoverage,
  addEmployee,
  isManager,
  getAnimalsOlderThan,
  getOldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
