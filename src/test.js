let _ = require('lodash');

let json = require('./data.json');

gnomes = json['Brastlewark'];

// let gnomes = JSON.parse(json);

function listProfessions(json) {

    let professionsSet = new Set();

    json['Brastlewark'].forEach(e => { return e.professions.forEach(p => professionsSet.add(p)) });

    return professionsSet;
    
}

let professionsSet = listProfessions(json);

// console.log(Array.from(professionsSet));

// console.log(json['Brastlewark'][0]);

// 'Ey'.toLowerCase();

let myObj = {
    name: 'John',
    age: 34,
    job: 'barrister',
};

let myJson = JSON.stringify(myObj, ['name', 'age'], '\t');

function replacer(key, value) {

    if (key === 'name') {
        return 'Jonathan';
    }
    return value;

}

// console.log(myJson);

let newObj = JSON.parse(myJson, reviver);

function reviver(key, value) {
    if (typeof value === 'number') {
        return value++;
    }
    return value;
}

// console.log(newObj);
// console.log(gnomes.find(gnome => gnome.name == 'Cogwitz Chillwidget'));

// console.log(new Array(10).fill(0));

let str = 'mygnome';
// console.log(str.includes('gn'));

let professionsArr = Array.from(listProfessions(json));
const professionsBorderToggler = professionsArr.map((prof) => [prof, false]);

const professionsObj = {};
professionsArr.forEach( (prof) => professionsObj[prof] = false );

// console.log(professionsObj);

let arr = [1,2,3,4,5]

let mySet = new Set(arr);

// console.log(Array.from(mySet));

// console.log(gnomes);

let filterProfessions = ['Metalworker', 'Woodcarver', 'Stonecarver'];

let filteredGnomes = [];
for (let i = 0; i < 10; i++) {
    // console.log('---- NEW ITERATION ----')
    // console.log(gnomes[i].professions);
    // console.log(filterProfessions);
    // console.log(Array.from(new Set(gnomes[i].professions.concat(filterProfessions))));
    if (gnomes[i].professions.length + filterProfessions.length > new Set(gnomes[i].professions.concat(filterProfessions)).size) {
        // console.log(gnomes[i].professions);
        // console.log(filterProfessions);
        filteredGnomes.push(gnomes[i]);
    }
    // gnomes[i].professions.length + filterProfessions.length > new Set(gnomes[i].professions.concat(filterProfessions)).size ? filteredGnomes.push() : filteredGnomes.push(gnomes[i]);
}

// console.log(filteredGnomes);

arr = [3,2];

// console.log(arr.sort( (a,b) => a - b));

let myArr = [1,2,3];
let arrClone = _.cloneDeep(myArr);
myArr[0] = 2
// console.log(arrClone);

let gnomesClone = _.cloneDeep(gnomes);

// console.log(gnomesClone);