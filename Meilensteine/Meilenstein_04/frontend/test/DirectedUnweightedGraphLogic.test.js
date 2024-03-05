import {
    expect, describe, test, jest, beforeEach, beforeAll,
  } from '@jest/globals';
import { Executer } from '../src/AlgoExecuter';
import DirectedUnweightedGraph from '../src/DirectedUnweightedGraphLogic';
import Node from '../src/DirectedUnweightedGraphLogic'
  
describe('MergeSort', () => {
    describe('helper functions', () => {
        let mockStateChangeCallback = jest.fn();
        let graph = new DirectedUnweightedGraph({}, mockStateChangeCallback);
        let nodeA = new Node("A");
        let nodeB = new Node("B");
        let nodeC = new Node("C");
        let nodeD = new Node("D");

        beforeEach(() => {
        mockStateChangeCallback = jest.fn();
        graph = new new DirectedUnweightedGraph({}, mockStateChangeCallback);
        nodeA = new Node("A");
        nodeB = new Node("B");
        nodeC = new Node("C");
        nodeD = new Node("D");
        });

        test.each([
        [{adjList: [[nodeA, nodeB],[nodeB, nodeC, nodeD],[nodeC,nodeA],[nodeD]], data: "E" , output: null}, 
        {adjList: [[nodeA, nodeB],[nodeB, nodeC, nodeD],[nodeC,nodeA],[nodeD],[new Node("E")]], data: "E" , output: null}],
        ])('Knoten hinzufügen', (inputs, solution) => {
            graph.exec = new Executer({});
            graph.exec.changeAlgo(graph.linesForInsertNode, [], 0, inputs)
            for(let i = 0; i < 1000; i++){
                graph.nextBreak()
            }
            expect(graph.exec.state.vars.adjList).toStrictEqual(solution.adjList);
        });
    });
}); 