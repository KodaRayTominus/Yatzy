class DiceFace extends HTMLElement{
    /**
     * General no arg constructor
     */
    constructor(){
        //calls super constructor HTMLElement
        super();
        //sets the class for a dice-face
        this.setAttribute("class", "dice-face");
    }
} 
//allows Customer DOM object to be used called and constructed
customElements.define('dice-face', DiceFace, { extends: "div" });