class Particle {
    constructor(maxLife = 5) {
        this.maxLife = maxLife;
        this.life = maxLife;
    }

    update(delta) {
        this.life -= delta;
    }

    render() {
        if (this.shape) {
            this.shape.render();
        }
    }

    isDead() {
        return this.life <= 0;
    }

    get lifeRatio() {
        return 1 - Math.max(0, Math.min(1, this.life / this.maxLife));
    }
}

class ParticleSystem {
    constructor(delayMin, delayMax) {
        this.particles = [];
        this.delayMin = delayMin;
        this.delayMax = delayMax;
        this.time = 0;
        this.delayBeforeSpawn = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
    }

    addParticle() {
        const particle = this.onCreate();
        this.particles.push(particle);
    }

    update(delta) {
        let nbSpawned = 0;
        this.time += delta;
        while (this.time >= this.delayBeforeSpawn) {
            this.addParticle();

            this.time -= this.delayBeforeSpawn;
            this.delayBeforeSpawn = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
            nbSpawned++;

            if (nbSpawned > 1000) {
                console.error('more than 1000 particles spawned, is there an infinite loop?');
                break;
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(delta);
            this.onUpdate(particle, delta);

            if (particle.isDead()) {
                this.particles.splice(i, 1);
            } else {
                particle.render();
            }
        }
    }

    onCreate() {
        return createParticle();
    }

    onUpdate(particle) {}

    render() {
        this.update(deltaTime / 1000);
    }
}

function createParticle(maxLife) {
    return new Particle(maxLife);
}

function createParticleSystem(delayMin, delayMax) {
    return new ParticleSystem(delayMin, delayMax);
}
