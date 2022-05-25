function openSizeList(flag){
    let con = document.getElementById('sizeListCon');
    let buttonUp = document.getElementById('buttonSizeUp');
    let buttonDown = document.getElementById('buttonSizeDown');
    if(flag == 1){
        buttonDown.style.display = 'none';
        con.style.display = 'block';
    }
    else 
    {
        buttonDown.style.display = 'block';
        con.style.display = 'none';
    }
} 

let pressFlag ='0';

function choseASize(size){
    if (pressFlag != '0'){
        let button = document.getElementById('sz'+ pressFlag);
        button.style.color = '#191919';
        pressFlag = size;
    }
    else
    {
        pressFlag = size;
    } 

    button = document.getElementById('sz'+ size);
    button.style.color = '#EC8100';
}


function cartAdd(id){
    console.log(id);
    let response = fetch('/setGoodsCart', {
        method: 'POST', 
        body: JSON.stringify({
            'size': pressFlag,
            'id': id,
            'cookies': document.cookie
        }),
        headers:{
            'Accept': 'application/json',
            'Content-Type':'application/json'
        }
    }).then(function(response){
        let error = response.status;
        console.log(error);
        if(error == 401){
            let loginCon = document.getElementById("loginDiv");
            loginCon.style.display = 'block';
        }
        else if (error == 409)
        {
            console.log('Error 409');
        }
        
    }); 
};

