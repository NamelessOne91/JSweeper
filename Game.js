import {Board} from "./Board.js";


const surroundings = [
    [-1,-1], [-1, 0], [-1,1],
    [0, -1]          ,[0, 1],
    [1, -1], [1, 0], [1, 1]
]

class Game
{
    constructor(difficulty)
    {
        this.gameover = false;
        this.difficulty = difficulty;
        this.board = null;
        this.flags = 0;
        this.squares_left = 0;

        this.set_board();
        this.find_mine_neighbours();
    }

    set_board()
    {
        if (this.difficulty == "easy")
        {
            this.board = new Board(10, 10, 15);
        }
        else if(this.difficulty == "medium")
        {
            this.board = new Board(15, 15, 30);
        }
        else if(this.difficulty == "hard")
        {
            this.board = new Board(15, 30, 50);
        }
        this.flags = this.board.mines;
        this.squares_left = this.board.clean_squares;
    }

    find_mine_neighbours()
    {
        for(let mine_pos of this.board.pos_mines)
        {
            let [r, c] = mine_pos;
            
            for(let direction of surroundings)
            {
                let [x, y] = direction;

                let row = r+x;
                let col = c+y;
                if (this.check_limits(row, col)) 
                {
                    this.board.field[row][col].increment_proximity();
                } 
            }
        }
    }

    check_limits(row, col)
    {
        return row  >= 0 && row <= this.board.rows-1 && col >= 0 && col <= this.board.columns-1;
    }

    check_victory()
    {
        return this.squares_left == 0;
    }

    decrement_sq_to_win()
    {
        this.squares_left -= 1;
    }

    increment_mines_counter()
    {
        this.flags += 1;
    }

    decrement_mines_counter()
    {
        this.flags -= 1;
    }

}

export{Game, surroundings};