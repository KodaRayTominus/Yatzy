class DiceFace extends HTMLElement {
    constructor() {
        super();
        this.setAttribute("class", "dice-face");
    }
}
customElements.define('dice-face', DiceFace);
class DiceSixSided extends HTMLElement {
    constructor() {
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
    moveDice() {
        if (this.inHand == true) {
            this.inHand = false;
        }
        else {
            this.inHand = true;
        }
    }
    isInHand() {
        return this.inHand;
    }
    rollDice() {
        let face = document.getElementsByClassName("dice-face");
        for (let fIt = 0; fIt < face.length; fIt++) {
            face[fIt].style.backgroundColor = "white";
        }
        let randFace = Math.round(Math.random() * 5);
        let topLocation = this.getStyle(this, 'top');
        let startLocation = "592.188px";
        this.style.top = (topLocation == startLocation) ? "40%" : "40%";
        this.style.transform = "rotate3d(1, 0, 0, " + Math.random() * 360 +
            "deg) rotate3d(0, 1, 0, " + Math.random() * 360 +
            "deg) rotate3d(0, 0, 1, " + Math.random() * 360 +
            "deg)";
        setTimeout(this.timeOut(randFace), 900);
        return randFace;
    }
    getStyle(el, prop) {
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    }
    timeOut(randFace) {
        this.style.transform = this.faceRot[randFace];
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
customElements.define('dice-six-sided', DiceSixSided);
class YatzyGame {
    constructor() {
        this.inPlay = new Array(5);
        this.turnOver = false;
        this.player1 = new GamePlayer();
        this.player2 = new GamePlayer();
        this.gameTotalPlayer1 = 0;
        this.gameTotalPlayer2 = 0;
        this.currentPlayer = 1;
        this.gameState = "finished";
        let gameBoard = document.getElementById("diceTable");
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
    resetTurn() {
        this.turnOver = false;
    }
    setTurnOver() {
        this.turnOver = true;
    }
    isTurnOver() {
        return this.turnOver;
    }
    rollAllDice() {
        if (this.currentPlayer == 1) {
            if (this.player1.getRollCount() < 3) {
                this.theRoll();
                this.increaseRollCount();
            }
            else {
                this.increaseRollCount();
            }
        }
        else {
            if (this.player2.getRollCount() < 3) {
                this.theRoll();
                this.increaseRollCount();
            }
            else {
                this.increaseRollCount();
            }
        }
    }
    displayCurrentPlayer(playerId) {
        let currentPlayer = (document.getElementById(playerId));
        currentPlayer.setAttribute("class", "currentPlayer");
    }
    theRoll() {
        for (let index = 0; index < 5; index++) {
            let currentDice = document.getElementById("dice" + (index + 1));
            if (!currentDice.isInHand()) {
                let currentDiceValue = currentDice.rollDice();
                this.inPlay[index] = currentDiceValue + 1;
            }
        }
    }
    increaseRollCount() {
        if (this.currentPlayer == 1) {
            this.player1.addToRollCount(1);
        }
        else {
            this.player2.addToRollCount(1);
        }
    }
    resetDice() {
        for (let index = 1; index < 6; index++) {
            let currentDice = this.getDie(index);
            currentDice.style.top = "40%";
            if (this.isInPlayersHand(index)) {
                currentDice.moveDice();
            }
        }
        this.theRoll();
    }
    moveDie(diceNumber) {
        let currentDice = this.getDie(diceNumber);
        currentDice.moveDice();
    }
    getDie(diceNumber) {
        let tempClassName = "dice" + diceNumber;
        let currentDice = document.getElementById(tempClassName);
        return currentDice;
    }
    isInPlayersHand(diceNumber) {
        let currentDice = this.getDie(diceNumber);
        return currentDice.isInHand();
    }
    gameInPlay() {
        return (this.player1.getRollCount() < 4 && this.player2.getRollCount() < 4) &&
            (this.player1.getRollCount() > 0 || this.player2.getRollCount() > 0);
    }
    updateScoreBoard() {
        if (this.currentPlayer == 1) {
            if (this.player1.getRollCount() == 4) {
                this.changePlayer();
            }
            else {
                this.player1.checkHand(1, this.inPlay);
            }
        }
        else {
            if (this.player2.getRollCount() == 4) {
                this.changePlayer();
            }
            else {
                this.player2.checkHand(2, this.inPlay);
            }
        }
    }
    changePlayer() {
        let currentScoreSections = document.getElementsByTagName("td");
        this.clearUnusedScores(currentScoreSections);
        let newPlayerNum = 0;
        if (this.currentPlayer == 1) {
            newPlayerNum = 2;
            this.player1.checkForSumBonus();
            this.player1.addToRollCount(0 - this.getCurrentPlayerTurnCount());
            let player1Tag = document.getElementById("player1");
            player1Tag.classList.remove("currentPlayer");
            this.resetDice();
        }
        else {
            newPlayerNum = 1;
            this.player2.checkForSumBonus();
            this.player2.addToRollCount(0 - this.getCurrentPlayerTurnCount());
            let player2Tag = document.getElementById("player2");
            player2Tag.classList.remove("currentPlayer");
            this.resetDice();
        }
        this.currentPlayer = newPlayerNum;
        this.displayCurrentPlayer("player" + newPlayerNum);
    }
    clearUnusedScores(currentScoreSections) {
        for (let index2 = 0; index2 < currentScoreSections.length; index2++) {
            if (hasNotBeenUsed(currentScoreSections[index2])) {
                currentScoreSections[index2].innerText = "";
            }
        }
    }
    getCurrentPlayerTurnCount() {
        if (this.getCurrentPlayer() == 1) {
            return this.player1.getRollCount();
        }
        else {
            return this.player2.getRollCount();
        }
    }
    getCurrentPlayer() {
        return this.currentPlayer;
    }
    getDiceValue(dieNum) {
        return this.inPlay[dieNum];
    }
}
class GamePlayer {
    constructor() {
        this.heldDie = [];
        this.totalPoints = 0;
        this.rollCount = 0;
        this.yatzyCount = 0;
    }
    getRollCount() {
        return this.rollCount;
    }
    addToRollCount(num) {
        let currentRollCount = document.getElementById("rollCount");
        this.rollCount += num;
        currentRollCount.innerText = "Roll Count: " + this.rollCount.toString() + " ";
    }
    getTotalPoints() {
        return this.totalPoints;
    }
    addPointsToTotal(turnPoints) {
        this.totalPoints += turnPoints;
    }
    addFullHouse() {
        let currentScoreSections = this.getElementByClass("fullHouse");
        let scoreSection = currentScoreSections[game.getCurrentPlayer()];
        if ((scoreSection).classList.contains("clickableTable")) {
            scoreSection.innerText = "25";
        }
    }
    addSmallStraight() {
        let currentScoreSections = this.getElementByClass("smallStraight");
        let scoreSection = currentScoreSections[game.getCurrentPlayer()];
        if ((scoreSection).classList.contains("clickableTable")) {
            scoreSection.innerText = "30";
        }
    }
    addLargeStraightInHand() {
        let currentScoreSections = this.getElementByClass("largeStraight");
        let scoreSection = currentScoreSections[game.getCurrentPlayer()];
        if ((scoreSection).classList.contains("clickableTable")) {
            scoreSection.innerText = "40";
        }
    }
    checkHand(currentPlayer, inPlay) {
        this.displayChance();
        if (inPlay[0] != null && inPlay[1] != null && inPlay[2] != null && inPlay[3] != null && inPlay[4] != null &&
            inPlay[0] != 0 && inPlay[1] != 0 && inPlay[2] != 0 && inPlay[3] != 0 && inPlay[4] != 0) {
            let tempHand = new Array(5);
            for (let index = 0; index < inPlay.length; index++) {
                tempHand[index] = inPlay[index];
            }
            tempHand = tempHand.sort();
            this.checkForLargeStraight(tempHand);
            this.checkForSmallStraight(tempHand);
            this.checkForFullHouse(tempHand);
            this.checkForFourOfKind(tempHand, currentPlayer);
            this.checkForThreeOfKind(tempHand, currentPlayer);
            this.checkForSimpleOfKinds(currentPlayer, tempHand);
            this.checkForYatzy(tempHand);
        }
    }
    checkForSimpleOfKinds(currentPlayer, tempHand) {
        for (let index1 = 1; index1 < 7; index1++) {
            let tempClassName = "of" + (index1) + "s";
            let tempScore = 0;
            let currentScoreSections = this.getElementByClass(tempClassName);
            if (this.isClickable(currentScoreSections, currentPlayer)) {
                for (let index2 = 0; index2 < tempHand.length; index2++) {
                    if (tempHand[index2] == index1) {
                        tempScore += index1;
                    }
                    let textNode = "";
                    textNode = tempScore.toString();
                    currentScoreSections[currentPlayer].innerText = textNode;
                }
            }
        }
    }
    checkForThreeOfKind(tempHand, currentPlayer) {
        if (tempHand[0] == tempHand[1] && tempHand[1] == tempHand[2] ||
            tempHand[1] == tempHand[2] && tempHand[2] == tempHand[3] ||
            tempHand[2] == tempHand[3] && tempHand[3] == tempHand[4]) {
            let currentScoreSections = this.getElementByClass("threeOfKind");
            if (this.isClickable(currentScoreSections, currentPlayer)) {
                let tempScore = 0;
                for (let index = 0; index < tempHand.length; index++) {
                    tempScore += tempHand[index];
                }
                let textNode = tempScore.toString();
                currentScoreSections[currentPlayer].innerText = textNode;
            }
        }
    }
    checkForFourOfKind(tempHand, currentPlayer) {
        if (tempHand[0] == tempHand[1] && tempHand[1] == tempHand[2] && tempHand[2] == tempHand[3] ||
            tempHand[1] == tempHand[2] && tempHand[2] == tempHand[3] && tempHand[3] == tempHand[4]) {
            let currentScoreSections = this.getElementByClass("fourOfKind");
            if (this.isClickable(currentScoreSections, currentPlayer)) {
                let tempScore = 0;
                for (let index = 0; index < tempHand.length; index++) {
                    tempScore += tempHand[index];
                }
                let textNode = tempScore.toString();
                currentScoreSections[currentPlayer].innerText = textNode;
            }
        }
    }
    checkForFullHouse(tempHand) {
        if (tempHand[0] == tempHand[1] && tempHand[1] == tempHand[2] && tempHand[3] == tempHand[4] && tempHand[2] != tempHand[3] ||
            tempHand[0] == tempHand[1] && tempHand[2] == tempHand[3] && tempHand[3] == tempHand[4] && tempHand[1] != tempHand[2]) {
            this.addFullHouse();
        }
    }
    checkForSmallStraight(tempHand) {
        if (tempHand[0] == tempHand[1] - 1 && tempHand[1] == tempHand[2] - 1 &&
            tempHand[2] == tempHand[3] - 1 ||
            tempHand[1] == tempHand[2] - 1 && tempHand[2] == tempHand[3] - 1 &&
                tempHand[3] == tempHand[4] - 1 ||
            tempHand[0] == tempHand[2] - 1 && tempHand[2] == tempHand[3] - 1 &&
                tempHand[3] == tempHand[4] - 1 ||
            tempHand[0] == tempHand[1] - 1 && tempHand[1] == tempHand[3] - 1 &&
                tempHand[3] == tempHand[4] - 1 ||
            tempHand[0] == tempHand[1] - 1 && tempHand[1] == tempHand[2] - 1 &&
                tempHand[2] == tempHand[4] - 1) {
            this.addSmallStraight();
        }
    }
    checkForLargeStraight(tempHand) {
        if (tempHand[0] == tempHand[1] - 1 && tempHand[1] == tempHand[2] - 1 &&
            tempHand[2] == tempHand[3] - 1 && tempHand[3] && tempHand[3] == tempHand[4] - 1) {
            this.addLargeStraightInHand();
        }
    }
    checkForYatzy(tempHand) {
        if (tempHand[0] == tempHand[1] && tempHand[1] == tempHand[2] &&
            tempHand[2] == tempHand[3] && tempHand[3] == tempHand[4] &&
            tempHand[0] != 0 && tempHand[1] != 0 && tempHand[2] != 0 &&
            tempHand[3] != 0 && tempHand[4] != 0 &&
            tempHand[0] != null && tempHand[1] != null && tempHand[2] != null &&
            tempHand[3] != null && tempHand[4] != null) {
            if (this.yatzyCount < 3) {
                let currentPlayer = game.getCurrentPlayer();
                let scoreSections = this.getElementByClass("yatzy");
                this.yatzyCount += 1;
                let score = this.yatzyCount * 50;
                this.checkForJoker(scoreSections, currentPlayer, tempHand);
                if (this.hasNotBeenGivenUp(scoreSections, currentPlayer)) {
                    let textNode = score.toString();
                    scoreSections[currentPlayer].innerText = textNode;
                }
            }
        }
    }
    hasNotBeenGivenUp(scoreSections, currentPlayer) {
        return scoreSections[currentPlayer].innerText != "0";
    }
    checkForJoker(scoreSections, currentPlayer, tempHand) {
        let tempScore = "50";
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
    displayJokers(tempHand, currentPlayer) {
        let tempClassName = "of" + tempHand[1] + "s";
        let jokerScoreSection = document.getElementsByClassName(tempClassName);
        let tempValue = tempHand[1] * 5;
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
    isClickable(ScoreSection, currentPlayer) {
        return ScoreSection[currentPlayer].classList.contains("clickableTable");
    }
    checkForSumBonus() {
        let sumSections = this.getElementByClass("sum");
        let bonusSections = this.getElementByClass("bonus");
        let currentPlayer = game.getCurrentPlayer();
        let playerSumSection = sumSections[currentPlayer];
        let playerBonusSection = bonusSections[currentPlayer];
        let tempSum = 0;
        if (playerBonusSection.innerHTML != "35") {
            for (let index2 = 1; index2 <= 6; index2++) {
                let tempClassName = "of" + (index2) + "s";
                let tempClasses = this.getElementByClass(tempClassName);
                let tempNumber = parseInt(tempClasses[currentPlayer].innerHTML);
                if (!(isNaN(tempNumber))) {
                    tempSum += tempNumber;
                }
                playerSumSection.innerText = tempSum.toString();
                if (tempSum > 62) {
                    playerBonusSection.innerHTML = "35";
                    addScoreToTotals("35");
                }
            }
        }
    }
    displayChance() {
        let chanceSections = this.getElementByClass("chance");
        for (let index = 1; index <= 2; index++) {
            if (this.isClickable(chanceSections, index) && game.getCurrentPlayer() == index) {
                let playerChanceSection = chanceSections[index];
                let tempSum = 0;
                for (let index2 = 0; index2 < 5; index2++) {
                    tempSum += game.getDiceValue(index2);
                }
                playerChanceSection.innerHTML = tempSum.toString();
            }
        }
    }
    getElementByClass(elementClass) {
        return document.getElementsByClassName(elementClass);
    }
}
let game;
let currentScoreSections = document.getElementsByTagName("td");
for (let index = 0; index < currentScoreSections.length; index++) {
    let scoreSection = currentScoreSections[index];
    scoreSection.onclick = function () {
        if (hasNotBeenUsed(scoreSection) && game.getCurrentPlayerTurnCount() > 0 &&
            (game.getCurrentPlayer() == 1 && index % 2 == 0 ||
                game.getCurrentPlayer() == 2 && index % 2 == 1)) {
            let tempScore = scoreSection.innerHTML;
            if (isNotValidScore(tempScore)) {
                tempScore = "0";
            }
            scoreSection.innerText = tempScore;
            scoreSection.classList.remove("clickableTable");
            addScoreToTotals(tempScore);
            game.changePlayer();
        }
    };
}
function addScoreToTotals(tempScore) {
    let totals = document.getElementsByClassName("totalScore");
    let player1Total = totals[1];
    let player2Total = totals[2];
    if (game.getCurrentPlayer() == 1) {
        game.player1.addPointsToTotal(parseInt(tempScore));
        player1Total.innerHTML = game.player1.getTotalPoints().toString();
    }
    else {
        game.player2.addPointsToTotal(parseInt(tempScore));
        player2Total.innerHTML = game.player2.getTotalPoints().toString();
    }
}
function gameIsNotOver() {
    let flag = 0;
    for (let index = 0; index < currentScoreSections.length; index++) {
        let currentInnerText = currentScoreSections[index].innerHTML;
        if (hasNotBeenUsed(currentScoreSections[index])) {
            flag++;
        }
    }
    if (flag > 0) {
        return true;
    }
    return false;
}
function isNotValidScore(tempScore) {
    return tempScore == null || tempScore == "";
}
function hasNotBeenUsed(scoreSection) {
    return scoreSection.classList.contains("clickableTable");
}
window.onload = function () {
    game = new YatzyGame();
    let player1 = document.getElementById("player1");
    player1.setAttribute("class", "currentPlayer");
    let gameBoard = document.getElementById("gameBoard");
    let button = document.getElementById("rollDiceButton");
    button.onclick = function () {
        if (gameIsNotOver()) {
            button.disabled = true;
            setTimeout(function () {
                button.disabled = false;
            }, 950);
            if (game.getCurrentPlayerTurnCount() < 3 && !game.isTurnOver()) {
                game.clearUnusedScores(currentScoreSections);
                game.rollAllDice();
                if (game.gameInPlay) {
                    game.updateScoreBoard();
                }
            }
            else if (game.getCurrentPlayerTurnCount() == 3 && !game.isTurnOver()) {
                alert("pick a score!");
            }
        }
        let dice = [];
        for (let index = 1; index < 6; index++) {
            dice[index] = document.getElementById("dice" + (index));
            dice[index].onclick = function () {
                if (game.isInPlayersHand(index) && game.gameInPlay()) {
                    game.moveDie(index);
                    this.style.top = "40%";
                }
                else if (game.gameInPlay()) {
                    game.moveDie(index);
                    this.style.top = "60%";
                }
            };
        }
    };
};
