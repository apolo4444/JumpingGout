WINDOW_WIDTH=720;
WINDOW_HEIGHT=1280;

VIRTUAL_WIDTH=360;
VIRTUAL_HEIGHT=640;

backgroundScroll=0;
groundScroll=0;

BACKGROUND_SCROLL_SPEED=30;
GROUND_SCROLL_SPEED=60;

BACKGROUND_LOOPING_POINT = 413

dt=1/60;

GRAVITY=20;

GAP_HEIGHT = 90

var CLOUDS=15;

var activate=false;
var gameOver=false;
var jumping=false;

GamePlayManager={

    init: function(){
        //console.log("init");
        game.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally=true;
        game.scale.pageAlignVertically=true;
        //Se inicializa la variable flagFirstMouseDown como falsa
        this.flagFirstMouseDown=false;
        this.endGame = false;

        this.x=0;
        this.y=0;
        this.spawnTimer=0;
        this.count=0;
        this.random=0;
        this.count2=0;

        this.score=0;
       this.lives=3;
       this.speed=50;
       this.goutX=this.speed*0.03;
       this.goutY=this.speed*0.03;
       this.break=CLOUDS;
    },

    preload:function(){
        game.load.image("background","./SRC/IMAGES/sky.avif");
        game.load.image("cloud","./SRC/IMAGES/Cloud.png");
        game.load.image("gout","./SRC/IMAGES/Gout.png");
    },

    gamePanel:function(){
        var screen = game.add.bitmapData(game.width, game.height);
        screen.ctx.fillStyle = '#FF00FF';
        screen.ctx.fillRect(0,0,game.width, game.height);

        var bg = game.add.sprite(0,0,screen);
        bg.alpha = 1;

        return bg;
    },
    showFinalMessage:function(msg){
        
        var style = {
            font: 'bold 60pt Arial',
            fill: '#FFFFFF',
            align: 'center'
          }
        //Crea un bitmap con el texto
        var bgAlpha = game.add.bitmapData(game.width, game.height);
        bgAlpha.ctx.fillStyle = '#000000';
        bgAlpha.ctx.fillRect(0,0,game.width, game.height);
        bgAlpha.ctx.font="60px Arial";
        bgAlpha.ctx.fillStyle="#FFFFFF";
        bgAlpha.ctx.fillText(msg,game.width/4, game.height/2);
    
        //Crea un sprite con el bitmap
        var bg = game.add.sprite(0,0,bgAlpha);
        bg.alpha = 0.5;
       
        
       return bg;
  
    },
    onTap: function(){

        activate=true;
     
    },

    create:function(){
        this.background=game.add.sprite(0,0,"background");
        this.background.height=game.height;
        this.background.width=game.width;

        this.gout=game.add.sprite(0,0,"gout");
        this.gout.anchor.setTo(0.5,0.5);
        this.gout.scale.x=0.15;
        this.gout.scale.y=0.15;
        this.gout.x=game.width/2;
        this.gout.y=game.height-this.gout.width;

         this.clouds=[];

        for(let i=0;i<CLOUDS;i++){

            var cloud=game.add.sprite(this.x,this.y,"cloud");
            cloud.anchor.setTo(0.5,0.5);
            cloud.scale.x=0.75;
            cloud.scale.y=0.15;
            if(i==0){
                cloud.x=game.width/2;
                cloud.y=game.height;
            }else{
                this.y+=1000;
                this.random=game.rnd.integerInRange(-0,game.width);
                cloud.x=this.random;
                cloud.y=game.height-this.y;
            }
            this.clouds[i]=cloud;
          
        }
        game.input.onDown.add(this.onTap,this);

         //Texto del puntaje
        this.currentScore = 0;
        var style = {
            font: 'bold 30pt Arial',
            fill: '#eeea0d',
            align: 'center'
          }
        
        this.scoreText = game.add.text(game.width/2, 20, '0', style);
        this.scoreText.anchor.setTo(0.5);

        this.livesText=game.add.text(20,20,this.lives, style);
        this.livesText.anchor.setTo(0.5);
    },

        increaseScore:function(){
        //cambia el sprite del caballo cuando agarra un diamante durante un tiempo determinado
        this.currentScore+=100;
        this.scoreText.text = this.currentScore;

    },

    getBoundsBlock: function(currentDiamond){
        //Devuelve un rectangulo con las mismas dimenciones que los sprites
        return new Phaser.Rectangle(currentDiamond.left,currentDiamond.top,currentDiamond.width,currentDiamond.height);

    },

    isRectanglesOverlapping: function(rect1, rect2) {
        if(rect1.x> rect2.x+rect2.width || rect2.x> rect1.x+rect1.width){
            return false;
        }
        if(rect1.y> rect2.y+rect2.height || rect2.y> rect1.y+rect1.height){
            return false;
        }
        return true;
    },

    isOverlapingOtherBlock:function(index, rect2){
        for(var i=0; i<index; i++){
            var rect1 = this.getBoundsDiamond(this.diamonds[i]);
            if(this.isRectanglesOverlapping(rect1, rect2)){
                return true;
            }
        }
        return false;
    },

     cloudsMove:function(){

        if(jumping){
            for(let i=0;i<CLOUDS;i++){
            
            this.clouds[i].y+=this.speed*0.03;

            if(this.clouds[i].y>game.height+this.clouds[i].height){
                this.clouds[i].y=this.clouds[CLOUDS-1].y-1000;
                this.random=game.rnd.integerInRange(-0,game.width);
                this.clouds[i].x=this.random;

            }
                
        }
        }
        
    },

    goutMove:function(gout){
        var pointerX=game.input.x;
        var distX=pointerX-this.gout.x;
    
        var rectBall=this.getBoundsBlock(gout);
        //var rectRacket=this.getBoundsBlock(this.racket);
        this.goutX=distX*0.03;
        //this.ballY=this.ballY;
        
       /*  if(this.isRectanglesOverlapping(rectBall,rectRacket)){
            this.ballY=-(this.ballY);
        }

        if (ball.x + this.ballX < 0){
            this.ballX=(game.rnd.integerInRange(50,100)*0.03);
            
        }
        if(ball.x +this.ballX > game.width-ball.width/2){
            this.ballX=-(game.rnd.integerInRange(50,100)*0.03);
            
        }
			    
		if (ball.y+this.ballY < 0){
            this.ballY=(game.rnd.integerInRange(50,100)*0.03);
            
        }
 */
        if(jumping){
            this.goutY=-this.speed*0.03;
        }else{
            this.goutY=GRAVITY*0.03;
        }

        if(this.gout.y+this.goutY< game.height/2){
            jumping=false;
        }

        if(this.gout.y+this.goutY> game.height-this.gout.height/2){
            this.lives-=1;
             jumping=false;
            activate=false;
           this.create();
          

            if(this.lives==0){
                gameOver=true;
                var GO=this.showFinalMessage("GAME OVER");
            }

            if(this.break==0){
                var win=this.showFinalMessage("CONGRATULATION");
            }
           
        }

        for(let i=0;i<CLOUDS;i++){
            let rectBlock=this.getBoundsBlock(this.clouds[i]);
            if(this.clouds[i].visible&&this.isRectanglesOverlapping(rectBall,rectBlock)&&!jumping){
                this.increaseScore();
                jumping=true;
                //this.ballY=-(game.rnd.integerInRange(50,100)*0.03);
                

            }
            

        }
            

        gout.x+=this.goutX;
        gout.y+=this.goutY;

    },

    update:function(){
        if(!gameOver){
            if(activate){
                this.cloudsMove();
                 this.goutMove(this.gout);  
                console.log(jumping);
            }
        }
    }

}

var game= new Phaser.Game(WINDOW_WIDTH,WINDOW_HEIGHT,Phaser.AUTO);
game.state.add("gameplay",GamePlayManager);
game.state.start("gameplay");