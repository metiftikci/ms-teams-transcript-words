const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Error: File path required!');
  return;
}

// Get File Content
const filePath = process.argv[2];
const show = process.argv[3] || 20;
const content = fs.readFileSync(filePath).toString();
const lines = content.split(/\r?\n/g);
const texts = [];

// Find Texts
const regExp = new RegExp("<v[^>]*>(.*)<\\/v>", "g");

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = regExp.exec(line);

  if (!match) continue;

  texts.push(match[1]);
}


// Read Database
const database = [
  { word: 'i', known: false, score: 0 },
  { word: 'you', known: true, score: 1 },
];

// Find Words
const allWords = texts
  .join()
  .toLowerCase()
  .replace(/[\s\W]+/g, " ")
  .split(" ");

// Find Words
let wordsInfo = [];

for (let i = 0; i < allWords.length; i++) {
  const word = allWords[i];
  if (!word) continue;
  const wordInfo = wordsInfo.find(x => x.word === word);

  if (wordInfo) {
    wordInfo.count++;
  } else {
    wordsInfo.push({ word, score: 0, count: 1 });
  }
}

// Order By Count
wordsInfo = wordsInfo.sort((a,b) => b.count - a.count);

// Show Words
console.table(wordsInfo.filter((_, i) => i < show));

// TODO: Write To Database
for (let i = 0; i < wordsInfo.length; i++) {
  const wordInfo = wordsInfo[i];

  const dbRow = database.find(x => x.word === wordInfo.word);

  if (dbRow) {
    dbRow.count += wordInfo.count;
  } else {
    database.push(wordInfo);
  }
}
