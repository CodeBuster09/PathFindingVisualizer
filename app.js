const board = document.getElementById('board');
var cells;
let row,col;
var matrix;
let source;
let target;

renderBoard();

function renderBoard(cellWidth = 22) {
    const root = document.documentElement;
    root.style.setProperty('--cell-width',`${cellWidth}px`);
    row = Math.floor(board.clientHeight / cellWidth);
    col = Math.floor(board.clientWidth / cellWidth);
    board.innerHTML = '';
    cells = [];
    matrix = [];

    for(let i=0;i<row;i++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        rowElement.setAttribute('id',`${i}`);

        const rowArr = [];
        for(let j=0;j<col;j++) {
            const colElement = document.createElement('div');
            colElement.classList.add('col');
            colElement.setAttribute('id',`${i}-${j}`);
            cells.push(colElement);    

            rowArr.push(colElement);
            rowElement.appendChild(colElement);
        }
        matrix.push(rowArr);
        board.appendChild(rowElement);
    }

    source = set('source');
    target = set('target');
}

const navOptions = document.querySelectorAll('.nav-menu>li>a');
var dropOptions = null;
const removeActive = (elements, parent = false)=> {
    elements.forEach(element => {
        if(parent) element = element.parentElement;
        element.classList.remove('active');
    });
}
navOptions.forEach(navOption => {

    navOption.addEventListener('click', ()=>{
        const li = navOption.parentElement;
        if(li.classList.contains('active')) {
            li.classList.remove('active');
            return;
        }
        removeActive(navOptions, true);
        li.classList.add('active');

        if(li.classList.contains('drop-box')) {
            dropOptions = li.querySelectorAll('.drop-menu>li');
            
            toggle_dropOption(navOption.innerText);
        }
    });
});

let pixelSize = 22;
let speed = 'normal';
let algorithm = 'BFS';
const visualizeBtn = document.getElementById('visualize');

function toggle_dropOption(text) {

    console.log(text)

    dropOptions.forEach(dropOption => {
        dropOption.addEventListener('click',()=>{
            removeActive(dropOptions);
            dropOption.classList.add('active');

            if(text === 'Pixel') {
                pixelSize = +dropOption.innerText.replace('px','');
                renderBoard(pixelSize);
            } else if(text === 'Speed'){
                speed = dropOption.innerText;
            } else {
                algorithm = dropOption.innerText.split(' ')[0];
                visualizeBtn.innerText = `Visualize ${algorithm}`;
            }

            removeActive(navOptions, true);
        })
    })
}

document.addEventListener('click',(e)=>{
    const navMenu = document.querySelector('.nav-menu');
    if(!navMenu.contains(e.target)) {
        removeActive(navOptions,true);
    }
})

//Board Interaction

function isValid(x, y) {
    return (x>=0 && y>=0 && x<row && y<col)
}

function set(className, x, y) {
    if(isValid(x,y)) {
        matrix[x][y].classList.add(className);
    }
    else {
        x = Math.floor(Math.random() * row);
        y = Math.floor(Math.random() * col);
        matrix[x][y].classList.add(className);
    }
    return {x,y};
} 


let isDrawing = false;
let isDragging = false;
let dragPoint = null;
cells.forEach((cell) => {

    const pointerup = ()=>{
        isDragging = false;
        isDrawing = false;
        dragPoint = null;
    }

    const pointerdown = (e)=> {
        if(e.target.classList.contains('source')) {
            isDragging = true;
            dragPoint = 'source';
        } else if(e.target.classList.contains('target')) {
            isDragging = true;
            dragPoint = 'target';
        } else {
            isDrawing = true;
        }
    }

    const pointermove = (e)=>{
        if(isDrawing) {
            e.target.classList.add('wall');
        } else if(dragPoint && isDragging){

            cells.forEach((cell) => {
                cell.classList.remove(`${dragPoint}`);
            });

            e.target.classList.add(`${dragPoint}`);
            let coordinate = e.target.id.split('-');
            if(dragPoint === 'source') {
                source.x = +coordinate[0];
                source.y = +coordinate[1];
            } else {
                target.x = +coordinate[0];
                target.y = +coordinate[1];
            
            }
        }
    }

    cell.addEventListener('pointerup',pointerup);
    cell.addEventListener('pointerdown',pointerdown);
    cell.addEventListener('pointermove',pointermove);
    cell.addEventListener('click', ()=> {
        cell.classList.toggle('wall');
    });
});

const clearPathBtn = document.getElementById('clear-path');
const clearBoardBtn = document.getElementById('clear-board');

clearPathBtn.addEventListener('click', clearPath);
clearBoardBtn.addEventListener('click', clearBoard);

const clearPath = ()=> {
    cells.forEach(cell => {
        cell.classList.remove('visited');
        cell.classList.remove('path');
    })
}

const clearBoard = ()=> {
    cells.forEach(cell => {
        cell.classList.remove('visited');
        cell.classList.remove('wall');
        cell.classList.remove('path');
    })
}

const clearWall = ()=> {
    cells.forEach(cell => {
        cell.classList.remove('wall');
    })
}




// MAZE GENERATION

var wallToAnimate;
const generateMazeBtn = document.getElementById('generate-maze');

generateMazeBtn.addEventListener('click', ()=>{
    wallToAnimate = [];
    generateMaze(0,row-1,0,col-1,false,'horizontal');
    animate(wallToAnimate, 'wall');
})

function generateMaze(rowStart, rowEnd, colStart, colEnd, surroundingWall, orientation) {

    //BASE CASE
    if(rowStart>rowEnd || colStart>colEnd) {
        return;
    }

    // STEP 1: CREATE SURROUNDING WALL
    if(!surroundingWall) {
        for(let i=0;i<col;i++) {
            if(!matrix[0][i].classList.contains('source') && !matrix[0][i].classList.contains('target'))
            wallToAnimate.push(matrix[0][i]);

            if(!matrix[row-1][i].classList.contains('source') && !matrix[row-1][i].classList.contains('target'))
            wallToAnimate.push(matrix[row-1][i]);
        }

        for(let i=0;i<row;i++) {
            if(!matrix[i][0].classList.contains('source') && !matrix[i][0].classList.contains('target'))
            wallToAnimate.push(matrix[i][0]);

            if(!matrix[i][col-1].classList.contains('source') && !matrix[i][col-1].classList.contains('target'))
            wallToAnimate.push(matrix[i][col-1]);
        }

        surroundingWall = true;
    }


    //STEP 2: DRAW WALL VERTICALLY OR HORIZONTALLY
    if(orientation === 'horizontal') {
        let possibleRows = [];
        for(let i=rowStart; i<=rowEnd;i+=2) {
            possibleRows.push(i);
        }

        let possibleCols = [];
        for(let i=colStart-1;i<=colEnd+1;i+=2) {
            if(i>0 && i<col-1) {
                possibleCols.push(i);
            }
        }

        const currentRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        const randomCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

        for(let i=colStart-1;i<=colEnd+1;i++) {
            const cell = matrix[currentRow][i];
            if(!cell || i === randomCol || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;
            
            wallToAnimate.push(cell);
        }

        //Recursive call

        //Upper division
        generateMaze(rowStart, currentRow-2,colStart,colEnd,surroundingWall,((currentRow-2)-rowStart > colEnd-colStart)?'horizontal':'vertical');

        //Lower division
        generateMaze(currentRow+2,rowEnd,colStart,colEnd,surroundingWall,(rowEnd-(currentRow+2) > colEnd-colStart)?'horizontal':'vertical');

    } else {

        let possibleCols = [];
        for(let i=colStart; i<=colEnd;i+=2) {
            possibleCols.push(i);
        }

        let possibleRows = [];
        for(let i=rowStart-1;i<=rowEnd+1;i+=2) {
            if(i>0 && i<row-1) {
                possibleRows.push(i);
            }
        }

        const currentCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        const randomRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

        for(let i=rowStart-1;i<=rowEnd+1;i++) {
            if(!matrix[i]) continue;

            const cell = matrix[i][currentCol];
            if(i === randomRow || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;

            wallToAnimate.push(cell);
        }

        //Recursive call

        //Left division
        generateMaze(rowStart, rowEnd, colStart, currentCol-2, surroundingWall, (rowEnd-rowStart > (currentCol-2)-colStart)?'horizontal':'vertical');

        //Right division
        generateMaze(rowStart, rowEnd, currentCol+2, colEnd, surroundingWall, (rowEnd-rowStart > colEnd-(currentCol+2))?'horizontal':'vertical');

    }

}


//PATH FINDING ALGROTHMS

// 1. BFS

var visitedCell;
var pathToAnimate;
visualizeBtn.addEventListener('click', ()=>{
    visitedCell = [];
    pathToAnimate = [];
    BFS();
    animate(visitedCell, 'visited');
});


function BFS() {
    const queue = [];
    const visited = new Set();
    const parent = new Map();

    queue.push(source);
    visited.add(`${source.x}-${source.y}`);

    while(queue.length > 0) {
        const current = queue.shift();
        visitedCell.push(matrix[current.x][current.y]);
        
        if(current.x === target.x && current.y === target.y){
            getPath(parent, target);
            return;
        }

        const neighbours = [
            {x: current.x-1, y: current.y}, // Up
            {x: current.x, y: current.y+1}, // Right
            {x: current.x+1, y: current.y}, // Bottom
            {x: current.x, y: current.y-1} // Left
        ];

        for (const neighbour of neighbours) {

            const key = `${neighbour.x}-${neighbour.y}`;
            if(isValid(neighbour.x, neighbour.y) && !visited.has(key) && !matrix[neighbour.x][neighbour.y].classList.contains('wall')) {
                queue.push(neighbour);
                visited.add(key);
                parent.set(key, current);
            }
        }
    }
};


//Animate algorithm
function animate(elements, className) {
    let delay = 10;
    if(className === 'path') {
        delay *= 3.5;
    }

    for (let i=0; i<elements.length; i++) {
        setTimeout(() => {
            elements[i].classList.remove('visited');
            elements[i].classList.add(className);
            if(i === elements.length-1 && className === 'visited') {
                animate(pathToAnimate, 'path');
            }
        }, delay*i);
    }
};


// Backtrack to get path from source to target
function getPath(parent, target) {
    if(!target) return;

    pathToAnimate.push(matrix[target.x][target.y]);

    const p = parent.get(`${target.x}-${target.y}`);
    getPath(parent,p);
};