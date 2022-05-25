
function sendDataLog(){
    let response = fetch('/login', {
        method: 'POST', 
        body: JSON.stringify({
            'email': document.querySelector('#log-email').value,
            'password': document.querySelector('#log-password').value,
            'cookies': document.cookie
        }),
        headers:{
            'Accept': 'application/json',
            'Content-Type':'application/json'
        }
    }).then(function(response){
        let error = response.status;
        console.log(error);
        if (error == 409){
            document.getElementById('log-error').innerText = '* login or password entered incorrectly'
            document.getElementById('log-error').style.display = 'block';
        }else if (error == 200){
            console.log(response)
            document.cookie = 'mail='+ document.querySelector('#log-email').value;
            window.location.href = '/';
        }
    }); 
};

document.querySelector('#log-form').onsubmit = function(event) {
    event.preventDefault();
    sendDataLog();
}
