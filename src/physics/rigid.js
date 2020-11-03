class RigidBody {
    constructor(mass = 1.0, velocity = 0.0) {
        this.mass = mass;
        this.velocity = velocity;
    }
}

class Circle extends RigidBody {
    constructor(mass = 1.0, velocity = 0.0, radius) {
        super(mass, velocity);
        this.radius = radius;
    }
}

class Polygon extends RigidBody {
    constructor(mass = 1.0, vertices = 0.0) {
        super(mass);
        this.vertices = vertices;
    }
}

export { RigidBody, Circle, Polygon };