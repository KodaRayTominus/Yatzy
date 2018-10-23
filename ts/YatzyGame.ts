class YatzyGame{
    player1:GamePlayer;
    player2:GamePlayer;
    private gameTotalPlayer1:Number;
    private gameTotalPlayer2:Number;
    private currentPlayer:number;
    private gameState:string; //started playing finished
    private die1:DiceSixSided;
    private die2:DiceSixSided;
    private die3:DiceSixSided;
    private die4:DiceSixSided;
    private die5:DiceSixSided;
    private inPlay:Array<number> = new Array(5);
    private turnOver:Boolean = false;

    /**
     * general no arg constructor
     */
    constructor(){
        this.player1 = new GamePlayer();
        this.player2 = new GamePlayer();
        this.gameTotalPlayer1 = 0;
        this.gameTotalPlayer2 = 0;
        this.currentPlayer = 1;
        this.gameState = "finished"
        let gameBoard:HTMLDivElement = <HTMLDivElement>document.getElementById("diceTable");
        
        
        this.die1 = new DiceSixSided();
        this.die1.setAttribute("class", "dice");
        this.die1.setAttribute("id", "dice1");
        gameBoard.appendChild(this.die1);
        this.die2 = new DiceSixSided();
        this.die2.setAttribute("class", "dice");
        this.die2.setAttribute("id", "dice2");
        gameBoard.appendChild(this.die2);
        this.die3 = new DiceSixSided();
        this.die3.setAttribute("class", "dice");
        this.die3.setAttribute("id", "dice3");
        gameBoard.appendChild(this.die3);
        this.die4 = new DiceSixSided();
        this.die4.setAttribute("class", "dice");
        this.die4.setAttribute("id", "dice4");
        gameBoard.appendChild(this.die4);
        this.die5 = new DiceSixSided();
        this.die5.setAttribute("class", "dice");
        this.die5.setAttribute("id", "dice5");
        gameBoard.appendChild(this.die5);
    }


    /**
     * resets the turn
     */
    resetTurn(){
        this.turnOver = false;
    }

    /**
     * sets the turn too over
     */
    setTurnOver(){
        this.turnOver = true;
    }

    /**
     * checks if turn is over
     */
    isTurnOver():Boolean{
        return this.turnOver;
    }

    /**
     * rolls dice if they are not in the hand already
     * sends values to be saved
     */
    rollAllDice():any{
        if(this.currentPlayer == 1){
            if(this.player1.getRollCount() <  3){
                this.theRoll();
                this.increaseRollCount();
            } else {
                this.increaseRollCount();
            }
        }else{
            if(this.player2.getRollCount() < 3) {
                this.theRoll();
                this.increaseRollCount();
            }else {
                this.increaseRollCount();
            }
        }          
    }

    /**
     * changes the vidual display for the active player
     * @param playerId id of player to be displayed
     */
    private displayCurrentPlayer(playerId:string){
        let currentPlayer:HTMLElement = <HTMLElement>(document.getElementById(playerId));
        currentPlayer.setAttribute("class", "currentPlayer");
    }

    /**
     * controls the roll for all dice
     */
    private theRoll() {
        for (let index = 0; index < 5; index++) {
            let currentDice = <DiceSixSided>document.getElementById("dice" + (index + 1));
            if (!currentDice.isInHand()) {
                let currentDiceValue = currentDice.rollDice();
                this.inPlay[index] = currentDiceValue + 1;
            }
        }
    }

    /**
     * increased the roll count
     */
    private increaseRollCount() {
        if(this.currentPlayer == 1){
            this.player1.addToRollCount(1);
        } else{
            this.player2.addToRollCount(1);
        }
    }

    /**
     * resets dice to board for next players turn
     */
    resetDice(){
        for (let index = 1; index < 6; index++) {
            let currentDice:DiceSixSided = this.getDie(index);
            currentDice.style.top = "40%";
            if(this.isInPlayersHand(index)){
                currentDice.moveDice();
            }
        }
        this.theRoll();
    }

    /**
     * holds dice and sends them to be stored
     * @param diceNumber dicenumber to be checked and held or released
     */
    moveDie(diceNumber: number){
        let currentDice:DiceSixSided = this.getDie(diceNumber);
        currentDice.moveDice();
    }

    /**
     * gets the dice object and returns it
     * @param diceNumber dice number to be grabed and return as object
     */
    private getDie(diceNumber: number) {
        let tempClassName: string = "dice" + diceNumber;
        let currentDice = <DiceSixSided>document.getElementById(tempClassName);
        return currentDice;
    }

    /**
     * checks if dice is in play.
     * @param diceNumber diceNumber to be checked
     */
    isInPlayersHand(diceNumber: number) {
        let currentDice:DiceSixSided = this.getDie(diceNumber);
        return currentDice.isInHand();
    }

    /**
     * checks if the game is in play
     */
    gameInPlay(){
        return (this.player1.getRollCount() < 4 && this.player2.getRollCount() < 4) &&
                (this.player1.getRollCount() > 0 || this.player2.getRollCount() > 0);
    }

    /**
     * updates score board based onpossible combinations
     */
    updateScoreBoard(){
        if(this.currentPlayer == 1){
            if(this.player1.getRollCount() == 4){
                this.changePlayer();
            } else{
                this.player1.checkHand(1, this.inPlay);
            }
        } else {
            if(this.player2.getRollCount() == 4){
                this.changePlayer();
            }else{
                this.player2.checkHand(2, this.inPlay);
            }
        }
    }

    /**
     * changes the player based on current player
     */
    changePlayer(){
        let currentScoreSections = <NodeListOf<HTMLTableDataCellElement>>document.getElementsByTagName("td");
        this.clearUnusedScores(currentScoreSections);
        let newPlayerNum:number = 0;
        if(this.currentPlayer == 1){
            newPlayerNum = 2;
            this.player1.checkForSumBonus();
            this.player1.addToRollCount(0 - this.getCurrentPlayerTurnCount());
            let player1Tag = <HTMLElement>document.getElementById("player1");
            player1Tag.classList.remove("currentPlayer");
            this.resetDice();
        } else {
            
            newPlayerNum = 1;
            this.player2.checkForSumBonus();
            this.player2.addToRollCount(0 - this.getCurrentPlayerTurnCount());
            let player2Tag = <HTMLElement>document.getElementById("player2");
            player2Tag.classList.remove("currentPlayer");
            this.resetDice();
        }
        this.currentPlayer = newPlayerNum;
        this.displayCurrentPlayer("player" + newPlayerNum);
        
        
        
    }

    //clear unused scores
    clearUnusedScores(currentScoreSections: NodeListOf<HTMLTableDataCellElement>) {
        for (let index2 = 0; index2 < currentScoreSections.length; index2++) {
            if (hasNotBeenUsed(currentScoreSections[index2])) {
                currentScoreSections[index2].innerText = "";
            }
        }
    }

    /**
     * gets the current players turn count and returns it.
     */
    getCurrentPlayerTurnCount(){
        if(this.getCurrentPlayer() == 1){
            return this.player1.getRollCount();
        } else {
            return this.player2.getRollCount();
        }
    }

    /**
     * gets the current player and returns it
     */
    getCurrentPlayer():number{
        return this.currentPlayer;
    }

    /**
     * gets the value of the dice number provided and returns the value
     * @param dieNum dice number to return value of
     */
    getDiceValue(dieNum:number){
        return this.inPlay[dieNum];
    }

}