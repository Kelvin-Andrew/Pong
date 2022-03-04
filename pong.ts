class Position
{
    x: number;  //x co-ordinate location
    y: number;  //y co-ordinate location
    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }  
}

class Size
{
    x: number;  //x co-ordinate size
    y: number;  //y co-ordinate size
    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }  
}

class Score
{
    public static readonly MAXSCORE: number = 5;
    public currentScore = 0;
}

class GameView
{
    public canvas: any = document.getElementById('gameCanvas');; 
    public canvasContext: any = this.canvas.getContext('2d');    
}

class DrawFrame
{
    private ball: Ball;
    private playerScore: Score;
    private botScore: Score;
    private player: PlayerPaddle;
    private bot: BotPaddle;
    private gameView: GameView;
    public isWinScreenShowing: boolean = false;
    private framesPerSecond: number = 120;
    public drawRate: number = 1000/this.framesPerSecond;

    constructor(ball: Ball, playerScore: Score, botScore: Score, player: PlayerPaddle, bot: BotPaddle, gameView: GameView)
    {
        this.ball = ball;
        this.playerScore = playerScore;
        this.botScore = botScore;
        this.player = player;
        this.bot = bot;
        this.gameView = gameView;
    }  
    
    colorRectangle(xCoord, yCoord, width, height, drawColor): void
    {
        this.gameView.canvasContext.fillStyle = drawColor;
        this.gameView.canvasContext.fillRect(xCoord,yCoord,width, height); 
    }

    colorCircle(xCoord, yCoord, radius, drawColor): void
    {
        this.gameView.canvasContext.fillStyle = drawColor;
        this.gameView.canvasContext.beginPath();
        this.gameView.canvasContext.arc(xCoord, yCoord, radius, 0, Math.PI*2, true);
        this.gameView.canvasContext.fill();
    }

    draw(): void
    {
        //has to skip draw is screen showing otherwise win text is drawn over
        if(this.isWinScreenShowing)
        {
            return;
        }
        //make background
        this.colorRectangle(0,0,this.gameView.canvas.width, this.gameView.canvas.height, 'black');
        //left paddle - player
        this.colorRectangle(this.player.position.x, this.player.position.y, this.player.size.x, this.player.size.y, 'blue');
        //right paddle - bot
        this.colorRectangle(this.bot.position.x, this.bot.position.y, this.bot.size.x, this.bot.size.y, 'blue');
        //make ball
        this.colorCircle(this.ball.position.x, this.ball.position.y, this.ball.size, 'white')
        //draw middle line
        this.drawnCenterLine()
        this.gameView.canvasContext.font = "20px Calibri";
        this.gameView.canvasContext.fillText(this.playerScore.currentScore, this.gameView.canvas.width / 2 - 100, 20);
        this.gameView.canvasContext.fillText(this.botScore.currentScore, this.gameView.canvas.width / 2 + 100, 20);
    }

    drawnCenterLine()
    {
        for(var i = 0; i < this.gameView.canvas.height; i+=40)
        {
            this.colorRectangle(this.gameView.canvas.width/2-1, i, 2, 20, 'white');
        }
    }

    detectWinner(): void
    {
        let player1Win: boolean = false;
        if(this.playerScore.currentScore === Score.MAXSCORE)
        {
            this.isWinScreenShowing = true;
            player1Win = true;
            this.showWinScreen(player1Win);
        }
        else if(this.botScore.currentScore === Score.MAXSCORE)
        {
            this.isWinScreenShowing = true;
            player1Win = false;
            this.showWinScreen(player1Win);
        }
    }

    showWinScreen(player1Win)
    {
        let winText: string = "";
        let continueText: string = " Click to Continue";
        if(player1Win)
        {
            winText = 'Player 1 Wins.' + continueText;
        }
        else
        {
            winText = 'Player 2 Wins.' + continueText;
        }
        this.gameView.canvasContext.font = "20px Calibri";
        this.gameView.canvasContext.fillStyle = 'white';
        this.gameView.canvasContext.fillText(winText, 100, 100);
    }

    resetGame(): void
    {
        this.playerScore.currentScore = 0;
        this.botScore.currentScore = 0; 
    }

    handleMouseClick(evt): void
    {
        if(this.isWinScreenShowing)
        {
            this.isWinScreenShowing = false;
        }
    }
}

class Paddle
{
    public position: Position = new Position(0, 0);
    public size: Size = new Size(8, 75);
}

class BotPaddle extends Paddle
{    
    botPaddleCenter: number;
    ball: Ball;
    public movementSpeed: number = 1.75;
    constructor(ball: Ball)
    {
        super();
        this.position.x = (document.documentElement.clientWidth / 2) - this.size.x - 2;
        this.position.y = (document.documentElement.clientHeight / 4);
        this.ball = ball;
    }

    paddleMovement(): void
    {
        this.botPaddleCenter = this.position.y + (this.size.y/2);

        if(this.botPaddleCenter < this.ball.position.y)
        {
            this.position.y += this.movementSpeed;
        }
        else
        {
            this.position.y -= this.movementSpeed;
        }
    }
}

class PlayerPaddle extends Paddle
{
    gameView: GameView;

    constructor(gameView: GameView)
    {
        super()
        this.position.x = 2;
        this.position.y = (document.documentElement.clientHeight / 4);
        this.gameView = gameView;
    }

    paddleMovement(evt): any
    {
        let rect = this.gameView.canvas.getBoundingClientRect();
        let root = document.documentElement;
        let mouseX = evt.clientX - rect.left - root.scrollLeft;
        let mouseY = evt.clientY - rect.top - root.scrollTop;
        return{x: mouseX, y: mouseY};
    }

}

class Ball
{
    public position: Position = new Position(0, 0);
    public size: number = 10;
    public speedX: number = 3;
    public speedY: number = 3;
    private gameView: GameView;

    constructor(gameView: GameView)
    {
        this.gameView = gameView;
        this.position.x = this.gameView.canvas.width / 2;
        this.position.y = this.gameView.canvas.height / 2;
    }

    ballReset(): void
    {
        this.position.x = this.gameView.canvas.width / 2;
        this.position.y = this.gameView.canvas.height / 2;
    }
}

class CollisionDetection
{
    ball: Ball;
    player: Paddle;
    bot: Paddle;
    playerScore: Score;
    botScore: Score;
    gameView: GameView;

    constructor(gameView: GameView, ball: Ball, player: Paddle, bot: Paddle, playerScore: Score, botScore: Score)
    {
        this.gameView = gameView;
        this.ball = ball;
        this.player = player;
        this.bot = bot;
        this.playerScore = playerScore;
        this.botScore = botScore;
    }

    batCollisionDetection(): void
    {
        let p1DeltaY: number = this.ball.position.y - (this.player.position.y + (this.player.size.y/2)); 
        let p2DeltaY: number = this.ball.position.y - (this.bot.position.y + (this.bot.size.y/2)); 
        if(this.ball.position.y > this.player.position.y && this.ball.position.y < this.player.position.y + this.player.size.y &&
             this.ball.position.x - this.ball.size < this.player.position.x + this.player.size.x)
        {
            this.ball.speedX *= -1//flips value
            this.ball.speedY = p1DeltaY * 0.1; //* 0.xx dampens the difference so ball does not go too fast
        }
        else if(this.ball.position.y > this.bot.position.y && this.ball.position.y < this.bot.position.y + this.bot.size.y &&
             this.ball.position.x + this.ball.size > this.bot.position.x - (this.bot.size.x/2))
        {
            this.ball.speedX *= -1; //flips value
            this.ball.speedY = p2DeltaY * 0.1;
        }
    }

    ballCollision(): void
    {
        this.ball.position.x += this.ball.speedX;
        this.ball.position.y += this.ball.speedY;

        if(this.ball.position.x + this.ball.size > this.gameView.canvas.width)
        {
            this.ball.speedX *= -1; //flips value
            this.changeScore(true);
            this.ball.ballReset(); 
        }
        else if(this.ball.position.x - this.ball.size < 0)
        {
            this.ball.speedX *= -1; //flips value
            this.changeScore(false);
            this.ball.ballReset();    
        }
        else if(this.ball.position.y + this.ball.size > this.gameView.canvas.height)
        {
            this.ball.speedY *= -1; //flips value
        }
        else if(this.ball.position.y < 0 + this.ball.size)
        {
            this.ball.speedY *= -1; //flips value
        }
    }
    
    changeScore(player: boolean): void
    {
        if(player === true)
        {
            this.playerScore.currentScore ++;
        }
        else
        {
            this.botScore.currentScore ++;
        }
    }
}

class Client
{
    gameView: GameView = new GameView();
    playerScore: Score = new Score();
    botScore: Score = new Score();
    ball: Ball = new Ball(this.gameView);

    player: PlayerPaddle = new PlayerPaddle(this.gameView);
    bot: BotPaddle = new BotPaddle(this.ball); 
       
    collisionDetection: CollisionDetection = new CollisionDetection(this.gameView, this.ball, this.player, this.bot, this.playerScore, this.botScore);
    drawFrame: DrawFrame = new DrawFrame(this.ball, this.playerScore, this.botScore, this.player, this.bot, this.gameView);   
    
    runGame(): void{
        setInterval(() => 
        {
            this.collisionDetection.ballCollision(); this.collisionDetection.batCollisionDetection(); 
            this.bot.paddleMovement(); this.drawFrame.draw(); this.drawFrame.detectWinner();}, this.drawFrame.drawRate);

            this.gameView.canvas.addEventListener('mousemove', (evt) => 
            {
                let mousePos = this.player.paddleMovement(evt);
                this.player.position.y = mousePos.y - (this.player.size.y/2);
            })
                
            this.gameView.canvas.addEventListener('mousedown', (evt) => 
            { 
                if (this.drawFrame.isWinScreenShowing) 
                {   
                    this.drawFrame.isWinScreenShowing = false; this.drawFrame.resetGame(); 
                }; 
        });
    }
}

window.onload = function()
{
    let client: Client = new Client();
    client.gameView.canvas.width = document.documentElement.clientWidth / 2;
    client.gameView.canvas.height = document.documentElement.clientHeight / 2;
    client.gameView.canvasContext.fillStyle = 'black';
    client.runGame();
}