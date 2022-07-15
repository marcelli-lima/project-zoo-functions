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
  return ids === 'undefined' ? [] : species.filter((element) => ids.includes(element.id));
}

function getAnimalsOlderThan(animal, age) {
  return species.filter((element) => element.name === animal).every((element) => element.residents.every((specie) => specie.age >= age));
}

function getEmployeeByName(employeeName) {
  return employeeName === undefined ? {} : employees.find((employee) => employee.firstName === employeeName || employee.lastName === employeeName);
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
  if (entrants === undefined || Object.keys(entrants).length === 0) return 0;
  const { Adult: adults = 0, Child: childs = 0, Senior: seniors = 0 } = entrants;
  const { Adult, Senior, Child } = prices;

  const result = adults * Adult + childs * Child + seniors * Senior;

  return result;
}
// console.log(calculateEntry({ Adult: 1 }));

function getAnimalMap(options) {
  // const { includeNames = false, sorted = false, sex = '' } = options;
  // if (options === undefined) {
  //   return {
  //     NE: species.filter((spe) => spe.location === 'NE').map((e) => e.name),
  //     NW: species.filter((spe) => spe.location === 'NW').map((e) => e.name),
  //     SE: species.filter((spe) => spe.location === 'SE').map((e) => e.name),
  //     SW: species.filter((spe) => spe.location === 'SW').map((e) => e.name),
  //   };
  // } if (includeNames) {
  //   return {
  //     NE: species.filter((spe) => spe.location === 'NE').map((e) => e.residents).map((animal) => animal.name),
  //     NW: species.filter((spe) => spe.location === 'NW').map((e) => e.residents),
  //     SE: species.filter((spe) => spe.location === 'SE').map((e) => e.residents),
  //     SW: species.filter((spe) => spe.location === 'SW').map((e) => e.residents),
  //   };
  // }
}
// const test = species.filter((spe) => spe.location === 'NE').map((e) => e.residents);
// console.log(test);
// console.log(getAnimalMap());

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
  if (dayName === undefined) return schedule;
  const result = { [dayName]: schedule[dayName] };
  return result;
}

// console.log(getSchedule('Tuesday'));

function getOldestFromFirstSpecies(id) {
  const specie = employees.find((ids) => ids.id === id).responsibleFor[0];
  const resul = species.find((element) => element.id === specie);
  const animalOld = resul.residents.sort((a, b) => b.age - a.age)[0];
  return [animalOld.name, animalOld.sex, animalOld.age];
}
console.log(getOldestFromFirstSpecies('9e7d4524-363c-416a-8759-8aa7e50c0992'));

function increasePrices(percentage) {
  // seu código aqui
}

function getEmployeeCoverage(idOrName) {
  // seu código aqui
}

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
