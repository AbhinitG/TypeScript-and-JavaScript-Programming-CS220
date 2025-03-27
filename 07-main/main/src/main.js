// Working Example

//This program allows users to choose 2 different pokemon, and if they are valid pokemon names then it will pull their types from PokeAPI
//Then using a 2d array of type effectiveness we will assess who is more effective against the other, and how much base damage they have and declare a winner
import fetch from "node-fetch";
import readline from "node:readline";
import * as process from "process";

pokeBattle();
async function pokeBattle() {
  const r1 = readline.createInterface({ input: process.stdin, output: process.stdout });
  r1.question("Choose your first Pokémon: ", async pokeOne => {
    //taking in user input for the pokemon names
    r1.question("Choose your second Pokémon: ", async pokeTwo => {
      console.log("You chose ", pokeOne, "and", pokeTwo, "!");
      r1.close();
      var pokeOneTypes = await pokeType(pokeOne); //calls function getting types for chosen pokemon
      var pokeTwoTypes = await pokeType(pokeTwo);
      var pokeOneAttack = await pokeAttack(pokeOne); //calls function getting base attack
      var pokeTwoAttack = await pokeAttack(pokeTwo);
      var score = pokeCalc(pokeOneTypes, pokeTwoTypes); //scores pokemon based on types and attack damage and determines winner
      score[0] = score[0] * pokeOneAttack;
      score[1] = score[1] * pokeTwoAttack;
      console.log([score[0], " vs ", score[1]]);
      if (score[0] > score[1]) {
        console.log(pokeOne, "should win!");
      } else if (score[0] < score[1]) {
        console.log(pokeTwo, "should win!");
      } else {
        console.log("Its too close to tell :(");
      }
    });
  });
}

async function pokeType(pokeName) {
  pokeName = pokeName.toLowerCase();
  const searchUrl = new URL(`https://pokeapi.co/api/v2/pokemon/${pokeName}`); //creates api link given pokemon
  const result = await fetch(searchUrl.toString())
    .then(res => (res.ok ? res.json() : (console.log("not a pokemon sorry :("), process.exit(0)))) //does pokemon exist?
    .then(json => {
      const types = json.types.map(type => type.type.name); //if yes get array of their types and return it
      console.log(`${pokeName}: `, types);
      return types;
    })
    .catch(error => {
      throw error;
    });
  return result;
}
async function pokeAttack(pokeName) {
  pokeName = pokeName.toLowerCase();
  const searchUrl = new URL(`https://pokeapi.co/api/v2/pokemon/${pokeName}`); //creates api link given pokemon
  const result = await fetch(searchUrl.toString())
    .then(res => (res.ok ? res.json() : (console.log("not a pokemon sorry :("), process.exit(0)))) //does pokemon exist?
    .then(json => {
      const attack = json.stats[1].base_stat; //if yes gets their base attack
      console.log(`${pokeName}'s base attack: `, attack);
      return attack;
    })
    .catch(error => {
      throw error;
    });
  return result;
}

function pokeCalc(pokeOneTypes, pokeTwoTypes) {
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ]; //array of possible typings

  var x = [-1, -1];
  var y = [-1, -1];
  x[0] = types.indexOf(pokeOneTypes[0]); //gets index corresponding to types given the above arra
  if (pokeOneTypes.length > 1) {
    x[1] = types.indexOf(pokeOneTypes[1]);
  }
  y[0] = types.indexOf(pokeTwoTypes[0]);
  if (pokeTwoTypes.length > 1) {
    y[1] = types.indexOf(pokeTwoTypes[1]);
  }
  const typeMatchups = getTypeMatchups(); //pulls 2d array of type effectiveness
  var pokeOneScore = 1;
  var pokeTwoScore = 1;
  for (var i = 0; i < x.length; ++i) {
    //for all of pokemon ones types
    for (var j = 0; j < y.length; ++j) {
      // for all of pokemon twos types
      if (x[i] != -1) {
        if (y[j] != -1) {
          pokeOneScore = pokeOneScore * typeMatchups[x[i]][y[j]]; //score gets multipled by how effective the attacker's current move is against the defender's current type
        }
      }
    }
  }
  for (var i = 0; i < x.length; ++i) {
    for (var j = 0; j < y.length; ++j) {
      if (x[i] != -1) {
        if (y[j] != -1) {
          pokeTwoScore = pokeTwoScore * typeMatchups[y[j]][x[i]]; //same thing but reversed for the second pokemon
        }
      }
    }
  }
  //prints the scores out and returns them
  return [pokeOneScore, pokeTwoScore];
}

function getTypeMatchups() {
  return [
    // Defending:    Normal Fire Water Elec Grass Ice Fight Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy
    /* Attacking */
    /* Normal */ [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 1, 1], // Normal
    /* Fire */ [1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 1, 2, 1, 1], // Fire
    /* Water */ [1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1], // Water
    /* Electric */ [1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1], // Electric
    /* Grass */ [1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 1], // Grass
    /* Ice */ [1, 0.5, 0.5, 1, 2, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0.5, 1, 1], // Ice
    /* Fighting */ [2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 1, 1, 2, 0.5, 0.5], // Fighting
    /* Poison */ [1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 0, 2, 1], // Poison
    /* Ground */ [1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 2, 1, 1], // Ground
    /* Flying */ [1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 0.5, 1, 1], // Flying
    /* Psychic */ [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1], // Psychic
    /* Bug */ [1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 0.5, 0.5, 1], // Bug
    /* Rock */ [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 0.5, 1, 1], // Rock
    /* Ghost */ [0, 1, 1, 1, 1, 1, 0, 0.5, 1, 1, 1, 0.5, 1, 2, 1, 1, 1, 1], // Ghost
    /* Dragon */ [1, 0.5, 0.5, 0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0.5, 1, 0], // Dragon
    /* Dark */ [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 0.5, 1, 1, 1, 0.5], // Dark
    /* Steel */ [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1, 2], // Steel
    /* Fairy */ [1, 0.5, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 0.5, 0.5, 1], // Fairy
  ];
}
