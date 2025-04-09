document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const enteredCode = document.getElementById("code").value;
    
    const correctCode = "191005"; 

    if (enteredCode === correctCode) {

        window.location.href = "account.html"; 
    } else {
    
        document.getElementById("error-message").style.display = "block";
    }
});