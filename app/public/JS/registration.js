function sendData(){
    let response = fetch('/registration', {
        method: 'POST', 
        body: JSON.stringify({
            'email': document.querySelector('#email').value,
            'password': document.querySelector('#password').value,
            'name': document.querySelector('#name').value,
            'secondName': document.querySelector('#secondName').value,
            'birthday': document.querySelector('#birthday').value,
        }),
        headers:{
            'Accept': 'application/json',
            'Content-Type':'application/json'
        }
    }).then(function(response){
        let error = response.status;
        console.log(error);
        if (error == 409){
            document.getElementById('error').innerText = '* this e-mail is already in use'
            document.getElementById('error').style.display = 'block';
        } else if(error == 400){
            document.getElementById('error').innerText = '* fill in all the registration fields'
            document.getElementById('error').style.display = 'block';
        } else if(error == 200){
            document.getElementById("regDiv").style.display = 'none';
            document.getElementById("loginDiv").style.display = 'flex';
        } 
    });
};

document.querySelector('#reg-form').onsubmit = function(event) {
    event.preventDefault();
    sendData();
}

































// window.onload = function(){
//     console.log(123);
//     let submit = document.getElementById('submit');
//     var email, pass, name, secName, birth;
//     submit.onclick = function(){
//         email = document.getElementsByName('email')[0].value;
//         pass = document.getElementsByName('password')[0].value;
//         name = document.getElementsByName('name')[0].value;
//         secName = document.getElementsByName('secondName')[0].value;
//         birth = document.getElementsByName('birthday')[0].value;
//         $.post("http://localhost:8000/registration",
//         {email: email, pass: pass, name: name, secName: secName, birth: birth}, 
//         function(data){
//            console.log(data);
//         });

//     };
// };