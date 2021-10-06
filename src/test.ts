import path from 'path';

import {SpawnPromise} from './index';

const ytdlPath = path.join(__dirname, 'youtube-dl');

const spawnPromise = new SpawnPromise(ytdlPath, [
  '-f',
  'best',
  'https://www.youtube.com/watch?v=LOHNL9cvfmY',
]);
spawnPromise.start();

(async () => {
  spawnPromise.on('output', message => {
    console.log(message);
  });
  const result = await spawnPromise.getResult();
  console.log(result);
})();
