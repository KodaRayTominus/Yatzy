class DiceSixSided extends HTMLElement{
    //face rotation variables
    private faceRot:Array<string>;
    
    //whether the dice is in hand or not
    private inHand:boolean;

    /**
     * general no arg constructor
     */
    constructor(){
        //calls the super constructor of HTML Element
        super();
        let dieside1 = new DiceFace();
        let dieside2 = new DiceFace();
        let dieside3 = new DiceFace();
        let dieside4 = new DiceFace();
        let dieside5 = new DiceFace();
        let dieside6 = new DiceFace();
        this.appendChild(dieside1);
        this.appendChild(dieside2);
        this.appendChild(dieside3);
        this.appendChild(dieside4);
        this.appendChild(dieside5);
        this.appendChild(dieside6);
        this.inHand = false;
        
        this.faceRot = ["rotate3d(0, 0, 1, -90deg)",
                        "rotate3d(1, 0, 0, 180deg)",
                        "rotate3d(1, 0, 0, 90deg)",
                        "rotate3d(1, 0, 0, -90deg)",
                        "rotate3d(0, 1, 0, -90deg)",
                        "rotate3d(0, 1, 0, 90deg)"];
        
    }

    /**
     * changes the boolean variable representing if the dice is in hand or not
     */
    moveDice(){
        if(this.inHand == true){
            this.inHand = false;
        } else{
            this.inHand = true;
        }
    }

    /**
     * returns a boolean representation of the dice being in hand or not
     * @returns false if dice is in play, true if dice is being held
     */
    isInHand():boolean{
        return this.inHand;
    }

    /**
     * rolls the dice, and returns the value of the upward face
     * @returns number of face right side up as value
     */
    rollDice():number{
        //grabs the faces of the dice
        let face = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("dice-face");

        //sets dice to white color
        for(let fIt = 0; fIt < face.length; fIt++) {
            face[fIt].style.backgroundColor = "white";
        }

        //picks a random integer between 1 and 6
        let randFace:number = Math.round(Math.random() * 5);

        //grabs the location fo the dice
        let topLocation:string = this.getStyle(this, 'top');
        let startLocation:string = "592.188px";
        //moves dice if needed
        this.style.top  = (topLocation == startLocation)? "40%" : "40%" ;

        this.style.transform = "rotate3d(1, 0, 0, " + Math.random() * 360 + 
                                "deg) rotate3d(0, 1, 0, " + Math.random() * 360 +
                                "deg) rotate3d(0, 0, 1, " + Math.random() * 360 + 
                                "deg)";
        setTimeout(this.timeOut(randFace), 900);    
        return randFace;     
        //return 1;                        
    }

    /**
     * gets the style property value;
     * @param el element to be checked
     * @param prop property to be grabbed
     */
    getStyle(el, prop) {
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    }
    
    /**
     * times out the dice spin on random face that was chosen and passed
     * @param randFace Random Face to be stopped on
     */
    timeOut(randFace:number) {
        this.style.transform = this.faceRot[randFace];
    }
    
}
/**
 * returns random integer value
 * @param min minimum value
 * @param max maximum value
 * @returns random integer value 
 */
function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
//enables custome DOm object to be used.
customElements.define('dice-six-sided', DiceSixSided, { extends: "div" });