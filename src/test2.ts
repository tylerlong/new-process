import path from 'path';
import {spawn} from 'child_process';

const childProcess = spawn(path.join(__dirname, 'ffmpeg'), ['--help']);
childProcess.stderr.setEncoding('utf-8');
childProcess.stderr.on('data', data => {
  console.log('stderr:');
  console.log(data);
});
