import { Writable } from "stream";
import { spawn } from "child_process";

class StdoutPiper extends Writable {
  func: (c: string) => void;

  constructor(func: (c: string) => void) {
    super();
    this.func = func;
  }

  _write(chunk: any, enc: any, next: any) {
    this.func(chunk.toString());
    next();
  }
}

export const gbth = (exec: string, arg: string, func: (c: string) => void) => {
  const stream = new StdoutPiper(func);

  const child = spawn(process.execPath, [exec, arg]);

  child.stdout.pipe(stream);
  child.stderr.pipe(process.stderr);

  return child;
};
