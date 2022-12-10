const input = `<input>`.split("\n")

type TickFn = (time: number) => void

class Clock {
  private time: number = 0
  constructor(private readonly tickFn: TickFn) { }

  tick() {
    ++this.time;
    this.tickFn(this.time)
  }
}

class Cpu {
  #x: number = 1

  get x() {
    return this.#x
  }

  addX(delta: number) {
    this.#x += delta
  }
}

class Crt {
  #screen: boolean[] = [];

  set(pos: number) {
    this.#screen[pos] = true
  }

  render() {
    let result: string[] = []
    for (let pos = 0; pos < 40 * 6; ++pos) {
      if (pos % 40 === 0) {
        result.push('\n')
      }
      result.push(this.#screen[pos] ? '#' : '.')
    }
    console.log(result.join(""))
  }
}

interface Command {
  run(p1?: string): void;
}

class AddX implements Command {
  constructor(private readonly clock: Clock, private readonly cpu: Cpu) { }

  run(delta: string) {
    this.clock.tick()
    this.clock.tick()
    this.cpu.addX(+delta)
  }
}

class Noop implements Command {
  constructor(private readonly clock: Clock, private readonly cpu: Cpu) { }

  run() {
    this.clock.tick()
  }
}

function part1() {
  let result = 0

  const cpu = new Cpu()

  const clock = new Clock((time) => {
    if ((time - 20) % 40 === 0 && time <= 220) {
      result += time * cpu.x
    }
  });

  const commands: Record<string, Command> = {
    "addx": new AddX(clock, cpu),
    "noop": new Noop(clock, cpu)
  }

  for (const [command, ...params] of input.map(line => line.split(" "))) {
    commands[command].run(...params)
  }

  console.log(result)
}

function part2() {
  let pos = 0;
  const cpu = new Cpu()
  const crt = new Crt()

  const clock = new Clock(() => {
    const linePos = pos % 40
    if (cpu.x - 1 <= linePos && linePos <= cpu.x + 1) {
      crt.set(pos)
    }
    ++pos
  });

  const commands: Record<string, Command> = {
    "addx": new AddX(clock, cpu),
    "noop": new Noop(clock, cpu)
  }

  for (const [command, ...params] of input.map(line => line.split(" "))) {
    commands[command].run(...params)
  }

  crt.render()
}

part1()
part2()