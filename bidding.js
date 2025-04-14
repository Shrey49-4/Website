// Updated Bidding Logic: Time resets after every bid

let currentHighestBid = 0;
let bidCount = 0;
let bidHistory = [];
const botNames = ["Kurt Hansen", "Albert Wesker", "Joseph Stalin"];
const botMaxBid = 40000;
const minIncrement = 200;

const userName = "Saburo Arasaka";

let bidEndTime = Date.now() + 20000; // 20 seconds per bid

const highestBidEl = document.getElementById("highest-bid");
const bidCountEl = document.getElementById("bid-count");
const timerEl = document.getElementById("timer");
const bidForm = document.getElementById("bid-form");
const bidAmountInput = document.getElementById("bid-amount");
const bidFeedback = document.getElementById("bid-feedback");
const historyEntriesEl = document.getElementById("history-entries");
const winnerAnnouncement = document.getElementById("winner-announcement");
const winnerName = document.getElementById("winner-name");

function updateTimer() {
    const now = Date.now();
    const remainingTime = bidEndTime - now;

    if (remainingTime <= 0) {
        endAuction();
        return;
    }

    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);
    timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
}
setInterval(updateTimer, 1000);

bidForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const bidAmount = parseInt(bidAmountInput.value);

    if (bidAmount <= currentHighestBid) {
        bidFeedback.textContent = "Bid must be higher than the current highest bid!";
        bidFeedback.classList.remove("hidden");
        return;
    }

    const confirmBid = confirm(`Are you sure you want to place a bid of $${bidAmount}?`);
    if (confirmBid) {
        placeBid(userName, bidAmount);
        bidFeedback.classList.add("hidden");
        bidAmountInput.value = "";
    }
});

function placeBid(user, amount) {
    currentHighestBid = amount;
    bidCount++;
    bidHistory.unshift({
        user,
        amount,
        time: new Date().toLocaleTimeString(),
    });

    highestBidEl.textContent = `$${currentHighestBid}`;
    bidCountEl.textContent = bidCount;

    const row = document.createElement("tr");
    row.innerHTML = `<td>${user}</td><td>$${amount}</td><td>${bidHistory[0].time}</td>`;
    historyEntriesEl.prepend(row);

    bidEndTime = Date.now() + 20000; // reset timer to 20s after each bid
}

function endAuction() {
    bidForm.style.display = "none";
    winnerAnnouncement.classList.remove("hidden");
    winnerName.textContent = bidHistory.length ? bidHistory[0].user : "No Winner";

    if (bidHistory.length) {
        const winner = bidHistory[0];
        localStorage.setItem(
            "winnerData",
            JSON.stringify({
                name: winner.user,
                bid: winner.amount,
                time: winner.time,
            })
        );
    } else {
        localStorage.setItem(
            "winnerData",
            JSON.stringify({
                name: "No Winner",
                bid: 0,
                time: "N/A",
            })
        );
    }

    window.location.href = "winner.html";
}

function botBid() {
    if (currentHighestBid >= botMaxBid) return;

    const nextBid = currentHighestBid + minIncrement + Math.floor(Math.random() * 500);
    const botName = botNames[Math.floor(Math.random() * botNames.length)];

    if (nextBid <= botMaxBid) {
        placeBid(botName, nextBid);
    }
}

setInterval(() => {
    const timeLeft = bidEndTime - Date.now();
    if (timeLeft > 4000 && Math.random() > 0.5) {
        botBid();
    }
}, Math.random() * 7000 + 3000);
