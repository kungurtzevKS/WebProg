var canvas = document.getElementById('balloonCanvas');
var ctx = canvas.getContext('2d');
function stoped(){
    //А тут будет вызов окна с подсчетом очков
}
function pred_start(){
    let InterID = setInterval(() => start(), 1100);   //изменять по уровнб сложности
    setTimeout(() => {clearInterval(InterID); stoped();}, 66000);
}
function start(){
/*Спавним шарик */
let size = 20 + Math.random()*20; //Рандом размер
let x = size + Math.random()*1000;  //рандом положение с учетом размеров
let y = size + Math.random()*600;   //Рандом положение
let color1 = parseInt (14+Math.random()*240);  //рандом цвета
let color2 = parseInt (14+Math.random()*240);
let color3 = parseInt (14+Math.random()*240);
const color = '#' + color1.toString(16) + color2.toString(16) + color3.toString(16);
console.log(color);
drawBalloon ('balloonCanvas', x, y, size,  color, 100, ctx)

//ЗАСПАВНИЛИ
/*Делэй*/
setTimeout(() => ctx.clearRect(x-size, y-size, 2*size, 3*size), 1000); //изменять по уровню сложности
//ctx.clearRect.call(ctx, x-size, y-size, 2*size, 3*size); 
//Я бля трахался с обычной формой сетТаймАута, там была ошибка с неправильным
//вызывающим объектом, теперь я шарю за call и apply
//ЗАДЕЛЕИЛИ
/*удаляем шарик*/
}
window.addEventListener('load', function () {
    const start_btn = document.getElementById("start");

start_btn.addEventListener("click", function(event) {
start_btn.style.fontSize = "50px",
pred_start()
/*В чем суть. Я как человек привыкший к плюсам и джава
Чисто подахуел с того расклада, что местные делэи рот ебать хотели программу
и тут нет таких, которые бы ее стопили, и имеются только те, которые что либо вызывают с задержкой
По этой причине мне пришлось сделать слегка костыльный Pred_start, который бы уже вызывал старт через интервал.
Остановку этого адского цикла можно будет осуществить по айдишнику, предлагаю останавливать спустя 1 минуту например, а потом оценивать
набранное за минуту кол-во очков и говорить, насколько игрок молодец.*/
}
); 
    }, false);


