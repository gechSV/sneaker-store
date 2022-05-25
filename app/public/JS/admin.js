function openEditForm(){
    document.getElementById('winEdit').style.display = 'block'
}

function closeEditForm(){
    document.getElementById('winEdit').style.display = 'none'
}

var nowId;

function openEditFormE(id){
    document.getElementById('winEditE').style.display = 'block'
    nowId = id;
    document.getElementById('nameE').value = document.getElementById('name'+id).innerText;
    document.getElementById('brandE').value = document.getElementById('brand'+id).innerText;
    document.getElementById('categoryE').value = document.getElementById('category'+id).innerText;
    document.getElementById('sexE').value = document.getElementById('sex'+id).innerText;
    document.getElementById('descripE').value = document.getElementById('description'+id).innerText;
    document.getElementById('mainImgE').value = document.getElementById('image'+id).innerText;
    document.getElementById('priceE').value = document.getElementById('price'+id).innerText;
    document.getElementById('img1E').value = document.getElementById('img1'+id).innerText;
    document.getElementById('img2E').value = document.getElementById('img2'+id).innerText;
    document.getElementById('img3E').value = document.getElementById('img3'+id).innerText;
    document.getElementById('img4E').value = document.getElementById('img4'+id).innerText;
    document.getElementById('imgCartE').value = document.getElementById('imgCart'+id).innerText; 
}

function closeEditFormE(){
    document.getElementById('winEditE').style.display = 'none'
}

function setDBItem(){
    let id = document.getElementById('id');
    let name = document.getElementById('name');
    let brand = document.getElementById('brand');
    let category = document.getElementById('category');
    let sex = document.getElementById('sex');
    let description= document.getElementById('descrip');
    let mainImg = document.getElementById('mainImg');
    let price = document.getElementById('price');
    let image1 = document.getElementById('img1');
    let image2 = document.getElementById('img2');
    let image3 = document.getElementById('img3');
    let image4 = document.getElementById('img4');
    let imageCart= document.getElementById('imgCart');

    if(id.value.trim().length && name.value.trim().length && brand.value.trim().length && category.value.trim().length
        && sex.value.trim().length  && description.value.trim().length
        && image1.value.trim().length && image2.value.trim().length 
        && image3.value.trim().length && image4.value.trim().length 
        && imageCart.value.trim().length && mainImg.value.trim().length 
        && price.value.trim().length)
    {
        console.log('good')
        let response = fetch('/addGoodsAdmin', {
            method: 'POST', 
            body: JSON.stringify({
                'id': id.value,
                'name': name.value,
                'brand': brand.value,
                'category': category.value,
                'sex': sex.value,
                'description': description.value,
                'mainImg': mainImg.value,
                'price': price.value,
                'img1': image1.value,
                'img2': image2.value,
                'img3': image3.value,
                'img4': image4.value,
                'imgCart': imageCart.value
            }),
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            }
        }).then(function(response){
            let error = response.status;
            console.log(error);
            if (error == 200){
                location.reload();
            }
        });
    } 
    else 
    {
        console.log('bad')
    }
}


function deleteGoods(id){
    console.log(id);
    let response = fetch('/deleteGoodsAdmin', {
        method: 'POST', 
        body: JSON.stringify({
            'id': id
        }),
        headers:{
            'Accept': 'application/json',
            'Content-Type':'application/json'
        }
    }).then(function(response){
        let error = response.status;
        console.log(error);
        if (error == 200){
                location.reload();
            }
    });
}

function editDBItem(){
    let name = document.getElementById('nameE');
    let brand = document.getElementById('brandE');
    let category = document.getElementById('categoryE');
    let sex = document.getElementById('sexE');
    let description= document.getElementById('descripE');
    let mainImg = document.getElementById('mainImgE');
    let price = document.getElementById('priceE');
    let image1 = document.getElementById('img1E');
    let image2 = document.getElementById('img2E');
    let image3 = document.getElementById('img3E');
    let image4 = document.getElementById('img4E');
    let imageCart= document.getElementById('imgCartE');

    if(name.value.trim().length && brand.value.trim().length && category.value.trim().length
        && sex.value.trim().length  && description.value.trim().length
        && image1.value.trim().length && image2.value.trim().length 
        && image3.value.trim().length && image4.value.trim().length 
        && imageCart.value.trim().length && mainImg.value.trim().length 
        && price.value.trim().length)
    {
        console.log('good')
        let response = fetch('/editGoodsAdmin', {
            method: 'POST', 
            body: JSON.stringify({
                'id': nowId,
                'name': name.value,
                'brand': brand.value,
                'category': category.value,
                'sex': sex.value,
                'description': description.value,
                'mainImg': mainImg.value,
                'price': price.value,
                'img1': image1.value,
                'img2': image2.value,
                'img3': image3.value,
                'img4': image4.value,
                'imgCart': imageCart.value
            }),
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            }
        }).then(function(response){
            let error = response.status;
            console.log(error);
            if (error == 200){
                location.reload();
            }
        });
    } 
    else 
    {
        console.log('bad')
    }

}