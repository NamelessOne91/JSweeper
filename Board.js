import { Square } from "./Square.js";

class Board 
{
    constructor(rows, columns, mines)
    {
        this.rows = rows;
        this.columns = columns;
        this.mines = mines;

        this.pos_mines = this.place_mines();
        this.clean_squares = (rows*columns) - mines;
        this.field = [];

        for(let i = 0; i < rows; i++)
        {
            this.field.push([]);
            for(let j = 0; j < columns; j++)
            {
                let temp;

                for(let z = 0; z < this.mines; z++)
                {
                    let [a, b] = this.pos_mines[z];
                    if (a == i && b == j)
                    {
                        temp = new Square(true);
                        this.field[i].push(temp);
                        break;
                    }
                    if ( z == this.mines-1)
                    {
                        temp = new Square(false);
                        this.field[i].push(temp);
                    }
                }
            }
        }
    }

    getRandomIntInclusive(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    place_mines()
    {
        let counter = 0;
        let local_mines = [];
        let inside;
        
        while(counter < this.mines)
        {
            let mine = [this.getRandomIntInclusive(0, this.rows-1), this.getRandomIntInclusive(0, this.columns-1)];
            inside = false;
            for(let i= 0; i < counter && !inside; i++)
            {
                let [a, b] = local_mines[i];
                if (a == mine[0] && b == mine[1])
                    inside = true;
            }
            if (!inside)
            {
                local_mines.push(mine);
                counter++;
            }
        }
        return local_mines;
    }
}

export{Board};