import { faker } from '@faker-js/faker';
import { BookRow } from '../types';

export function generateFakeBooks(count: number): BookRow[] {
  const rows: BookRow[] = [];
  for (let i = 0; i < count; i += 1) {
    rows.push({
      Title: faker.lorem.words({ min: 2, max: 6 }),
      Author: `${faker.person.firstName()} ${faker.person.lastName()}`,
      Genre: faker.helpers.arrayElement(['Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance']),
      PublishedYear: faker.number.int({ min: 1900, max: 2025 }),
      ISBN: faker.string.alphanumeric({ length: 13 }).toUpperCase(),
      __rowId: `fake_${i}_${faker.string.alphanumeric({ length: 6 })}`,
    });
  }
  return rows;
}


