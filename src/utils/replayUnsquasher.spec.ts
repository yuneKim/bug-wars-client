import { cloneDeep } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { generateFrame, unsquashBattleground, type TickSummary } from './replayUnsquasher';

const battleGridStr =
  '010101010101010101010101010101010101010101 010101010101010100020000000101010101010101 010101010100000000000000000000000101010101 010101010000000000000000000000000001010101 010101000000000000000000000000000000010101 010100000000000000000000000000000000000101 010100000000000000001100000000000000000101 010100000000000000000000000000000000000101 010000000007000000000000000000310000000001 010000000000000000000000000000000000000001 010000000007000000000000000000310000000001 010000000000000000000000000000000000000001 010000000007000000000000000000310000000001 010100000000000000000000000000000000000101 010100000000000000001900000000000000000101 010100000000000000000000000000000000000101 010101000000000000000000000000000000010101 010101010000000000000000000000000001010101 010101010100000000000000000000000101010101 010101010101010100000000000101010101010101 010101010101010101010101010101010101010101 ';

const tickSummaryArr: TickSummary[] = [
  [
    {
      coords: {
        x: 5.0,
        y: 8.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 15.0,
        y: 12.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 5.0,
        y: 12.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 15.0,
        y: 8.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 5.0,
        y: 10.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 15.0,
        y: 10.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 10.0,
        y: 6.0,
      },
      action: 10,
    },
    {
      coords: {
        x: 10.0,
        y: 14.0,
      },
      action: 10,
    },
  ],
];

describe('unsquashBattleground', () => {
  it('should unsquash a replay', () => {
    const battleGrid = unsquashBattleground(battleGridStr);

    expect(battleGrid[6][10]).toEqual({
      type: 'bug',
      direction: 'south',
      swarm: 0,
    });

    expect(battleGrid[0][10]).toEqual({
      type: 'wall',
    });

    expect(battleGrid[1][9]).toEqual({
      type: 'food',
    });
  });
});

describe('generateFrame', () => {
  it('should generate a frame', () => {
    const battleGrid = unsquashBattleground(battleGridStr);

    const frame = generateFrame(battleGrid, tickSummaryArr, 0);

    expect(frame[7][10]).toEqual({
      type: 'bug',
      direction: 'south',
      swarm: 0,
    });
  });

  it('should handle rotl', () => {
    const battleGrid = unsquashBattleground(battleGridStr);

    const tickSummary = cloneDeep(tickSummaryArr);
    tickSummary[0][0].action = 12;

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[8][5]).toEqual({
      type: 'bug',
      direction: 'north',
      swarm: 0,
    });
  });

  it('should handle rotr', () => {
    const battleGrid = unsquashBattleground(battleGridStr);

    const tickSummary = cloneDeep(tickSummaryArr);
    tickSummary[0][0].action = 11;

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[8][5]).toEqual({
      type: 'bug',
      direction: 'south',
      swarm: 0,
    });
  });

  it('should handle eat', () => {
    const battleStr = '00 11 02';
    const battleGrid = unsquashBattleground(battleStr);

    const tickSummary = [
      [
        {
          coords: {
            x: 0,
            y: 1,
          },
          action: 14,
        },
      ],
    ];

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[2][0]).toEqual({
      type: 'bug',
      direction: 'north',
      swarm: 0,
    });
  });

  it('should handle att on bug', () => {
    const battleStr = '0731';
    const battleGrid = unsquashBattleground(battleStr);

    const tickSummary = [
      [
        {
          coords: {
            x: 0,
            y: 0,
          },
          action: 13,
        },
      ],
    ];

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[0][1]).toEqual({
      type: 'food',
    });
  });

  it('should handle att on food', () => {
    const battleStr = '0702';
    const battleGrid = unsquashBattleground(battleStr);

    const tickSummary = [
      [
        {
          coords: {
            x: 0,
            y: 0,
          },
          action: 13,
        },
      ],
    ];

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[0][1]).toEqual({
      type: 'empty',
    });
  });

  it('should face center from west', () => {
    const battleStr = '11000000 02000000 00000000';
    const battleGrid = unsquashBattleground(battleStr);

    const tickSummary = [
      [
        {
          coords: {
            x: 0,
            y: 0,
          },
          action: 14,
        },
      ],
    ];

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[1][0]).toEqual({
      type: 'bug',
      direction: 'east',
      swarm: 0,
    });
  });

  it('should face center from east', () => {
    const battleStr = '00000011 00000002 00000000';
    const battleGrid = unsquashBattleground(battleStr);

    const tickSummary = [
      [
        {
          coords: {
            x: 3,
            y: 0,
          },
          action: 14,
        },
      ],
    ];

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[1][3]).toEqual({
      type: 'bug',
      direction: 'west',
      swarm: 0,
    });
  });

  it('should face center from south', () => {
    const battleStr = '00000000 00000000 00000000 00001100 00000200';
    const battleGrid = unsquashBattleground(battleStr);

    const tickSummary = [
      [
        {
          coords: {
            x: 2,
            y: 3,
          },
          action: 14,
        },
      ],
    ];

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[4][2]).toEqual({
      type: 'bug',
      direction: 'north',
      swarm: 0,
    });
  });

  it('should face south from north', () => {
    const battleStr = '00110000 00020000 00000000 00000000 00000000';
    const battleGrid = unsquashBattleground(battleStr);

    const tickSummary = [
      [
        {
          coords: {
            x: 1,
            y: 0,
          },
          action: 14,
        },
      ],
    ];

    const frame = generateFrame(battleGrid, tickSummary, 0);

    expect(frame[1][1]).toEqual({
      type: 'bug',
      direction: 'south',
      swarm: 0,
    });
  });

  it('should throw error on misaddressed bug', () => {
    const battleStr = '00110000 00020000 00000000 00000000 00000000';
    const battleGrid = unsquashBattleground(battleStr);

    const tickSummary = [
      [
        {
          coords: {
            x: 0,
            y: 0,
          },
          action: 14,
        },
      ],
    ];

    expect(() => generateFrame(battleGrid, tickSummary, 0)).toThrowError();
  });
});
