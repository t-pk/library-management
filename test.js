const borrowerObj = { '1': 5, '2': 3, '3': 8, '4': 13, '5': 13, '6': 13, '7': 3, '8': 4 };

const limit = 10;
let count = 0;
let mark = 0;

let resultObj = {};

for (const [key, value] of Object.entries(borrowerObj)) {
  count += value;
  if (Math.floor(count / limit) > mark) {
    //xu li
    let start = mark * limit;
    const end = count;

    let jump = Math.floor(count / limit) - mark;
    console.log("jump", jump);

    if (jump <= 0) continue;

    // if(jump ===1) {
    //   ++mark
    // }

    else {
      while (jump > 0) {
        ++mark;
        while ((start + limit) < end) {
          console.log("jump", jump, "lmit", limit, "value", value, "mark", mark, "count", count);
          const point = (mark * limit) - value;
          // if(point>0) {
          // resultObj[start+limit] = (mark * limit) - value;
          resultObj[start + limit] = (mark * limit) - (count - value);
          // }
          // else {
          //   resultObj[start+limit] = (mark * limit) - value;
          // }
          start++;
        }
        // start++;
        jump--;
      }
    }
  }
}

console.log("mark", mark, count);
console.log(resultObj);

