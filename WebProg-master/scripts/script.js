class Canvas {
    constructor() {
        this.canvas = $("#balloonCanvas")[0];
        this.ctx = this.canvas.getContext("2d");

        this.x = this.canvas.getBoundingClientRect().left;
        this.y = this.canvas.getBoundingClientRect().top;
    }

    removeFigure(x, y, width, height) {
        this.ctx.clearRect(x, y, width, height);
    }

    drawBalloon(cX, cY, rad, col, delta) {
        function LightenDarkenColor(col, d) {
            //Вычисляет цвет темнее (d>0) или светлее (d<0)
            var usePound = false;
            if (col[0] == "#") {
                col = col.slice(1);
                usePound = true;
            }
            var num = parseInt(col, 16);
            var r = (num >> 16) + d;
            if (r > 255) r = 255;
            else if (r < 0) r = 0;
            var g = ((num >> 8) & 0x00ff) + d;
            if (g > 255) g = 255;
            else if (g < 0) g = 0;
            var b = (num & 0x0000ff) + d;
            if (b > 255) b = 255;
            else if (b < 0) b = 0;
            return (
                (usePound ? "#" : "") +
                (r < 16 ? "0" : "") +
                r.toString(16) +
                (g < 16 ? "0" : "") +
                g.toString(16) +
                (b < 16 ? "0" : "") +
                b.toString(16)
            );
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
        var darkColor = LightenDarkenColor(baseColor, -delta);
        var lightColor = LightenDarkenColor(baseColor, delta);

        var handleLength = ROUNDNESS * radius;
        var widthDiff = radius * WIDTH;
        var heightDiff = radius * HEIGHT;
        var balloonBottomY = centerY + radius + heightDiff;

        this.ctx.beginPath(); //Начали формировать графический путь

        //Верхняя левая курва:
        var topLeftCurveStartX = centerX - radius;
        var topLeftCurveStartY = centerY;
        var topLeftCurveEndX = centerX;
        var topLeftCurveEndY = centerY - radius;
        this.ctx.moveTo(topLeftCurveStartX, topLeftCurveStartY);
        this.ctx.bezierCurveTo(
            topLeftCurveStartX,
            topLeftCurveStartY - handleLength - widthDiff,
            topLeftCurveEndX - handleLength,
            topLeftCurveEndY,
            topLeftCurveEndX,
            topLeftCurveEndY
        );

        //Верхняя правая курва:
        var topRightCurveStartX = centerX;
        var topRightCurveStartY = centerY - radius;
        var topRightCurveEndX = centerX + radius;
        var topRightCurveEndY = centerY;
        this.ctx.bezierCurveTo(
            topRightCurveStartX + handleLength + widthDiff,
            topRightCurveStartY,
            topRightCurveEndX,
            topRightCurveEndY - handleLength,
            topRightCurveEndX,
            topRightCurveEndY
        );

        //Нижняя правая курва:
        var bottomRightCurveStartX = centerX + radius;
        var bottomRightCurveStartY = centerY;
        var bottomRightCurveEndX = centerX;
        var bottomRightCurveEndY = balloonBottomY;
        this.ctx.bezierCurveTo(
            bottomRightCurveStartX,
            bottomRightCurveStartY + handleLength,
            bottomRightCurveEndX + handleLength,
            bottomRightCurveEndY,
            bottomRightCurveEndX,
            bottomRightCurveEndY
        );

        //Нижняя левая курва:
        var bottomLeftCurveStartX = centerX;
        var bottomLeftCurveStartY = balloonBottomY;
        var bottomLeftCurveEndX = centerX - radius;
        var bottomLeftCurveEndY = centerY;
        this.ctx.bezierCurveTo(
            bottomLeftCurveStartX - handleLength,
            bottomLeftCurveStartY,
            bottomLeftCurveEndX,
            bottomLeftCurveEndY + handleLength,
            bottomLeftCurveEndX,
            bottomLeftCurveEndY
        );

        //Градиент:
        var gradientOffset = radius / GRADIENTOFFSET;
        var balloonGradient = this.ctx.createRadialGradient(
            centerX + gradientOffset,
            centerY - gradientOffset,
            GRADIENTSTARTRADIUS,
            centerX,
            centerY,
            radius + heightDiff
        );
        balloonGradient.addColorStop(0.1, lightColor);
        balloonGradient.addColorStop(0.7, darkColor);

        this.ctx.fillStyle = balloonGradient;
        this.ctx.fill(); //Конец формирования графического пути

        //Хвостик шарика:
        var halfTieWidth = (radius * TILEWIDTH) / 2;
        var tieHeight = radius * TILEHEIGHT;
        var tieCurveHeight = radius * TIE_CURVE_FACTOR;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 1, balloonBottomY);
        this.ctx.lineTo(centerX - halfTieWidth, balloonBottomY + tieHeight);
        this.ctx.quadraticCurveTo(
            centerX,
            balloonBottomY + tieCurveHeight,
            centerX + halfTieWidth,
            balloonBottomY + tieHeight
        );
        this.ctx.lineTo(centerX + 1, balloonBottomY);
        this.ctx.fill();
    }
}

class Game {
    
    constructor(song) {
        this.userScore = 0;
        this.allScore = 0;
        this.difficulty = 1100;

        this.gameTime = 66000;
        
        this.song = song;

        this.resultModal = new ResultModal('resultModal');
    }

    start(canvas) {
        this.userScore = 0;
        this.allScore = 0;

        let intervalID = setInterval(() => this._startGame(canvas), this.difficulty); //изменять по уровню сложности
        setTimeout(() => {
            clearInterval(intervalID);
            this.finish();
        }, this.gameTime); // Время Игры
    }

    _startGame(canvas) {
        const size = 20 + Math.random() * 20; //Рандом размер
        const x = size + Math.random() * 1000; //рандом положение с учетом размеров
        const y = size + Math.random() * 600; //Рандом положение

        const color1 = parseInt(14 + Math.random() * 240); //рандом цвета
        const color2 = parseInt(14 + Math.random() * 240);
        const color3 = parseInt(14 + Math.random() * 240);

        const color =
            "#" +
            color1.toString(16) +
            color2.toString(16) +
            color3.toString(16);

        canvas.drawBalloon(x, y, size, color, 100);

        let isDeleted = false;

        function listener(event) {
            if (isDeleted) return;

            const startX = canvas.x;
            const startY = canvas.y;

            const centerOfRoundX = Math.floor(x) + startX;
            const centerOfRoundY = Math.floor(y) + startY;

            const clickX = event.pageX;
            const clickY = event.pageY;

            const pointDistance = Math.sqrt(
                (clickX - centerOfRoundX)*(clickX - centerOfRoundX) + (clickY - centerOfRoundY)*(clickY - centerOfRoundY)
            );
             //   console.log(pointDistance);
            if (pointDistance < size) {
                isDeleted = true;
                this.song.playSuccess();
                ++this.userScore;
                ++this.allScore;
                canvas.removeFigure(x - size, y - size, 2 * size, 3 * size);
                console.log('Попал!');
            } else {
                this.song.playFailed();
            }
        }

        canvas.canvas.addEventListener("click", listener.bind(this));

        setTimeout(() => {
            canvas.canvas.removeEventListener("click", listener);
            if (!isDeleted) {
                isDeleted = true;
                canvas.removeFigure(x - size, y - size, 2 * size, 3 * size);
                ++this.allScore;
                this.song.playFailed();
                console.log('Мимо!');
            }
        }, this.difficulty - 100);
    }

    finish() {
        this.resultModal.openModal();
        this.resultModal.setResult(parseInt((this.userScore/this.allScore)*100));
    }

    setDifficulty(difficulty) {
        this.difficulty = +difficulty;
    }
}

class Modal {
    constructor(id) {
        this.modal = $(`#${id}`);

        this.initButtons();
    }

    initButtons() {
        this.modal.contextmenu(event => {
            event.preventDefault();

            this.closeModal();
        })
    }

    openModal() {
        this.modal.css('display', 'block');
        setTimeout(() => this.modal.css('opacity', '1'), 100);
    }

    closeModal() {
        this.modal.css('opacity', '0');

        setTimeout(() => this.modal.css('display', 'none'), 500);
    }
}

class ResultModal extends Modal {
    constructor(id) {
        super(id);
    }

    setResult(result) {
        $('#moves').text(`Процент попаданий: ${result}%`);
    }
}

class OptionsModal extends Modal {
    constructor(id, game) {
        super(id);
        this.game = game
    }

    initButtons() {
        super.initButtons();

        $('#settings').click(this.openModal.bind(this));

        [...$('input[name="difficulty"]')].forEach(item => {
            item.addEventListener('change', () => this.setDifficulty(item.dataset.difficulty));
        })
    }

    setDifficulty(difficulty) {
        this.game.setDifficulty(difficulty);
    }
}

class Song {
    constructor() {
        this.popal = $('#popal')[0];
        this.mimo = $('#mimo')[0];
    }

    playSuccess() {
        this.popal.play();
    }

    playFailed() {
        this.mimo.play();
    }
}

window.onload = () => {
    const start_btn = $('#start');
    const canvas = new Canvas();
    const song = new Song();

    const game = new Game(song);

    const optionsModal = new OptionsModal('optionsModal', game);
    start_btn.click(() => game.start(canvas));
};
