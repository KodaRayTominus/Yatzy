let dice:Array<HTMLElement> = [];    

let diceValues:Array<number> = [];

let heldDice:Array<HTMLElement> = [];

for (let i = 0; i < 5; i++) {
    dice[i] = <HTMLElement>document.getElementsByClassName("dice")[i];
} 
let faceRot:Array<string> = ["rotate3d(0, 0, 1, -90deg)",
                            "rotate3d(1, 0, 0, 180deg)",
                            "rotate3d(1, 0, 0, 90deg)",
                            "rotate3d(1, 0, 0, -90deg)",
                            "rotate3d(0, 1, 0, -90deg)",
                            "rotate3d(0, 1, 0, 90deg)"];
function rollDice(){  
    for (let index = 0; index < 5; index++) {
        let faces = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("dice-face");

        for(let fIt = 0; fIt < faces.length; fIt++) {
            faces[fIt].style.backgroundColor = "white";
        }

        let randFace:number = Math.round(Math.random() * 5);

        diceValues[index] = randFace;
        
        //randomly places dice on screen 
        //dice[index].style.left = 1000 + (Math.random()* 550) + "px";
        //dice[index].style.top =  120 + (Math.random()* 550) + "px";
        let topLocation = window.getComputedStyle(dice[index], null).getPropertyValue('top');
        function getStyle(el, prop) {
            return window.getComputedStyle(el, null).getPropertyValue(prop);
        }
        topLocation = getStyle(dice[index], 'top');
        let startLocation = "592.188px";
        dice[index].style.top  = (topLocation == "592.188px")? "40%" : "40%" ;
        

        dice[index].style.transform = "rotate3d(1, 0, 0, " + Math.random() * 360 + 
                                        "deg) rotate3d(0, 1, 0, " + Math.random() * 360 +
                                        "deg) rotate3d(0, 0, 1, " + Math.random() * 360 + 
                                        "deg)";

        setTimeout( function() {
            dice[index].style.transform = faceRot[randFace];
        }, 900 );  
    }
    
}

function scoreUpdates(){


    
}

let saveDie = function(int:number):any{
        
        (<HTMLDivElement>document.getElementsByClassName("dice-face")[int]).style.backgroundColor = "green";
    }
window.onload = function(){
}

function whenClicked():any {
    rollDice();
    addEvents();
}

function addEvents() {
    dice[0].addEventListener("click", saveDie(diceValues[0]));
    dice[1].addEventListener("click", saveDie(diceValues[1]));
    dice[2].addEventListener("click", saveDie(diceValues[2]));
    dice[3].addEventListener("click", saveDie(diceValues[3]));
    dice[4].addEventListener("click", saveDie(diceValues[4]));
}
