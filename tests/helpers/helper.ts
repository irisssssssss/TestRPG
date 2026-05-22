import { Page, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

export async function setup(page: Page, path: string): Promise<void> {
  await page.goto(`${BASE_URL}/${path}`);
  await expect(page).toHaveTitle(/TestRPG/);
}

export async function createCharacter(page: Page, characterName: string): Promise<void> {
  await page.getByTestId('character-name-input').fill(characterName);
  await page.getByTestId('character-start-button').click();
  await expect(page.getByTestId('character-name')).toHaveText(characterName);
}


