import { gameService } from '@/services/gameService';
import { scriptService } from '@/services/scriptService';
import type { ScriptName } from '@/types';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGameLobby, type Map } from './useGameLobby';

vi.mock('@/services/gameService');
vi.mock('@/services/scriptService');

describe('useGameLobby', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should load maps', async () => {
    const expectedMaps: Map[] = [
      {
        id: 1,
        name: 'Map 1',
        swarms: 2,
        previewImgUrl: 'https://example.com/preview.png',
      },
      {
        id: 2,
        name: 'Map 2',
        swarms: 4,
        previewImgUrl: 'https://example.com/preview.png',
      },
    ];

    vi.mocked(gameService.getMaps).mockResolvedValue({
      type: 'success',
      status: 200,
      data: expectedMaps,
    });
    vi.mocked(scriptService.getAllNamesOfValidScripts).mockResolvedValue({
      type: 'success',
      status: 200,
      data: 'yep',
    });

    const { maps } = await useGameLobby();

    expect(maps.value).toStrictEqual(expectedMaps);
  });

  it('should load scripts', async () => {
    const expectedMaps: Map[] = [
      {
        id: 1,
        name: 'Map 1',
        swarms: 2,
        previewImgUrl: 'https://example.com/preview.png',
      },
      {
        id: 2,
        name: 'Map 2',
        swarms: 4,
        previewImgUrl: 'https://example.com/preview.png',
      },
    ];

    const expectedScripts: ScriptName[] = [
      {
        name: 'Script 1',
        id: 1,
        author: 'Author 1',
      },
      {
        name: 'Script 2',
        id: 2,
        author: 'Author 2',
      },
    ];

    vi.mocked(gameService.getMaps).mockResolvedValue({
      type: 'success',
      status: 200,
      data: expectedMaps,
    });
    vi.mocked(scriptService.getAllNamesOfValidScripts).mockResolvedValue({
      type: 'success',
      status: 200,
      data: expectedScripts,
    });

    const { scripts } = await useGameLobby();

    expect(scripts.value).toStrictEqual(expectedScripts);
  });

  it('should set the map via handler function', async () => {
    const expectedMaps: Map[] = [
      {
        id: 1,
        name: 'Map 1',
        swarms: 2,
        previewImgUrl: 'https://example.com/preview.png',
      },
      {
        id: 2,
        name: 'Map 2',
        swarms: 4,
        previewImgUrl: 'https://example.com/preview.png',
      },
    ];

    vi.mocked(gameService.getMaps).mockResolvedValue({
      type: 'success',
      status: 200,
      data: expectedMaps,
    });
    vi.mocked(scriptService.getAllNamesOfValidScripts).mockResolvedValue({
      type: 'error',
      status: 400,
      error: 'yep',
    });

    const { currentMap, handleSelector, fourSwarmMapSelected } = await useGameLobby();
    currentMap.value = 3;
    expect(currentMap.value).toBe(3);

    fourSwarmMapSelected.value = true;
    handleSelector();

    expect(currentMap.value).toBe(0);
  });

  it('computes the current map name', async () => {
    const expectedMaps: Map[] = [
      {
        id: 1,
        name: 'Map 1',
        swarms: 2,
        previewImgUrl: 'https://example.com/preview.png',
      },
      {
        id: 2,
        name: 'Map 2',
        swarms: 4,
        previewImgUrl: 'https://example.com/preview.png',
      },
    ];

    vi.mocked(gameService.getMaps).mockResolvedValue({
      type: 'success',
      status: 200,
      data: expectedMaps,
    });
    vi.mocked(scriptService.getAllNamesOfValidScripts).mockResolvedValue({
      type: 'error',
      status: 400,
      error: 'yep',
    });

    const { currentMap, currentMapName, fourSwarmMapSelected } = await useGameLobby();
    expect(currentMap.value).toBe(0);
    expect(currentMapName.value).toBe('Map 1');

    fourSwarmMapSelected.value = true;
    expect(currentMapName.value).toBe('Map 2');
  });

  it('computes the carousel value', async () => {
    const expectedMaps: Map[] = [
      {
        id: 1,
        name: 'Map 1',
        swarms: 2,
        previewImgUrl: 'https://example.com/preview.png',
      },
      {
        id: 2,
        name: 'Map 2',
        swarms: 4,
        previewImgUrl: 'https://example.com/preview.png',
      },
    ];

    vi.mocked(gameService.getMaps).mockResolvedValue({
      type: 'success',
      status: 200,
      data: expectedMaps,
    });
    vi.mocked(scriptService.getAllNamesOfValidScripts).mockResolvedValue({
      type: 'error',
      status: 400,
      error: 'yep',
    });

    const { currentMap, carouselValue, fourSwarmMapSelected } = await useGameLobby();
    expect(currentMap.value).toBe(0);
    expect(carouselValue.value).toStrictEqual([expectedMaps[0]]);

    fourSwarmMapSelected.value = true;
    expect(carouselValue.value).toStrictEqual([expectedMaps[1]]);
  });
});
