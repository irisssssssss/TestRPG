import { test, expect } from '@playwright/test';
import {setup, createCharacter } from './helpers/helper';

test('Character name has to be at least 3 characters and at most 20 characters', async ({ page }) => {

  await setup(page, 'play');

//Less than 3 characters
  await createCharacter(page, 'Aa');
  await expect(page.getByText('Name must be at least 3 characters')).toBeVisible();


//More than 20 characters
  await createCharacter(page, 'Testasdfghjkwetyuioplaasw');
  await expect(page.getByText('Name cannot be longer than 20 characters')).toBeVisible();


// Between 3 and 20 characters
 await createCharacter(page, 'Test');

});

test('Changing the character build type changes the stats (strength, agility, wisdom, magic).', async ({ page }) => {

  await setup(page, 'play');

// Verify stats for Thief

  await expect(page.locator('[data-character-stats="Strength"]')).toContainText('1');
  await expect(page.locator('[data-character-stats="Agility"]')).toContainText('6');
  await expect(page.locator('[data-character-stats="Wisdom"]')).toContainText('2');
  await expect(page.locator('[data-character-stats="Magic"]')).toContainText('1');

//Change build type to Knight

 await page.getByTestId('character-build-select').click();
 await page.getByRole('option', { name: 'Knight' }).click();

 // Verify stats for Knight

 await expect(page.locator('[data-character-stats="Strength"]')).toContainText('6');
 await expect(page.locator('[data-character-stats="Agility"]')).toContainText('2');
 await expect(page.locator('[data-character-stats="Wisdom"]')).toContainText('1');
 await expect(page.locator('[data-character-stats="Magic"]')).toContainText('1');

});

test('Clicking the click-task button 5 times levels up the character', async ({ page }) => {
  await setup(page, 'play');
  await createCharacter(page, 'Test');

  // Verify level 1
 await expect(page.getByTestId('character-description')).toContainText('1');

  // Click 5 times
  for (let i = 0; i < 5; i++) {
    await page.getByTestId('clicker-button').click();
  }

  // Verify level 2
   await expect(page.getByTestId('character-description')).toContainText('2');

});


test('Selecting a file in the upload-task levels up the character', async ({ page }) => {
  await setup(page, 'play');
  await createCharacter(page, 'Test');

 // Verify level 1
 await expect(page.getByTestId('character-description')).toContainText('1');


// Upload file
await page.getByTestId('uploader-input').setInputFiles('tests/helpers/test-file.txt');

  // Verify level 2
   await expect(page.getByTestId('character-description')).toContainText('2');

});

test('Typing Lorem Ipsum in the typer-task levels up the character', async ({ page }) => {
   await setup(page, 'play');
  await createCharacter(page, 'Test');

   // Verify level 1
 await expect(page.getByTestId('character-description')).toContainText('1');


  // Type "Lorem Ipsum"
  await page.getByTestId('typer-input').fill('Lorem Ipsum');

    // Verify level 2
   await expect(page.getByTestId('character-description')).toContainText('2');
});

test('Moving the slider all the way to the right levels up the character', async ({ page }) => {
   await setup(page, 'play');
  await createCharacter(page, 'Test');

     // Verify level 1
 await expect(page.getByTestId('character-description')).toContainText('1');

await page.locator('span[role="slider"]').hover();
await page.mouse.down();
await page.mouse.move(1000, 0);
await page.mouse.up();

  // Verify level 2
   await expect(page.getByTestId('character-description')).toContainText('2');

});





