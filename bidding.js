let currentHighestBid = 0;
let bidCount = 0;
let bidHistory = [];
const auctionEndTime = new Date().getTime() + 2 * 60 * 1000; 
const botNames = ["Kurt Hansen", "Albert Wesker", "Joseph Stalin"]; 
const botMaxBid = 40000; 
const minIncrement = 200; 


const userName = "Saburo Arasaka";


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
    
    const now = new Date().getTime();
    const remainingTime = auctionEndTime - now;

    if (remainingTime <= 0) {
        timerEl.textContent = "Auction Ended";
        bidForm.style.display = "none";
        winnerAnnouncement.classList.remove("hidden");
        winnerName.textContent = bidHistory.length ? bidHistory[0].user : "No Winner";
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
}

//botbid

function botBid() {
    if (currentHighestBid >= botMaxBid) return; 
    const nextBid = currentHighestBid + minIncrement + Math.floor(Math.random() * 500); 
    const botName = botNames[Math.floor(Math.random() * botNames.length)];

    if (nextBid <= botMaxBid) {
        placeBid(botName, nextBid);
    }
}

const botInterval = setInterval(botBid, Math.random() * 8000 + 12000); 

function updateTimer() {
    const now = new Date().getTime();
    const remainingTime = auctionEndTime - now;

    if (remainingTime <= 0) {

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
        return;
    }

    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);
    timerEl.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
}
