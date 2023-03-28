import { Test } from '@nestjs/testing';
import AuthController from '../controllers';
import { CommandHandlers } from '../commands/handlers';
import { array } from 'joi';

const area = (radius: number) => Math.PI * radius ** 2;
const circumference = (radius: number) => 2 * Math.PI * radius;
const circle: Record<string, (a?: number) => number> = {};
circle.area = area;
circle.circumference = circumference;

type Products = typeof products;

const byPriceRange = (products: Products, min: number, max: number) => {
  return products.filter((item) => item.price >= min && item.price <= max);
};

const products = [
  { name: 'onion', price: 12 },
  { name: 'tomato', price: 26 },
  { name: 'banana', price: 29 },
  { name: 'orange', price: 38 },
];

const a = products[3];

test('сложение положительных чисел не равно нулю', () => {
  for (let a = 0; a < 10; a++) {
    for (let b = 0; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});

const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'milk',
];

test('the shopping list has milk on it', () => {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});

test('Test product filter by range', () => {
  const FROM = 15;
  const TO = 30;
  const filteredProducts = byPriceRange(products, FROM, TO);

  expect(filteredProducts).toHaveLength(2);
  expect(filteredProducts).toContainEqual({ name: 'tomato', price: 26 });
  expect(filteredProducts).toEqual([
    { name: 'tomato', price: 26 },
    { name: 'basnana', price: 29 },
  ]);
  expect(filteredProducts[0].price).toBeGreaterThanOrEqual(FROM);
  expect(filteredProducts[1].price).toBeLessThanOrEqual(TO);
  expect(filteredProducts).not.toContainEqual({ name: 'orange', price: 38 });
});

it('area', () => {
  expect(circle.area(5)).toBeCloseTo(78.54);
  expect(circle.area()).toBeNaN();
});

it('circumreference', () => {
  expect(circle.circumference(11)).toBeCloseTo(69.1, 1);
  expect(circle.circumference()).toBeNaN();
});

describe('auth controller', () => {
  let authController: AuthController;

  it('My first test', () => {
    expect(Math.max(1, 5, 10)).toBe(10);
  });

  // beforeEach(async () => {
  //   const moduleRef = await Test.createTestingModule({
  //     controllers: [AuthController],
  //     providers: [...CommandHandlers],
  //   }).compile();
  //   authController = moduleRef.get<AuthController>(AuthController)
  // })
  // describe('sign Up', () => {
  //   it('should create user with tokens', async () => {

  //   })
});
