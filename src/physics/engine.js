import { Circle } from './rigid';
import { isColliding, isCollidingBoundary } from './collision/collisionDetection';
import { resolveCollision, resolveBoundaryCollision } from './collision/collisionResolution';
import { vec2 as v } from 'gl-matrix';

class Engine {
    /**
     * @constructs Creates an instance of the Engine.
     * @param {Object} bounds - An array containing arrays for the boundaries of each axis.
     *                          X, Y, then Z axis respectively. Within each subarray, min then max.
     * @param {Object} settings - An object conitanin
     * @param {number} dim - The number of dimensions the engine is working in.
     * Engine settings such as graivty and etc.
     */
    constructor(bounds, settings, dim = 2) {
        this.bounds = bounds;
        this.settings = settings;
        this.dim = dim;
    }

    /**
     * Updates an array of RigidBody's.
     * @param {RigidBody[]} vals - An array of RigidBody's or objects inherited from RigidBody.
     */
    update(vals) {
        for (let i = 0; i < vals.length; i++) {
            // Detect and resolve object-object collisions.
            for (let j = i + 1; j < vals.length; j++) {
                if (isColliding(vals[i], vals[j])) {
                    resolveCollision(vals[i], vals[j], this.settings);
                }
            }

            // Detect and handle object-boundary collisions.
            for (let axis = 0; axis < this.dim; axis++) {
                let isBoundCollFrame = false;
                const minBound = this.bounds[axis][0];
                const maxBound = this.bounds[axis][1];

                if (isCollidingBoundary(vals[i], minBound, true, axis)) { // Min
                    resolveBoundaryCollision(vals[i], minBound, true, axis, this.settings);
                    isBoundCollFrame = true;
                } else if (isCollidingBoundary(vals[i], maxBound, false, axis)) { // Max
                    resolveBoundaryCollision(vals[i], maxBound, false, axis, this.settings);
                    isBoundCollFrame = true;
                }

                // TODO: Currently inaccurate. Coliisions lose energy when gravity is on, even with
                // perfectly elastic boundaries. Fix by not using Euler Integration. Also need to
                // implement "sleeping" system, otherwise we have too many collision resolutions calls.
                // TODO: Double check this.
                if (!isBoundCollFrame) {
                    vals[i].velocity[axis] = vals[i].velocity[axis] + this.settings.gravity[axis]
                }
            }

            // Move the objects by their velocities.
            if (vals[i] instanceof Circle) {
                for (let c = 0; c < vals[i].coords.length; c++) {
                    vals[i].coords[c] += vals[i].velocity[c];
                }
            }

        }
    }

}

export default Engine;
