const board = document.getElementById('board');
var cells;
renderBoard();

function renderBoard(cellWidth = 22) {
    let row = Math.floor(board.clientHeight / cellWidth);
    let col = Math.floor(board.clientWidth / cellWidth);

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