import React, { Component } from 'react';
import './PathFindingVisualizer.css';
import Node from '../Node/Node';

export default class PathFindingVisualizer extends Component {
    constructor(props){
        super(props);
        this.state = {
            nodes: [],
        };
    }

    componentDidMount() {
        const nodes = [];
        for (let row=0; row<20; row++) {
            const currentRow = [];
            for(let col=0; col<50; col++) {
                const currNode = {
                    col,
                    row,
                    isStart: row === 10 && col === 5,
                    isEnd: row === 10 && col === 45
                } 
                currentRow.push(currNode)
            }
            nodes.push(currentRow);
        }
        this.setState({nodes})
    }

    render() {
        const {nodes} = this.state;

        return (
            <div className="grid">
                {nodes.map((row,rowIdx) => {
                    
                    return <div key={rowIdx}>
                        {row.map((node,nodeIdx) => {
                            const {isStart, isEnd} = node;
                            return <Node key={nodeIdx}
                            isStart={isStart}
                            isEnd={isEnd} 
                            test={'foo'} 
                            >
                            </Node>})}
                    </div>
                })}
            </div> 
        )

    }
}