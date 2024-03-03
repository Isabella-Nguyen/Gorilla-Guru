class Sprite {
    constructor(position, image, frames = {max:1}, sprites){
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
        this.moving = false;
        this.sprites = sprites;
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )

        if (!this.moving) return;

        if (this.frames.max > 1){
            this.frames.elapsed++;
        }

        if (this.frames.elapsed %10 === 0){
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
}

class Boundary {
    static width = 14.4;
    static height = 14.4;
    constructor(position) {
        this.position = position;
        this.width = 14.4;   // his map is 400% zoomed, and each pixel is 12x12, so 12x4=48
        this.height = 14.4;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.0)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}