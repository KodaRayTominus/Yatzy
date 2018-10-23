let game:YatzyGame;

//grabs score card
let currentScoreSections = document.getElementsByTagName("td");

//on clicks for optional score sections
for (let index = 0; index < currentScoreSections.length; index++) {
    let scoreSection = <HTMLTableDataCellElement>currentScoreSections[index];
    scoreSection.onclick = function(){
        //checks if slot has been used and if the player has even rolled
        //as well that the slot belongs to the current player
        if(hasNotBeenUsed(scoreSection) && game.getCurrentPlayerTurnCount() > 0 && 
            (game.getCurrentPlayer() == 1 && index % 2 == 0 || 
             game.getCurrentPlayer() == 2 && index % 2 == 1)){
            //grabs string of inner text for safe keeping
            let tempScore:string = scoreSection.innerHTML;
            //checks for valid values
            if(isNotValidScore(tempScore)){
                tempScore = "0";
            }
            scoreSection.innerText = tempScore;
            scoreSection.classList.remove("clickableTable");
            addScoreToTotals(tempScore);
            game.changePlayer();
        }
    };
}

/**
 * assd the temps score into the total score for the active player
 * @param tempScore temparary score to be stored into total
 */
function addScoreToTotals(tempScore: string) {
    let totals:HTMLCollectionOf<Element> = document.getElementsByClassName("totalScore");
    let player1Total:Element = totals[1];
    let player2Total:Element = totals[2];
    if (game.getCurrentPlayer() == 1) {
        game.player1.addPointsToTotal(parseInt(tempScore));
        player1Total.innerHTML = game.player1.getTotalPoints().toString();
    }
    else {
        game.player2.addPointsToTotal(parseInt(tempScore));
        player2Total.innerHTML = game.player2.getTotalPoints().toString();
    }
}

/**
 * checks if game is over or not
 * returns true if game is not over
 */
function gameIsNotOver():boolean{
    //flag for storing any occurances where the game could continue
    let flag:number = 0;

    for (let index = 0; index < currentScoreSections.length; index++) {
        let currentInnerText:string = currentScoreSections[index].innerHTML;
        if(hasNotBeenUsed(currentScoreSections[index])){
            flag++;
        }
    }
    if(flag > 0){
        return true;
    }
    return false;
}

/**
 * checks if the temp scor eis a valid score
 * @param tempScore score to be checked
 */
function isNotValidScore(tempScore: string) {
    return tempScore == null || tempScore == "";
}

/**
 * checks if score section has been used or not
 * @param scoreSection score section to be checked
 */
function hasNotBeenUsed(scoreSection: HTMLTableDataCellElement) {
    return scoreSection.classList.contains("clickableTable");
}

//window onload function
window.onload = function(){
    game = new YatzyGame();
    let player1 = <HTMLElement>document.getElementById("player1");
    player1.setAttribute("class", "currentPlayer");

    //game.rollAllDice();

    let gameBoard:HTMLElement = <HTMLElement>document.getElementById("gameBoard");
    //roll dice function call
    let button = <HTMLInputElement>document.getElementById("rollDiceButton");
    button.onclick = function(){
        if(gameIsNotOver()){
            button.disabled = true;
            setTimeout(function() {
                button.disabled = false;
            }, 950);
            if(game.getCurrentPlayerTurnCount() < 3 && !game.isTurnOver()){
                game.clearUnusedScores(currentScoreSections);
                game.rollAllDice();
                if(game.gameInPlay){
                    game.updateScoreBoard();
                } 
            } else if(game.getCurrentPlayerTurnCount() == 3 && !game.isTurnOver()){
                alert("pick a score!");
            }
        }
        
        let dice = [];
        
        //on clicks for holding and releasing die.
        for (let index = 1; index < 6; index++) {
            dice[index] = <HTMLDivElement>document.getElementById("dice" + (index));
            dice[index].onclick = function(){ 
                if(game.isInPlayersHand(index) && game.gameInPlay()){
                    game.moveDie(index);
                    this.style.top = "40%";
                } else if (game.gameInPlay()){
                    game.moveDie(index);
                    this.style.top = "60%";

                }
            }
        } 
    }   
}
    
    


