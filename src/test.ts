import path from 'path';

import NewProcess, {NewProcessEvents} from './index';

const ytdlPath = path.join(__dirname, 'youtube-dl');

const newProcess = new NewProcess(ytdlPath, [
  '-f',
  'best',
  'https://www.youtube.com/watch?v=LOHNL9cvfmY',
]);
newProcess.start();

(async () => {
  newProcess.on(NewProcessEvents.OUTPUT, message => {
    console.log(message);
  });
  const result = await newProcess.getResult();
  console.log(result);
})();
