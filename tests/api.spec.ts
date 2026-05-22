import { test, expect } from '@playwright/test';

test('Check if Thief build is correct', async ({ request }) => {

const response = await request.get(`http://localhost:3000/api/builds`);
expect(response.ok).toBeTruthy();

  const responseBody = await response.json();
 expect(responseBody.thief).toEqual({
    weapon: 'knife',
    upgradedWeapon: 'katana',
    armor: 'leather_armor',
    upgradedArmor: 'silver_armor',
    strength: 1,
    agility: 6,
    wisdom: 2,
    magic: 1,
  });

});

test('Make a new build with API',async ({ request }) => {

  //Post new build
  const newBuild = await request.post(`http://localhost:3000/api/builds`, {
  data: {
    build: {
      name: "Barbarian",
      strength: 5,
      agility: 2,
      wisdom: 2,
      magic: 0,
    },
  },
});

const response = await request.get(`http://localhost:3000/api/builds`);
expect(response.ok).toBeTruthy();

//Check if build is added and correct
 const responseBody = await response.json();
 expect(responseBody.barbarian).toEqual({
    name: 'barbarian',
    strength: 5,
    agility: 2,
    wisdom: 2,
    magic: 0
  });


});

test('Make an excisting build with API',async ({ request }) => {

 // Try to create another character with the same name
  const response = await request.post(`http://localhost:3000/api/builds`, {
  data: {
    build: {
      name: "Barbarian",
      strength: 5,
      agility: 2,
      wisdom: 2,
      magic: 0,
    },
  },
});

  // Assert the error response
const responseBody = await response.json();
await expect(response.status()).toBe(409);
await expect(responseBody).toEqual({ error: "Build name 'barbarian' already exists" });
});

