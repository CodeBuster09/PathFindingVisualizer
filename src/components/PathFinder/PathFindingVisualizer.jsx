import React, { Component } from 'react';
import './PathFindingVisualizer.css';
import Node from '../Node/Node';
import { getNodesInShortestPathOrder, dijsktra } from '../../algorithms/dijsktra';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathFindingVisualizer extends Component {
    constructor(){
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            distance: 0
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid})
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        // newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    handleDoubleClick(row, col) {
        const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-visited';
          }, 10 * i);
        }
      }

      animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }, 50 * i);
        }
      }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        const visitedNodesInOrder = dijsktra(grid,startNode,finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        console.log(visitedNodesInOrder);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        this.setState({distance: nodesInShortestPathOrder.length});
    }

    render() {
        const {grid, mouseIsPressed, distance} = this.state;

        return (
            <>
            <div className="flex">
                <button className="btn" onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijsktra Algorithm
                </button>
                <div className="flex-end">
                    <div className="legend-mgn">&nbsp;</div><div className="legend">Weight of 15 &nbsp;</div>
                    <div className="legend-db">&nbsp;</div><div className="legend">Walls &nbsp;</div>
                    <div className="legend-green">&nbsp;</div><div className="legend">Source &nbsp;</div>
                    <div className="legend-red">&nbsp;</div><div className="legend">Destination &nbsp;</div>
                </div>
            </div>
            {(distance>0) ? <h1>Number of grid-cells covered in the shortest-path: {distance}</h1> : <div></div>}
            <div className="grid">
                {grid.map((row,rowIdx) => {
                    
                    return <div key={rowIdx}>
                        {row.map((node,nodeIdx) => {
                            const {row, col, isEnd, isStart, isWall, isWeighted} = node;
                            return <Node
                            key={nodeIdx}
                            col={col}
                            isFinish={isEnd}
                            isStart={isStart}
                            isWall={isWall}
                            isWeighted={isWeighted}
                            mouseIsPressed={mouseIsPressed}
                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                            onMouseEnter={(row, col) =>
                              this.handleMouseEnter(row, col)
                            }
                            onMouseUp={() => this.handleMouseUp()}
                            onDoubleClick={(row, col) => this.handleDoubleClick(row, col)}
                            row={row}>
                            </Node>
                            })}
                    </div>
                })}
            </div> 
            </>
        )

    }
};

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isEnd: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      isWeighted: false,
      previousNode: null,
    };
  };

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const getNewGridWithWeightToggled = (grid,row,col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWeighted: !node.isWeighted,
    };

    newGrid[row][col] = newNode;
    return newGrid;
  };