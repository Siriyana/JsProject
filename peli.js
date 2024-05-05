//Hakee canvas-elementin ja määrittää canvasin leveys ja korkeus-muuttujat
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

//COllision canvas
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = 600;
collisionCanvas.height = 600;



//määritellään animaation etenemiseen liittyviä tietoja
let gameFrame = 0;
const staggerFrames = 5;
let gameSpeed = 1;


let timeToNextEnemy = 1000;
let enemyInterval = 1000;
let lastTime = 0;
let score = 0;
ctx.font = '50px Impact';

//SHADOWDOG IMAGE AND ANIMATION STATES
let playerState = 'run';    //määritellään hahmon tila, eli hahmo juoksee
const dropdown = document.getElementById('animations'); //sivulla valikko, jost voi valita halutun animaation ja joka päivittää hahmon tilan
dropdown.addEventListener('change', function(e){
    playerState = e.target.value;
})

//alustetaan pelihahmon kuva
const playerImage = new Image(); 
playerImage.src = "peli/shadow_dog.png"; //picture of the dog
const spriteWidth = 575;
const spriteHeight = 523;

//luodaan lista pelihahmon erilaisista animaatiosta ja luodaan eri tiloihin liittyvät animaatiot
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    }, 
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4
    }
];
animationStates.forEach((state, index) => {
    let frames = { //muuttuja ja loc-tieto alustetaan
        loc: [],
    }
    //käydään jokaisen animaation kehysten määrä läpi
    for (let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth; //laskee hahmon sijainnin leveyden
        let positionY = index * spriteHeight; //laskee hahmon sijainin pystysuunnassa kertomalla indeksillä kuvan korkeuden
        frames.loc.push({x: positionX, y: positionY}); //lisä tiedot frames.loc listaan
    }
    spriteAnimations[state.name] = frames;
});

// Alustetaan taustakuvat
const backgroundLayer1 = new Image();
backgroundLayer1.src = 'peli/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'peli/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'peli/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'peli/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'peli/layer-5.png';


//ALustetaan vihollisten tietoja, vihollisten määrä ja lista, johon viholliset lisätään
let enemiesArray = [];


//luodaan neljä erilaista vihollisluokkaa, joilla on eri kuva ja erilaiset liikeradat
class Enemy1 {
    //luokan rakenne, joka suoritetaan aina, kun olio luodaan
    constructor(){
        this.image = new Image(); //uusi kuva-olio
        this.image.src = 'peli/enemy1.png';
        this.spriteWidth = 293; //kuvakehyksen, mistä animaatio luodaan, leveys
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 3;      //asettaa leveyden, joka tässä kolmasosa kuvakehyksen leveydestä 
        this.height = this.spriteHeight / 3;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - 200);
        this.directionX = Math.random() * 5 + 3;
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3);
        this.markedForDeletion = false;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';     
    }
    //metdoi määritellee missä hahmon aloituspiste ja mihin suuntaan ja millä nopeudella
    update() {
        this.x -= this.directionX;
        this.y += Math.random() * 3 -1.5;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        //animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
        
    }
    //piirtää hahmon ruudulle
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};

class Enemy2 {
    constructor(){
        this.image = new Image();
        this.image.src = 'peli/enemy2.png';
        this.speed = Math.random() * 4 - 6; //random number between -2 to 2 (0-2 4-2)
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / 3;       
        this.height = this.spriteHeight / 3;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - 400);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 +1);
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.directionX = Math.random() * 5;
        this.curve = Math.random() * 5; //by changing multiplier here, you can control how prominent to moving up and down is
        this.markedForDeletion = false;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'; 
    }
    //method to define where enemy spawns and at what speed and direnction it goes
    update() {
        this.x -= this.directionX;
        this.y += this.curve * Math.sin(this.angle); 
        this.angle += this.angleSpeed;
        if (this.x + this.width < 0) this.x = canvas.width;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        //animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
        
    }
    //draws enemy
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};


class Enemy3 {
    constructor(){
        this.image = new Image();
        this.image.src = 'peli/enemy3.png';
        //this.speed = Math.random() * 4 - 2; //random number between -2 to 2 (0-2 4-2)
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width = this.spriteWidth / 2.5;       
        this.height = this.spriteHeight / 2.5;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 +1);
        this.angle = Math.random() * 500;
        this.angleSpeed = Math.random() * 1.5 + 0.5;
        this.curve = Math.random() * 200 + 50;
        this.directionX = Math.random() * 5;
        this.markedForDeletion = false;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'; 
    }
    //method to define where enemy spawns and at what speed and direnction it goes
    update() {
        this.x = canvas.width/2 * Math.sin(this.angle * Math.PI/90) + (canvas.width/2 - this.width/2);
        this.y = canvas.height/4 * Math.cos(this.angle * Math.PI/270) + (canvas.height/2 - this.height/2);

        this.angle += this.angleSpeed;
        this.x -= this.directionX;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        //animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
        
    }
    //draws enemy
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};


class Enemy4 {
    constructor(){
        this.image = new Image();
        this.image.src = 'peli/enemy4.png';
        this.speed = Math.random() * 4 - 1; //random number between -2 to 2 (0-2 4-2)
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 2.5;       
        this.height = this.spriteHeight / 2.5;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - 250);
        this.newX = Math.random() * (canvas.width - this.width);
        this.newY = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 +1);
        this.interval = Math.floor(Math.random() * 200 + 50);
        this.directionX = Math.random() * 5;
        this.markedForDeletion = false;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'; 
    }
    //method to define where enemy spawns and at what speed and direnction it goes
    update() {
        if (gameFrame % this.interval === 0) {
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= this.directionX;
        this.y -= dy/20;
        if (this.x + this.width < 0) this.x = canvas.width;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        //animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
        
    }
    //draws enemy
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};



// COLLISION EXPLOSIONS


let explosions = [];

class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'peli/boom.png'
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'peli/FireImpact1.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
    update(deltatime){
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y -this.size/4, this.size, this.size);
    }

}




//Pistetaulu
function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75); //scoreboard määritellään tiettyyn sijaintiin
    ctx.fillStyle = 'white'; //saadaan piirrettyä hieno varjostus, kun eka mustalla ja sitten valkoisella vähän eri kohtaan
    ctx.fillText('Score: ' + score, 55, 80);
}

//Räjähdys-tapahtuma, kun klikataan vihollista
window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
    const pc = detectPixelColor.data;
    enemiesArray.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    });
});


//ALL THE ANIMATIONS ON THE SAME
//animaatio alkaa, kun sivu ladataan
window.addEventListener('load', function(){
    //nopeuden määritteleminen sliderin avulla
    const slider = document.getElementById('slider');
    slider.value = gameSpeed;
    const showGameSpeed = document.getElementById('showGameSpeed');
    showGameSpeed.innerHTML = gameSpeed;

    slider.addEventListener('change', function(e){
        gameSpeed = e.target.value;
        showGameSpeed.innerHTML = e.target.value;
    });

    //Tauskuva-luokka, eri taustojen luomiseksi ja määrittelemiseksi
    class Layer {
        constructor(image, speedModifier){
            this.x = 0;
            this.y = 0;
            this.width = 2200;      //this depends on image size, so with your own image, need to try and see what
            this.height = 600;      //canvas height, at least in here
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }
        update(){
            this.speed = gameSpeed * this.speedModifier; // for dynamic speed
            if (this.x <= -this.width){                 //for to make image run smoothly, without empty space, and using the same picture twice
                this.x = 0; 
            }
            this.x = this.x - this.speed;
            //this.x = gameFrame * this.speed % this.width;
    
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
    }




    const layer1 = new Layer(backgroundLayer1, 0.2);
    const layer2 = new Layer(backgroundLayer2, 0.4);
    const layer3 = new Layer(backgroundLayer3, 0.6);
    const layer4 = new Layer(backgroundLayer4, 0.8);
    const layer5 = new Layer(backgroundLayer5, 1);

    const gameObjects = [layer1, layer2, layer3, layer4, layer5];

    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
        let deltatime = timestamp - lastTime;
        lastTime = timestamp;
        timeToNextEnemy += deltatime;
        if (timeToNextEnemy > enemyInterval){
                // Valitse satunnainen vihollistyyppi
                const enemyType = Math.floor(Math.random() * 4) + 1;
            
                // Luo ja lisää vihollinen taulukkoon riippuen valitusta tyypistä
                switch (enemyType) {
                    case 1:
                        enemiesArray.push(new Enemy1());
                        break;
                    case 2:
                        enemiesArray.push(new Enemy2());
                        break;
                    case 3:
                        enemiesArray.push(new Enemy3());
                        break;
                    case 4:
                        enemiesArray.push(new Enemy4());
                        break;
                    default:
                        console.error("Unknown enemy type:", enemyType);
                        break;
                }
            
            timeToNextEnemy = 200;
            enemiesArray.sort(function(a,b){ //sort so, that smaller ravens are created first, so that when drawn, the bigger ones are upfront
                return a.width - b.width;
            })
        };


        // Piirrä tausta
        gameObjects.forEach(object => {
            object.update();
            object.draw();
        });

        // Piirrä koira
        let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
        let frameX = spriteWidth * position;
        let frameY = spriteAnimations[playerState].loc[position].y;
        ctx.drawImage(playerImage, frameX, frameY,
        spriteWidth, spriteHeight, canvas.width - 450, canvas.height - 250, 150, 150);


        drawScore();

        [...enemiesArray, ...explosions].forEach(object => object.update(deltatime)); //array literal and spread operator
        [...enemiesArray, ...explosions].forEach(object => object.draw());
        enemiesArray = enemiesArray.filter(object => !object.markedForDeletion);
        explosions = explosions.filter(object => !object.markedForDeletion);


        gameFrame++;
        requestAnimationFrame(animate); // Tässä käytetään samaa animaatiofunktiota
    }

    animate(0); // Käynnistä animaatio
});