function getComputerChoice() {
    const choices = ["Rock", "Paper", "Scissors"];
    return choices[Math.floor(Math.random() * choices.length)];
}
function getPlayerChoice() {
    const playerChoice = prompt("Enter your choice: Rock, Paper, or Scissors");
    return playerChoice.toLowerCase();
}
function playRound(playerChoice, computerChoice) {
    // Convert both to lowercase to make the comparison case-insensitive
    const player = playerChoice.toLowerCase();
    const computer = computerChoice.toLowerCase();

    if (player === computer) {
        return "It's a tie!";
    } else if (player === "rock" && computer === "scissors") {
        return "You win!";
    } else if (player === "scissors" && computer === "paper") {
        return "You win!";
    } else if (player === "paper" && computer === "rock") {
        return "You win!";
    } else {
        return "You lose!";
    }
}
function game() {
    let playerScore = 0;
    let computerScore = 0;

    for (let i = 0; i < 5; i++) {
        const playerChoice = getPlayerChoice();

        // Handle if user clicks cancel
        if (!playerChoice) {
            alert("Game cancelled!");
            return;
        }

        const computerChoice = getComputerChoice();
        const roundResult = playRound(playerChoice, computerChoice);

        if (roundResult === "You win!") {
            playerScore++;
        } else if (roundResult === "You lose!") {
            computerScore++;
        }

        alert(`Round ${i + 1}:\nYou chose: ${playerChoice}\nComputer chose: ${computerChoice}\n\n${roundResult}\n\nCurrent Score -> You: ${playerScore} | Computer: ${computerScore}`);
    }

    if (playerScore > computerScore) {
        alert(`Game Over! You won the game ${playerScore} to ${computerScore}! 🎉`);
    } else if (computerScore > playerScore) {
        alert(`Game Over! You lost the game ${computerScore} to ${playerScore}. 😢`);
    } else {
        alert(`Game Over! It was a tie, ${playerScore} to ${computerScore}.`);
    }
}
game(); 
