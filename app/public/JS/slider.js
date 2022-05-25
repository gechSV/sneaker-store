var offset = 0; //смещение слайдера
const sliderLine = document.querySelector('.slider-line');
const testt = document.querySelector('item-prew');

var but_1 = document.getElementById("button_slider_1");
var but_2 = document.getElementById("button_slider_2");
var but_3 = document.getElementById("button_slider_3");
var but_4 = document.getElementById("button_slider_4");
var but_5 = document.getElementById("button_slider_5");

var line = document.getElementById("line");
var slCon = document.getElementById("sl-con");
var sl = document.getElementById("sl");

var img_1 = document.getElementById("img_1");
var img_2 = document.getElementById("img_2");
var img_3 = document.getElementById("img_3");
var img_4 = document.getElementById("img_4");
var img_5 = document.getElementById("img_5");

var winWidth = document.documentElement.innerWidth;



function sliderClick(id) {
    but_1.style.background = "none";
    but_2.style.background = "none";
    but_3.style.background = "none";
    but_4.style.background = "none";
    but_5.style.background = "none";

    switch(id){
        case 1:{
            but_1.style.background = "#fafafa";
            offset = 0;
            sliderLine.style.left = -offset + 'px';
            break;
        }
        case 2:{
            but_2.style.background = "#fafafa";
            offset = 1920;
            sliderLine.style.left = -offset + 'px';
            break;
        }
        case 3:{
            but_3.style.background = "#fafafa";
            offset = 3840;
            sliderLine.style.left = -offset + 'px';
            break;
        }
        case 4:{
            but_4.style.background = "#fafafa";
            offset = 5760;
            sliderLine.style.left = -offset + 'px';
            break;
        }
        case 5:{
            but_5.style.background = "#fafafa";
            offset = 7680;
            sliderLine.style.left = -offset + 'px';
            break;
        }
    }
}

// document.body.onload = function lineSize(){
//     console.log(winWidth)
//     slCon.style.width = winWidth + 'px';
// }

// window.onresize = function lineSize(){
//     console.log(winWidth)
//     slCon.style.width = winWidth + 'px';
// }


