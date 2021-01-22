class Square
{
    constructor(is_mine, is_visible = false, is_flagged = false )
    {
        this.is_mine = is_mine;
        this.is_flagged = is_flagged;
        this.is_visible = is_visible;
        this.proximity = 0;
    }

    show()
    {
        this.is_visible = true;
    }

    flag()
    {
        this.is_flagged = !this.is_flagged;
    }

    increment_proximity()
    {
        this.proximity += 1;
    }

}


export{Square};