import{Game, surroundings} from "./Game.js";

const COLORS = {
    'field': {
        'lg' : 'var(--light-green)',
        'dg' : 'var(--dark-green)',
        'lb' : 'var(--light-brown)',
        'db' : 'var(--dark-brown)',
    },
    'other': {
        1 : 'var(--one)',
        2 : 'var(--two)',
        3 : 'var(--three)',
        4 : 'var(--four)',
        5 : 'var(--five)'
    }
}


//PAGE SELECTOR
const buttons = document.querySelectorAll('button');
const board = document.getElementById('board');
const counter = document.getElementById('counter');
const msgbox = document.getElementById('msgbox');
let count;

//GLOBAL GAME ISTANCE
var game;

//STARTER LISTENERS
buttons.forEach(btn =>{
    btn.addEventListener('click', init);
})
/**************************************************
 * 
 *          FIRE AT CLICKS
 * 
 **************************************************/

//STARTER
function init(){
    let game_starter = document.getElementById('game-starter');
    let difficulty = this.textContent.toLowerCase();
    game_init(difficulty);
    game_starter.className = 'hide';
}

//LEFT CLICK
function clicked(){
    if(!game.gameover){
        let row = parseInt(this.parentNode.dataset.row, 10);
        let col = parseInt(this.dataset.col, 10);
        let cell = game.board.field[row][col];
    
        if(!cell.is_flagged){
            if(cell.is_mine){
                game.gameover = true;
                show_bomb(row, col, this);
                for(let [x, y] of game.board.pos_mines){
                    let d_cell = board.childNodes[x].childNodes[y];
                    show_bomb(x, y, d_cell, (x+y)/2);
                    cell.show();
                }
                board.classList.toggle('shake');
                show_message('You lose');
            }else{
                show_n_expand(row, col);
                console.log(game.squares_left);
                if(!game.squares_left){
                    show_message('You win');
                }
            }
        }
    }
}

//RIGHT CLICK
function flag(e){
    e.preventDefault();
    let row = this.parentNode.dataset.row;
    let col = this.dataset.col;
    let cell = game.board.field[row][col];
    if(!cell.is_visible&&!game.gameover){
        if(cell.is_flagged){
            cell.flag();
            count++;
            this.removeChild(this.firstChild);
        }else if (count){
            count--;
            let flag = document.createElement('i');
            flag.className = "fas fa-flag";
            this.append(flag);
            cell.flag();
        }
        counter.textContent = count;
    }
}

/**************************************************
 * 
 *          GAME STARTER
 * 
 **************************************************/

function game_init(difficulty){
    game = new Game(difficulty);

    let rows = game.board.rows;
    let cols = game.board.columns;
    count = game.board.mines
    counter.textContent = count;

    for(let i=0; i<rows; i++){
        let row = document.createElement('div');
        row.setAttribute('data-row', i);
        row.className = "row";
        board.append(row);
        for(let j=0; j<cols; j++){
            let cell = document.createElement('div');
            cell.setAttribute('data-col', j);
            cell.className = "col";

            //SET LISTENERS
            cell.addEventListener('click', clicked);
            cell.addEventListener('contextmenu', flag)

            set_cell_color(i, j, cell, COLORS['field']['lg'], COLORS['field']['dg']);
            row.append(cell);
        }
    }
}

/**************************************************
 * 
 *          HELPERS
 * 
 **************************************************/

function rand_int(){
    return Math.floor(Math.random() * 4) + 1;
}

//SET CELLS COLORS AS A GRID
function set_cell_color(row, col, cell, color1, color2){
    if(row%2 == 0){
        if(col%2 == 0){
            cell.style.setProperty('background-color', color1);
        }else{
            cell.style.setProperty('background-color', color2);
        }
    }else{
        if(col%2 == 0){
            cell.style.setProperty('background-color', color2);
        }else{
            cell.style.setProperty('background-color', color1);
        }
    }
}

function show_bomb(row, col, cell, delay){
    if(cell.children.length == 0){
        let bomb = document.createElement('i');
        bomb.className = "fas fa-bomb";
        bomb.style.setProperty('animation-delay', String(delay) +'s');
        cell.append(bomb);
        set_cell_color(row, col, cell.firstChild, COLORS['other'][rand_int()], COLORS['other'][rand_int()]);
    }
}

//EXPAND VISIBLE ZONES
function show_n_expand(row, col){
    let cell = game.board.field[row][col];

    if(cell.is_visible || cell.is_flagged)
        return;

    let d_cell = board.childNodes[row].childNodes[col];

    cell.show();
    set_cell_color(row, col, d_cell, COLORS['field']['lb'], COLORS['field']['db']);
    game.decrement_sq_to_win();

    if(cell.proximity){
        let p = document.createElement('p');
        p.textContent = cell.proximity;
        p.style.setProperty('color', COLORS['other'][cell.proximity]);
        d_cell.append(p);
        return;
    }

    for(let [x, y] of surroundings){
        x += row;
        y += col;
        if(game.check_limits(x , y)){
            show_n_expand(x, y);
        }
    }
}

function show_message(msg){
    msgbox.children[0].children[0].textContent = msg;
    msgbox.classList.toggle('hide');
}

