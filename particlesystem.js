class Particle {
    constructor(maxLife = 5) {
        this.maxLife = maxLife;
        this.life = maxLife;
    }

    update(delta) {
        this.life -= delta;
    }

    draw() {}

    isDead() {
        return this.life <= 0;
    }

    get lifeRatio() {
        return 1 - Math.max(0, Math.min(1, this.life / this.maxLife));
    }
}

class ParticleSystem {
    constructor(delayMin, delayMax, onCreateParticle) {
        this.particles = [];
        this.delayMin = delayMin;
        this.delayMax = delayMax;
        this.onCreateParticle = onCreateParticle.bind(this);
        this.time = 0;

        this.delayBeforeSpawn = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
    }

    addParticle() {
        this.particles.push(this.onCreateParticle());
    }

    draw() {
        const delta = deltaTime / 1000;

        let nbSpawned = 0;
        this.time += delta;
        while (this.time >= this.delayBeforeSpawn) {
            this.addParticle();

            this.time -= this.delayBeforeSpawn;
            this.delayBeforeSpawn = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
            nbSpawned++;

            if (nbSpawned > 1000) {
                console.error('more than 1000 particles spawned, are you sure about that?');
                break;
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(delta);

            if (particle.isDead()) {
                this.particles.splice(i, 1);
            } else {
                particle.draw();
            }
        }
    }
}

p5.prototype.createParticle = function (maxLife) {
    return new Particle(maxLife);
};

p5.prototype.createParticleSystem = function (delayMin, delayMax, onCreateParticle) {
    const ps = new ParticleSystem(delayMin, delayMax, onCreateParticle);

    return ps;
};
