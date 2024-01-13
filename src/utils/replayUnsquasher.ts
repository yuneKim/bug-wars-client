export type Direction = 'north' | 'east' | 'south' | 'west';

export type Entity = Wall | Food | Bug | Empty;

export type Wall = {
  type: 'wall';
};

export type Food = {
  type: 'food';
};

export type Bug = {
  type: 'bug';
  direction: Direction;
  swarm: number;
};

export type Empty = {
  type: 'empty';
};

export type ActionSummary = {
  coords: {
    x: number;
    y: number;
  };
  action: number;
};

export type TickSummary = ActionSummary[];

export type BattleGrid = Entity[][];

const directions: Record<number, Direction> = {
  0: 'north',
  1: 'east',
  2: 'south',
  3: 'west',
};

const commands: Record<number, string> = {
  0: 'noop',
  10: 'mov',
  11: 'rotr',
  12: 'rotl',
  13: 'att',
  14: 'eat',
};

export function unsquashBattleground(str: string): BattleGrid {
  const map = str
    .split(' ')
    .filter((s) => s.length > 0)
    .map(unsquashBattlegroundLine);

  return map as BattleGrid;
}

export function generateFrame(nextFrame: BattleGrid, ticks: TickSummary[], i: number): BattleGrid {
  for (const action of ticks[i]) {
    modifyFrameWithAction(nextFrame, action, i);
  }
  return nextFrame;
}

function unsquashBattlegroundLine(s: string) {
  // split string into groups of 2 characters
  return s.match(/.{1,2}/g)?.map(unsquashEntity);
}

function unsquashEntity(s: string): Entity {
  // each group is a decimal representation of a binary number
  const n = parseInt(s, 10);
  // last 2 bits are entity type
  if (n === 0) {
    return { type: 'empty' } as Empty;
  } else if (n === 1) {
    return { type: 'wall' } as Wall;
  } else if (n === 2) {
    return { type: 'food' } as Food;
  } else if (n >= 3) {
    // center 2 bits are direction
    const directionBits = n.toString(2).slice(-4, -2) || '00';
    const directionIndex = parseInt(directionBits, 2);
    // first 2 bits are swarm
    const swarmBits = n.toString(2).slice(0, -4) || '00';
    const swarm = parseInt(swarmBits, 2);
    return {
      type: 'bug',
      direction: directions[directionIndex],
      swarm,
    } as Bug;
  } else {
    throw new Error('Unknown entity');
  }
}

function modifyFrameWithAction(frame: BattleGrid, action: ActionSummary, i: number) {
  const { x, y } = action.coords;
  const cell = frame[y][x];
  if (cell.type !== 'bug') {
    throw new Error(`Problem with data on tick ${i}`);
  }

  switch (commands[action.action]) {
    case 'mov':
      mov(cell, frame, [y, x]);
      break;
    case 'rotr':
      cell.direction = rotateDirection(cell.direction, 1);
      break;
    case 'rotl':
      cell.direction = rotateDirection(cell.direction, -1);
      break;
    case 'att':
      att(cell, frame, [y, x]);
      break;
    case 'eat':
      eat(cell, frame, [y, x]);
      break;
  }
}

function mov(bug: Bug, frame: BattleGrid, [y, x]: [number, number]) {
  const { x: dx, y: dy } = getDirectionVector(bug.direction);
  const nextCell = frame[y + dy][x + dx];
  if (nextCell.type === 'empty') {
    frame[y + dy][x + dx] = bug;
    frame[y][x] = { type: 'empty' };
  }
}

function att(bug: Bug, frame: BattleGrid, [y, x]: [number, number]) {
  const { x: dx, y: dy } = getDirectionVector(bug.direction);
  const nextCell = frame[y + dy][x + dx];
  if (nextCell.type === 'bug') {
    frame[y + dy][x + dx] = { type: 'food' };
  } else if (nextCell.type === 'food') {
    frame[y + dy][x + dx] = { type: 'empty' };
  }
}

function eat(bug: Bug, frame: BattleGrid, [y, x]: [number, number]) {
  const { x: dx, y: dy } = getDirectionVector(bug.direction);
  const nextCell = frame[y + dy][x + dx];
  if (nextCell.type === 'food') {
    const newBug = {
      type: 'bug',
      direction: faceCenter(x + dx, y + dy, frame),
      swarm: bug.swarm,
    } as Bug;
    frame[y + dy][x + dx] = newBug;
  }
}

function faceCenter(x: number, y: number, frame: BattleGrid): Direction {
  const centerX = Math.floor(frame[0].length / 2);
  const centerY = Math.floor(frame.length / 2);
  const slope = x == centerX ? Infinity : (-1 * (centerY - y)) / (centerX - x);

  if (slope > -1 && slope < 1) {
    return x > centerX ? 'west' : 'east';
  }
  return y > centerY ? 'north' : 'south';
}

function getDirectionVector(direction: Direction) {
  switch (direction) {
    case 'north':
      return { x: 0, y: -1 };
    case 'east':
      return { x: 1, y: 0 };
    case 'south':
      return { x: 0, y: 1 };
    case 'west':
      return { x: -1, y: 0 };
  }
}

function rotateDirection(direction: Direction, amount: number) {
  const directions = ['north', 'east', 'south', 'west'];
  const index = directions.indexOf(direction);
  const newIndex = (index + amount + 4) % 4;
  return directions[newIndex] as Direction;
}
