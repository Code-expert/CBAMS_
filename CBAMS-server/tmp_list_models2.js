import fs from 'fs';

async function run() {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBdDJD9U8FInpwHJd_UtW2FkwHIQNBiHP0');
  const data = await response.json();
  const modelNames = data.models.map(m => m.name);
  fs.writeFileSync('models_list.txt', JSON.stringify(modelNames, null, 2));
}
run();
