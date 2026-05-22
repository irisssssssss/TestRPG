import { test, expect } from '@playwright/test';
import {setup, createCharacter } from './helpers/helper';


test('The bag contains four items: two weapons and two armor pieces for the selected build.', async ({ page }) => {
   await setup(page, 'inventory');                               
  //  Verify the bag has 4 items (2 weapons, 2 armor)
   await expect(page.locator('[data-testid="inventory-item"]')).toHaveCount(4);
   await expect(page.locator('[data-testid="inventory-item"][data-item-type="weapon"]')).toHaveCount(2);
   await expect(page.locator('[data-testid="inventory-item"][data-item-type="armor"]')).toHaveCount(2);

});

test('Selecting a different build resets the equipment slots and repopulates the bag with items for that build.', async ({ page }) => {
   await setup(page, 'inventory'); 

  // Equip thief items
   await page.getByText('Knife').dragTo(page.getByTestId('inventory-slot-weapon-1'));
   await page.getByText('Silver Armor').dragTo(page.getByTestId('inventory-slot-armor-2'));

  // Switch to Knight build
  await page.getByTestId('inventory-build-select').selectOption('knight');
  
  // Verify equipment slots are empty
  (page.getByTestId('inventory-slot-weapon-1'));
  const weaponSlots = await page.locator('[data-testid^="weapon-slot-"]').all();
  for (const slot of weaponSlots) {
    await expect(slot).toBeEmpty();
  }
  const armorSlots = await page.locator('[data-testid^="armor-slot-"]').all();
  for (const slot of armorSlots) {
    await expect(slot).toBeEmpty();
  }

  // Verify the bag now has Knight items 
await expect(page.getByTestId('inventory-bag')).toContainText('Knife');
await expect(page.getByTestId('inventory-bag')).toContainText('Longsword');
await expect(page.getByTestId('inventory-bag')).toContainText('Partial Plate');
await expect(page.getByTestId('inventory-bag')).toContainText('Full Plate');

});