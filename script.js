const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

const contents=[
    document.querySelector("#c1"),
    document.querySelector("#c2"),
    document.querySelector("#c3"),
    document.querySelector("#c4"),
    document.querySelector("#c5"),
    document.querySelector("#c6"),
    document.querySelector("#c7")
];

const wave = {
    amplitude: 50, // 波浪的振幅
    frequency: 1, // 波浪的频率
    speed: 20, // 逐渐显现的速度（控制从左到右显现的速度）
    offsetX: 0, // 波浪的水平偏移量，控制显现的进度
};

const canvasWidth = window.innerWidth;
const canvasHeight = 200;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
wave.frequency = 7.0*Math.PI/canvasWidth;

let isInViewport = false;

function trigger(index) {
    contents[index].style.transition = "opacity 0.5s ease-in-out";
    contents[index].style.visibility = "visible";
    contents[index].style.opacity=1;
}

const uppertext=[
    "《感动中国人物汇编》",
    "“赤子心”专辑",
    "《东方遥望》",
    "感动中国系列创作",
    "《砼声颂》",
    "“赤子心”专辑",
    "《信仰启航》"
];
const uoffset=[-20,-25,-20,-20,-20,-25,-20];

const lowertext=[
    "感动中国系列创作",
    "《赤色光辉》",
    "“赤子心”专辑",
    "《两秩十秩的感动》",
    "",
    "《垦荒之旅》",
    "“赤子心”专辑"
];
const loffset=[20,20,25,20,20,20,20];

// 绘制波浪线
function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    // 设置字体样式
    ctx.font = '20px 宋体';

    // 设置填充颜色
    ctx.fillStyle = 'black';

    // 通过调整offsetX逐渐从左到右绘制波浪
    for (let x = 0; x < wave.offsetX; x++) {
        const y = -wave.amplitude * Math.sin(wave.frequency * x) + canvasHeight / 2;
        ctx.lineTo(x, y);
    }

    ctx.textAlign = 'center';
    for (let i = 0; wave.offsetX * 14 >= canvas.width * (2 * i + 1) ; i++) {
        const x = canvas.width * (2 * i + 1) / 14;
        const y = -wave.amplitude * Math.sin(Math.PI * (i + 0.5)) + canvasHeight / 2;
        ctx.textBaseline='bottom';
        if (i == 3)
        {
            ctx.fillText("感动中国", x, y+uoffset[i]-20);
            ctx.fillText("系列创作", x, y+uoffset[i]);
        }
        else
        {
            ctx.fillText(uppertext[i], x, y+uoffset[i]);
        }
        ctx.textBaseline='top';
        if (i == 0)
        {
            ctx.fillText("感动中国", x, y+loffset[i]);
            ctx.fillText("系列创作", x, y+loffset[i]+20);
        }
        else
        {
            ctx.fillText(lowertext[i], x, y+loffset[i]);
        }
    }

    ctx.strokeStyle = '#cccc00';
    ctx.lineWidth = 5;
    ctx.stroke();
}

// 更新波浪的显现进度
function updateWave() {
    if (wave.offsetX < canvas.width) {
        wave.offsetX += wave.speed; // 逐渐增加offsetX，控制从左到右的显现
        drawWave();
        requestAnimationFrame(updateWave); // 保持逐渐显现的动画
        for (let x = 0; x < 7; x++) {
            if (wave.offsetX * 7 >= canvas.width * (x + 1)) {
                trigger(x);
            }
        }
    }
    else {
        trigger(6);
    }
}

// 使用 IntersectionObserver 来检查何时进入视口
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            isInViewport = true; // 当canvas进入视口时开始绘制
            updateWave(); // 启动显现波浪线的过程
        } else {
            isInViewport = false; // 如果离开视口，可以停止绘制
        }
    });
}, { threshold: 0.5 });

observer.observe(canvas);
