const board = document.getElementById('board');
var cells;
let row,col;
var matrix = [];
renderBoard();

function renderBoard(cellWidth = 22) {
    const root = document.documentElement;
    root.style.setProperty('--cell-width',`${cellWidth}px`);
    row = Math.floor(board.clientHeight / cellWidth);
    col = Math.floor(board.clientWidth / cellWidth);
    board.innerHTML = '';
    cells = [];
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

let source = set('source');
let target = set('target');

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
})

const clearPath = ()=> {
    cells.forEach(cell => {
        cell.classList.remove('path');
    })
}

const clearWall = ()=> {
    cells.forEach(cell => {
        cell.classList.remove('wall');
    })
}