import {
    expect, describe, test, jest, beforeEach, beforeAll,
  } from '@jest/globals';
import { Executer } from '../src/AlgoExecuter';
import SingleLinkedList from '../src/SingleLinkedListLogic';
import Node from '../src/SingleLinkedListLogic'
  
  describe('MergeSort', () => {
    describe('helper functions', () => {
      let mockStateChangeCallback = jest.fn();
      let SLL = new SingleLinkedList({}, mockStateChangeCallback);
  
      beforeEach(() => {
        mockStateChangeCallback = jest.fn();
        SLL = new SingleLinkedList({}, mockStateChangeCallback);
      });

      test.each([
        [{front: null, position: 0, data: "A"}, {front: new Node("A")}],
        ])('sort', (input, solution) => {
            SLL.exec = new Executer({});
            SLL.exec.changeAlgo(SLL.linesForAddDataAtPosition, [], 0, input)
            for(let i = 0; i < 1000; i++){
                SLL.nextBreak()
            }
            expect(SLL.exec.state.vars).toStrictEqual(solution);
        });
    });
  }); 