import { List, node, empty, listToArray, arrayToList } from "../include/lists.js";
import {
  keepTrendMiddles,
} from "./lists.js";


const lst2 = node(1, node(0, node(3, node(7, empty()))));
const newlst2 = keepTrendMiddles(lst2, (x, y, z) => y >= x && y <= z);

console.log(newlst2.head());