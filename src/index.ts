import {spawn, ChildProcess} from 'child_process';
import EventEmitter from 'events';

export type Result = {
  code: number | null;
  outputs: string[];
  errors: string[];
};

export enum NewProcessEvents {
  OUTPUT = 'OUTPUT',
  ERROR = 'ERROR',
}

class NewProcess extends EventEmitter {
  command: string;
  args: string[];
  childProcess?: ChildProcess;
  code: number | null = null;
  outputs: string[] = [];
  errors: string[] = [];

  constructor(command: string, args: string[]) {
    super();
    this.command = command;
    this.args = args;
  }

  start() {
    this.childProcess = spawn(this.command, this.args);
    this.childProcess.stdout?.setEncoding('utf-8');
    this.childProcess.stdout?.on('data', data => {
      this.outputs.push(data.trim());
      this.emit(NewProcessEvents.OUTPUT, data.trim());
    });
    this.childProcess.stderr?.setEncoding('utf-8');
    this.childProcess.stderr?.on('data', data => {
      this.errors.push(data.trim());
      this.emit(NewProcessEvents.ERROR, data.trim());
    });
    this.childProcess.on('exit', code => {
      this.code = code;
      this.childProcess = undefined;
    });
  }

  kill() {
    this.childProcess?.kill();
    this.childProcess = undefined;
  }

  getResult(): Promise<Result> {
    return new Promise(resolve => {
      this.childProcess?.on('exit', code => {
        return resolve({outputs: this.outputs, errors: this.errors, code});
      });
      if (this.childProcess === undefined) {
        return resolve({
          outputs: this.outputs,
          errors: this.errors,
          code: this.code,
        });
      }
    });
  }
}

export default NewProcess;
