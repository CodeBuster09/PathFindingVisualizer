export function dijsktra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while(!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);

        const closestNode = unvisitedNodes.shift();
        
        //When the closest node is a wall, we can't go through
        if(closestNode.isWall) continue;
        
        //When the closest node has dist INFINITY, we can't go through, that means that the startNode is covered
        //by walls on all sides and can't reach the endNode.
        if(closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if(closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbours(closestNode,grid);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbours(node, grid) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node,grid);
    for(const neighbor of unvisitedNeighbours) {
        if(node.isWeighted)
            neighbor.distance = node.distance + 15;
        else        
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbours(node, grid) {
    const neighbors = [];
    const {col,row} = node;
    if(row>0) neighbors.push(grid[row-1][col]);
    if(row<grid.length-1) neighbors.push(grid[row+1][col]);
    if(col>0) neighbors.push(grid[row][col-1]);
    if(col<grid[0].length - 1) neighbors.push(grid[row][col+1]);

    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for(const row of grid) {
        for(const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder  = [];
    let currentNode = finishNode;
    while(currentNode!==null){
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}