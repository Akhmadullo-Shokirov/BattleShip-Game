var view = {
    displayMessage : function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit : function(location) {
        var hit = document.getElementById(location);
        hit.setAttribute("class", "hit");
    },
    displayMiss : function(location) {
        var miss = document.getElementById(location);
        miss.setAttribute("class", "miss");
    }
};

var model = {

    boardSize : 7,
    numShips : 3,
    shipLength : 3,
    shipSunk : 0,
    
    ships : [
        {location : ["0", "0", "0"], hit : ["", "", ""]},
        {location : ["0", "0", "0"], hit : ["", "", ""]},
        {location : ["0", "0", "0"], hit : ["", "", ""]}
    ],

    fire : function(guess) {
        for(var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.location.indexOf(guess);
            if(index >= 0) {
                if(ship.hit[index] === "hit") {
                    view.displayMessage("You already hit that location!");
                } else {
                    view.displayHit(guess);
                    view.displayMessage("Hit!");
                    ship.hit[index] = "hit";
                    if(this.isSunk(ship)) {
                        this.shipSunk++;
                        view.displayMessage("You sunk my battleship");
                    }
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Missed!");
        return false;
    },
    
    isSunk : function(location) {
        for(var i = 0; i < this.shipLength; i++) {
            if(location.hit[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations : function() {
        var newShip = [];
        for(var i = 0; i < this.numShips; i++) {
            do{
                newShip = this.generateShip();
            }while(this.collision(newShip));
            this.ships[i].location = newShip;
        }
    },

    collision : function(ship) {
        for(var i = 0; i < this.numShips; i++) {
            var array = this.ships[i].location;
            for(var j = 0; j < ship.length; j++) {
                for(var k = 0; k < array.length; k++) {
                    if(array[j] === ship[k]) {
                        return true;
                    }
                }
                
            }
        }
        return false;
    },

    generateShip : function() {

        var direction = Math.floor(Math.random() * 2);
        var newLocation = [];
        var row, col;
        if(direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        for(var i = 0; i < this.shipLength; i++) {
            if(direction === 1) {
                newLocation.push(row + "" + (col + i));
            } else {
                newLocation.push((row + i) + "" + col);
            }
        }
        return newLocation;
    }
};

var controller = {
    guesses : 0,

    parseShipLocations : function(guess) {
        
        var location = parseGuess(guess);
        if(location !== null) {
            var hit = model.fire(location);
            this.guesses++;
            if(hit && model.shipSunk === model.numShips) {
                view.displayMessage("You sank all my BattleShips with " + this.guesses + " guesses!");
                winnerPopUp();
            }
        }
    }
};

function parseGuess(guess) {

    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    var letter = alphabet.indexOf(guess.charAt(0));
    var number = guess.charAt(1);
    if(guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board!");
    } else if(letter < 0 || letter >= model.boardSize || number < 0 || number >= model.boardSize) {
        alert("Oops, that's off the board!");
    } else if(isNaN(guess.charAt(1))) {
        alert("Oops, enter a letter and a number on the board!");
    } else {
        return letter + number;
    } 
    return null;
}

function handleInput() {
    var input = document.getElementById("guessInput");
    var value = input.value.toUpperCase();
    controller.parseShipLocations(value);
    input.value = "";
}

function init() {
    setTimeout(() => {
        var info = document.getElementById("info");
        info.classList.add("show");
    }, 500);
    var btn = document.getElementById("start");
    btn.addEventListener("click", () => {
        var info = document.getElementById("info");
        info.classList.remove("show");
    });
    model.generateShipLocations();
    var input = document.getElementById("guessInput");
    input.addEventListener("keydown", handleKeyPress);
    var close = document.getElementById("close");
    close.addEventListener("click", closeVideo);
}



function handleKeyPress(e) {
    if(e.keyCode === 13) {
        document.getElementById("fireButton").click();
        e.preventDefault();
    }    
}

function winnerPopUp() {
    var modal = document.getElementById("modal-container");
    modal.classList.add("show");
    var winner = document.getElementById("winner");
    winner.setAttribute("src", "https://www.youtube.com/embed/gQljjskKsYw?autoplay=1");
}

function closeVideo() {
    var modal = document.getElementById("modal-container");
    modal.classList.remove("show");
    var winner = document.getElementById("winner");
    winner.setAttribute("src", "https://www.youtube.com/embed/gQljjskKsYwautoplay=1");
    window.location.reload();
}

window.onload = init;