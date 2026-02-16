<template>
    <canvas
        ref="canvasRef"
        class="seasons-falling-canvas"
        :class="{ 'is-fullscreen': fullScreen }"
    ></canvas>
</template>

<script>
export default {
    props: {
        autoSeason: { type: Boolean, default: false },
        season: {
            type: String,
            default: 'spring', // 'spring', 'summer', 'autumn', 'winter'
        },
        theme: {
            type: String,
            default: 'light'   // 'light' | 'dark' — affects snowflake tint and overall opacity
        },
        amount: { type: Number, default: 100 },
        size: { type: Number, default: 5 },
        speed: { type: Number, default: 1.5 },
        wind: { type: Number, default: 0 },
        color: { type: String, default: '#fff' },
        opacity: { type: Number, default: 0.8 },
        swing: { type: Number, default: 1 },
        image: { type: String, default: null },
        zIndex: { type: Number, default: null },
        resize: { type: Boolean, default: true },
        fullScreen: { type: Boolean, default: false },  // false: fill parent layer
        mouseInteraction: { type: Boolean, default: false }
    },
    mounted() {
        const self = this;
        const CANVAS = self.$refs.canvasRef;
        const ctx = CANVAS.getContext('2d');
        let canvasHeight, canvasWidth;
        let flakes = [];
        let loadedImage = null;
        let currentActiveSeason = self.season;
        let mouse = { x: -1000, y: -1000 }; // initial position outside the screen

        if (!CANVAS) return;

        const onMouseMove = (e) => {
            const rect = CANVAS.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const onTouchMove = (e) => {
            if (e.touches.length > 0) {
                const rect = CANVAS.getBoundingClientRect();
                const touch = e.touches[0];
                mouse.x = touch.clientX - rect.left;
                mouse.y = touch.clientY - rect.top;
            }
        };

        // Store handlers for cleanup in beforeUnmount
        self._onMouseMove = onMouseMove;
        self._onTouchMove = onTouchMove;
        self._animationId = null;

        const rgbCache = {};
        function getRgbCached(str) {
            if (!rgbCache[str]) rgbCache[str] = getRgb(str);
            return rgbCache[str];
        }

        // Default season configs (winter color is overridden in drawShape by theme)
        const seasonConfigs = {
            spring: { color: '#ffb7c5', swing: 2, speed: 0.8, size: 4 },
            summer: { color: '#7dd3fc', swing: 0, speed: 1.2, size: 1 },
            autumn: { color: '#ff8c00', swing: 1.5, speed: 1.2, size: 6 },
            winter: { color: '#e2e8f0', swing: 1, speed: 1.5, size: 2 }
        };

        function updateCanvasSize() {
            const oldWidth = canvasWidth;
            const oldHeight = canvasHeight;

            if (self.fullScreen) {
                canvasWidth = window.innerWidth;
                canvasHeight = window.innerHeight;
            } else {
                const parent = CANVAS.parentElement;
                canvasWidth = parent ? parent.offsetWidth : window.innerWidth;
                canvasHeight = parent ? parent.offsetHeight : window.innerHeight;
            }

            if (CANVAS.width !== canvasWidth || CANVAS.height !== canvasHeight) {
                CANVAS.width = canvasWidth;
                CANVAS.height = canvasHeight;

                if (oldWidth && oldHeight) {
                    const scaleX = canvasWidth / oldWidth;
                    const scaleY = canvasHeight / oldHeight;
                    flakes.forEach(flake => {
                        flake.x *= scaleX;
                        flake.y *= scaleY;
                    });
                }
            }
        }

        function getSeasonByMonth() {
            const month = new Date().getMonth() + 1; // getMonth() 是 0-11
            if (month >= 3 && month <= 5) return 'spring';
            if (month >= 6 && month <= 8) return 'summer';
            if (month >= 9 && month <= 11) return 'autumn';
            return 'winter';
        }

        function init() {
            if (self.autoSeason) {
                currentActiveSeason = getSeasonByMonth();
            } else {
                currentActiveSeason = self.season;
            }

            updateCanvasSize();
            CANVAS.style.zIndex = self.zIndex || 'auto';

            // Amount by screen area: sqrt curve + min/max for consistent density from phone to ultrawide/4K
            const baseArea = 1920 * 1080;
            const currentArea = canvasWidth * canvasHeight;
            const ratio = Math.sqrt(currentArea / baseArea);
            const finalAmount = Math.max(80, Math.min(600, Math.floor(self.amount * ratio)));

            flakes = [];
            for (let i = 0; i < finalAmount; i++) {
                flakes.push(createFlake(true));
            }
            if (self.image) {
                loadedImage = new Image();
                loadedImage.src = self.image;
            }

            if (self.mouseInteraction) {
                window.addEventListener('mousemove', self._onMouseMove);
                window.addEventListener('touchmove', self._onTouchMove, { passive: true });
            }
            self._animationId = requestAnimationFrame(snow);
        }

        function createFlake(isInitial = false) {
            const config = seasonConfigs[currentActiveSeason] || seasonConfigs.winter;
            const baseSize = (self.size || config.size) * 0.8;
            const r = random(baseSize * 0.3, baseSize * 2) / 2;
            const x = random(0, canvasWidth);
            const y = isInitial ? random(0, canvasHeight) : -r * 4;

            // Winter: keep original logic unchanged
            if (currentActiveSeason === 'winter') {
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

            // Summer: raining — uniform high speed, no swing, wind-driven slant
            if (currentActiveSeason === 'summer') {
                const rSummer = random(baseSize * 0.2, baseSize * 1.4) / 2;
                return {
                    x, y: isInitial ? y : -rSummer * 4, r: rSummer,
                    velY: self.speed * 6,
                    velX: self.wind * 2,
                    stepSize: random(0.01, 0.04),
                    step: random(0, Math.PI * 2),
                    opacity: random(0.5, self.opacity),
                    swingAmplitude: 0
                };
            }

            // Autumn: sparse feel — half of particles opacity 0; narrower size range
            if (currentActiveSeason === 'autumn') {
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

            // Spring: cherry blossom — smooth S-curve path; chaos/oscillation set only in createFlake
            if (currentActiveSeason === 'spring') {
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

            // Fallback (other seasons use winter logic)
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
            const season = currentActiveSeason;
            const theme = self.theme;
            ctx.save();

            if (season === 'summer') {
                const dropLen = flake.velY * (1 + flake.r * 0.6);
                const summerAlpha = (theme === 'dark' ? 0.25 : 0.65) * flake.opacity;
                ctx.globalAlpha = Math.min(1, summerAlpha);
                ctx.strokeStyle = theme === 'light' ? `rgba(147, 197, 253, ${Math.min(1, flake.opacity * 1.1)})` : `rgba(255, 255, 255, ${Math.min(1, flake.opacity * 0.85)})`;
                ctx.lineWidth = Math.max(0.8, 0.5 + flake.r * 0.5);
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

            const season = currentActiveSeason;
            const windBase = self.wind * 0.5;
            const isSummer = currentActiveSeason === 'summer';
            const bottomMargin = isSummer ? 100 : 0;
            const useImage = loadedImage && loadedImage.complete;

            for (let i = 0; i < flakes.length; i++) {
                const flake = flakes[i];
                flake.y += flake.velY;

                if (self.mouseInteraction) {
                    const dx = flake.x - mouse.x;
                    const dy = flake.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem to calculate distance
                    const forceRadius = 100; // The force field radius, flakes within 100px will be blown away

                    if (distance < forceRadius) {
                        const force = (forceRadius - distance) / forceRadius; // Force is stronger when closer (0 to 1)
                        const moveX = (dx / distance) * force * 10; // The strength of the push is 10
                        const moveY = (dy / distance) * force * 10;
                        
                        flake.x += moveX;
                        flake.y += moveY;
                    }
                }

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
            self._animationId = requestAnimationFrame(snow);
        }

        // Keep reference so we can remove the same listener in beforeUnmount
        self._onResize = updateCanvasSize;

        init();

        if (self.resize) {
            window.addEventListener('resize', self._onResize);
        }
    },
    beforeUnmount() {
        if (this._animationId != null) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
        if (this._onResize) {
            window.removeEventListener('resize', this._onResize);
            this._onResize = null;
        }
        if (this.mouseInteraction && this._onMouseMove) {
            window.removeEventListener('mousemove', this._onMouseMove);
            window.removeEventListener('touchmove', this._onTouchMove);
            this._onMouseMove = null;
            this._onTouchMove = null;
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
    display: block;
    pointer-events: none;
}

.seasons-falling-canvas.is-fullscreen {
    position: fixed !important;
    inset: 0 !important; 
    width: 100vw !important;
    height: 100vh !important;
}
</style>