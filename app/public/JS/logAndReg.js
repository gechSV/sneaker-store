let loginCon = document.getElementById("loginDiv");
let regCon = document.getElementById("regDiv");

function openLogWin() {
    regCon.style.display = "none";
    loginCon.style.display = "flex";
}

function openRegWin() {
    loginCon.style.display = "none";
    regCon.style.display = "flex";
}

function closeRegLog() {
    loginCon.style.display = "none";
    regCon.style.display = "none";
}