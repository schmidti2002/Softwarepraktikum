//Jest Beispielfunktion
const { sum, exe_for } = require('./BubbleSortSortLogic')

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});