<template>
    <canvas class="seasons-falling-canvas"></canvas>
</template>

<script>
export default {
    props: {
        season: {
            type: String,
            default: 'winter', // 'spring', 'summer', 'autumn', 'winter'
        },
        theme: {
            type: String,
            default: 'light'   // 'light' | 'dark' — 影響雪花色調與整體透明度
        },
        amount: { type: Number, default: 50 },
        size: { type: Number, default: 5 },
        speed: { type: Number, default: 1.5 },
        wind: { type: Number, default: 0 },
        color: { type: String, default: '#fff' },
        opacity: { type: Number, default: 0.8 },
        swing: { type: Number, default: 1 },
        image: { type: String, default: null },
        zIndex: { type: Number, default: null },
        resize: { type: Boolean, default: true }
    },
    mounted() {
        const self = this;
        const CANVAS = self.$el;
        const ctx = CANVAS.getContext('2d');
        let canvasHeight, canvasWidth;
        let flakes = [];
        let loadedImage = null;

        const rgbCache = {};
        function getRgbCached(str) {
            if (!rgbCache[str]) rgbCache[str] = getRgb(str);
            return rgbCache[str];
        }

        // 季節預設配置（winter 顏色在 drawShape 依 theme 再覆寫）
        const seasonConfigs = {
            spring: { color: '#ffb7c5', swing: 2, speed: 0.8, size: 4 },
            summer: { color: '#7dd3fc', swing: 0, speed: 1.2, size: 1 },
            autumn: { color: '#ff8c00', swing: 1.5, speed: 1.2, size: 6 },
            winter: { color: '#e2e8f0', swing: 1, speed: 1.5, size: 2 }
        };

        function updateCanvasSize() {
            canvasHeight = CANVAS.offsetHeight;
            canvasWidth = CANVAS.offsetWidth;
            CANVAS.height = canvasHeight;
            CANVAS.width = canvasWidth;
        }

        function init() {
            updateCanvasSize();
            CANVAS.style.zIndex = self.zIndex || 'auto';
            flakes = [];
            for (let i = 0; i < self.amount; i++) {
                flakes.push(createFlake(true));
            }
            if (self.image) {
                loadedImage = new Image();
                loadedImage.src = self.image;
            }
            requestAnimationFrame(snow);
        }

        function createFlake(isInitial = false) {
            const config = seasonConfigs[self.season] || seasonConfigs.winter;
            const baseSize = (self.size || config.size) * 0.8;
            const r = random(baseSize * 0.3, baseSize * 2) / 2;
            const x = random(0, canvasWidth);
            const y = isInitial ? random(0, canvasHeight) : -r * 4;

            // Winter: 保持原有邏輯不變
            if (self.season === 'winter') {
                return {
                    x, y, r,
                    velY: random(self.speed, self.speed * 1.5) * Math.pow(r / baseSize, 1.5),
                    velX: self.wind,
                    stepSize: random(0.01, 0.04),
                    step: random(0, Math.PI * 2),
                    opacity: random(0.4, self.opacity) * (r / baseSize + 0.2),
                    rotation: random(0, 360),
                    rotationSpeed: random(-0.5, 0.5)
                };
            }

            // Summer: 大雨 — 統一高速、無擺動、隨風斜落
            if (self.season === 'summer') {
                return {
                    x, y, r,
                    velY: self.speed * 6,
                    velX: self.wind * 2,
                    stepSize: random(0.01, 0.04),
                    step: random(0, Math.PI * 2),
                    opacity: random(0.5, self.opacity),
                    swingAmplitude: 0
                };
            }

            // Autumn: 疏落感 — 一半粒子 opacity 0；大小差矩收窄
            if (self.season === 'autumn') {
                const baseSpeed = (config.speed != null ? config.speed : self.speed);
                const rAutumn = random(baseSize * 1.5, baseSize * 3) / 2;
                const yAutumn = isInitial ? y : -rAutumn * 4;
                const velY = baseSpeed * random(0.8, 1.2);
                const swingAmplitude = (config.swing != null ? config.swing : self.swing) * random(1.0, 1.8);
                const opacityAutumn = Math.random() < 0.5 ? 0 : random(0.5, self.opacity);
                return {
                    x, y: yAutumn, r: rAutumn,
                    velY,
                    velX: self.wind,
                    stepSize: random(0.02, 0.06),
                    step: random(0, Math.PI * 2),
                    opacity: opacityAutumn,
                    rotation: random(0, 360),
                    rotationSpeed: random(-1.5, 1.5),
                    flip: random(0, Math.PI * 2),
                    flipSpeed: random(-0.1, 0.1),
                    swingAmplitude
                };
            }

            // Spring: 櫻花 — 平滑 S 型軌跡，chaos/oscillation 僅在 createFlake 時決定
            if (self.season === 'spring') {
                const baseSpeed = (config.speed != null ? config.speed : self.speed);
                const velY = baseSpeed * random(0.48, 0.58);
                const rSpring = r * 1.25;
                const oscillation = random(0.015, 0.025);
                return {
                    x, y, r: rSpring,
                    velY,
                    velX: self.wind,
                    stepSize: oscillation,
                    step: random(0, Math.PI * 2),
                    opacity: random(0.5, self.opacity),
                    rotation: random(0, 360),
                    rotationSpeed: random(-0.8, 0.8),
                    flip: random(0, Math.PI * 2),
                    flipSpeed: random(-0.12, 0.12),
                    chaos: random(0.9, 1.1)
                };
            }

            // Fallback (其他季節沿用 winter 邏輯)
            return {
                x, y, r,
                velY: random(self.speed, self.speed * 1.5) * Math.pow(r / baseSize, 1.5),
                velX: self.wind,
                stepSize: random(0.01, 0.04),
                step: random(0, Math.PI * 2),
                opacity: random(0.4, self.opacity) * (r / baseSize + 0.2),
                rotation: random(0, 360),
                rotationSpeed: random(-0.5, 0.5)
            };
        }

        function drawShape(ctx, flake) {
            const season = self.season;
            const theme = self.theme;
            ctx.save();

            if (season === 'summer') {
                const dropLen = flake.velY * 1.5;
                ctx.globalAlpha = theme === 'dark' ? 0.2 : 0.6;
                ctx.strokeStyle = theme === 'light' ? 'rgba(147, 197, 253, 0.85)' : 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(flake.x, flake.y);
                ctx.lineTo(flake.x + self.wind * 2 * (dropLen / 20), flake.y + dropLen);
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else if (season === 'spring') {
                const pinkAlpha = theme === 'light' ? Math.min(1, flake.opacity * 1.12) : Math.min(1, flake.opacity * 0.5);
                ctx.globalAlpha = theme === 'light' ? 0.96 : 0.82;
                ctx.fillStyle = `rgba(255, 192, 203, ${pinkAlpha})`;
                ctx.translate(flake.x, flake.y);
                ctx.rotate(flake.rotation * Math.PI / 180);
                ctx.scale((Math.abs(Math.cos(flake.flip)) * 0.3 + 0.7), 1);
                const pr = flake.r * 1.1;
                const wr = flake.r * 0.9;
                ctx.beginPath();
                ctx.moveTo(0, -pr);
                ctx.bezierCurveTo(-wr, -pr * 0.3, -wr * 0.8, pr * 0.8, 0, pr);
                ctx.bezierCurveTo(wr * 0.8, pr * 0.8, wr, -pr * 0.3, 0, -pr);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (season === 'autumn') {
                const baseColor = (self.color === '#fff' || self.color === '#ffffff') ? (seasonConfigs.autumn?.color || '#ff8c00') : self.color;
                const opacityMult = theme === 'dark' ? 0.5 : 1;
                ctx.fillStyle = `rgba(${getRgbCached(baseColor)}, ${Math.min(1, flake.opacity * opacityMult)})`;
                ctx.translate(flake.x, flake.y);
                ctx.rotate(flake.rotation * Math.PI / 180);
                ctx.scale((Math.abs(Math.cos(flake.flip)) * 0.3 + 0.7), 1);
                const L = flake.r * 1.35;
                ctx.beginPath();
                ctx.moveTo(0, L);
                ctx.quadraticCurveTo(L * 0.12, L * 0.6, L * 0.4, L * 0.7);
                ctx.quadraticCurveTo(L * 0.3, L * 0.25, L * 0.65, L * 0.05);
                ctx.quadraticCurveTo(L * 0.45, -L * 0.2, L * 0.5, -L * 0.7);
                ctx.quadraticCurveTo(L * 0.2, -L * 0.5, 0, -L * 0.55);
                ctx.quadraticCurveTo(-L * 0.2, -L * 0.5, -L * 0.5, -L * 0.7);
                ctx.quadraticCurveTo(-L * 0.45, -L * 0.2, -L * 0.65, L * 0.05);
                ctx.quadraticCurveTo(-L * 0.3, L * 0.25, -L * 0.4, L * 0.7);
                ctx.quadraticCurveTo(-L * 0.12, L * 0.6, 0, L);
                ctx.closePath();
                ctx.fill();
            } else {
                const baseColor = theme === 'light' ? '#dbeafe' : '#e2e8f0';
                const snowAlpha = theme === 'light' ? Math.min(1, flake.opacity * 1.12) : flake.opacity * 0.5;
                if (theme === 'light') ctx.globalAlpha = 0.96;
                ctx.fillStyle = `rgba(${getRgbCached(baseColor)}, ${snowAlpha})`;
                ctx.shadowBlur = 2;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.r, 0, 2 * Math.PI);
                ctx.fill();
                ctx.shadowBlur = 0;
                if (theme === 'light') ctx.globalAlpha = 1;
            }

            ctx.restore();
        }

        function snow() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            const season = self.season;
            const windBase = self.wind * 0.5;
            const isSummer = season === 'summer';
            const bottomMargin = isSummer ? 100 : 0;
            const useImage = loadedImage && loadedImage.complete;

            for (let i = 0; i < flakes.length; i++) {
                const flake = flakes[i];
                flake.y += flake.velY;

                const windX = flake.velX != null ? flake.velX : windBase;

                if (season === 'spring') {
                    flake.step += flake.stepSize;
                    flake.x += Math.sin(flake.step) * 0.55 * (flake.chaos ?? 1) + Math.cos(flake.flip) * 0.35 + windX;
                } else {
                    flake.step += flake.stepSize;
                    const swing = flake.swingAmplitude != null ? flake.swingAmplitude : self.swing;
                    flake.x += Math.sin(flake.step) * (swing * 0.5) + windX;
                }

                if (season === 'spring' || season === 'autumn') {
                    flake.flip += flake.flipSpeed;
                    flake.rotation += flake.rotationSpeed;
                }

                if (useImage) {
                    ctx.drawImage(loadedImage, flake.x - flake.r, flake.y - flake.r, flake.r * 2, flake.r * 2);
                } else if (!(season === 'autumn' && flake.opacity === 0)) {
                    drawShape(ctx, flake);
                }

                const margin = bottomMargin || flake.r;
                if (flake.y > canvasHeight + margin || flake.x > canvasWidth + flake.r || flake.x < -flake.r) {
                    Object.assign(flake, createFlake(false));
                }
            }
            requestAnimationFrame(snow);
        }

        init();

        if (self.resize) {
            window.addEventListener('resize', updateCanvasSize);
        }
    }
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function getRgb(str) {
    if (str.indexOf('#') === 0) {
        if (str.length === 4) {
            return str.slice(1).split('').map(n => parseInt(n + n, 16)).join(',');
        }
        if (str.length === 7) {
            return [str.slice(1, 3), str.slice(3, 5), str.slice(5, 7)].map(n => parseInt(n, 16)).join(',');
        }
        return '255,255,255';
    }
    if (str.indexOf('rgb(') === 0) return str.slice(4, -1);
    return '255,255,255';
}
</script>

<style scoped>
.seasons-falling-canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* 確保不會擋住底層按鈕點擊 */
}
</style>