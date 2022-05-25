var offset = 0;
const sliderLine = document.querySelector('.slider-line-goods');

var but_1 = document.getElementById("button_slider_goods_1");
var but_2 = document.getElementById("button_slider_goods_2");
var but_3 = document.getElementById("button_slider_goods_3");
var but_4 = document.getElementById("button_slider_goods_4");

var img_1 = document.getElementById("img_goods_1");
var img_2 = document.getElementById("img_goods_2");
var img_3 = document.getElementById("img_goods_3");
var img_4 = document.getElementById("img_goods_4");

function goodsSliderClick(id) {
    but_1.style.background = "none";
    but_2.style.background = "none";
    but_3.style.background = "none";
    but_4.style.background = "none";

    switch(id){
        case 1:{
            but_1.style.background = "#fafafa";
            offset = 0;
            sliderLine.style.left = -offset + 'px';
            break;
        }
        case 2:{
            but_2.style.background = "#fafafa";
            offset = 800;
            sliderLine.style.left = -offset + 'px';
            break;
        }
        case 3:{
            but_3.style.background = "#fafafa";
            offset = 1600;
            sliderLine.style.left = -offset + 'px';
            break;
        }
        case 4:{
            but_4.style.background = "#fafafa";
            offset = 2400;
            sliderLine.style.left = -offset + 'px';
            break;
        }
    }
}