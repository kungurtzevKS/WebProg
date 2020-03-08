function drawBalloon (canvasElementID, cX, cY, rad, col, delta, ctx) {
    //ID канвы, центр, основной радиус, основной цвет, отклонение для цвета

function LightenDarkenColor(col, d) { //Вычисляет цвет темнее (d>0) или светлее (d<0)
var usePound = false;
if (col[0] == "#") { col = col.slice(1); usePound = true; }
var num = parseInt(col,16);
var r = (num >> 16) + d; if (r > 255) r = 255; else if  (r < 0) r = 0;
var g = ((num >> 8) & 0x00FF) + d; if (g > 255) g = 255; else if (g < 0) g = 0;
var b = (num & 0x0000FF) + d; if (b > 255) b = 255; else if  (b < 0) b = 0;
return (usePound?"#":"") + (r<16?'0':'')+r.toString(16) +
(g<16?'0':'')+g.toString(16) + (b<16?'0':'')+b.toString(16);
}

//Настройки шарика для курвы Безье:
var ROUNDNESS = 0.55; //закруглённость
var WIDTH = 0.05; //множитель ширины для основной части
var HEIGHT = 0.33; //множитель высоты для основной части
var TILEWIDTH = 0.17; //множитель ширины для хвостика
var TILEHEIGHT = 0.11; //множитель высоты для хвостика
var TIE_CURVE_FACTOR = 0.12; //множитель кривизны для хвостика
var GRADIENTOFFSET = 3; //смещение для градиента
var GRADIENTSTARTRADIUS = 3; //начальный радиус для градиента

//Подготовить данные:
var centerX = cX;
var centerY = cY;
var radius = rad;
var baseColor = col;
var darkColor = LightenDarkenColor(baseColor,-delta);
var lightColor = LightenDarkenColor(baseColor,delta);

var handleLength = ROUNDNESS * radius;
var widthDiff = (radius * WIDTH);
var heightDiff = (radius * HEIGHT);
var balloonBottomY = centerY + radius + heightDiff;

ctx.beginPath(); //Начали формировать графический путь

//Верхняя левая курва:
var topLeftCurveStartX = centerX - radius;
var topLeftCurveStartY = centerY;
var topLeftCurveEndX = centerX;
var topLeftCurveEndY = centerY - radius;
ctx.moveTo (topLeftCurveStartX, topLeftCurveStartY);
ctx.bezierCurveTo (topLeftCurveStartX, topLeftCurveStartY - handleLength - widthDiff,
topLeftCurveEndX - handleLength, topLeftCurveEndY, topLeftCurveEndX, topLeftCurveEndY);

//Верхняя правая курва:
var topRightCurveStartX = centerX;
var topRightCurveStartY = centerY - radius;
var topRightCurveEndX = centerX + radius;
var topRightCurveEndY = centerY;
ctx.bezierCurveTo (topRightCurveStartX + handleLength + widthDiff, topRightCurveStartY,
topRightCurveEndX, topRightCurveEndY - handleLength, topRightCurveEndX, topRightCurveEndY);

//Нижняя правая курва:
var bottomRightCurveStartX = centerX + radius;
var bottomRightCurveStartY = centerY;
var bottomRightCurveEndX = centerX;
var bottomRightCurveEndY = balloonBottomY;
ctx.bezierCurveTo (bottomRightCurveStartX, bottomRightCurveStartY + handleLength,
bottomRightCurveEndX + handleLength, bottomRightCurveEndY, bottomRightCurveEndX, bottomRightCurveEndY);

//Нижняя левая курва:
var bottomLeftCurveStartX = centerX;
var bottomLeftCurveStartY = balloonBottomY;
var bottomLeftCurveEndX = centerX - radius;
var bottomLeftCurveEndY = centerY;
ctx.bezierCurveTo (bottomLeftCurveStartX - handleLength, bottomLeftCurveStartY,
bottomLeftCurveEndX, bottomLeftCurveEndY + handleLength, bottomLeftCurveEndX, bottomLeftCurveEndY);

//Градиент:
var gradientOffset = (radius/GRADIENTOFFSET);
var balloonGradient = ctx.createRadialGradient(centerX + gradientOffset, centerY - gradientOffset,
GRADIENTSTARTRADIUS, centerX, centerY, radius + heightDiff);
balloonGradient.addColorStop(0.1, lightColor);
balloonGradient.addColorStop(0.7, darkColor);

ctx.fillStyle = balloonGradient;
ctx.fill(); //Конец формирования графического пути

//Хвостик шарика:
var halfTieWidth = (radius * TILEWIDTH)/2;
var tieHeight = (radius * TILEHEIGHT);
var tieCurveHeight = (radius * TIE_CURVE_FACTOR);
ctx.beginPath();
ctx.moveTo(centerX - 1, balloonBottomY);
ctx.lineTo(centerX - halfTieWidth, balloonBottomY + tieHeight);
ctx.quadraticCurveTo (centerX, balloonBottomY + tieCurveHeight, 
centerX + halfTieWidth, balloonBottomY + tieHeight);
ctx.lineTo(centerX + 1, balloonBottomY);
ctx.fill();
}

/*window.addEventListener('load', function () {
drawBalloon ('balloonCanvas', 150, 200, 80,  '#E52D2D', 85); //красный
drawBalloon ('balloonCanvas', 320, 340, 60,  '#11ee22', 100); //зеленоватый
drawBalloon ('balloonCanvas', 350, 110, 70,  '#DDDD66', 50); //желтоватый
}, false);*/