const board = document.getElementById('board');
var cells;
renderBoard();

function renderBoard(cellWidth = 22) {
    const root = document.documentElement;
    root.style.setProperty('--cell-width',`${cellWidth}px`);
    let row = Math.floor(board.clientHeight / cellWidth);
    let col = Math.floor(board.clientWidth / cellWidth);
    board.innerHTML = '';
    cells = [];
    for(let i=0;i<row;i++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        rowElement.setAttribute('id',`${i}`);
        for(let j=0;j<col;j++) {
            const colElement = document.createElement('div');
            colElement.classList.add('col');
            colElement.setAttribute('id',`${i}-${j}`);
            cells.push(colElement);    

            rowElement.appendChild(colElement);
        }
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