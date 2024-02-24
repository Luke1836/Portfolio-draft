const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = 'transparent';
ctx.lineWidth = 2;

/*  ------------Adding Linear Gradients--------------  */

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#43766C');
gradient.addColorStop(0.5, 'cyan');
gradient.addColorStop(1, '#D63484');

class Particles
{
    constructor(effect)
    {
        this.effect = effect;
        this.radius = Math.random() * 12 + 2;
        this.x = this.radius + Math.random() * (this.effect.width - 2 * this.radius);
        this.y = this.radius + Math.random() * (this.effect.height -2 * this.radius);
        this.vx = Math.random() * 2 - 2;
        this.vy = Math.random() * 2 - 2;
        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.90;
        this.frictionY = 0.5;
    }

    draw(context)
    {
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill();
        context.stroke();
    }

    update()
    {
        if(this.effect.mouse.pressed)
        {
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const dist = Math.hypot(dy, dx);

            if(dist < this.effect.mouse.radius)
            {
                const angle = Math.atan2(dy, dx);
                this.pushX -= Math.cos(angle) * dist / 25;
                this.pushY -= Math.sin(angle) * dist / 25;
            }
        }
        
        this.x += (this.pushX *= this.friction) + this.vx;
        this.y += (this.pushY *= this.frictionY) + this.vy;

        if(this.x < this.radius)
        {
            this.x = this.radius;
            this.vx *= -1;
        }

        else if(this.x > this.effect.width - this.radius)
        {
            this.x = this.effect.width - this.radius;
            this.vx *= -1;
        }

        if(this.y < this.radius)
        {
            this.y = this.radius;
            this.vy *= -1;
        }

        else if(this.y > this.effect.height - this.radius)
        {
            this.y = this.effect.height - this.radius;
            this.vy += -1;
        }
    }

    reset()
    {
        this.x = this.radius + Math.random() * (this.effect.width - 2 * this.radius);
        this.y = this.radius + Math.random() * (this.effect.height - 2 * this.radius);
    }
}

class Effect
{
    constructor(canvas, context)
    {
        this.context = context
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 350;
        this.createParticles();

        this.mouse = 
        {   x: 0,
            y: 0,
            pressed: false,
            radius: 250,
        };

        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight, context);
        });

        window.addEventListener('mousemove', e => {
            if(this.mouse.pressed)
            {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });

        window.addEventListener('mousedown', e=> {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
    }

    createParticles()
    {
        for(let i = 0 ; i < this.numberOfParticles ; i++)
            this.particles.push(new Particles(this));
    }

    handleParticles(context)
    {
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }

    connectParticles(context)
    {
        const maxDistance = 120;
        for(let i = 0 ; i < this.particles.length ; i++)
        {   for(let j = 0 ; j < this.particles.length ; j++)
            {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.hypot(dy, dx);
                if(dist < maxDistance)
                {
                    context.save();
                    const opacity = 1 - (dist/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[i].x, this.particles[i].y);
                    context.lineTo(this.particles[j].x, this.particles[j].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }

    resize(width, height, context)
    {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        context.fillStyle = gradient;
        context.strokeStyle = 'transparent';
        context.lineWidth = 2;
        this.particles.forEach(particle => {
            particle.reset();
        })
    }
}

const effects = new Effect(canvas, ctx);

function animate()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effects.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();