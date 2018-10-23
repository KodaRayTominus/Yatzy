class GamePlayer{
    //players total points
    private totalPoints:number;
    private yatzyCount:number;

    //die values that have been held this turn
    private heldDie:Array<number>;

    //the integer value of which roll the player is on
    private rollCount:number;
    

    /**
     * general no arg constructor
     */
    constructor(){
        this.heldDie = [];
        this.totalPoints = 0;
        this.rollCount = 0;
        this.yatzyCount = 0;
    }

    /**
     * gets the roll counts and returns it as a number
     * @returns the integer value of rollCount
     */
    getRollCount():number{
        return this.rollCount;
    }

    /**
     * adds or subtracts number to roll count
     * @param num integer to be added( or subtracted if negetive) to the roll count
     */
    addToRollCount(num:number){
        let currentRollCount:HTMLElement = document.getElementById("rollCount");
        this.rollCount += num;
        currentRollCount.innerText = "Roll Count: " + this.rollCount.toString() + " ";
    }

    /**
     * gets total points for player and returns it as an integer value
     * @returns integer representation of totalPoints
     */
    getTotalPoints():number{
        return this.totalPoints;
    }

    /**
     * adds points to total
     * @param turnPoints points to be added to total
     */
    addPointsToTotal(turnPoints:number){
        this.totalPoints += turnPoints;
    }

    /**
     * adds 25 points to player score
     */
    addFullHouse(){
        let currentScoreSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("fullHouse");
        let scoreSection:HTMLElement = currentScoreSections[game.getCurrentPlayer()];
        if((scoreSection).classList.contains("clickableTable")){
            scoreSection.innerText = "25";
        }

    }

    /**
     * adds 30 points to player score
     */
    addSmallStraight(){
        let currentScoreSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("smallStraight");
        let scoreSection:HTMLElement = currentScoreSections[game.getCurrentPlayer()];
        if((scoreSection).classList.contains("clickableTable")){
            scoreSection.innerText = "30";
        }
    }

    /**
     * adds 40 points to player score
     */
    addLargeStraightInHand(){
        let currentScoreSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("largeStraight");
        let scoreSection:HTMLElement = currentScoreSections[game.getCurrentPlayer()];
        if((scoreSection).classList.contains("clickableTable")){
            scoreSection.innerText = "40";
        }
    }

    /**
     * checks the hand for different combinations of possible scores
     */
    checkHand(currentPlayer:number, inPlay:Array<number>){
        this.displayChance();
        
        if(inPlay[0] != null && inPlay[1] != null && inPlay[2] != null && inPlay[3] != null && inPlay[4] != null  &&
            inPlay[0] != 0 && inPlay[1] != 0 && inPlay[2] != 0 && inPlay[3] != 0 && inPlay[4] != 0){
                let tempHand:Array<number> = new Array(5);
                for (let index = 0; index < inPlay.length; index++) {
                    tempHand[index] = inPlay[index];
                    
                } 
                tempHand = tempHand.sort();
            

            //checks for large straights
            this.checkForLargeStraight(tempHand);

            //checks for small straight
            this.checkForSmallStraight(tempHand);

            //checks for full house
            this.checkForFullHouse(tempHand);

            //checks for four of a kind
            this.checkForFourOfKind(tempHand, currentPlayer);

            //checks for three of a kind
            this.checkForThreeOfKind(tempHand, currentPlayer);

            //checks hands for possible of a kind hands for top portion of score board                
            this.checkForSimpleOfKinds(currentPlayer, tempHand); 
            
            //checks for yatzy
            this.checkForYatzy(tempHand);
        }
    }

    /**
     * checks for simple of a kinds for top portion of score card
     * @param currentPlayer curent player in play
     * @param tempHand sorted hand t be checked
     */
    private checkForSimpleOfKinds(currentPlayer: number, tempHand: number[]) {
        for (let index1 = 1; index1 < 7; index1++) {
            let tempClassName: string = "of" + (index1) + "s";
            let tempScore: number = 0;
            let currentScoreSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass(tempClassName);
            if (this.isClickable(currentScoreSections, currentPlayer)) {
                for (let index2 = 0; index2 < tempHand.length; index2++) {
                    if (tempHand[index2] == index1) {
                        tempScore += index1;
                    }
                    let textNode:string = "";
                    textNode = tempScore.toString();
                    currentScoreSections[currentPlayer].innerText = textNode;
                }
            }
        }
    }

    /**
     * checks for three of a kind in hand
     * @param tempHand sorted hand to be checked
     * @param currentPlayer current player in play
     */
    private checkForThreeOfKind(tempHand: number[], currentPlayer: number) {
        if (tempHand[0] == tempHand[1] && tempHand[1] == tempHand[2] ||
            tempHand[1] == tempHand[2] && tempHand[2] == tempHand[3] ||
            tempHand[2] == tempHand[3] && tempHand[3] == tempHand[4]) {
            let currentScoreSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("threeOfKind");
            if (this.isClickable(currentScoreSections, currentPlayer)) {
                let tempScore:number = 0;
                for (let index = 0; index < tempHand.length; index++) {
                    tempScore += tempHand[index];
                }
                let textNode:string = tempScore.toString();
                currentScoreSections[currentPlayer].innerText = textNode;
            }
        }
    }

    /**
     * checkes for four of a kind in hand
     * @param tempHand sorted hand to be checked
     * @param currentPlayer current player in play
     */
    private checkForFourOfKind(tempHand: number[], currentPlayer: number) {
        if (tempHand[0] == tempHand[1] && tempHand[1] == tempHand[2] && tempHand[2] == tempHand[3] ||
            tempHand[1] == tempHand[2] && tempHand[2] == tempHand[3] && tempHand[3] == tempHand[4]) {
            let currentScoreSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("fourOfKind");
            if (this.isClickable(currentScoreSections, currentPlayer)) {
                let tempScore:number = 0;
                for (let index = 0; index < tempHand.length; index++) {
                    tempScore += tempHand[index];
                }
                let textNode:string = tempScore.toString();
                currentScoreSections[currentPlayer].innerText = textNode;
            }
        }
    }

    /**
     * checks the hand for a full house
     * @param tempHand sorted hand to be cheked
     */
    private checkForFullHouse(tempHand: number[]) {
        if (tempHand[0] == tempHand[1] && tempHand[1] == tempHand[2] && tempHand[3] == tempHand[4] && tempHand[2] != tempHand[3] ||
            tempHand[0] == tempHand[1] && tempHand[2] == tempHand[3] && tempHand[3] == tempHand[4] && tempHand[1] != tempHand[2]) {
            this.addFullHouse();
        }
    }

    /**
     * checks the hand for a small straight
     * @param tempHand sorted hand to be checked
     */
    private checkForSmallStraight(tempHand: number[]) {
        if (tempHand[0] == tempHand[1] - 1 && tempHand[1] == tempHand[2] - 1 &&
            tempHand[2] == tempHand[3] - 1 ||// (1) (2) (3) (4) (?)
            tempHand[1] == tempHand[2] - 1 && tempHand[2] == tempHand[3] - 1 &&
            tempHand[3] == tempHand[4] - 1 || // (?) (1) (2) (3) (4) 
            tempHand[0] == tempHand[2] - 1 && tempHand[2] == tempHand[3] - 1 && 
            tempHand[3] == tempHand[4] - 1 ||// (1) (1/2) (2) (3) (4)
            tempHand[0] == tempHand[1] - 1 && tempHand[1] == tempHand[3] - 1 && 
            tempHand[3] == tempHand[4] - 1 ||// (1) (2) (2/3) (3) (4)
            tempHand[0] == tempHand[1] - 1 && tempHand[1] == tempHand[2] - 1 &&
            tempHand[2] == tempHand[4] - 1) {// (1) (2) (3) (3/4) (4)
            this.addSmallStraight();
        }
    }

    /**
     * checks the hand for a large straight
     * @param tempHand sorted hand to be checked
     */
    private checkForLargeStraight(tempHand: number[]) {
        if (tempHand[0] == tempHand[1] - 1 && tempHand[1] == tempHand[2]  -1 && 
            tempHand[2] == tempHand[3] - 1 && tempHand[3] && tempHand[3] == tempHand[4] - 1) {
            this.addLargeStraightInHand();
        }
    }

    /**
     * checks the hand for possible yatzys
     * @param tempHand sorted hand to be checked
     */
    private checkForYatzy(tempHand: number[]) {
        if (tempHand[0] == tempHand[1] && tempHand[1] == tempHand[2] && 
            tempHand[2] == tempHand[3] && tempHand[3] == tempHand[4] && 
            tempHand[0] != 0 && tempHand[1] != 0 && tempHand[2] != 0 && 
            tempHand[3] != 0 && tempHand[4] != 0 &&
            tempHand[0] != null && tempHand[1] != null && tempHand[2] != null && 
            tempHand[3] != null && tempHand[4] != null) {
            if (this.yatzyCount < 3) {
                let currentPlayer:number = game.getCurrentPlayer();
                let scoreSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("yatzy");
                this.yatzyCount += 1;
                let score:number = this.yatzyCount * 50;
                this.checkForJoker(scoreSections, currentPlayer, tempHand);
                if(this.hasNotBeenGivenUp(scoreSections, currentPlayer)){
                    let textNode:string = score.toString();
                scoreSections[currentPlayer].innerText = textNode;
                }
            }
        }
    }

    /**
     * checks if the score section has been given up too as "0" score
     * @param scoreSections scoreSection to be checked
     * @param currentPlayer current player in play
     */
    private hasNotBeenGivenUp(scoreSections: HTMLCollectionOf<HTMLElement>, currentPlayer: number) {
        return scoreSections[currentPlayer].innerText != "0";
    }

    /**
     * checks if joker is applicable
     * @param scoreSections score sections to be looked at
     * @param currentPlayer current player in play
     * @param tempHand sorted hand to be checked
     */
    private checkForJoker(scoreSections: HTMLCollectionOf<HTMLElement>, currentPlayer: number, tempHand: number[]) {
        let tempScore:string = "50";
        if (this.yatzyCount == 1) {
            if (this.hasNotBeenGivenUp(scoreSections, currentPlayer)) {
                addScoreToTotals(tempScore);
                scoreSections[currentPlayer].classList.remove("clickableTable");
            }
            else {
                this.displayJokers(tempHand, currentPlayer);
            }
            game.changePlayer();
        }
        else if (this.yatzyCount > 1) {
            if (this.hasNotBeenGivenUp(scoreSections, currentPlayer)) {
                addScoreToTotals(tempScore);
            }
            this.displayJokers(tempHand, currentPlayer);
        }
    }

    /**
     * displays possible jokers
     * @param tempHand sorted hand to be checked
     * @param currentPlayer current player in play
     */
    private displayJokers(tempHand: number[], currentPlayer: number) {
        let tempClassName:string = "of" + tempHand[1] + "s";
        let jokerScoreSection = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName(tempClassName);
        let tempValue:number = tempHand[1] * 5;
        if (this.isClickable(jokerScoreSection, currentPlayer)) {
            jokerScoreSection[currentPlayer].innerHTML = tempValue.toString();
            jokerScoreSection[currentPlayer].classList.remove("clickableTable");
            addScoreToTotals(tempValue.toString());
        }
        else {
            this.rollCount = 3;
            this.addFullHouse();
            this.addLargeStraightInHand();
            this.addSmallStraight();
        }
    }

    /**
     * checks if section is clickable
     * @param ScoreSection section to be checked
     * @param currentPlayer current player in play
     */
    private isClickable(ScoreSection: HTMLCollectionOf<Element>, currentPlayer: number) {
        return ScoreSection[currentPlayer].classList.contains("clickableTable");
    }

    /**
     * checks the top half of score board for the bonis sum amount
     */
    checkForSumBonus(){
        let sumSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("sum");
        let bonusSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("bonus");
        let currentPlayer:number = game.getCurrentPlayer();
        let playerSumSection:HTMLElement = sumSections[currentPlayer];
        let playerBonusSection:HTMLElement = bonusSections[currentPlayer];
        let tempSum:number = 0;
        if(playerBonusSection.innerHTML != "35"){
            for (let index2 = 1; index2 <= 6; index2++) {
                let tempClassName:string = "of" + (index2) + "s";
                let tempClasses = <HTMLCollectionOf<HTMLElement>>this.getElementByClass(tempClassName);
                let tempNumber:number = parseInt(tempClasses[currentPlayer].innerHTML);
                if(!(isNaN(tempNumber))){
                    tempSum += tempNumber;
                }
                playerSumSection.innerText = tempSum.toString();
                if(tempSum > 62){
                    playerBonusSection.innerHTML = "35";
                    addScoreToTotals("35");
                }
            }
        }
    
    }

    /**
     * displays the chance sectin of core bored is applicable
     */
    displayChance(){
        let chanceSections = <HTMLCollectionOf<HTMLElement>>this.getElementByClass("chance");
        for (let index = 1; index <= 2; index++) {
            if(this.isClickable(chanceSections, index)&& game.getCurrentPlayer() == index){
                let playerChanceSection:HTMLElement = chanceSections[index];
                let tempSum:number = 0;
                for (let index2 = 0; index2 < 5; index2++) {
                    tempSum += game.getDiceValue(index2);
                }
                playerChanceSection.innerHTML = tempSum.toString();
            }
        }
    }
    
    /**
     * returns objects in collection based on given class
     * @param elementClass class to retreive
     */
    getElementByClass(elementClass:string){
        return <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName(elementClass);
    }
}