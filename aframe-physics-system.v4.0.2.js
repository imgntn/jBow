!function() {
    return function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a;
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function(r) {
                    return o(e[i][1][r] || r);
                }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o;
    };
}()({
    1: [ function(require, module, exports) {
        var CANNON = require("cannon-es");
        require("./src/components/math"), require("./src/components/body/ammo-body"), 
        require("./src/components/body/body"), require("./src/components/body/dynamic-body"), 
        require("./src/components/body/static-body"), require("./src/components/shape/shape"), 
        require("./src/components/shape/ammo-shape"), require("./src/components/ammo-constraint"), 
        require("./src/components/constraint"), require("./src/components/spring"), 
        require("./src/system"), module.exports = {
            registerAll: function() {
                console.warn("registerAll() is deprecated. Components are automatically registered.");
            }
        }, window.CANNON = window.CANNON || CANNON;
    }, {
        "./src/components/ammo-constraint": 8,
        "./src/components/body/ammo-body": 9,
        "./src/components/body/body": 10,
        "./src/components/body/dynamic-body": 11,
        "./src/components/body/static-body": 12,
        "./src/components/constraint": 13,
        "./src/components/math": 14,
        "./src/components/shape/ammo-shape": 16,
        "./src/components/shape/shape": 17,
        "./src/components/spring": 18,
        "./src/system": 28,
        "cannon-es": 4
    } ],
    2: [ function(require, module, exports) {
        var CANNON = require("cannon-es");
        CANNON.shape2mesh = function(body) {
            for (var obj = new THREE.Object3D(), l = 0; l < body.shapes.length; l++) {
                var mesh, shape = body.shapes[l];
                switch (shape.type) {
                  case CANNON.Shape.types.SPHERE:
                    var sphere_geometry = new THREE.SphereGeometry(shape.radius, 8, 8);
                    mesh = new THREE.Mesh(sphere_geometry, this.currentMaterial);
                    break;

                  case CANNON.Shape.types.PARTICLE:
                    mesh = new THREE.Mesh(this.particleGeo, this.particleMaterial);
                    var s = this.settings;
                    mesh.scale.set(s.particleSize, s.particleSize, s.particleSize);
                    break;

                  case CANNON.Shape.types.PLANE:
                    var geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
                    mesh = new THREE.Object3D();
                    var submesh = new THREE.Object3D(), ground = new THREE.Mesh(geometry, this.currentMaterial);
                    ground.scale.set(100, 100, 100), submesh.add(ground), ground.castShadow = !0, 
                    ground.receiveShadow = !0, mesh.add(submesh);
                    break;

                  case CANNON.Shape.types.BOX:
                    var box_geometry = new THREE.BoxGeometry(2 * shape.halfExtents.x, 2 * shape.halfExtents.y, 2 * shape.halfExtents.z);
                    mesh = new THREE.Mesh(box_geometry, this.currentMaterial);
                    break;

                  case CANNON.Shape.types.CONVEXPOLYHEDRON:
                    for (var geo = new THREE.Geometry(), i = 0; i < shape.vertices.length; i++) {
                        var v = shape.vertices[i];
                        geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
                    }
                    for (i = 0; i < shape.faces.length; i++) for (var face = shape.faces[i], a = face[0], j = 1; j < face.length - 1; j++) {
                        var b = face[j], c = face[j + 1];
                        geo.faces.push(new THREE.Face3(a, b, c));
                    }
                    geo.computeBoundingSphere(), geo.computeFaceNormals(), mesh = new THREE.Mesh(geo, this.currentMaterial);
                    break;

                  case CANNON.Shape.types.HEIGHTFIELD:
                    geometry = new THREE.Geometry();
                    for (var v0 = new CANNON.Vec3(), v1 = new CANNON.Vec3(), v2 = new CANNON.Vec3(), xi = 0; xi < shape.data.length - 1; xi++) for (var yi = 0; yi < shape.data[xi].length - 1; yi++) for (var k = 0; k < 2; k++) {
                        shape.getConvexTrianglePillar(xi, yi, 0 === k), v0.copy(shape.pillarConvex.vertices[0]), 
                        v1.copy(shape.pillarConvex.vertices[1]), v2.copy(shape.pillarConvex.vertices[2]), 
                        v0.vadd(shape.pillarOffset, v0), v1.vadd(shape.pillarOffset, v1), 
                        v2.vadd(shape.pillarOffset, v2), geometry.vertices.push(new THREE.Vector3(v0.x, v0.y, v0.z), new THREE.Vector3(v1.x, v1.y, v1.z), new THREE.Vector3(v2.x, v2.y, v2.z));
                        i = geometry.vertices.length - 3;
                        geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
                    }
                    geometry.computeBoundingSphere(), geometry.computeFaceNormals(), 
                    mesh = new THREE.Mesh(geometry, this.currentMaterial);
                    break;

                  case CANNON.Shape.types.TRIMESH:
                    for (geometry = new THREE.Geometry(), v0 = new CANNON.Vec3(), 
                    v1 = new CANNON.Vec3(), v2 = new CANNON.Vec3(), i = 0; i < shape.indices.length / 3; i++) {
                        shape.getTriangleVertices(i, v0, v1, v2), geometry.vertices.push(new THREE.Vector3(v0.x, v0.y, v0.z), new THREE.Vector3(v1.x, v1.y, v1.z), new THREE.Vector3(v2.x, v2.y, v2.z));
                        j = geometry.vertices.length - 3;
                        geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
                    }
                    geometry.computeBoundingSphere(), geometry.computeFaceNormals(), 
                    mesh = new THREE.Mesh(geometry, this.currentMaterial);
                    break;

                  default:
                    throw "Visual type not recognized: " + shape.type;
                }
                if (mesh.receiveShadow = !0, mesh.castShadow = !0, mesh.children) for (i = 0; i < mesh.children.length; i++) if (mesh.children[i].castShadow = !0, 
                mesh.children[i].receiveShadow = !0, mesh.children[i]) for (j = 0; j < mesh.children[i].length; j++) mesh.children[i].children[j].castShadow = !0, 
                mesh.children[i].children[j].receiveShadow = !0;
                var o = body.shapeOffsets[l], q = body.shapeOrientations[l];
                mesh.position.set(o.x, o.y, o.z), mesh.quaternion.set(q.x, q.y, q.z, q.w), 
                obj.add(mesh);
            }
            return obj;
        }, module.exports = CANNON.shape2mesh;
    }, {
        "cannon-es": 4
    } ],
    3: [ function(require, module, exports) {
        THREE.AmmoDebugConstants = {
            NoDebug: 0,
            DrawWireframe: 1,
            DrawAabb: 2,
            DrawFeaturesText: 4,
            DrawContactPoints: 8,
            NoDeactivation: 16,
            NoHelpText: 32,
            DrawText: 64,
            ProfileTimings: 128,
            EnableSatComparison: 256,
            DisableBulletLCP: 512,
            EnableCCD: 1024,
            DrawConstraints: 2048,
            DrawConstraintLimits: 4096,
            FastWireframe: 8192,
            DrawNormals: 16384,
            DrawOnTop: 32768,
            MAX_DEBUG_DRAW_MODE: 4294967295
        }, THREE.AmmoDebugDrawer = function(scene, world, options) {
            this.scene = scene, this.world = world, options = options || {}, this.debugDrawMode = options.debugDrawMode || THREE.AmmoDebugConstants.DrawWireframe;
            var drawOnTop = this.debugDrawMode & THREE.AmmoDebugConstants.DrawOnTop || !1, maxBufferSize = options.maxBufferSize || 1e6;
            this.geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array(3 * maxBufferSize), colors = new Float32Array(3 * maxBufferSize);
            this.geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3).setUsage(THREE.DynamicDrawUsage)), 
            this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)), 
            this.index = 0;
            var material = new THREE.LineBasicMaterial({
                vertexColors: !0,
                depthTest: !drawOnTop
            });
            this.mesh = new THREE.LineSegments(this.geometry, material), drawOnTop && (this.mesh.renderOrder = 999), 
            this.mesh.frustumCulled = !1, this.enabled = !1, this.debugDrawer = new Ammo.DebugDrawer(), 
            this.debugDrawer.drawLine = this.drawLine.bind(this), this.debugDrawer.drawContactPoint = this.drawContactPoint.bind(this), 
            this.debugDrawer.reportErrorWarning = this.reportErrorWarning.bind(this), 
            this.debugDrawer.draw3dText = this.draw3dText.bind(this), this.debugDrawer.setDebugMode = this.setDebugMode.bind(this), 
            this.debugDrawer.getDebugMode = this.getDebugMode.bind(this), this.debugDrawer.enable = this.enable.bind(this), 
            this.debugDrawer.disable = this.disable.bind(this), this.debugDrawer.update = this.update.bind(this), 
            this.world.setDebugDrawer(this.debugDrawer);
        }, THREE.AmmoDebugDrawer.prototype = function() {
            return this.debugDrawer;
        }, THREE.AmmoDebugDrawer.prototype.enable = function() {
            this.enabled = !0, this.scene.add(this.mesh);
        }, THREE.AmmoDebugDrawer.prototype.disable = function() {
            this.enabled = !1, this.scene.remove(this.mesh);
        }, THREE.AmmoDebugDrawer.prototype.update = function() {
            this.enabled && (0 != this.index && (this.geometry.attributes.position.needsUpdate = !0, 
            this.geometry.attributes.color.needsUpdate = !0), this.index = 0, this.world.debugDrawWorld(), 
            this.geometry.setDrawRange(0, this.index));
        }, THREE.AmmoDebugDrawer.prototype.drawLine = function(from, to, color) {
            const heap = Ammo.HEAPF32, r = heap[(color + 0) / 4], g = heap[(color + 4) / 4], b = heap[(color + 8) / 4], fromX = heap[(from + 0) / 4], fromY = heap[(from + 4) / 4], fromZ = heap[(from + 8) / 4];
            this.geometry.attributes.position.setXYZ(this.index, fromX, fromY, fromZ), 
            this.geometry.attributes.color.setXYZ(this.index++, r, g, b);
            const toX = heap[(to + 0) / 4], toY = heap[(to + 4) / 4], toZ = heap[(to + 8) / 4];
            this.geometry.attributes.position.setXYZ(this.index, toX, toY, toZ), 
            this.geometry.attributes.color.setXYZ(this.index++, r, g, b);
        }, THREE.AmmoDebugDrawer.prototype.drawContactPoint = function(pointOnB, normalOnB, distance, lifeTime, color) {
            const heap = Ammo.HEAPF32, r = heap[(color + 0) / 4], g = heap[(color + 4) / 4], b = heap[(color + 8) / 4], x = heap[(pointOnB + 0) / 4], y = heap[(pointOnB + 4) / 4], z = heap[(pointOnB + 8) / 4];
            this.geometry.attributes.position.setXYZ(this.index, x, y, z), this.geometry.attributes.color.setXYZ(this.index++, r, g, b);
            const dx = heap[(normalOnB + 0) / 4] * distance, dy = heap[(normalOnB + 4) / 4] * distance, dz = heap[(normalOnB + 8) / 4] * distance;
            this.geometry.attributes.position.setXYZ(this.index, x + dx, y + dy, z + dz), 
            this.geometry.attributes.color.setXYZ(this.index++, r, g, b);
        }, THREE.AmmoDebugDrawer.prototype.reportErrorWarning = function(warningString) {
            Ammo.hasOwnProperty("Pointer_stringify") ? console.warn(Ammo.Pointer_stringify(warningString)) : this.warnedOnce || (this.warnedOnce = !0, 
            console.warn("Cannot print warningString, please rebuild Ammo.js using 'debug' flag"));
        }, THREE.AmmoDebugDrawer.prototype.draw3dText = function(location, textString) {
            console.warn("TODO: draw3dText");
        }, THREE.AmmoDebugDrawer.prototype.setDebugMode = function(debugMode) {
            this.debugDrawMode = debugMode;
        }, THREE.AmmoDebugDrawer.prototype.getDebugMode = function() {
            return this.debugDrawMode;
        };
    }, {} ],
    4: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var ObjectCollisionMatrix = function() {
            function ObjectCollisionMatrix() {
                this.matrix = {};
            }
            var _proto = ObjectCollisionMatrix.prototype;
            return _proto.get = function(bi, bj) {
                var i = bi.id, j = bj.id;
                if (j > i) {
                    var temp = j;
                    j = i, i = temp;
                }
                return i + "-" + j in this.matrix;
            }, _proto.set = function(bi, bj, value) {
                var i = bi.id, j = bj.id;
                if (j > i) {
                    var temp = j;
                    j = i, i = temp;
                }
                value ? this.matrix[i + "-" + j] = !0 : delete this.matrix[i + "-" + j];
            }, _proto.reset = function() {
                this.matrix = {};
            }, _proto.setNumObjects = function(n) {}, ObjectCollisionMatrix;
        }(), Mat3 = function() {
            function Mat3(elements) {
                void 0 === elements && (elements = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]), 
                this.elements = elements;
            }
            var _proto = Mat3.prototype;
            return _proto.identity = function() {
                var e = this.elements;
                e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, 
                e[7] = 0, e[8] = 1;
            }, _proto.setZero = function() {
                var e = this.elements;
                e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 0, e[6] = 0, 
                e[7] = 0, e[8] = 0;
            }, _proto.setTrace = function(vector) {
                var e = this.elements;
                e[0] = vector.x, e[4] = vector.y, e[8] = vector.z;
            }, _proto.getTrace = function(target) {
                void 0 === target && (target = new Vec3());
                var e = this.elements;
                target.x = e[0], target.y = e[4], target.z = e[8];
            }, _proto.vmult = function(v, target) {
                void 0 === target && (target = new Vec3());
                var e = this.elements, x = v.x, y = v.y, z = v.z;
                return target.x = e[0] * x + e[1] * y + e[2] * z, target.y = e[3] * x + e[4] * y + e[5] * z, 
                target.z = e[6] * x + e[7] * y + e[8] * z, target;
            }, _proto.smult = function(s) {
                for (var i = 0; i < this.elements.length; i++) this.elements[i] *= s;
            }, _proto.mmult = function(matrix, target) {
                void 0 === target && (target = new Mat3());
                for (var elements = matrix.elements, i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
                    for (var sum = 0, k = 0; k < 3; k++) sum += elements[i + 3 * k] * this.elements[k + 3 * j];
                    target.elements[i + 3 * j] = sum;
                }
                return target;
            }, _proto.scale = function(vector, target) {
                void 0 === target && (target = new Mat3());
                for (var e = this.elements, t = target.elements, i = 0; 3 !== i; i++) t[3 * i + 0] = vector.x * e[3 * i + 0], 
                t[3 * i + 1] = vector.y * e[3 * i + 1], t[3 * i + 2] = vector.z * e[3 * i + 2];
                return target;
            }, _proto.solve = function(b, target) {
                void 0 === target && (target = new Vec3());
                var i, j, eqns = [];
                for (i = 0; i < 12; i++) eqns.push(0);
                for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) eqns[i + 4 * j] = this.elements[i + 3 * j];
                eqns[3] = b.x, eqns[7] = b.y, eqns[11] = b.z;
                var np, p, n = 3, k = n;
                do {
                    if (0 === eqns[(i = k - n) + 4 * i]) for (j = i + 1; j < k; j++) if (0 !== eqns[i + 4 * j]) {
                        np = 4;
                        do {
                            eqns[(p = 4 - np) + 4 * i] += eqns[p + 4 * j];
                        } while (--np);
                        break;
                    }
                    if (0 !== eqns[i + 4 * i]) for (j = i + 1; j < k; j++) {
                        var multiplier = eqns[i + 4 * j] / eqns[i + 4 * i];
                        np = 4;
                        do {
                            eqns[(p = 4 - np) + 4 * j] = p <= i ? 0 : eqns[p + 4 * j] - eqns[p + 4 * i] * multiplier;
                        } while (--np);
                    }
                } while (--n);
                if (target.z = eqns[11] / eqns[10], target.y = (eqns[7] - eqns[6] * target.z) / eqns[5], 
                target.x = (eqns[3] - eqns[2] * target.z - eqns[1] * target.y) / eqns[0], 
                isNaN(target.x) || isNaN(target.y) || isNaN(target.z) || target.x === 1 / 0 || target.y === 1 / 0 || target.z === 1 / 0) throw "Could not solve equation! Got x=[" + target.toString() + "], b=[" + b.toString() + "], A=[" + this.toString() + "]";
                return target;
            }, _proto.e = function(row, column, value) {
                if (void 0 === value) return this.elements[column + 3 * row];
                this.elements[column + 3 * row] = value;
            }, _proto.copy = function(matrix) {
                for (var i = 0; i < matrix.elements.length; i++) this.elements[i] = matrix.elements[i];
                return this;
            }, _proto.toString = function() {
                for (var r = "", i = 0; i < 9; i++) r += this.elements[i] + ",";
                return r;
            }, _proto.reverse = function(target) {
                void 0 === target && (target = new Mat3());
                var i, j, eqns = [];
                for (i = 0; i < 18; i++) eqns.push(0);
                for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) eqns[i + 6 * j] = this.elements[i + 3 * j];
                eqns[3] = 1, eqns[9] = 0, eqns[15] = 0, eqns[4] = 0, eqns[10] = 1, 
                eqns[16] = 0, eqns[5] = 0, eqns[11] = 0, eqns[17] = 1;
                var np, p, n = 3, k = n;
                do {
                    if (0 === eqns[(i = k - n) + 6 * i]) for (j = i + 1; j < k; j++) if (0 !== eqns[i + 6 * j]) {
                        np = 6;
                        do {
                            eqns[(p = 6 - np) + 6 * i] += eqns[p + 6 * j];
                        } while (--np);
                        break;
                    }
                    if (0 !== eqns[i + 6 * i]) for (j = i + 1; j < k; j++) {
                        var multiplier = eqns[i + 6 * j] / eqns[i + 6 * i];
                        np = 6;
                        do {
                            eqns[(p = 6 - np) + 6 * j] = p <= i ? 0 : eqns[p + 6 * j] - eqns[p + 6 * i] * multiplier;
                        } while (--np);
                    }
                } while (--n);
                i = 2;
                do {
                    j = i - 1;
                    do {
                        var _multiplier = eqns[i + 6 * j] / eqns[i + 6 * i];
                        np = 6;
                        do {
                            eqns[(p = 6 - np) + 6 * j] = eqns[p + 6 * j] - eqns[p + 6 * i] * _multiplier;
                        } while (--np);
                    } while (j--);
                } while (--i);
                i = 2;
                do {
                    var _multiplier2 = 1 / eqns[i + 6 * i];
                    np = 6;
                    do {
                        eqns[(p = 6 - np) + 6 * i] = eqns[p + 6 * i] * _multiplier2;
                    } while (--np);
                } while (i--);
                i = 2;
                do {
                    j = 2;
                    do {
                        if (p = eqns[3 + j + 6 * i], isNaN(p) || p === 1 / 0) throw "Could not reverse! A=[" + this.toString() + "]";
                        target.e(i, j, p);
                    } while (j--);
                } while (i--);
                return target;
            }, _proto.setRotationFromQuaternion = function(q) {
                var x = q.x, y = q.y, z = q.z, w = q.w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2, e = this.elements;
                return e[0] = 1 - (yy + zz), e[1] = xy - wz, e[2] = xz + wy, e[3] = xy + wz, 
                e[4] = 1 - (xx + zz), e[5] = yz - wx, e[6] = xz - wy, e[7] = yz + wx, 
                e[8] = 1 - (xx + yy), this;
            }, _proto.transpose = function(target) {
                void 0 === target && (target = new Mat3());
                for (var Mt = target.elements, M = this.elements, i = 0; 3 !== i; i++) for (var j = 0; 3 !== j; j++) Mt[3 * i + j] = M[3 * j + i];
                return target;
            }, Mat3;
        }(), Vec3 = function() {
            function Vec3(x, y, z) {
                void 0 === x && (x = 0), void 0 === y && (y = 0), void 0 === z && (z = 0), 
                this.x = x, this.y = y, this.z = z;
            }
            var _proto = Vec3.prototype;
            return _proto.cross = function(vector, target) {
                void 0 === target && (target = new Vec3());
                var vx = vector.x, vy = vector.y, vz = vector.z, x = this.x, y = this.y, z = this.z;
                return target.x = y * vz - z * vy, target.y = z * vx - x * vz, target.z = x * vy - y * vx, 
                target;
            }, _proto.set = function(x, y, z) {
                return this.x = x, this.y = y, this.z = z, this;
            }, _proto.setZero = function() {
                this.x = this.y = this.z = 0;
            }, _proto.vadd = function(vector, target) {
                if (!target) return new Vec3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
                target.x = vector.x + this.x, target.y = vector.y + this.y, target.z = vector.z + this.z;
            }, _proto.vsub = function(vector, target) {
                if (!target) return new Vec3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
                target.x = this.x - vector.x, target.y = this.y - vector.y, target.z = this.z - vector.z;
            }, _proto.crossmat = function() {
                return new Mat3([ 0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0 ]);
            }, _proto.normalize = function() {
                var x = this.x, y = this.y, z = this.z, n = Math.sqrt(x * x + y * y + z * z);
                if (n > 0) {
                    var invN = 1 / n;
                    this.x *= invN, this.y *= invN, this.z *= invN;
                } else this.x = 0, this.y = 0, this.z = 0;
                return n;
            }, _proto.unit = function(target) {
                void 0 === target && (target = new Vec3());
                var x = this.x, y = this.y, z = this.z, ninv = Math.sqrt(x * x + y * y + z * z);
                return ninv > 0 ? (ninv = 1 / ninv, target.x = x * ninv, target.y = y * ninv, 
                target.z = z * ninv) : (target.x = 1, target.y = 0, target.z = 0), 
                target;
            }, _proto.length = function() {
                var x = this.x, y = this.y, z = this.z;
                return Math.sqrt(x * x + y * y + z * z);
            }, _proto.lengthSquared = function() {
                return this.dot(this);
            }, _proto.distanceTo = function(p) {
                var x = this.x, y = this.y, z = this.z, px = p.x, py = p.y, pz = p.z;
                return Math.sqrt((px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z));
            }, _proto.distanceSquared = function(p) {
                var x = this.x, y = this.y, z = this.z, px = p.x, py = p.y, pz = p.z;
                return (px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z);
            }, _proto.scale = function(scalar, target) {
                void 0 === target && (target = new Vec3());
                var x = this.x, y = this.y, z = this.z;
                return target.x = scalar * x, target.y = scalar * y, target.z = scalar * z, 
                target;
            }, _proto.vmul = function(vector, target) {
                return void 0 === target && (target = new Vec3()), target.x = vector.x * this.x, 
                target.y = vector.y * this.y, target.z = vector.z * this.z, target;
            }, _proto.addScaledVector = function(scalar, vector, target) {
                return void 0 === target && (target = new Vec3()), target.x = this.x + scalar * vector.x, 
                target.y = this.y + scalar * vector.y, target.z = this.z + scalar * vector.z, 
                target;
            }, _proto.dot = function(vector) {
                return this.x * vector.x + this.y * vector.y + this.z * vector.z;
            }, _proto.isZero = function() {
                return 0 === this.x && 0 === this.y && 0 === this.z;
            }, _proto.negate = function(target) {
                return void 0 === target && (target = new Vec3()), target.x = -this.x, 
                target.y = -this.y, target.z = -this.z, target;
            }, _proto.tangents = function(t1, t2) {
                var norm = this.length();
                if (norm > 0) {
                    var n = Vec3_tangents_n, inorm = 1 / norm;
                    n.set(this.x * inorm, this.y * inorm, this.z * inorm);
                    var randVec = Vec3_tangents_randVec;
                    Math.abs(n.x) < .9 ? (randVec.set(1, 0, 0), n.cross(randVec, t1)) : (randVec.set(0, 1, 0), 
                    n.cross(randVec, t1)), n.cross(t1, t2);
                } else t1.set(1, 0, 0), t2.set(0, 1, 0);
            }, _proto.toString = function() {
                return this.x + "," + this.y + "," + this.z;
            }, _proto.toArray = function() {
                return [ this.x, this.y, this.z ];
            }, _proto.copy = function(vector) {
                return this.x = vector.x, this.y = vector.y, this.z = vector.z, 
                this;
            }, _proto.lerp = function(vector, t, target) {
                var x = this.x, y = this.y, z = this.z;
                target.x = x + (vector.x - x) * t, target.y = y + (vector.y - y) * t, 
                target.z = z + (vector.z - z) * t;
            }, _proto.almostEquals = function(vector, precision) {
                return void 0 === precision && (precision = 1e-6), !(Math.abs(this.x - vector.x) > precision || Math.abs(this.y - vector.y) > precision || Math.abs(this.z - vector.z) > precision);
            }, _proto.almostZero = function(precision) {
                return void 0 === precision && (precision = 1e-6), !(Math.abs(this.x) > precision || Math.abs(this.y) > precision || Math.abs(this.z) > precision);
            }, _proto.isAntiparallelTo = function(vector, precision) {
                return this.negate(antip_neg), antip_neg.almostEquals(vector, precision);
            }, _proto.clone = function() {
                return new Vec3(this.x, this.y, this.z);
            }, Vec3;
        }();
        Vec3.ZERO = new Vec3(0, 0, 0), Vec3.UNIT_X = new Vec3(1, 0, 0), Vec3.UNIT_Y = new Vec3(0, 1, 0), 
        Vec3.UNIT_Z = new Vec3(0, 0, 1);
        var Vec3_tangents_n = new Vec3(), Vec3_tangents_randVec = new Vec3(), antip_neg = new Vec3(), AABB = function() {
            function AABB(options) {
                void 0 === options && (options = {}), this.lowerBound = new Vec3(), 
                this.upperBound = new Vec3(), options.lowerBound && this.lowerBound.copy(options.lowerBound), 
                options.upperBound && this.upperBound.copy(options.upperBound);
            }
            var _proto = AABB.prototype;
            return _proto.setFromPoints = function(points, position, quaternion, skinSize) {
                var l = this.lowerBound, u = this.upperBound, q = quaternion;
                l.copy(points[0]), q && q.vmult(l, l), u.copy(l);
                for (var i = 1; i < points.length; i++) {
                    var p = points[i];
                    q && (q.vmult(p, tmp), p = tmp), p.x > u.x && (u.x = p.x), p.x < l.x && (l.x = p.x), 
                    p.y > u.y && (u.y = p.y), p.y < l.y && (l.y = p.y), p.z > u.z && (u.z = p.z), 
                    p.z < l.z && (l.z = p.z);
                }
                return position && (position.vadd(l, l), position.vadd(u, u)), skinSize && (l.x -= skinSize, 
                l.y -= skinSize, l.z -= skinSize, u.x += skinSize, u.y += skinSize, 
                u.z += skinSize), this;
            }, _proto.copy = function(aabb) {
                return this.lowerBound.copy(aabb.lowerBound), this.upperBound.copy(aabb.upperBound), 
                this;
            }, _proto.clone = function() {
                return new AABB().copy(this);
            }, _proto.extend = function(aabb) {
                this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x), 
                this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x), 
                this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y), 
                this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y), 
                this.lowerBound.z = Math.min(this.lowerBound.z, aabb.lowerBound.z), 
                this.upperBound.z = Math.max(this.upperBound.z, aabb.upperBound.z);
            }, _proto.overlaps = function(aabb) {
                var l1 = this.lowerBound, u1 = this.upperBound, l2 = aabb.lowerBound, u2 = aabb.upperBound, overlapsX = l2.x <= u1.x && u1.x <= u2.x || l1.x <= u2.x && u2.x <= u1.x, overlapsY = l2.y <= u1.y && u1.y <= u2.y || l1.y <= u2.y && u2.y <= u1.y, overlapsZ = l2.z <= u1.z && u1.z <= u2.z || l1.z <= u2.z && u2.z <= u1.z;
                return overlapsX && overlapsY && overlapsZ;
            }, _proto.volume = function() {
                var l = this.lowerBound, u = this.upperBound;
                return (u.x - l.x) * (u.y - l.y) * (u.z - l.z);
            }, _proto.contains = function(aabb) {
                var l1 = this.lowerBound, u1 = this.upperBound, l2 = aabb.lowerBound, u2 = aabb.upperBound;
                return l1.x <= l2.x && u1.x >= u2.x && l1.y <= l2.y && u1.y >= u2.y && l1.z <= l2.z && u1.z >= u2.z;
            }, _proto.getCorners = function(a, b, c, d, e, f, g, h) {
                var l = this.lowerBound, u = this.upperBound;
                a.copy(l), b.set(u.x, l.y, l.z), c.set(u.x, u.y, l.z), d.set(l.x, u.y, u.z), 
                e.set(u.x, l.y, u.z), f.set(l.x, u.y, l.z), g.set(l.x, l.y, u.z), 
                h.copy(u);
            }, _proto.toLocalFrame = function(frame, target) {
                var corners = transformIntoFrame_corners, a = corners[0], b = corners[1], c = corners[2], d = corners[3], e = corners[4], f = corners[5], g = corners[6], h = corners[7];
                this.getCorners(a, b, c, d, e, f, g, h);
                for (var i = 0; 8 !== i; i++) {
                    var corner = corners[i];
                    frame.pointToLocal(corner, corner);
                }
                return target.setFromPoints(corners);
            }, _proto.toWorldFrame = function(frame, target) {
                var corners = transformIntoFrame_corners, a = corners[0], b = corners[1], c = corners[2], d = corners[3], e = corners[4], f = corners[5], g = corners[6], h = corners[7];
                this.getCorners(a, b, c, d, e, f, g, h);
                for (var i = 0; 8 !== i; i++) {
                    var corner = corners[i];
                    frame.pointToWorld(corner, corner);
                }
                return target.setFromPoints(corners);
            }, _proto.overlapsRay = function(ray) {
                var direction = ray.direction, from = ray.from, dirFracX = 1 / direction.x, dirFracY = 1 / direction.y, dirFracZ = 1 / direction.z, t1 = (this.lowerBound.x - from.x) * dirFracX, t2 = (this.upperBound.x - from.x) * dirFracX, t3 = (this.lowerBound.y - from.y) * dirFracY, t4 = (this.upperBound.y - from.y) * dirFracY, t5 = (this.lowerBound.z - from.z) * dirFracZ, t6 = (this.upperBound.z - from.z) * dirFracZ, tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6)), tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
                return !(tmax < 0) && !(tmin > tmax);
            }, AABB;
        }(), tmp = new Vec3(), transformIntoFrame_corners = [ new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3() ], ArrayCollisionMatrix = function() {
            function ArrayCollisionMatrix() {
                this.matrix = [];
            }
            var _proto = ArrayCollisionMatrix.prototype;
            return _proto.get = function(bi, bj) {
                var i = bi.index, j = bj.index;
                if (j > i) {
                    var temp = j;
                    j = i, i = temp;
                }
                return this.matrix[(i * (i + 1) >> 1) + j - 1];
            }, _proto.set = function(bi, bj, value) {
                var i = bi.index, j = bj.index;
                if (j > i) {
                    var temp = j;
                    j = i, i = temp;
                }
                this.matrix[(i * (i + 1) >> 1) + j - 1] = value ? 1 : 0;
            }, _proto.reset = function() {
                for (var i = 0, l = this.matrix.length; i !== l; i++) this.matrix[i] = 0;
            }, _proto.setNumObjects = function(n) {
                this.matrix.length = n * (n - 1) >> 1;
            }, ArrayCollisionMatrix;
        }();
        function _inheritsLoose(subClass, superClass) {
            subClass.prototype = Object.create(superClass.prototype), subClass.prototype.constructor = subClass, 
            subClass.__proto__ = superClass;
        }
        function _assertThisInitialized(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        }
        var EventTarget = function() {
            function EventTarget() {}
            var _proto = EventTarget.prototype;
            return _proto.addEventListener = function(type, listener) {
                void 0 === this._listeners && (this._listeners = {});
                var listeners = this._listeners;
                return void 0 === listeners[type] && (listeners[type] = []), listeners[type].includes(listener) || listeners[type].push(listener), 
                this;
            }, _proto.hasEventListener = function(type, listener) {
                if (void 0 === this._listeners) return !1;
                var listeners = this._listeners;
                return !(void 0 === listeners[type] || !listeners[type].includes(listener));
            }, _proto.hasAnyEventListener = function(type) {
                return void 0 !== this._listeners && void 0 !== this._listeners[type];
            }, _proto.removeEventListener = function(type, listener) {
                if (void 0 === this._listeners) return this;
                var listeners = this._listeners;
                if (void 0 === listeners[type]) return this;
                var index = listeners[type].indexOf(listener);
                return -1 !== index && listeners[type].splice(index, 1), this;
            }, _proto.dispatchEvent = function(event) {
                if (void 0 === this._listeners) return this;
                var listenerArray = this._listeners[event.type];
                if (void 0 !== listenerArray) {
                    event.target = this;
                    for (var i = 0, l = listenerArray.length; i < l; i++) listenerArray[i].call(this, event);
                }
                return this;
            }, EventTarget;
        }(), Quaternion = function() {
            function Quaternion(x, y, z, w) {
                void 0 === x && (x = 0), void 0 === y && (y = 0), void 0 === z && (z = 0), 
                void 0 === w && (w = 1), this.x = x, this.y = y, this.z = z, this.w = w;
            }
            var _proto = Quaternion.prototype;
            return _proto.set = function(x, y, z, w) {
                return this.x = x, this.y = y, this.z = z, this.w = w, this;
            }, _proto.toString = function() {
                return this.x + "," + this.y + "," + this.z + "," + this.w;
            }, _proto.toArray = function() {
                return [ this.x, this.y, this.z, this.w ];
            }, _proto.setFromAxisAngle = function(vector, angle) {
                var s = Math.sin(.5 * angle);
                return this.x = vector.x * s, this.y = vector.y * s, this.z = vector.z * s, 
                this.w = Math.cos(.5 * angle), this;
            }, _proto.toAxisAngle = function(targetAxis) {
                void 0 === targetAxis && (targetAxis = new Vec3()), this.normalize();
                var angle = 2 * Math.acos(this.w), s = Math.sqrt(1 - this.w * this.w);
                return s < .001 ? (targetAxis.x = this.x, targetAxis.y = this.y, 
                targetAxis.z = this.z) : (targetAxis.x = this.x / s, targetAxis.y = this.y / s, 
                targetAxis.z = this.z / s), [ targetAxis, angle ];
            }, _proto.setFromVectors = function(u, v) {
                if (u.isAntiparallelTo(v)) {
                    var t1 = sfv_t1, t2 = sfv_t2;
                    u.tangents(t1, t2), this.setFromAxisAngle(t1, Math.PI);
                } else {
                    var a = u.cross(v);
                    this.x = a.x, this.y = a.y, this.z = a.z, this.w = Math.sqrt(Math.pow(u.length(), 2) * Math.pow(v.length(), 2)) + u.dot(v), 
                    this.normalize();
                }
                return this;
            }, _proto.mult = function(quat, target) {
                void 0 === target && (target = new Quaternion());
                var ax = this.x, ay = this.y, az = this.z, aw = this.w, bx = quat.x, by = quat.y, bz = quat.z, bw = quat.w;
                return target.x = ax * bw + aw * bx + ay * bz - az * by, target.y = ay * bw + aw * by + az * bx - ax * bz, 
                target.z = az * bw + aw * bz + ax * by - ay * bx, target.w = aw * bw - ax * bx - ay * by - az * bz, 
                target;
            }, _proto.inverse = function(target) {
                void 0 === target && (target = new Quaternion());
                var x = this.x, y = this.y, z = this.z, w = this.w;
                this.conjugate(target);
                var inorm2 = 1 / (x * x + y * y + z * z + w * w);
                return target.x *= inorm2, target.y *= inorm2, target.z *= inorm2, 
                target.w *= inorm2, target;
            }, _proto.conjugate = function(target) {
                return void 0 === target && (target = new Quaternion()), target.x = -this.x, 
                target.y = -this.y, target.z = -this.z, target.w = this.w, target;
            }, _proto.normalize = function() {
                var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
                return 0 === l ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (l = 1 / l, 
                this.x *= l, this.y *= l, this.z *= l, this.w *= l), this;
            }, _proto.normalizeFast = function() {
                var f = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
                return 0 === f ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (this.x *= f, 
                this.y *= f, this.z *= f, this.w *= f), this;
            }, _proto.vmult = function(v, target) {
                void 0 === target && (target = new Vec3());
                var x = v.x, y = v.y, z = v.z, qx = this.x, qy = this.y, qz = this.z, qw = this.w, ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
                return target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy, target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz, 
                target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx, target;
            }, _proto.copy = function(quat) {
                return this.x = quat.x, this.y = quat.y, this.z = quat.z, this.w = quat.w, 
                this;
            }, _proto.toEuler = function(target, order) {
                var heading, attitude, bank;
                void 0 === order && (order = "YZX");
                var x = this.x, y = this.y, z = this.z, w = this.w;
                switch (order) {
                  case "YZX":
                    var test = x * y + z * w;
                    if (test > .499 && (heading = 2 * Math.atan2(x, w), attitude = Math.PI / 2, 
                    bank = 0), test < -.499 && (heading = -2 * Math.atan2(x, w), 
                    attitude = -Math.PI / 2, bank = 0), void 0 === heading) {
                        var sqx = x * x, sqy = y * y, sqz = z * z;
                        heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz), 
                        attitude = Math.asin(2 * test), bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);
                    }
                    break;

                  default:
                    throw new Error("Euler order " + order + " not supported yet.");
                }
                target.y = heading, target.z = attitude, target.x = bank;
            }, _proto.setFromEuler = function(x, y, z, order) {
                void 0 === order && (order = "XYZ");
                var c1 = Math.cos(x / 2), c2 = Math.cos(y / 2), c3 = Math.cos(z / 2), s1 = Math.sin(x / 2), s2 = Math.sin(y / 2), s3 = Math.sin(z / 2);
                return "XYZ" === order ? (this.x = s1 * c2 * c3 + c1 * s2 * s3, 
                this.y = c1 * s2 * c3 - s1 * c2 * s3, this.z = c1 * c2 * s3 + s1 * s2 * c3, 
                this.w = c1 * c2 * c3 - s1 * s2 * s3) : "YXZ" === order ? (this.x = s1 * c2 * c3 + c1 * s2 * s3, 
                this.y = c1 * s2 * c3 - s1 * c2 * s3, this.z = c1 * c2 * s3 - s1 * s2 * c3, 
                this.w = c1 * c2 * c3 + s1 * s2 * s3) : "ZXY" === order ? (this.x = s1 * c2 * c3 - c1 * s2 * s3, 
                this.y = c1 * s2 * c3 + s1 * c2 * s3, this.z = c1 * c2 * s3 + s1 * s2 * c3, 
                this.w = c1 * c2 * c3 - s1 * s2 * s3) : "ZYX" === order ? (this.x = s1 * c2 * c3 - c1 * s2 * s3, 
                this.y = c1 * s2 * c3 + s1 * c2 * s3, this.z = c1 * c2 * s3 - s1 * s2 * c3, 
                this.w = c1 * c2 * c3 + s1 * s2 * s3) : "YZX" === order ? (this.x = s1 * c2 * c3 + c1 * s2 * s3, 
                this.y = c1 * s2 * c3 + s1 * c2 * s3, this.z = c1 * c2 * s3 - s1 * s2 * c3, 
                this.w = c1 * c2 * c3 - s1 * s2 * s3) : "XZY" === order && (this.x = s1 * c2 * c3 - c1 * s2 * s3, 
                this.y = c1 * s2 * c3 - s1 * c2 * s3, this.z = c1 * c2 * s3 + s1 * s2 * c3, 
                this.w = c1 * c2 * c3 + s1 * s2 * s3), this;
            }, _proto.clone = function() {
                return new Quaternion(this.x, this.y, this.z, this.w);
            }, _proto.slerp = function(toQuat, t, target) {
                void 0 === target && (target = new Quaternion());
                var omega, cosom, sinom, scale0, scale1, ax = this.x, ay = this.y, az = this.z, aw = this.w, bx = toQuat.x, by = toQuat.y, bz = toQuat.z, bw = toQuat.w;
                return (cosom = ax * bx + ay * by + az * bz + aw * bw) < 0 && (cosom = -cosom, 
                bx = -bx, by = -by, bz = -bz, bw = -bw), 1 - cosom > 1e-6 ? (omega = Math.acos(cosom), 
                sinom = Math.sin(omega), scale0 = Math.sin((1 - t) * omega) / sinom, 
                scale1 = Math.sin(t * omega) / sinom) : (scale0 = 1 - t, scale1 = t), 
                target.x = scale0 * ax + scale1 * bx, target.y = scale0 * ay + scale1 * by, 
                target.z = scale0 * az + scale1 * bz, target.w = scale0 * aw + scale1 * bw, 
                target;
            }, _proto.integrate = function(angularVelocity, dt, angularFactor, target) {
                void 0 === target && (target = new Quaternion());
                var ax = angularVelocity.x * angularFactor.x, ay = angularVelocity.y * angularFactor.y, az = angularVelocity.z * angularFactor.z, bx = this.x, by = this.y, bz = this.z, bw = this.w, half_dt = .5 * dt;
                return target.x += half_dt * (ax * bw + ay * bz - az * by), target.y += half_dt * (ay * bw + az * bx - ax * bz), 
                target.z += half_dt * (az * bw + ax * by - ay * bx), target.w += half_dt * (-ax * bx - ay * by - az * bz), 
                target;
            }, Quaternion;
        }(), sfv_t1 = new Vec3(), sfv_t2 = new Vec3(), SHAPE_TYPES = {
            SPHERE: 1,
            PLANE: 2,
            BOX: 4,
            COMPOUND: 8,
            CONVEXPOLYHEDRON: 16,
            HEIGHTFIELD: 32,
            PARTICLE: 64,
            CYLINDER: 128,
            TRIMESH: 256
        }, Shape = function() {
            function Shape(options) {
                void 0 === options && (options = {}), this.id = Shape.idCounter++, 
                this.type = options.type || 0, this.boundingSphereRadius = 0, this.collisionResponse = !options.collisionResponse || options.collisionResponse, 
                this.collisionFilterGroup = void 0 !== options.collisionFilterGroup ? options.collisionFilterGroup : 1, 
                this.collisionFilterMask = void 0 !== options.collisionFilterMask ? options.collisionFilterMask : -1, 
                this.material = options.material ? options.material : null, this.body = null;
            }
            var _proto = Shape.prototype;
            return _proto.updateBoundingSphereRadius = function() {
                throw "computeBoundingSphereRadius() not implemented for shape type " + this.type;
            }, _proto.volume = function() {
                throw "volume() not implemented for shape type " + this.type;
            }, _proto.calculateLocalInertia = function(mass, target) {
                throw "calculateLocalInertia() not implemented for shape type " + this.type;
            }, _proto.calculateWorldAABB = function(pos, quat, min, max) {
                throw "calculateWorldAABB() not implemented for shape type " + this.type;
            }, Shape;
        }();
        Shape.idCounter = 0, Shape.types = SHAPE_TYPES;
        var Transform = function() {
            function Transform(options) {
                void 0 === options && (options = {}), this.position = new Vec3(), 
                this.quaternion = new Quaternion(), options.position && this.position.copy(options.position), 
                options.quaternion && this.quaternion.copy(options.quaternion);
            }
            var _proto = Transform.prototype;
            return _proto.pointToLocal = function(worldPoint, result) {
                return Transform.pointToLocalFrame(this.position, this.quaternion, worldPoint, result);
            }, _proto.pointToWorld = function(localPoint, result) {
                return Transform.pointToWorldFrame(this.position, this.quaternion, localPoint, result);
            }, _proto.vectorToWorldFrame = function(localVector, result) {
                return void 0 === result && (result = new Vec3()), this.quaternion.vmult(localVector, result), 
                result;
            }, Transform.pointToLocalFrame = function(position, quaternion, worldPoint, result) {
                return void 0 === result && (result = new Vec3()), worldPoint.vsub(position, result), 
                quaternion.conjugate(tmpQuat), tmpQuat.vmult(result, result), result;
            }, Transform.pointToWorldFrame = function(position, quaternion, localPoint, result) {
                return void 0 === result && (result = new Vec3()), quaternion.vmult(localPoint, result), 
                result.vadd(position, result), result;
            }, Transform.vectorToWorldFrame = function(quaternion, localVector, result) {
                return void 0 === result && (result = new Vec3()), quaternion.vmult(localVector, result), 
                result;
            }, Transform.vectorToLocalFrame = function(position, quaternion, worldVector, result) {
                return void 0 === result && (result = new Vec3()), quaternion.w *= -1, 
                quaternion.vmult(worldVector, result), quaternion.w *= -1, result;
            }, Transform;
        }(), tmpQuat = new Quaternion(), ConvexPolyhedron = function(_Shape) {
            function ConvexPolyhedron(props) {
                var _this;
                void 0 === props && (props = {});
                var _props = props, _props$vertices = _props.vertices, vertices = void 0 === _props$vertices ? [] : _props$vertices, _props$faces = _props.faces, faces = void 0 === _props$faces ? [] : _props$faces, _props$normals = _props.normals, normals = void 0 === _props$normals ? [] : _props$normals, axes = _props.axes, boundingSphereRadius = _props.boundingSphereRadius;
                return (_this = _Shape.call(this, {
                    type: Shape.types.CONVEXPOLYHEDRON
                }) || this).vertices = vertices, _this.faces = faces, _this.faceNormals = normals, 
                0 === _this.faceNormals.length && _this.computeNormals(), boundingSphereRadius ? _this.boundingSphereRadius = boundingSphereRadius : _this.updateBoundingSphereRadius(), 
                _this.worldVertices = [], _this.worldVerticesNeedsUpdate = !0, _this.worldFaceNormals = [], 
                _this.worldFaceNormalsNeedsUpdate = !0, _this.uniqueAxes = axes ? axes.slice() : null, 
                _this.uniqueEdges = [], _this.computeEdges(), _this;
            }
            _inheritsLoose(ConvexPolyhedron, _Shape);
            var _proto = ConvexPolyhedron.prototype;
            return _proto.computeEdges = function() {
                var faces = this.faces, vertices = this.vertices, edges = this.uniqueEdges;
                edges.length = 0;
                for (var edge = new Vec3(), i = 0; i !== faces.length; i++) for (var face = faces[i], numVertices = face.length, j = 0; j !== numVertices; j++) {
                    var k = (j + 1) % numVertices;
                    vertices[face[j]].vsub(vertices[face[k]], edge), edge.normalize();
                    for (var found = !1, p = 0; p !== edges.length; p++) if (edges[p].almostEquals(edge) || edges[p].almostEquals(edge)) {
                        found = !0;
                        break;
                    }
                    found || edges.push(edge.clone());
                }
            }, _proto.computeNormals = function() {
                this.faceNormals.length = this.faces.length;
                for (var i = 0; i < this.faces.length; i++) {
                    for (var j = 0; j < this.faces[i].length; j++) if (!this.vertices[this.faces[i][j]]) throw new Error("Vertex " + this.faces[i][j] + " not found!");
                    var n = this.faceNormals[i] || new Vec3();
                    this.getFaceNormal(i, n), n.negate(n), this.faceNormals[i] = n;
                    var vertex = this.vertices[this.faces[i][0]];
                    if (n.dot(vertex) < 0) {
                        console.error(".faceNormals[" + i + "] = Vec3(" + n.toString() + ") looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.");
                        for (var _j = 0; _j < this.faces[i].length; _j++) console.warn(".vertices[" + this.faces[i][_j] + "] = Vec3(" + this.vertices[this.faces[i][_j]].toString() + ")");
                    }
                }
            }, _proto.getFaceNormal = function(i, target) {
                var f = this.faces[i], va = this.vertices[f[0]], vb = this.vertices[f[1]], vc = this.vertices[f[2]];
                ConvexPolyhedron.computeNormal(va, vb, vc, target);
            }, _proto.clipAgainstHull = function(posA, quatA, hullB, posB, quatB, separatingNormal, minDist, maxDist, result) {
                for (var WorldNormal = new Vec3(), closestFaceB = -1, dmax = -Number.MAX_VALUE, face = 0; face < hullB.faces.length; face++) {
                    WorldNormal.copy(hullB.faceNormals[face]), quatB.vmult(WorldNormal, WorldNormal);
                    var d = WorldNormal.dot(separatingNormal);
                    d > dmax && (dmax = d, closestFaceB = face);
                }
                for (var worldVertsB1 = [], i = 0; i < hullB.faces[closestFaceB].length; i++) {
                    var b = hullB.vertices[hullB.faces[closestFaceB][i]], worldb = new Vec3();
                    worldb.copy(b), quatB.vmult(worldb, worldb), posB.vadd(worldb, worldb), 
                    worldVertsB1.push(worldb);
                }
                closestFaceB >= 0 && this.clipFaceAgainstHull(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist, result);
            }, _proto.findSeparatingAxis = function(hullB, posA, quatA, posB, quatB, target, faceListA, faceListB) {
                var faceANormalWS3 = new Vec3(), Worldnormal1 = new Vec3(), deltaC = new Vec3(), worldEdge0 = new Vec3(), worldEdge1 = new Vec3(), Cross = new Vec3(), dmin = Number.MAX_VALUE;
                if (this.uniqueAxes) for (var _i = 0; _i !== this.uniqueAxes.length; _i++) {
                    quatA.vmult(this.uniqueAxes[_i], faceANormalWS3);
                    var _d = this.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB);
                    if (!1 === _d) return !1;
                    _d < dmin && (dmin = _d, target.copy(faceANormalWS3));
                } else for (var numFacesA = faceListA ? faceListA.length : this.faces.length, i = 0; i < numFacesA; i++) {
                    var fi = faceListA ? faceListA[i] : i;
                    faceANormalWS3.copy(this.faceNormals[fi]), quatA.vmult(faceANormalWS3, faceANormalWS3);
                    var d = this.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB);
                    if (!1 === d) return !1;
                    d < dmin && (dmin = d, target.copy(faceANormalWS3));
                }
                if (hullB.uniqueAxes) for (var _i3 = 0; _i3 !== hullB.uniqueAxes.length; _i3++) {
                    quatB.vmult(hullB.uniqueAxes[_i3], Worldnormal1);
                    var _d3 = this.testSepAxis(Worldnormal1, hullB, posA, quatA, posB, quatB);
                    if (!1 === _d3) return !1;
                    _d3 < dmin && (dmin = _d3, target.copy(Worldnormal1));
                } else for (var numFacesB = faceListB ? faceListB.length : hullB.faces.length, _i2 = 0; _i2 < numFacesB; _i2++) {
                    var _fi = faceListB ? faceListB[_i2] : _i2;
                    Worldnormal1.copy(hullB.faceNormals[_fi]), quatB.vmult(Worldnormal1, Worldnormal1);
                    var _d2 = this.testSepAxis(Worldnormal1, hullB, posA, quatA, posB, quatB);
                    if (!1 === _d2) return !1;
                    _d2 < dmin && (dmin = _d2, target.copy(Worldnormal1));
                }
                for (var e0 = 0; e0 !== this.uniqueEdges.length; e0++) {
                    quatA.vmult(this.uniqueEdges[e0], worldEdge0);
                    for (var e1 = 0; e1 !== hullB.uniqueEdges.length; e1++) if (quatB.vmult(hullB.uniqueEdges[e1], worldEdge1), 
                    worldEdge0.cross(worldEdge1, Cross), !Cross.almostZero()) {
                        Cross.normalize();
                        var dist = this.testSepAxis(Cross, hullB, posA, quatA, posB, quatB);
                        if (!1 === dist) return !1;
                        dist < dmin && (dmin = dist, target.copy(Cross));
                    }
                }
                return posB.vsub(posA, deltaC), deltaC.dot(target) > 0 && target.negate(target), 
                !0;
            }, _proto.testSepAxis = function(axis, hullB, posA, quatA, posB, quatB) {
                ConvexPolyhedron.project(this, axis, posA, quatA, maxminA), ConvexPolyhedron.project(hullB, axis, posB, quatB, maxminB);
                var maxA = maxminA[0], minA = maxminA[1], maxB = maxminB[0], minB = maxminB[1];
                if (maxA < minB || maxB < minA) return !1;
                var d0 = maxA - minB, d1 = maxB - minA;
                return d0 < d1 ? d0 : d1;
            }, _proto.calculateLocalInertia = function(mass, target) {
                var aabbmax = new Vec3(), aabbmin = new Vec3();
                this.computeLocalAABB(aabbmin, aabbmax);
                var x = aabbmax.x - aabbmin.x, y = aabbmax.y - aabbmin.y, z = aabbmax.z - aabbmin.z;
                target.x = 1 / 12 * mass * (2 * y * 2 * y + 2 * z * 2 * z), target.y = 1 / 12 * mass * (2 * x * 2 * x + 2 * z * 2 * z), 
                target.z = 1 / 12 * mass * (2 * y * 2 * y + 2 * x * 2 * x);
            }, _proto.getPlaneConstantOfFace = function(face_i) {
                var f = this.faces[face_i], n = this.faceNormals[face_i], v = this.vertices[f[0]];
                return -n.dot(v);
            }, _proto.clipFaceAgainstHull = function(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist, result) {
                for (var faceANormalWS = new Vec3(), edge0 = new Vec3(), WorldEdge0 = new Vec3(), worldPlaneAnormal1 = new Vec3(), planeNormalWS1 = new Vec3(), worldA1 = new Vec3(), localPlaneNormal = new Vec3(), planeNormalWS = new Vec3(), pVtxIn = worldVertsB1, pVtxOut = [], closestFaceA = -1, dmin = Number.MAX_VALUE, face = 0; face < this.faces.length; face++) {
                    faceANormalWS.copy(this.faceNormals[face]), quatA.vmult(faceANormalWS, faceANormalWS);
                    var d = faceANormalWS.dot(separatingNormal);
                    d < dmin && (dmin = d, closestFaceA = face);
                }
                if (!(closestFaceA < 0)) {
                    var polyA = this.faces[closestFaceA];
                    polyA.connectedFaces = [];
                    for (var i = 0; i < this.faces.length; i++) for (var j = 0; j < this.faces[i].length; j++) -1 !== polyA.indexOf(this.faces[i][j]) && i !== closestFaceA && -1 === polyA.connectedFaces.indexOf(i) && polyA.connectedFaces.push(i);
                    for (var numVerticesA = polyA.length, _i4 = 0; _i4 < numVerticesA; _i4++) {
                        var a = this.vertices[polyA[_i4]], b = this.vertices[polyA[(_i4 + 1) % numVerticesA]];
                        a.vsub(b, edge0), WorldEdge0.copy(edge0), quatA.vmult(WorldEdge0, WorldEdge0), 
                        posA.vadd(WorldEdge0, WorldEdge0), worldPlaneAnormal1.copy(this.faceNormals[closestFaceA]), 
                        quatA.vmult(worldPlaneAnormal1, worldPlaneAnormal1), posA.vadd(worldPlaneAnormal1, worldPlaneAnormal1), 
                        WorldEdge0.cross(worldPlaneAnormal1, planeNormalWS1), planeNormalWS1.negate(planeNormalWS1), 
                        worldA1.copy(a), quatA.vmult(worldA1, worldA1), posA.vadd(worldA1, worldA1);
                        var otherFace = polyA.connectedFaces[_i4];
                        localPlaneNormal.copy(this.faceNormals[otherFace]);
                        var _localPlaneEq = this.getPlaneConstantOfFace(otherFace);
                        planeNormalWS.copy(localPlaneNormal), quatA.vmult(planeNormalWS, planeNormalWS);
                        var _planeEqWS = _localPlaneEq - planeNormalWS.dot(posA);
                        for (this.clipFaceAgainstPlane(pVtxIn, pVtxOut, planeNormalWS, _planeEqWS); pVtxIn.length; ) pVtxIn.shift();
                        for (;pVtxOut.length; ) pVtxIn.push(pVtxOut.shift());
                    }
                    localPlaneNormal.copy(this.faceNormals[closestFaceA]);
                    var localPlaneEq = this.getPlaneConstantOfFace(closestFaceA);
                    planeNormalWS.copy(localPlaneNormal), quatA.vmult(planeNormalWS, planeNormalWS);
                    for (var planeEqWS = localPlaneEq - planeNormalWS.dot(posA), _i5 = 0; _i5 < pVtxIn.length; _i5++) {
                        var depth = planeNormalWS.dot(pVtxIn[_i5]) + planeEqWS;
                        if (depth <= minDist && (console.log("clamped: depth=" + depth + " to minDist=" + minDist), 
                        depth = minDist), depth <= maxDist) {
                            var point = pVtxIn[_i5];
                            if (depth <= 1e-6) {
                                var p = {
                                    point: point,
                                    normal: planeNormalWS,
                                    depth: depth
                                };
                                result.push(p);
                            }
                        }
                    }
                }
            }, _proto.clipFaceAgainstPlane = function(inVertices, outVertices, planeNormal, planeConstant) {
                var n_dot_first, n_dot_last, numVerts = inVertices.length;
                if (numVerts < 2) return outVertices;
                var firstVertex = inVertices[inVertices.length - 1], lastVertex = inVertices[0];
                n_dot_first = planeNormal.dot(firstVertex) + planeConstant;
                for (var vi = 0; vi < numVerts; vi++) {
                    if (lastVertex = inVertices[vi], n_dot_last = planeNormal.dot(lastVertex) + planeConstant, 
                    n_dot_first < 0) if (n_dot_last < 0) {
                        var newv = new Vec3();
                        newv.copy(lastVertex), outVertices.push(newv);
                    } else {
                        var _newv = new Vec3();
                        firstVertex.lerp(lastVertex, n_dot_first / (n_dot_first - n_dot_last), _newv), 
                        outVertices.push(_newv);
                    } else if (n_dot_last < 0) {
                        var _newv2 = new Vec3();
                        firstVertex.lerp(lastVertex, n_dot_first / (n_dot_first - n_dot_last), _newv2), 
                        outVertices.push(_newv2), outVertices.push(lastVertex);
                    }
                    firstVertex = lastVertex, n_dot_first = n_dot_last;
                }
                return outVertices;
            }, _proto.computeWorldVertices = function(position, quat) {
                for (;this.worldVertices.length < this.vertices.length; ) this.worldVertices.push(new Vec3());
                for (var verts = this.vertices, worldVerts = this.worldVertices, i = 0; i !== this.vertices.length; i++) quat.vmult(verts[i], worldVerts[i]), 
                position.vadd(worldVerts[i], worldVerts[i]);
                this.worldVerticesNeedsUpdate = !1;
            }, _proto.computeLocalAABB = function(aabbmin, aabbmax) {
                var vertices = this.vertices;
                aabbmin.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE), 
                aabbmax.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                for (var i = 0; i < this.vertices.length; i++) {
                    var v = vertices[i];
                    v.x < aabbmin.x ? aabbmin.x = v.x : v.x > aabbmax.x && (aabbmax.x = v.x), 
                    v.y < aabbmin.y ? aabbmin.y = v.y : v.y > aabbmax.y && (aabbmax.y = v.y), 
                    v.z < aabbmin.z ? aabbmin.z = v.z : v.z > aabbmax.z && (aabbmax.z = v.z);
                }
            }, _proto.computeWorldFaceNormals = function(quat) {
                for (var N = this.faceNormals.length; this.worldFaceNormals.length < N; ) this.worldFaceNormals.push(new Vec3());
                for (var normals = this.faceNormals, worldNormals = this.worldFaceNormals, i = 0; i !== N; i++) quat.vmult(normals[i], worldNormals[i]);
                this.worldFaceNormalsNeedsUpdate = !1;
            }, _proto.updateBoundingSphereRadius = function() {
                for (var max2 = 0, verts = this.vertices, i = 0; i !== verts.length; i++) {
                    var norm2 = verts[i].lengthSquared();
                    norm2 > max2 && (max2 = norm2);
                }
                this.boundingSphereRadius = Math.sqrt(max2);
            }, _proto.calculateWorldAABB = function(pos, quat, min, max) {
                for (var minx, miny, minz, maxx, maxy, maxz, verts = this.vertices, tempWorldVertex = new Vec3(), i = 0; i < verts.length; i++) {
                    tempWorldVertex.copy(verts[i]), quat.vmult(tempWorldVertex, tempWorldVertex), 
                    pos.vadd(tempWorldVertex, tempWorldVertex);
                    var v = tempWorldVertex;
                    (void 0 === minx || v.x < minx) && (minx = v.x), (void 0 === maxx || v.x > maxx) && (maxx = v.x), 
                    (void 0 === miny || v.y < miny) && (miny = v.y), (void 0 === maxy || v.y > maxy) && (maxy = v.y), 
                    (void 0 === minz || v.z < minz) && (minz = v.z), (void 0 === maxz || v.z > maxz) && (maxz = v.z);
                }
                min.set(minx, miny, minz), max.set(maxx, maxy, maxz);
            }, _proto.volume = function() {
                return 4 * Math.PI * this.boundingSphereRadius / 3;
            }, _proto.getAveragePointLocal = function(target) {
                void 0 === target && (target = new Vec3());
                for (var verts = this.vertices, i = 0; i < verts.length; i++) target.vadd(verts[i], target);
                return target.scale(1 / verts.length, target), target;
            }, _proto.transformAllPoints = function(offset, quat) {
                var n = this.vertices.length, verts = this.vertices;
                if (quat) {
                    for (var i = 0; i < n; i++) {
                        var v = verts[i];
                        quat.vmult(v, v);
                    }
                    for (var _i6 = 0; _i6 < this.faceNormals.length; _i6++) {
                        var _v = this.faceNormals[_i6];
                        quat.vmult(_v, _v);
                    }
                }
                if (offset) for (var _i7 = 0; _i7 < n; _i7++) {
                    var _v2 = verts[_i7];
                    _v2.vadd(offset, _v2);
                }
            }, _proto.pointIsInside = function(p) {
                var verts = this.vertices, faces = this.faces, normals = this.faceNormals, pointInside = new Vec3();
                this.getAveragePointLocal(pointInside);
                for (var i = 0; i < this.faces.length; i++) {
                    var n = normals[i], v = verts[faces[i][0]], vToP = new Vec3();
                    p.vsub(v, vToP);
                    var r1 = n.dot(vToP), vToPointInside = new Vec3();
                    pointInside.vsub(v, vToPointInside);
                    var r2 = n.dot(vToPointInside);
                    if (r1 < 0 && r2 > 0 || r1 > 0 && r2 < 0) return !1;
                }
                return -1;
            }, ConvexPolyhedron;
        }(Shape);
        ConvexPolyhedron.computeNormal = function(va, vb, vc, target) {
            var cb = new Vec3(), ab = new Vec3();
            vb.vsub(va, ab), vc.vsub(vb, cb), cb.cross(ab, target), target.isZero() || target.normalize();
        };
        var maxminA = [], maxminB = [];
        ConvexPolyhedron.project = function(shape, axis, pos, quat, result) {
            var n = shape.vertices.length, localAxis = new Vec3(), max = 0, min = 0, localOrigin = new Vec3(), vs = shape.vertices;
            localOrigin.setZero(), Transform.vectorToLocalFrame(pos, quat, axis, localAxis), 
            Transform.pointToLocalFrame(pos, quat, localOrigin, localOrigin);
            var add = localOrigin.dot(localAxis);
            min = max = vs[0].dot(localAxis);
            for (var i = 1; i < n; i++) {
                var val = vs[i].dot(localAxis);
                val > max && (max = val), val < min && (min = val);
            }
            if ((min -= add) > (max -= add)) {
                var temp = min;
                min = max, max = temp;
            }
            result[0] = max, result[1] = min;
        };
        var Box = function(_Shape) {
            function Box(halfExtents) {
                var _this;
                return (_this = _Shape.call(this, {
                    type: Shape.types.BOX
                }) || this).halfExtents = halfExtents, _this.convexPolyhedronRepresentation = null, 
                _this.updateConvexPolyhedronRepresentation(), _this.updateBoundingSphereRadius(), 
                _this;
            }
            _inheritsLoose(Box, _Shape);
            var _proto = Box.prototype;
            return _proto.updateConvexPolyhedronRepresentation = function() {
                var sx = this.halfExtents.x, sy = this.halfExtents.y, sz = this.halfExtents.z, V = Vec3, vertices = [ new V(-sx, -sy, -sz), new V(sx, -sy, -sz), new V(sx, sy, -sz), new V(-sx, sy, -sz), new V(-sx, -sy, sz), new V(sx, -sy, sz), new V(sx, sy, sz), new V(-sx, sy, sz) ], axes = [ new V(0, 0, 1), new V(0, 1, 0), new V(1, 0, 0) ], h = new ConvexPolyhedron({
                    vertices: vertices,
                    faces: [ [ 3, 2, 1, 0 ], [ 4, 5, 6, 7 ], [ 5, 4, 0, 1 ], [ 2, 3, 7, 6 ], [ 0, 4, 7, 3 ], [ 1, 2, 6, 5 ] ],
                    axes: axes
                });
                this.convexPolyhedronRepresentation = h, h.material = this.material;
            }, _proto.calculateLocalInertia = function(mass, target) {
                return void 0 === target && (target = new Vec3()), Box.calculateInertia(this.halfExtents, mass, target), 
                target;
            }, _proto.getSideNormals = function(sixTargetVectors, quat) {
                var sides = sixTargetVectors, ex = this.halfExtents;
                if (sides[0].set(ex.x, 0, 0), sides[1].set(0, ex.y, 0), sides[2].set(0, 0, ex.z), 
                sides[3].set(-ex.x, 0, 0), sides[4].set(0, -ex.y, 0), sides[5].set(0, 0, -ex.z), 
                void 0 !== quat) for (var i = 0; i !== sides.length; i++) quat.vmult(sides[i], sides[i]);
                return sides;
            }, _proto.volume = function() {
                return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z;
            }, _proto.updateBoundingSphereRadius = function() {
                this.boundingSphereRadius = this.halfExtents.length();
            }, _proto.forEachWorldCorner = function(pos, quat, callback) {
                for (var e = this.halfExtents, corners = [ [ e.x, e.y, e.z ], [ -e.x, e.y, e.z ], [ -e.x, -e.y, e.z ], [ -e.x, -e.y, -e.z ], [ e.x, -e.y, -e.z ], [ e.x, e.y, -e.z ], [ -e.x, e.y, -e.z ], [ e.x, -e.y, e.z ] ], i = 0; i < corners.length; i++) worldCornerTempPos.set(corners[i][0], corners[i][1], corners[i][2]), 
                quat.vmult(worldCornerTempPos, worldCornerTempPos), pos.vadd(worldCornerTempPos, worldCornerTempPos), 
                callback(worldCornerTempPos.x, worldCornerTempPos.y, worldCornerTempPos.z);
            }, _proto.calculateWorldAABB = function(pos, quat, min, max) {
                var e = this.halfExtents;
                worldCornersTemp[0].set(e.x, e.y, e.z), worldCornersTemp[1].set(-e.x, e.y, e.z), 
                worldCornersTemp[2].set(-e.x, -e.y, e.z), worldCornersTemp[3].set(-e.x, -e.y, -e.z), 
                worldCornersTemp[4].set(e.x, -e.y, -e.z), worldCornersTemp[5].set(e.x, e.y, -e.z), 
                worldCornersTemp[6].set(-e.x, e.y, -e.z), worldCornersTemp[7].set(e.x, -e.y, e.z);
                var wc = worldCornersTemp[0];
                quat.vmult(wc, wc), pos.vadd(wc, wc), max.copy(wc), min.copy(wc);
                for (var i = 1; i < 8; i++) {
                    var _wc = worldCornersTemp[i];
                    quat.vmult(_wc, _wc), pos.vadd(_wc, _wc);
                    var _x = _wc.x, _y = _wc.y, _z = _wc.z;
                    _x > max.x && (max.x = _x), _y > max.y && (max.y = _y), _z > max.z && (max.z = _z), 
                    _x < min.x && (min.x = _x), _y < min.y && (min.y = _y), _z < min.z && (min.z = _z);
                }
            }, Box;
        }(Shape);
        Box.calculateInertia = function(halfExtents, mass, target) {
            var e = halfExtents;
            target.x = 1 / 12 * mass * (2 * e.y * 2 * e.y + 2 * e.z * 2 * e.z), 
            target.y = 1 / 12 * mass * (2 * e.x * 2 * e.x + 2 * e.z * 2 * e.z), 
            target.z = 1 / 12 * mass * (2 * e.y * 2 * e.y + 2 * e.x * 2 * e.x);
        };
        var worldCornerTempPos = new Vec3(), worldCornersTemp = [ new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3() ], BODY_SLEEP_STATES = {
            AWAKE: 0,
            SLEEPY: 1,
            SLEEPING: 2
        }, Body = function(_EventTarget) {
            function Body(options) {
                var _this;
                void 0 === options && (options = {}), (_this = _EventTarget.call(this) || this).id = Body.idCounter++, 
                _this.index = -1, _this.world = null, _this.preStep = null, _this.postStep = null, 
                _this.vlambda = new Vec3(), _this.collisionFilterGroup = "number" == typeof options.collisionFilterGroup ? options.collisionFilterGroup : 1, 
                _this.collisionFilterMask = "number" == typeof options.collisionFilterMask ? options.collisionFilterMask : -1, 
                _this.collisionResponse = "boolean" != typeof options.collisionResponse || options.collisionResponse, 
                _this.position = new Vec3(), _this.previousPosition = new Vec3(), 
                _this.interpolatedPosition = new Vec3(), _this.initPosition = new Vec3(), 
                options.position && (_this.position.copy(options.position), _this.previousPosition.copy(options.position), 
                _this.interpolatedPosition.copy(options.position), _this.initPosition.copy(options.position)), 
                _this.velocity = new Vec3(), options.velocity && _this.velocity.copy(options.velocity), 
                _this.initVelocity = new Vec3(), _this.force = new Vec3();
                var mass = "number" == typeof options.mass ? options.mass : 0;
                return _this.mass = mass, _this.invMass = mass > 0 ? 1 / mass : 0, 
                _this.material = options.material || null, _this.linearDamping = "number" == typeof options.linearDamping ? options.linearDamping : .01, 
                _this.type = mass <= 0 ? Body.STATIC : Body.DYNAMIC, typeof options.type == typeof Body.STATIC && (_this.type = options.type), 
                _this.allowSleep = void 0 === options.allowSleep || options.allowSleep, 
                _this.sleepState = 0, _this.sleepSpeedLimit = void 0 !== options.sleepSpeedLimit ? options.sleepSpeedLimit : .1, 
                _this.sleepTimeLimit = void 0 !== options.sleepTimeLimit ? options.sleepTimeLimit : 1, 
                _this.timeLastSleepy = 0, _this.wakeUpAfterNarrowphase = !1, _this.torque = new Vec3(), 
                _this.quaternion = new Quaternion(), _this.initQuaternion = new Quaternion(), 
                _this.previousQuaternion = new Quaternion(), _this.interpolatedQuaternion = new Quaternion(), 
                options.quaternion && (_this.quaternion.copy(options.quaternion), 
                _this.initQuaternion.copy(options.quaternion), _this.previousQuaternion.copy(options.quaternion), 
                _this.interpolatedQuaternion.copy(options.quaternion)), _this.angularVelocity = new Vec3(), 
                options.angularVelocity && _this.angularVelocity.copy(options.angularVelocity), 
                _this.initAngularVelocity = new Vec3(), _this.shapes = [], _this.shapeOffsets = [], 
                _this.shapeOrientations = [], _this.inertia = new Vec3(), _this.invInertia = new Vec3(), 
                _this.invInertiaWorld = new Mat3(), _this.invMassSolve = 0, _this.invInertiaSolve = new Vec3(), 
                _this.invInertiaWorldSolve = new Mat3(), _this.fixedRotation = void 0 !== options.fixedRotation && options.fixedRotation, 
                _this.angularDamping = void 0 !== options.angularDamping ? options.angularDamping : .01, 
                _this.linearFactor = new Vec3(1, 1, 1), options.linearFactor && _this.linearFactor.copy(options.linearFactor), 
                _this.angularFactor = new Vec3(1, 1, 1), options.angularFactor && _this.angularFactor.copy(options.angularFactor), 
                _this.aabb = new AABB(), _this.aabbNeedsUpdate = !0, _this.boundingRadius = 0, 
                _this.wlambda = new Vec3(), options.shape && _this.addShape(options.shape), 
                _this.updateMassProperties(), _this;
            }
            _inheritsLoose(Body, _EventTarget);
            var _proto = Body.prototype;
            return _proto.wakeUp = function() {
                var prevState = this.sleepState;
                this.sleepState = 0, this.wakeUpAfterNarrowphase = !1, prevState === Body.SLEEPING && this.dispatchEvent(Body.wakeupEvent);
            }, _proto.sleep = function() {
                this.sleepState = Body.SLEEPING, this.velocity.set(0, 0, 0), this.angularVelocity.set(0, 0, 0), 
                this.wakeUpAfterNarrowphase = !1;
            }, _proto.sleepTick = function(time) {
                if (this.allowSleep) {
                    var sleepState = this.sleepState, speedSquared = this.velocity.lengthSquared() + this.angularVelocity.lengthSquared(), speedLimitSquared = Math.pow(this.sleepSpeedLimit, 2);
                    sleepState === Body.AWAKE && speedSquared < speedLimitSquared ? (this.sleepState = Body.SLEEPY, 
                    this.timeLastSleepy = time, this.dispatchEvent(Body.sleepyEvent)) : sleepState === Body.SLEEPY && speedSquared > speedLimitSquared ? this.wakeUp() : sleepState === Body.SLEEPY && time - this.timeLastSleepy > this.sleepTimeLimit && (this.sleep(), 
                    this.dispatchEvent(Body.sleepEvent));
                }
            }, _proto.updateSolveMassProperties = function() {
                this.sleepState === Body.SLEEPING || this.type === Body.KINEMATIC ? (this.invMassSolve = 0, 
                this.invInertiaSolve.setZero(), this.invInertiaWorldSolve.setZero()) : (this.invMassSolve = this.invMass, 
                this.invInertiaSolve.copy(this.invInertia), this.invInertiaWorldSolve.copy(this.invInertiaWorld));
            }, _proto.pointToLocalFrame = function(worldPoint, result) {
                return void 0 === result && (result = new Vec3()), worldPoint.vsub(this.position, result), 
                this.quaternion.conjugate().vmult(result, result), result;
            }, _proto.vectorToLocalFrame = function(worldVector, result) {
                return void 0 === result && (result = new Vec3()), this.quaternion.conjugate().vmult(worldVector, result), 
                result;
            }, _proto.pointToWorldFrame = function(localPoint, result) {
                return void 0 === result && (result = new Vec3()), this.quaternion.vmult(localPoint, result), 
                result.vadd(this.position, result), result;
            }, _proto.vectorToWorldFrame = function(localVector, result) {
                return void 0 === result && (result = new Vec3()), this.quaternion.vmult(localVector, result), 
                result;
            }, _proto.addShape = function(shape, _offset, _orientation) {
                var offset = new Vec3(), orientation = new Quaternion();
                return _offset && offset.copy(_offset), _orientation && orientation.copy(_orientation), 
                this.shapes.push(shape), this.shapeOffsets.push(offset), this.shapeOrientations.push(orientation), 
                this.updateMassProperties(), this.updateBoundingRadius(), this.aabbNeedsUpdate = !0, 
                shape.body = this, this;
            }, _proto.updateBoundingRadius = function() {
                for (var shapes = this.shapes, shapeOffsets = this.shapeOffsets, N = shapes.length, radius = 0, i = 0; i !== N; i++) {
                    var shape = shapes[i];
                    shape.updateBoundingSphereRadius();
                    var offset = shapeOffsets[i].length(), r = shape.boundingSphereRadius;
                    offset + r > radius && (radius = offset + r);
                }
                this.boundingRadius = radius;
            }, _proto.computeAABB = function() {
                for (var shapes = this.shapes, shapeOffsets = this.shapeOffsets, shapeOrientations = this.shapeOrientations, N = shapes.length, offset = tmpVec, orientation = tmpQuat$1, bodyQuat = this.quaternion, aabb = this.aabb, shapeAABB = computeAABB_shapeAABB, i = 0; i !== N; i++) {
                    var shape = shapes[i];
                    bodyQuat.vmult(shapeOffsets[i], offset), offset.vadd(this.position, offset), 
                    bodyQuat.mult(shapeOrientations[i], orientation), shape.calculateWorldAABB(offset, orientation, shapeAABB.lowerBound, shapeAABB.upperBound), 
                    0 === i ? aabb.copy(shapeAABB) : aabb.extend(shapeAABB);
                }
                this.aabbNeedsUpdate = !1;
            }, _proto.updateInertiaWorld = function(force) {
                var I = this.invInertia;
                if (I.x !== I.y || I.y !== I.z || force) {
                    var m1 = uiw_m1, m2 = uiw_m2;
                    m1.setRotationFromQuaternion(this.quaternion), m1.transpose(m2), 
                    m1.scale(I, m1), m1.mmult(m2, this.invInertiaWorld);
                } else;
            }, _proto.applyForce = function(force, relativePoint) {
                if (this.type === Body.DYNAMIC) {
                    var rotForce = Body_applyForce_rotForce;
                    relativePoint.cross(force, rotForce), this.force.vadd(force, this.force), 
                    this.torque.vadd(rotForce, this.torque);
                }
            }, _proto.applyLocalForce = function(localForce, localPoint) {
                if (this.type === Body.DYNAMIC) {
                    var worldForce = Body_applyLocalForce_worldForce, relativePointWorld = Body_applyLocalForce_relativePointWorld;
                    this.vectorToWorldFrame(localForce, worldForce), this.vectorToWorldFrame(localPoint, relativePointWorld), 
                    this.applyForce(worldForce, relativePointWorld);
                }
            }, _proto.applyImpulse = function(impulse, relativePoint) {
                if (this.type === Body.DYNAMIC) {
                    var r = relativePoint, velo = Body_applyImpulse_velo;
                    velo.copy(impulse), velo.scale(this.invMass, velo), this.velocity.vadd(velo, this.velocity);
                    var rotVelo = Body_applyImpulse_rotVelo;
                    r.cross(impulse, rotVelo), this.invInertiaWorld.vmult(rotVelo, rotVelo), 
                    this.angularVelocity.vadd(rotVelo, this.angularVelocity);
                }
            }, _proto.applyLocalImpulse = function(localImpulse, localPoint) {
                if (this.type === Body.DYNAMIC) {
                    var worldImpulse = Body_applyLocalImpulse_worldImpulse, relativePointWorld = Body_applyLocalImpulse_relativePoint;
                    this.vectorToWorldFrame(localImpulse, worldImpulse), this.vectorToWorldFrame(localPoint, relativePointWorld), 
                    this.applyImpulse(worldImpulse, relativePointWorld);
                }
            }, _proto.updateMassProperties = function() {
                var halfExtents = Body_updateMassProperties_halfExtents;
                this.invMass = this.mass > 0 ? 1 / this.mass : 0;
                var I = this.inertia, fixed = this.fixedRotation;
                this.computeAABB(), halfExtents.set((this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2, (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2, (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2), 
                Box.calculateInertia(halfExtents, this.mass, I), this.invInertia.set(I.x > 0 && !fixed ? 1 / I.x : 0, I.y > 0 && !fixed ? 1 / I.y : 0, I.z > 0 && !fixed ? 1 / I.z : 0), 
                this.updateInertiaWorld(!0);
            }, _proto.getVelocityAtWorldPoint = function(worldPoint, result) {
                var r = new Vec3();
                return worldPoint.vsub(this.position, r), this.angularVelocity.cross(r, result), 
                this.velocity.vadd(result, result), result;
            }, _proto.integrate = function(dt, quatNormalize, quatNormalizeFast) {
                if (this.previousPosition.copy(this.position), this.previousQuaternion.copy(this.quaternion), 
                (this.type === Body.DYNAMIC || this.type === Body.KINEMATIC) && this.sleepState !== Body.SLEEPING) {
                    var velo = this.velocity, angularVelo = this.angularVelocity, pos = this.position, force = this.force, torque = this.torque, quat = this.quaternion, invMass = this.invMass, invInertia = this.invInertiaWorld, linearFactor = this.linearFactor, iMdt = invMass * dt;
                    velo.x += force.x * iMdt * linearFactor.x, velo.y += force.y * iMdt * linearFactor.y, 
                    velo.z += force.z * iMdt * linearFactor.z;
                    var e = invInertia.elements, angularFactor = this.angularFactor, tx = torque.x * angularFactor.x, ty = torque.y * angularFactor.y, tz = torque.z * angularFactor.z;
                    angularVelo.x += dt * (e[0] * tx + e[1] * ty + e[2] * tz), angularVelo.y += dt * (e[3] * tx + e[4] * ty + e[5] * tz), 
                    angularVelo.z += dt * (e[6] * tx + e[7] * ty + e[8] * tz), pos.x += velo.x * dt, 
                    pos.y += velo.y * dt, pos.z += velo.z * dt, quat.integrate(this.angularVelocity, dt, this.angularFactor, quat), 
                    quatNormalize && (quatNormalizeFast ? quat.normalizeFast() : quat.normalize()), 
                    this.aabbNeedsUpdate = !0, this.updateInertiaWorld();
                }
            }, Body;
        }(EventTarget);
        Body.COLLIDE_EVENT_NAME = "collide", Body.DYNAMIC = 1, Body.STATIC = 2, 
        Body.KINEMATIC = 4, Body.AWAKE = BODY_SLEEP_STATES.AWAKE, Body.SLEEPY = BODY_SLEEP_STATES.SLEEPY, 
        Body.SLEEPING = BODY_SLEEP_STATES.SLEEPING, Body.idCounter = 0, Body.wakeupEvent = {
            type: "wakeup"
        }, Body.sleepyEvent = {
            type: "sleepy"
        }, Body.sleepEvent = {
            type: "sleep"
        };
        var tmpVec = new Vec3(), tmpQuat$1 = new Quaternion(), computeAABB_shapeAABB = new AABB(), uiw_m1 = new Mat3(), uiw_m2 = new Mat3(), Body_applyForce_rotForce = (new Mat3(), 
        new Vec3()), Body_applyLocalForce_worldForce = new Vec3(), Body_applyLocalForce_relativePointWorld = new Vec3(), Body_applyImpulse_velo = new Vec3(), Body_applyImpulse_rotVelo = new Vec3(), Body_applyLocalImpulse_worldImpulse = new Vec3(), Body_applyLocalImpulse_relativePoint = new Vec3(), Body_updateMassProperties_halfExtents = new Vec3(), Broadphase = function() {
            function Broadphase() {
                this.world = null, this.useBoundingBoxes = !1, this.dirty = !0;
            }
            var _proto = Broadphase.prototype;
            return _proto.collisionPairs = function(world, p1, p2) {
                throw new Error("collisionPairs not implemented for this BroadPhase class!");
            }, _proto.needBroadphaseCollision = function(bodyA, bodyB) {
                return 0 != (bodyA.collisionFilterGroup & bodyB.collisionFilterMask) && 0 != (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) && (0 == (bodyA.type & Body.STATIC) && bodyA.sleepState !== Body.SLEEPING || 0 == (bodyB.type & Body.STATIC) && bodyB.sleepState !== Body.SLEEPING);
            }, _proto.intersectionTest = function(bodyA, bodyB, pairs1, pairs2) {
                this.useBoundingBoxes ? this.doBoundingBoxBroadphase(bodyA, bodyB, pairs1, pairs2) : this.doBoundingSphereBroadphase(bodyA, bodyB, pairs1, pairs2);
            }, _proto.doBoundingSphereBroadphase = function(bodyA, bodyB, pairs1, pairs2) {
                var r = Broadphase_collisionPairs_r;
                bodyB.position.vsub(bodyA.position, r);
                var boundingRadiusSum2 = Math.pow(bodyA.boundingRadius + bodyB.boundingRadius, 2);
                r.lengthSquared() < boundingRadiusSum2 && (pairs1.push(bodyA), pairs2.push(bodyB));
            }, _proto.doBoundingBoxBroadphase = function(bodyA, bodyB, pairs1, pairs2) {
                bodyA.aabbNeedsUpdate && bodyA.computeAABB(), bodyB.aabbNeedsUpdate && bodyB.computeAABB(), 
                bodyA.aabb.overlaps(bodyB.aabb) && (pairs1.push(bodyA), pairs2.push(bodyB));
            }, _proto.makePairsUnique = function(pairs1, pairs2) {
                for (var t = Broadphase_makePairsUnique_temp, p1 = Broadphase_makePairsUnique_p1, p2 = Broadphase_makePairsUnique_p2, N = pairs1.length, i = 0; i !== N; i++) p1[i] = pairs1[i], 
                p2[i] = pairs2[i];
                pairs1.length = 0, pairs2.length = 0;
                for (var _i = 0; _i !== N; _i++) {
                    var id1 = p1[_i].id, id2 = p2[_i].id, key = id1 < id2 ? id1 + "," + id2 : id2 + "," + id1;
                    t[key] = _i, t.keys.push(key);
                }
                for (var _i2 = 0; _i2 !== t.keys.length; _i2++) {
                    var _key = t.keys.pop(), pairIndex = t[_key];
                    pairs1.push(p1[pairIndex]), pairs2.push(p2[pairIndex]), delete t[_key];
                }
            }, _proto.setWorld = function(world) {}, _proto.aabbQuery = function(world, aabb, result) {
                return console.warn(".aabbQuery is not implemented in this Broadphase subclass."), 
                [];
            }, Broadphase;
        }(), Broadphase_collisionPairs_r = new Vec3(), Broadphase_makePairsUnique_temp = (new Vec3(), 
        new Quaternion(), new Vec3(), {
            keys: []
        }), Broadphase_makePairsUnique_p1 = [], Broadphase_makePairsUnique_p2 = [];
        new Vec3();
        Broadphase.boundingSphereCheck = function(bodyA, bodyB) {
            var dist = new Vec3();
            bodyA.position.vsub(bodyB.position, dist);
            var sa = bodyA.shapes[0], sb = bodyB.shapes[0];
            return Math.pow(sa.boundingSphereRadius + sb.boundingSphereRadius, 2) > dist.lengthSquared();
        };
        var GridBroadphase = function(_Broadphase) {
            function GridBroadphase(aabbMin, aabbMax, nx, ny, nz) {
                var _this;
                void 0 === aabbMin && (aabbMin = new Vec3(100, 100, 100)), void 0 === aabbMax && (aabbMax = new Vec3(-100, -100, -100)), 
                void 0 === nx && (nx = 10), void 0 === ny && (ny = 10), void 0 === nz && (nz = 10), 
                (_this = _Broadphase.call(this) || this).nx = nx, _this.ny = ny, 
                _this.nz = nz, _this.aabbMin = aabbMin, _this.aabbMax = aabbMax;
                var nbins = _this.nx * _this.ny * _this.nz;
                if (nbins <= 0) throw "GridBroadphase: Each dimension's n must be >0";
                _this.bins = [], _this.binLengths = [], _this.bins.length = nbins, 
                _this.binLengths.length = nbins;
                for (var i = 0; i < nbins; i++) _this.bins[i] = [], _this.binLengths[i] = 0;
                return _this;
            }
            return _inheritsLoose(GridBroadphase, _Broadphase), GridBroadphase.prototype.collisionPairs = function(world, pairs1, pairs2) {
                for (var N = world.numObjects(), bodies = world.bodies, max = this.aabbMax, min = this.aabbMin, nx = this.nx, ny = this.ny, nz = this.nz, xstep = ny * nz, ystep = nz, zstep = 1, xmax = max.x, ymax = max.y, zmax = max.z, xmin = min.x, ymin = min.y, zmin = min.z, xmult = nx / (xmax - xmin), ymult = ny / (ymax - ymin), zmult = nz / (zmax - zmin), binsizeX = (xmax - xmin) / nx, binsizeY = (ymax - ymin) / ny, binsizeZ = (zmax - zmin) / nz, binRadius = .5 * Math.sqrt(binsizeX * binsizeX + binsizeY * binsizeY + binsizeZ * binsizeZ), types = Shape.types, SPHERE = types.SPHERE, PLANE = types.PLANE, bins = (types.BOX, 
                types.COMPOUND, types.CONVEXPOLYHEDRON, this.bins), binLengths = this.binLengths, Nbins = this.bins.length, i = 0; i !== Nbins; i++) binLengths[i] = 0;
                var ceil = Math.ceil;
                function addBoxToBins(x0, y0, z0, x1, y1, z1, bi) {
                    var xoff0 = (x0 - xmin) * xmult | 0, yoff0 = (y0 - ymin) * ymult | 0, zoff0 = (z0 - zmin) * zmult | 0, xoff1 = ceil((x1 - xmin) * xmult), yoff1 = ceil((y1 - ymin) * ymult), zoff1 = ceil((z1 - zmin) * zmult);
                    xoff0 < 0 ? xoff0 = 0 : xoff0 >= nx && (xoff0 = nx - 1), yoff0 < 0 ? yoff0 = 0 : yoff0 >= ny && (yoff0 = ny - 1), 
                    zoff0 < 0 ? zoff0 = 0 : zoff0 >= nz && (zoff0 = nz - 1), xoff1 < 0 ? xoff1 = 0 : xoff1 >= nx && (xoff1 = nx - 1), 
                    yoff1 < 0 ? yoff1 = 0 : yoff1 >= ny && (yoff1 = ny - 1), zoff1 < 0 ? zoff1 = 0 : zoff1 >= nz && (zoff1 = nz - 1), 
                    yoff0 *= ystep, zoff0 *= zstep, xoff1 *= xstep, yoff1 *= ystep, 
                    zoff1 *= zstep;
                    for (var xoff = xoff0 *= xstep; xoff <= xoff1; xoff += xstep) for (var yoff = yoff0; yoff <= yoff1; yoff += ystep) for (var zoff = zoff0; zoff <= zoff1; zoff += zstep) {
                        var idx = xoff + yoff + zoff;
                        bins[idx][binLengths[idx]++] = bi;
                    }
                }
                for (var _i = 0; _i !== N; _i++) {
                    var bi = bodies[_i], si = bi.shapes[0];
                    switch (si.type) {
                      case SPHERE:
                        var shape = si, x = bi.position.x, y = bi.position.y, z = bi.position.z, r = shape.radius;
                        addBoxToBins(x - r, y - r, z - r, x + r, y + r, z + r, bi);
                        break;

                      case PLANE:
                        var _shape = si;
                        _shape.worldNormalNeedsUpdate && _shape.computeWorldNormal(bi.quaternion);
                        var planeNormal = _shape.worldNormal, xreset = xmin + .5 * binsizeX - bi.position.x, yreset = ymin + .5 * binsizeY - bi.position.y, zreset = zmin + .5 * binsizeZ - bi.position.z, d = GridBroadphase_collisionPairs_d;
                        d.set(xreset, yreset, zreset);
                        for (var xi = 0, xoff = 0; xi !== nx; xi++, xoff += xstep, 
                        d.y = yreset, d.x += binsizeX) for (var yi = 0, yoff = 0; yi !== ny; yi++, 
                        yoff += ystep, d.z = zreset, d.y += binsizeY) for (var zi = 0, zoff = 0; zi !== nz; zi++, 
                        zoff += zstep, d.z += binsizeZ) if (d.dot(planeNormal) < binRadius) {
                            var idx = xoff + yoff + zoff;
                            bins[idx][binLengths[idx]++] = bi;
                        }
                        break;

                      default:
                        bi.aabbNeedsUpdate && bi.computeAABB(), addBoxToBins(bi.aabb.lowerBound.x, bi.aabb.lowerBound.y, bi.aabb.lowerBound.z, bi.aabb.upperBound.x, bi.aabb.upperBound.y, bi.aabb.upperBound.z, bi);
                    }
                }
                for (var _i2 = 0; _i2 !== Nbins; _i2++) {
                    var binLength = binLengths[_i2];
                    if (binLength > 1) for (var bin = bins[_i2], _xi = 0; _xi !== binLength; _xi++) for (var _bi = bin[_xi], _yi = 0; _yi !== _xi; _yi++) {
                        var bj = bin[_yi];
                        this.needBroadphaseCollision(_bi, bj) && this.intersectionTest(_bi, bj, pairs1, pairs2);
                    }
                }
                this.makePairsUnique(pairs1, pairs2);
            }, GridBroadphase;
        }(Broadphase), GridBroadphase_collisionPairs_d = new Vec3(), NaiveBroadphase = (new Vec3(), 
        function(_Broadphase) {
            function NaiveBroadphase() {
                return _Broadphase.call(this) || this;
            }
            _inheritsLoose(NaiveBroadphase, _Broadphase);
            var _proto = NaiveBroadphase.prototype;
            return _proto.collisionPairs = function(world, pairs1, pairs2) {
                for (var bi, bj, bodies = world.bodies, n = bodies.length, i = 0; i !== n; i++) for (var j = 0; j !== i; j++) bi = bodies[i], 
                bj = bodies[j], this.needBroadphaseCollision(bi, bj) && this.intersectionTest(bi, bj, pairs1, pairs2);
            }, _proto.aabbQuery = function(world, aabb, result) {
                void 0 === result && (result = []);
                for (var i = 0; i < world.bodies.length; i++) {
                    var b = world.bodies[i];
                    b.aabbNeedsUpdate && b.computeAABB(), b.aabb.overlaps(aabb) && result.push(b);
                }
                return result;
            }, NaiveBroadphase;
        }(Broadphase)), RaycastResult = function() {
            function RaycastResult() {
                this.rayFromWorld = new Vec3(), this.rayToWorld = new Vec3(), this.hitNormalWorld = new Vec3(), 
                this.hitPointWorld = new Vec3(), this.hasHit = !1, this.shape = null, 
                this.body = null, this.hitFaceIndex = -1, this.distance = -1, this.shouldStop = !1;
            }
            var _proto = RaycastResult.prototype;
            return _proto.reset = function() {
                this.rayFromWorld.setZero(), this.rayToWorld.setZero(), this.hitNormalWorld.setZero(), 
                this.hitPointWorld.setZero(), this.hasHit = !1, this.shape = null, 
                this.body = null, this.hitFaceIndex = -1, this.distance = -1, this.shouldStop = !1;
            }, _proto.abort = function() {
                this.shouldStop = !0;
            }, _proto.set = function(rayFromWorld, rayToWorld, hitNormalWorld, hitPointWorld, shape, body, distance) {
                this.rayFromWorld.copy(rayFromWorld), this.rayToWorld.copy(rayToWorld), 
                this.hitNormalWorld.copy(hitNormalWorld), this.hitPointWorld.copy(hitPointWorld), 
                this.shape = shape, this.body = body, this.distance = distance;
            }, RaycastResult;
        }(), Ray = function() {
            function Ray(from, to) {
                void 0 === from && (from = new Vec3()), void 0 === to && (to = new Vec3()), 
                this.from = from.clone(), this.to = to.clone(), this.direction = new Vec3(), 
                this.precision = 1e-4, this.checkCollisionResponse = !0, this.skipBackfaces = !1, 
                this.collisionFilterMask = -1, this.collisionFilterGroup = -1, this.mode = Ray.ANY, 
                this.result = new RaycastResult(), this.hasHit = !1, this.callback = function(result) {};
            }
            var _proto = Ray.prototype;
            return _proto.intersectWorld = function(world, options) {
                return this.mode = options.mode || Ray.ANY, this.result = options.result || new RaycastResult(), 
                this.skipBackfaces = !!options.skipBackfaces, this.collisionFilterMask = void 0 !== options.collisionFilterMask ? options.collisionFilterMask : -1, 
                this.collisionFilterGroup = void 0 !== options.collisionFilterGroup ? options.collisionFilterGroup : -1, 
                this.checkCollisionResponse = void 0 === options.checkCollisionResponse || options.checkCollisionResponse, 
                options.from && this.from.copy(options.from), options.to && this.to.copy(options.to), 
                this.callback = options.callback || function() {}, this.hasHit = !1, 
                this.result.reset(), this.updateDirection(), this.getAABB(tmpAABB), 
                tmpArray.length = 0, world.broadphase.aabbQuery(world, tmpAABB, tmpArray), 
                this.intersectBodies(tmpArray), this.hasHit;
            }, _proto.intersectBody = function(body, result) {
                result && (this.result = result, this.updateDirection());
                var checkCollisionResponse = this.checkCollisionResponse;
                if ((!checkCollisionResponse || body.collisionResponse) && 0 != (this.collisionFilterGroup & body.collisionFilterMask) && 0 != (body.collisionFilterGroup & this.collisionFilterMask)) for (var xi = intersectBody_xi, qi = intersectBody_qi, i = 0, N = body.shapes.length; i < N; i++) {
                    var shape = body.shapes[i];
                    if ((!checkCollisionResponse || shape.collisionResponse) && (body.quaternion.mult(body.shapeOrientations[i], qi), 
                    body.quaternion.vmult(body.shapeOffsets[i], xi), xi.vadd(body.position, xi), 
                    this.intersectShape(shape, qi, xi, body), this.result.shouldStop)) break;
                }
            }, _proto.intersectBodies = function(bodies, result) {
                result && (this.result = result, this.updateDirection());
                for (var i = 0, l = bodies.length; !this.result.shouldStop && i < l; i++) this.intersectBody(bodies[i]);
            }, _proto.updateDirection = function() {
                this.to.vsub(this.from, this.direction), this.direction.normalize();
            }, _proto.intersectShape = function(shape, quat, position, body) {
                if (!(function(from, direction, position) {
                    position.vsub(from, v0);
                    var dot = v0.dot(direction);
                    return direction.scale(dot, intersect), intersect.vadd(from, intersect), 
                    position.distanceTo(intersect);
                }(this.from, this.direction, position) > shape.boundingSphereRadius)) {
                    var intersectMethod = this[shape.type];
                    intersectMethod && intersectMethod.call(this, shape, quat, position, body, shape);
                }
            }, _proto._intersectBox = function(box, quat, position, body, reportedShape) {
                return this._intersectConvex(box.convexPolyhedronRepresentation, quat, position, body, reportedShape);
            }, _proto._intersectPlane = function(shape, quat, position, body, reportedShape) {
                var from = this.from, to = this.to, direction = this.direction, worldNormal = new Vec3(0, 0, 1);
                quat.vmult(worldNormal, worldNormal);
                var len = new Vec3();
                from.vsub(position, len);
                var planeToFrom = len.dot(worldNormal);
                if (to.vsub(position, len), !(planeToFrom * len.dot(worldNormal) > 0 || from.distanceTo(to) < planeToFrom)) {
                    var n_dot_dir = worldNormal.dot(direction);
                    if (!(Math.abs(n_dot_dir) < this.precision)) {
                        var planePointToFrom = new Vec3(), dir_scaled_with_t = new Vec3(), hitPointWorld = new Vec3();
                        from.vsub(position, planePointToFrom);
                        var t = -worldNormal.dot(planePointToFrom) / n_dot_dir;
                        direction.scale(t, dir_scaled_with_t), from.vadd(dir_scaled_with_t, hitPointWorld), 
                        this.reportIntersection(worldNormal, hitPointWorld, reportedShape, body, -1);
                    }
                }
            }, _proto.getAABB = function(aabb) {
                var lowerBound = aabb.lowerBound, upperBound = aabb.upperBound, to = this.to, from = this.from;
                lowerBound.x = Math.min(to.x, from.x), lowerBound.y = Math.min(to.y, from.y), 
                lowerBound.z = Math.min(to.z, from.z), upperBound.x = Math.max(to.x, from.x), 
                upperBound.y = Math.max(to.y, from.y), upperBound.z = Math.max(to.z, from.z);
            }, _proto._intersectHeightfield = function(shape, quat, position, body, reportedShape) {
                shape.data, shape.elementSize;
                var localRay = intersectHeightfield_localRay;
                localRay.from.copy(this.from), localRay.to.copy(this.to), Transform.pointToLocalFrame(position, quat, localRay.from, localRay.from), 
                Transform.pointToLocalFrame(position, quat, localRay.to, localRay.to), 
                localRay.updateDirection();
                var iMinX, iMinY, iMaxX, iMaxY, index = intersectHeightfield_index;
                iMinX = iMinY = 0, iMaxX = iMaxY = shape.data.length - 1;
                var aabb = new AABB();
                localRay.getAABB(aabb), shape.getIndexOfPosition(aabb.lowerBound.x, aabb.lowerBound.y, index, !0), 
                iMinX = Math.max(iMinX, index[0]), iMinY = Math.max(iMinY, index[1]), 
                shape.getIndexOfPosition(aabb.upperBound.x, aabb.upperBound.y, index, !0), 
                iMaxX = Math.min(iMaxX, index[0] + 1), iMaxY = Math.min(iMaxY, index[1] + 1);
                for (var i = iMinX; i < iMaxX; i++) for (var j = iMinY; j < iMaxY; j++) {
                    if (this.result.shouldStop) return;
                    if (shape.getAabbAtIndex(i, j, aabb), aabb.overlapsRay(localRay)) {
                        if (shape.getConvexTrianglePillar(i, j, !1), Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset), 
                        this._intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions), 
                        this.result.shouldStop) return;
                        shape.getConvexTrianglePillar(i, j, !0), Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset), 
                        this._intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions);
                    }
                }
            }, _proto._intersectSphere = function(sphere, quat, position, body, reportedShape) {
                var from = this.from, to = this.to, r = sphere.radius, a = Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2) + Math.pow(to.z - from.z, 2), b = 2 * ((to.x - from.x) * (from.x - position.x) + (to.y - from.y) * (from.y - position.y) + (to.z - from.z) * (from.z - position.z)), c = Math.pow(from.x - position.x, 2) + Math.pow(from.y - position.y, 2) + Math.pow(from.z - position.z, 2) - Math.pow(r, 2), delta = Math.pow(b, 2) - 4 * a * c, intersectionPoint = Ray_intersectSphere_intersectionPoint, normal = Ray_intersectSphere_normal;
                if (!(delta < 0)) if (0 === delta) from.lerp(to, delta, intersectionPoint), 
                intersectionPoint.vsub(position, normal), normal.normalize(), this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1); else {
                    var d1 = (-b - Math.sqrt(delta)) / (2 * a), d2 = (-b + Math.sqrt(delta)) / (2 * a);
                    if (d1 >= 0 && d1 <= 1 && (from.lerp(to, d1, intersectionPoint), 
                    intersectionPoint.vsub(position, normal), normal.normalize(), 
                    this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1)), 
                    this.result.shouldStop) return;
                    d2 >= 0 && d2 <= 1 && (from.lerp(to, d2, intersectionPoint), 
                    intersectionPoint.vsub(position, normal), normal.normalize(), 
                    this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1));
                }
            }, _proto._intersectConvex = function(shape, quat, position, body, reportedShape, options) {
                for (var normal = intersectConvex_normal, vector = intersectConvex_vector, faceList = options && options.faceList || null, faces = shape.faces, vertices = shape.vertices, normals = shape.faceNormals, direction = this.direction, from = this.from, to = this.to, fromToDistance = from.distanceTo(to), Nfaces = faceList ? faceList.length : faces.length, result = this.result, j = 0; !result.shouldStop && j < Nfaces; j++) {
                    var fi = faceList ? faceList[j] : j, face = faces[fi], faceNormal = normals[fi], q = quat, x = position;
                    vector.copy(vertices[face[0]]), q.vmult(vector, vector), vector.vadd(x, vector), 
                    vector.vsub(from, vector), q.vmult(faceNormal, normal);
                    var dot = direction.dot(normal);
                    if (!(Math.abs(dot) < this.precision)) {
                        var scalar = normal.dot(vector) / dot;
                        if (!(scalar < 0)) {
                            direction.scale(scalar, intersectPoint), intersectPoint.vadd(from, intersectPoint), 
                            a.copy(vertices[face[0]]), q.vmult(a, a), x.vadd(a, a);
                            for (var i = 1; !result.shouldStop && i < face.length - 1; i++) {
                                b.copy(vertices[face[i]]), c.copy(vertices[face[i + 1]]), 
                                q.vmult(b, b), q.vmult(c, c), x.vadd(b, b), x.vadd(c, c);
                                var distance = intersectPoint.distanceTo(from);
                                !pointInTriangle(intersectPoint, a, b, c) && !pointInTriangle(intersectPoint, b, a, c) || distance > fromToDistance || this.reportIntersection(normal, intersectPoint, reportedShape, body, fi);
                            }
                        }
                    }
                }
            }, _proto._intersectTrimesh = function(mesh, quat, position, body, reportedShape, options) {
                var normal = intersectTrimesh_normal, triangles = intersectTrimesh_triangles, treeTransform = intersectTrimesh_treeTransform, vector = intersectConvex_vector, localDirection = intersectTrimesh_localDirection, localFrom = intersectTrimesh_localFrom, localTo = intersectTrimesh_localTo, worldIntersectPoint = intersectTrimesh_worldIntersectPoint, worldNormal = intersectTrimesh_worldNormal, indices = (options && options.faceList, 
                mesh.indices), from = (mesh.vertices, this.from), to = this.to, direction = this.direction;
                treeTransform.position.copy(position), treeTransform.quaternion.copy(quat), 
                Transform.vectorToLocalFrame(position, quat, direction, localDirection), 
                Transform.pointToLocalFrame(position, quat, from, localFrom), Transform.pointToLocalFrame(position, quat, to, localTo), 
                localTo.x *= mesh.scale.x, localTo.y *= mesh.scale.y, localTo.z *= mesh.scale.z, 
                localFrom.x *= mesh.scale.x, localFrom.y *= mesh.scale.y, localFrom.z *= mesh.scale.z, 
                localTo.vsub(localFrom, localDirection), localDirection.normalize();
                var fromToDistanceSquared = localFrom.distanceSquared(localTo);
                mesh.tree.rayQuery(this, treeTransform, triangles);
                for (var i = 0, N = triangles.length; !this.result.shouldStop && i !== N; i++) {
                    var trianglesIndex = triangles[i];
                    mesh.getNormal(trianglesIndex, normal), mesh.getVertex(indices[3 * trianglesIndex], a), 
                    a.vsub(localFrom, vector);
                    var dot = localDirection.dot(normal), scalar = normal.dot(vector) / dot;
                    if (!(scalar < 0)) {
                        localDirection.scale(scalar, intersectPoint), intersectPoint.vadd(localFrom, intersectPoint), 
                        mesh.getVertex(indices[3 * trianglesIndex + 1], b), mesh.getVertex(indices[3 * trianglesIndex + 2], c);
                        var squaredDistance = intersectPoint.distanceSquared(localFrom);
                        !pointInTriangle(intersectPoint, b, a, c) && !pointInTriangle(intersectPoint, a, b, c) || squaredDistance > fromToDistanceSquared || (Transform.vectorToWorldFrame(quat, normal, worldNormal), 
                        Transform.pointToWorldFrame(position, quat, intersectPoint, worldIntersectPoint), 
                        this.reportIntersection(worldNormal, worldIntersectPoint, reportedShape, body, trianglesIndex));
                    }
                }
                triangles.length = 0;
            }, _proto.reportIntersection = function(normal, hitPointWorld, shape, body, hitFaceIndex) {
                var from = this.from, to = this.to, distance = from.distanceTo(hitPointWorld), result = this.result;
                if (!(this.skipBackfaces && normal.dot(this.direction) > 0)) switch (result.hitFaceIndex = void 0 !== hitFaceIndex ? hitFaceIndex : -1, 
                this.mode) {
                  case Ray.ALL:
                    this.hasHit = !0, result.set(from, to, normal, hitPointWorld, shape, body, distance), 
                    result.hasHit = !0, this.callback(result);
                    break;

                  case Ray.CLOSEST:
                    (distance < result.distance || !result.hasHit) && (this.hasHit = !0, 
                    result.hasHit = !0, result.set(from, to, normal, hitPointWorld, shape, body, distance));
                    break;

                  case Ray.ANY:
                    this.hasHit = !0, result.hasHit = !0, result.set(from, to, normal, hitPointWorld, shape, body, distance), 
                    result.shouldStop = !0;
                }
            }, Ray;
        }();
        Ray.CLOSEST = 1, Ray.ANY = 2, Ray.ALL = 4;
        var tmpAABB = new AABB(), tmpArray = [], v1 = new Vec3(), v2 = new Vec3();
        function pointInTriangle(p, a, b, c) {
            c.vsub(a, v0), b.vsub(a, v1), p.vsub(a, v2);
            var u, v, dot00 = v0.dot(v0), dot01 = v0.dot(v1), dot02 = v0.dot(v2), dot11 = v1.dot(v1), dot12 = v1.dot(v2);
            return (u = dot11 * dot02 - dot01 * dot12) >= 0 && (v = dot00 * dot12 - dot01 * dot02) >= 0 && u + v < dot00 * dot11 - dot01 * dot01;
        }
        Ray.pointInTriangle = pointInTriangle;
        var intersectBody_xi = new Vec3(), intersectBody_qi = new Quaternion(), intersectPoint = (new Vec3(), 
        new Vec3(), new Vec3()), a = new Vec3(), b = new Vec3(), c = new Vec3();
        new Vec3(), new RaycastResult();
        Ray.prototype[Shape.types.BOX] = Ray.prototype._intersectBox, Ray.prototype[Shape.types.PLANE] = Ray.prototype._intersectPlane;
        var intersectConvexOptions = {
            faceList: [ 0 ]
        }, worldPillarOffset = new Vec3(), intersectHeightfield_localRay = new Ray(), intersectHeightfield_index = [];
        Ray.prototype[Shape.types.HEIGHTFIELD] = Ray.prototype._intersectHeightfield;
        var Ray_intersectSphere_intersectionPoint = new Vec3(), Ray_intersectSphere_normal = new Vec3();
        Ray.prototype[Shape.types.SPHERE] = Ray.prototype._intersectSphere;
        var intersectConvex_normal = new Vec3(), intersectConvex_vector = (new Vec3(), 
        new Vec3(), new Vec3());
        Ray.prototype[Shape.types.CONVEXPOLYHEDRON] = Ray.prototype._intersectConvex;
        var intersectTrimesh_normal = new Vec3(), intersectTrimesh_localDirection = new Vec3(), intersectTrimesh_localFrom = new Vec3(), intersectTrimesh_localTo = new Vec3(), intersectTrimesh_worldNormal = new Vec3(), intersectTrimesh_worldIntersectPoint = new Vec3(), intersectTrimesh_triangles = (new AABB(), 
        []), intersectTrimesh_treeTransform = new Transform();
        Ray.prototype[Shape.types.TRIMESH] = Ray.prototype._intersectTrimesh;
        var v0 = new Vec3(), intersect = new Vec3();
        var SAPBroadphase = function(_Broadphase) {
            function SAPBroadphase(world) {
                var _this;
                (_this = _Broadphase.call(this) || this).axisList = [], _this.world = null, 
                _this.axisIndex = 0;
                var axisList = _this.axisList;
                return _this._addBodyHandler = function(event) {
                    axisList.push(event.body);
                }, _this._removeBodyHandler = function(event) {
                    var idx = axisList.indexOf(event.body);
                    -1 !== idx && axisList.splice(idx, 1);
                }, world && _this.setWorld(world), _this;
            }
            _inheritsLoose(SAPBroadphase, _Broadphase);
            var _proto = SAPBroadphase.prototype;
            return _proto.setWorld = function(world) {
                this.axisList.length = 0;
                for (var i = 0; i < world.bodies.length; i++) this.axisList.push(world.bodies[i]);
                world.removeEventListener("addBody", this._addBodyHandler), world.removeEventListener("removeBody", this._removeBodyHandler), 
                world.addEventListener("addBody", this._addBodyHandler), world.addEventListener("removeBody", this._removeBodyHandler), 
                this.world = world, this.dirty = !0;
            }, _proto.collisionPairs = function(world, p1, p2) {
                var i, j, bodies = this.axisList, N = bodies.length, axisIndex = this.axisIndex;
                for (this.dirty && (this.sortList(), this.dirty = !1), i = 0; i !== N; i++) {
                    var _bi = bodies[i];
                    for (j = i + 1; j < N; j++) {
                        var _bj = bodies[j];
                        if (this.needBroadphaseCollision(_bi, _bj)) {
                            if (!SAPBroadphase.checkBounds(_bi, _bj, axisIndex)) break;
                            this.intersectionTest(_bi, _bj, p1, p2);
                        }
                    }
                }
            }, _proto.sortList = function() {
                for (var axisList = this.axisList, axisIndex = this.axisIndex, N = axisList.length, i = 0; i !== N; i++) {
                    var _bi2 = axisList[i];
                    _bi2.aabbNeedsUpdate && _bi2.computeAABB();
                }
                0 === axisIndex ? SAPBroadphase.insertionSortX(axisList) : 1 === axisIndex ? SAPBroadphase.insertionSortY(axisList) : 2 === axisIndex && SAPBroadphase.insertionSortZ(axisList);
            }, _proto.autoDetectAxis = function() {
                for (var sumX = 0, sumX2 = 0, sumY = 0, sumY2 = 0, sumZ = 0, sumZ2 = 0, bodies = this.axisList, N = bodies.length, invN = 1 / N, i = 0; i !== N; i++) {
                    var b = bodies[i], centerX = b.position.x;
                    sumX += centerX, sumX2 += centerX * centerX;
                    var centerY = b.position.y;
                    sumY += centerY, sumY2 += centerY * centerY;
                    var centerZ = b.position.z;
                    sumZ += centerZ, sumZ2 += centerZ * centerZ;
                }
                var varianceX = sumX2 - sumX * sumX * invN, varianceY = sumY2 - sumY * sumY * invN, varianceZ = sumZ2 - sumZ * sumZ * invN;
                this.axisIndex = varianceX > varianceY ? varianceX > varianceZ ? 0 : 2 : varianceY > varianceZ ? 1 : 2;
            }, _proto.aabbQuery = function(world, aabb, result) {
                void 0 === result && (result = []), this.dirty && (this.sortList(), 
                this.dirty = !1);
                var axisIndex = this.axisIndex, axis = "x";
                1 === axisIndex && (axis = "y"), 2 === axisIndex && (axis = "z");
                for (var axisList = this.axisList, i = (aabb.lowerBound[axis], aabb.upperBound[axis], 
                0); i < axisList.length; i++) {
                    var b = axisList[i];
                    b.aabbNeedsUpdate && b.computeAABB(), b.aabb.overlaps(aabb) && result.push(b);
                }
                return result;
            }, SAPBroadphase;
        }(Broadphase);
        function Utils() {}
        SAPBroadphase.insertionSortX = function(a) {
            for (var i = 1, l = a.length; i < l; i++) {
                var v = a[i], j = void 0;
                for (j = i - 1; j >= 0 && !(a[j].aabb.lowerBound.x <= v.aabb.lowerBound.x); j--) a[j + 1] = a[j];
                a[j + 1] = v;
            }
            return a;
        }, SAPBroadphase.insertionSortY = function(a) {
            for (var i = 1, l = a.length; i < l; i++) {
                var v = a[i], j = void 0;
                for (j = i - 1; j >= 0 && !(a[j].aabb.lowerBound.y <= v.aabb.lowerBound.y); j--) a[j + 1] = a[j];
                a[j + 1] = v;
            }
            return a;
        }, SAPBroadphase.insertionSortZ = function(a) {
            for (var i = 1, l = a.length; i < l; i++) {
                var v = a[i], j = void 0;
                for (j = i - 1; j >= 0 && !(a[j].aabb.lowerBound.z <= v.aabb.lowerBound.z); j--) a[j + 1] = a[j];
                a[j + 1] = v;
            }
            return a;
        }, SAPBroadphase.checkBounds = function(bi, bj, axisIndex) {
            var biPos, bjPos;
            0 === axisIndex ? (biPos = bi.position.x, bjPos = bj.position.x) : 1 === axisIndex ? (biPos = bi.position.y, 
            bjPos = bj.position.y) : 2 === axisIndex && (biPos = bi.position.z, 
            bjPos = bj.position.z);
            var ri = bi.boundingRadius;
            return bjPos - bj.boundingRadius < biPos + ri;
        }, Utils.defaults = function(options, defaults) {
            for (var key in void 0 === options && (options = {}), defaults) key in options || (options[key] = defaults[key]);
            return options;
        };
        var Constraint = function() {
            function Constraint(bodyA, bodyB, options) {
                void 0 === options && (options = {}), options = Utils.defaults(options, {
                    collideConnected: !0,
                    wakeUpBodies: !0
                }), this.equations = [], this.bodyA = bodyA, this.bodyB = bodyB, 
                this.id = Constraint.idCounter++, this.collideConnected = options.collideConnected, 
                options.wakeUpBodies && (bodyA && bodyA.wakeUp(), bodyB && bodyB.wakeUp());
            }
            var _proto = Constraint.prototype;
            return _proto.update = function() {
                throw new Error("method update() not implmemented in this Constraint subclass!");
            }, _proto.enable = function() {
                for (var eqs = this.equations, i = 0; i < eqs.length; i++) eqs[i].enabled = !0;
            }, _proto.disable = function() {
                for (var eqs = this.equations, i = 0; i < eqs.length; i++) eqs[i].enabled = !1;
            }, Constraint;
        }();
        Constraint.idCounter = 0;
        var JacobianElement = function() {
            function JacobianElement() {
                this.spatial = new Vec3(), this.rotational = new Vec3();
            }
            var _proto = JacobianElement.prototype;
            return _proto.multiplyElement = function(element) {
                return element.spatial.dot(this.spatial) + element.rotational.dot(this.rotational);
            }, _proto.multiplyVectors = function(spatial, rotational) {
                return spatial.dot(this.spatial) + rotational.dot(this.rotational);
            }, JacobianElement;
        }(), Equation = function() {
            function Equation(bi, bj, minForce, maxForce) {
                void 0 === minForce && (minForce = -1e6), void 0 === maxForce && (maxForce = 1e6), 
                this.id = Equation.id++, this.minForce = minForce, this.maxForce = maxForce, 
                this.bi = bi, this.bj = bj, this.a = 0, this.b = 0, this.eps = 0, 
                this.jacobianElementA = new JacobianElement(), this.jacobianElementB = new JacobianElement(), 
                this.enabled = !0, this.multiplier = 0, this.setSpookParams(1e7, 4, 1 / 60);
            }
            var _proto = Equation.prototype;
            return _proto.setSpookParams = function(stiffness, relaxation, timeStep) {
                var d = relaxation, k = stiffness, h = timeStep;
                this.a = 4 / (h * (1 + 4 * d)), this.b = 4 * d / (1 + 4 * d), this.eps = 4 / (h * h * k * (1 + 4 * d));
            }, _proto.computeB = function(a, b, h) {
                var GW = this.computeGW();
                return -this.computeGq() * a - GW * b - this.computeGiMf() * h;
            }, _proto.computeGq = function() {
                var GA = this.jacobianElementA, GB = this.jacobianElementB, bi = this.bi, bj = this.bj, xi = bi.position, xj = bj.position;
                return GA.spatial.dot(xi) + GB.spatial.dot(xj);
            }, _proto.computeGW = function() {
                var GA = this.jacobianElementA, GB = this.jacobianElementB, bi = this.bi, bj = this.bj, vi = bi.velocity, vj = bj.velocity, wi = bi.angularVelocity, wj = bj.angularVelocity;
                return GA.multiplyVectors(vi, wi) + GB.multiplyVectors(vj, wj);
            }, _proto.computeGWlambda = function() {
                var GA = this.jacobianElementA, GB = this.jacobianElementB, bi = this.bi, bj = this.bj, vi = bi.vlambda, vj = bj.vlambda, wi = bi.wlambda, wj = bj.wlambda;
                return GA.multiplyVectors(vi, wi) + GB.multiplyVectors(vj, wj);
            }, _proto.computeGiMf = function() {
                var GA = this.jacobianElementA, GB = this.jacobianElementB, bi = this.bi, bj = this.bj, fi = bi.force, ti = bi.torque, fj = bj.force, tj = bj.torque, invMassi = bi.invMassSolve, invMassj = bj.invMassSolve;
                return fi.scale(invMassi, iMfi), fj.scale(invMassj, iMfj), bi.invInertiaWorldSolve.vmult(ti, invIi_vmult_taui), 
                bj.invInertiaWorldSolve.vmult(tj, invIj_vmult_tauj), GA.multiplyVectors(iMfi, invIi_vmult_taui) + GB.multiplyVectors(iMfj, invIj_vmult_tauj);
            }, _proto.computeGiMGt = function() {
                var GA = this.jacobianElementA, GB = this.jacobianElementB, bi = this.bi, bj = this.bj, invMassi = bi.invMassSolve, invMassj = bj.invMassSolve, invIi = bi.invInertiaWorldSolve, invIj = bj.invInertiaWorldSolve, result = invMassi + invMassj;
                return invIi.vmult(GA.rotational, tmp$1), result += tmp$1.dot(GA.rotational), 
                invIj.vmult(GB.rotational, tmp$1), result += tmp$1.dot(GB.rotational);
            }, _proto.addToWlambda = function(deltalambda) {
                var GA = this.jacobianElementA, GB = this.jacobianElementB, bi = this.bi, bj = this.bj, temp = addToWlambda_temp;
                bi.vlambda.addScaledVector(bi.invMassSolve * deltalambda, GA.spatial, bi.vlambda), 
                bj.vlambda.addScaledVector(bj.invMassSolve * deltalambda, GB.spatial, bj.vlambda), 
                bi.invInertiaWorldSolve.vmult(GA.rotational, temp), bi.wlambda.addScaledVector(deltalambda, temp, bi.wlambda), 
                bj.invInertiaWorldSolve.vmult(GB.rotational, temp), bj.wlambda.addScaledVector(deltalambda, temp, bj.wlambda);
            }, _proto.computeC = function() {
                return this.computeGiMGt() + this.eps;
            }, Equation;
        }();
        Equation.id = 0;
        var iMfi = new Vec3(), iMfj = new Vec3(), invIi_vmult_taui = new Vec3(), invIj_vmult_tauj = new Vec3(), tmp$1 = new Vec3(), addToWlambda_temp = new Vec3(), ContactEquation = function(_Equation) {
            function ContactEquation(bodyA, bodyB, maxForce) {
                var _this;
                return void 0 === maxForce && (maxForce = 1e6), (_this = _Equation.call(this, bodyA, bodyB, 0, maxForce) || this).restitution = 0, 
                _this.ri = new Vec3(), _this.rj = new Vec3(), _this.ni = new Vec3(), 
                _this;
            }
            _inheritsLoose(ContactEquation, _Equation);
            var _proto = ContactEquation.prototype;
            return _proto.computeB = function(h) {
                var a = this.a, b = this.b, bi = this.bi, bj = this.bj, ri = this.ri, rj = this.rj, rixn = ContactEquation_computeB_temp1, rjxn = ContactEquation_computeB_temp2, vi = bi.velocity, wi = bi.angularVelocity, vj = (bi.force, 
                bi.torque, bj.velocity), wj = bj.angularVelocity, penetrationVec = (bj.force, 
                bj.torque, ContactEquation_computeB_temp3), GA = this.jacobianElementA, GB = this.jacobianElementB, n = this.ni;
                ri.cross(n, rixn), rj.cross(n, rjxn), n.negate(GA.spatial), rixn.negate(GA.rotational), 
                GB.spatial.copy(n), GB.rotational.copy(rjxn), penetrationVec.copy(bj.position), 
                penetrationVec.vadd(rj, penetrationVec), penetrationVec.vsub(bi.position, penetrationVec), 
                penetrationVec.vsub(ri, penetrationVec);
                var g = n.dot(penetrationVec), ePlusOne = this.restitution + 1;
                return -g * a - (ePlusOne * vj.dot(n) - ePlusOne * vi.dot(n) + wj.dot(rjxn) - wi.dot(rixn)) * b - h * this.computeGiMf();
            }, _proto.getImpactVelocityAlongNormal = function() {
                var vi = ContactEquation_getImpactVelocityAlongNormal_vi, vj = ContactEquation_getImpactVelocityAlongNormal_vj, xi = ContactEquation_getImpactVelocityAlongNormal_xi, xj = ContactEquation_getImpactVelocityAlongNormal_xj, relVel = ContactEquation_getImpactVelocityAlongNormal_relVel;
                return this.bi.position.vadd(this.ri, xi), this.bj.position.vadd(this.rj, xj), 
                this.bi.getVelocityAtWorldPoint(xi, vi), this.bj.getVelocityAtWorldPoint(xj, vj), 
                vi.vsub(vj, relVel), this.ni.dot(relVel);
            }, ContactEquation;
        }(Equation), ContactEquation_computeB_temp1 = new Vec3(), ContactEquation_computeB_temp2 = new Vec3(), ContactEquation_computeB_temp3 = new Vec3(), ContactEquation_getImpactVelocityAlongNormal_vi = new Vec3(), ContactEquation_getImpactVelocityAlongNormal_vj = new Vec3(), ContactEquation_getImpactVelocityAlongNormal_xi = new Vec3(), ContactEquation_getImpactVelocityAlongNormal_xj = new Vec3(), ContactEquation_getImpactVelocityAlongNormal_relVel = new Vec3(), PointToPointConstraint = function(_Constraint) {
            function PointToPointConstraint(bodyA, pivotA, bodyB, pivotB, maxForce) {
                var _this;
                void 0 === pivotA && (pivotA = new Vec3()), void 0 === pivotB && (pivotB = new Vec3()), 
                void 0 === maxForce && (maxForce = 1e6), (_this = _Constraint.call(this, bodyA, bodyB) || this).pivotA = pivotA.clone(), 
                _this.pivotB = pivotB.clone();
                var x = _this.equationX = new ContactEquation(bodyA, bodyB), y = _this.equationY = new ContactEquation(bodyA, bodyB), z = _this.equationZ = new ContactEquation(bodyA, bodyB);
                return _this.equations.push(x, y, z), x.minForce = y.minForce = z.minForce = -maxForce, 
                x.maxForce = y.maxForce = z.maxForce = maxForce, x.ni.set(1, 0, 0), 
                y.ni.set(0, 1, 0), z.ni.set(0, 0, 1), _this;
            }
            return _inheritsLoose(PointToPointConstraint, _Constraint), PointToPointConstraint.prototype.update = function() {
                var bodyA = this.bodyA, bodyB = this.bodyB, x = this.equationX, y = this.equationY, z = this.equationZ;
                bodyA.quaternion.vmult(this.pivotA, x.ri), bodyB.quaternion.vmult(this.pivotB, x.rj), 
                y.ri.copy(x.ri), y.rj.copy(x.rj), z.ri.copy(x.ri), z.rj.copy(x.rj);
            }, PointToPointConstraint;
        }(Constraint), ConeEquation = function(_Equation) {
            function ConeEquation(bodyA, bodyB, options) {
                var _this;
                void 0 === options && (options = {});
                var maxForce = void 0 !== options.maxForce ? options.maxForce : 1e6;
                return (_this = _Equation.call(this, bodyA, bodyB, -maxForce, maxForce) || this).axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0), 
                _this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0, 1, 0), 
                _this.angle = void 0 !== options.angle ? options.angle : 0, _this;
            }
            return _inheritsLoose(ConeEquation, _Equation), ConeEquation.prototype.computeB = function(h) {
                var a = this.a, b = this.b, ni = this.axisA, nj = this.axisB, nixnj = tmpVec1, njxni = tmpVec2, GA = this.jacobianElementA, GB = this.jacobianElementB;
                return ni.cross(nj, nixnj), nj.cross(ni, njxni), GA.rotational.copy(njxni), 
                GB.rotational.copy(nixnj), -(Math.cos(this.angle) - ni.dot(nj)) * a - this.computeGW() * b - h * this.computeGiMf();
            }, ConeEquation;
        }(Equation), tmpVec1 = new Vec3(), tmpVec2 = new Vec3(), RotationalEquation = function(_Equation) {
            function RotationalEquation(bodyA, bodyB, options) {
                var _this;
                void 0 === options && (options = {});
                var maxForce = void 0 !== options.maxForce ? options.maxForce : 1e6;
                return (_this = _Equation.call(this, bodyA, bodyB, -maxForce, maxForce) || this).axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0), 
                _this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0, 1, 0), 
                _this.maxAngle = Math.PI / 2, _this;
            }
            return _inheritsLoose(RotationalEquation, _Equation), RotationalEquation.prototype.computeB = function(h) {
                var a = this.a, b = this.b, ni = this.axisA, nj = this.axisB, nixnj = tmpVec1$1, njxni = tmpVec2$1, GA = this.jacobianElementA, GB = this.jacobianElementB;
                return ni.cross(nj, nixnj), nj.cross(ni, njxni), GA.rotational.copy(njxni), 
                GB.rotational.copy(nixnj), -(Math.cos(this.maxAngle) - ni.dot(nj)) * a - this.computeGW() * b - h * this.computeGiMf();
            }, RotationalEquation;
        }(Equation), tmpVec1$1 = new Vec3(), tmpVec2$1 = new Vec3(), ConeTwistConstraint = function(_PointToPointConstrai) {
            function ConeTwistConstraint(bodyA, bodyB, options) {
                var _this;
                void 0 === options && (options = {});
                var maxForce = void 0 !== options.maxForce ? options.maxForce : 1e6, pivotA = options.pivotA ? options.pivotA.clone() : new Vec3(), pivotB = options.pivotB ? options.pivotB.clone() : new Vec3();
                (_this = _PointToPointConstrai.call(this, bodyA, pivotA, bodyB, pivotB, maxForce) || this).axisA = options.axisA ? options.axisA.clone() : new Vec3(), 
                _this.axisB = options.axisB ? options.axisB.clone() : new Vec3(), 
                _this.collideConnected = !!options.collideConnected, _this.angle = void 0 !== options.angle ? options.angle : 0;
                var c = _this.coneEquation = new ConeEquation(bodyA, bodyB, options), t = _this.twistEquation = new RotationalEquation(bodyA, bodyB, options);
                return _this.twistAngle = void 0 !== options.twistAngle ? options.twistAngle : 0, 
                c.maxForce = 0, c.minForce = -maxForce, t.maxForce = 0, t.minForce = -maxForce, 
                _this.equations.push(c, t), _this;
            }
            return _inheritsLoose(ConeTwistConstraint, _PointToPointConstrai), ConeTwistConstraint.prototype.update = function() {
                var bodyA = this.bodyA, bodyB = this.bodyB, cone = this.coneEquation, twist = this.twistEquation;
                _PointToPointConstrai.prototype.update.call(this), bodyA.vectorToWorldFrame(this.axisA, cone.axisA), 
                bodyB.vectorToWorldFrame(this.axisB, cone.axisB), this.axisA.tangents(twist.axisA, twist.axisA), 
                bodyA.vectorToWorldFrame(twist.axisA, twist.axisA), this.axisB.tangents(twist.axisB, twist.axisB), 
                bodyB.vectorToWorldFrame(twist.axisB, twist.axisB), cone.angle = this.angle, 
                twist.maxAngle = this.twistAngle;
            }, ConeTwistConstraint;
        }(PointToPointConstraint), DistanceConstraint = (new Vec3(), new Vec3(), 
        function(_Constraint) {
            function DistanceConstraint(bodyA, bodyB, distance, maxForce) {
                var _this;
                void 0 === maxForce && (maxForce = 1e6), _this = _Constraint.call(this, bodyA, bodyB) || this, 
                void 0 === distance && (distance = bodyA.position.distanceTo(bodyB.position)), 
                _this.distance = distance;
                var eq = _this.distanceEquation = new ContactEquation(bodyA, bodyB);
                return _this.equations.push(eq), eq.minForce = -maxForce, eq.maxForce = maxForce, 
                _this;
            }
            return _inheritsLoose(DistanceConstraint, _Constraint), DistanceConstraint.prototype.update = function() {
                var bodyA = this.bodyA, bodyB = this.bodyB, eq = this.distanceEquation, halfDist = .5 * this.distance, normal = eq.ni;
                bodyB.position.vsub(bodyA.position, normal), normal.normalize(), 
                normal.scale(halfDist, eq.ri), normal.scale(-halfDist, eq.rj);
            }, DistanceConstraint;
        }(Constraint)), LockConstraint = function(_PointToPointConstrai) {
            function LockConstraint(bodyA, bodyB, options) {
                var _this;
                void 0 === options && (options = {});
                var maxForce = void 0 !== options.maxForce ? options.maxForce : 1e6, pivotA = new Vec3(), pivotB = new Vec3(), halfWay = new Vec3();
                bodyA.position.vadd(bodyB.position, halfWay), halfWay.scale(.5, halfWay), 
                bodyB.pointToLocalFrame(halfWay, pivotB), bodyA.pointToLocalFrame(halfWay, pivotA), 
                (_this = _PointToPointConstrai.call(this, bodyA, pivotA, bodyB, pivotB, maxForce) || this).xA = bodyA.vectorToLocalFrame(Vec3.UNIT_X), 
                _this.xB = bodyB.vectorToLocalFrame(Vec3.UNIT_X), _this.yA = bodyA.vectorToLocalFrame(Vec3.UNIT_Y), 
                _this.yB = bodyB.vectorToLocalFrame(Vec3.UNIT_Y), _this.zA = bodyA.vectorToLocalFrame(Vec3.UNIT_Z), 
                _this.zB = bodyB.vectorToLocalFrame(Vec3.UNIT_Z);
                var r1 = _this.rotationalEquation1 = new RotationalEquation(bodyA, bodyB, options), r2 = _this.rotationalEquation2 = new RotationalEquation(bodyA, bodyB, options), r3 = _this.rotationalEquation3 = new RotationalEquation(bodyA, bodyB, options);
                return _this.equations.push(r1, r2, r3), _this;
            }
            return _inheritsLoose(LockConstraint, _PointToPointConstrai), LockConstraint.prototype.update = function() {
                var bodyA = this.bodyA, bodyB = this.bodyB, r1 = (this.motorEquation, 
                this.rotationalEquation1), r2 = this.rotationalEquation2, r3 = this.rotationalEquation3;
                _PointToPointConstrai.prototype.update.call(this), bodyA.vectorToWorldFrame(this.xA, r1.axisA), 
                bodyB.vectorToWorldFrame(this.yB, r1.axisB), bodyA.vectorToWorldFrame(this.yA, r2.axisA), 
                bodyB.vectorToWorldFrame(this.zB, r2.axisB), bodyA.vectorToWorldFrame(this.zA, r3.axisA), 
                bodyB.vectorToWorldFrame(this.xB, r3.axisB);
            }, LockConstraint;
        }(PointToPointConstraint), RotationalMotorEquation = (new Vec3(), new Vec3(), 
        function(_Equation) {
            function RotationalMotorEquation(bodyA, bodyB, maxForce) {
                var _this;
                return void 0 === maxForce && (maxForce = 1e6), (_this = _Equation.call(this, bodyA, bodyB, -maxForce, maxForce) || this).axisA = new Vec3(), 
                _this.axisB = new Vec3(), _this.targetVelocity = 0, _this;
            }
            return _inheritsLoose(RotationalMotorEquation, _Equation), RotationalMotorEquation.prototype.computeB = function(h) {
                this.a;
                var b = this.b, axisA = (this.bi, this.bj, this.axisA), axisB = this.axisB, GA = this.jacobianElementA, GB = this.jacobianElementB;
                return GA.rotational.copy(axisA), axisB.negate(GB.rotational), -(this.computeGW() - this.targetVelocity) * b - h * this.computeGiMf();
            }, RotationalMotorEquation;
        }(Equation)), HingeConstraint = function(_PointToPointConstrai) {
            function HingeConstraint(bodyA, bodyB, options) {
                var _this;
                void 0 === options && (options = {});
                var maxForce = void 0 !== options.maxForce ? options.maxForce : 1e6, pivotA = options.pivotA ? options.pivotA.clone() : new Vec3(), pivotB = options.pivotB ? options.pivotB.clone() : new Vec3();
                ((_this = _PointToPointConstrai.call(this, bodyA, pivotA, bodyB, pivotB, maxForce) || this).axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0)).normalize(), 
                (_this.axisB = options.axisB ? options.axisB.clone() : new Vec3(1, 0, 0)).normalize(), 
                _this.collideConnected = !!options.collideConnected;
                var rotational1 = _this.rotationalEquation1 = new RotationalEquation(bodyA, bodyB, options), rotational2 = _this.rotationalEquation2 = new RotationalEquation(bodyA, bodyB, options), motor = _this.motorEquation = new RotationalMotorEquation(bodyA, bodyB, maxForce);
                return motor.enabled = !1, _this.equations.push(rotational1, rotational2, motor), 
                _this;
            }
            _inheritsLoose(HingeConstraint, _PointToPointConstrai);
            var _proto = HingeConstraint.prototype;
            return _proto.enableMotor = function() {
                this.motorEquation.enabled = !0;
            }, _proto.disableMotor = function() {
                this.motorEquation.enabled = !1;
            }, _proto.setMotorSpeed = function(speed) {
                this.motorEquation.targetVelocity = speed;
            }, _proto.setMotorMaxForce = function(maxForce) {
                this.motorEquation.maxForce = maxForce, this.motorEquation.minForce = -maxForce;
            }, _proto.update = function() {
                var bodyA = this.bodyA, bodyB = this.bodyB, motor = this.motorEquation, r1 = this.rotationalEquation1, r2 = this.rotationalEquation2, worldAxisA = HingeConstraint_update_tmpVec1, worldAxisB = HingeConstraint_update_tmpVec2, axisA = this.axisA, axisB = this.axisB;
                _PointToPointConstrai.prototype.update.call(this), bodyA.quaternion.vmult(axisA, worldAxisA), 
                bodyB.quaternion.vmult(axisB, worldAxisB), worldAxisA.tangents(r1.axisA, r2.axisA), 
                r1.axisB.copy(worldAxisB), r2.axisB.copy(worldAxisB), this.motorEquation.enabled && (bodyA.quaternion.vmult(this.axisA, motor.axisA), 
                bodyB.quaternion.vmult(this.axisB, motor.axisB));
            }, HingeConstraint;
        }(PointToPointConstraint), HingeConstraint_update_tmpVec1 = new Vec3(), HingeConstraint_update_tmpVec2 = new Vec3(), FrictionEquation = function(_Equation) {
            function FrictionEquation(bodyA, bodyB, slipForce) {
                var _this;
                return (_this = _Equation.call(this, bodyA, bodyB, -slipForce, slipForce) || this).ri = new Vec3(), 
                _this.rj = new Vec3(), _this.t = new Vec3(), _this;
            }
            return _inheritsLoose(FrictionEquation, _Equation), FrictionEquation.prototype.computeB = function(h) {
                this.a;
                var b = this.b, ri = (this.bi, this.bj, this.ri), rj = this.rj, rixt = FrictionEquation_computeB_temp1, rjxt = FrictionEquation_computeB_temp2, t = this.t;
                ri.cross(t, rixt), rj.cross(t, rjxt);
                var GA = this.jacobianElementA, GB = this.jacobianElementB;
                return t.negate(GA.spatial), rixt.negate(GA.rotational), GB.spatial.copy(t), 
                GB.rotational.copy(rjxt), -this.computeGW() * b - h * this.computeGiMf();
            }, FrictionEquation;
        }(Equation), FrictionEquation_computeB_temp1 = new Vec3(), FrictionEquation_computeB_temp2 = new Vec3(), ContactMaterial = function ContactMaterial(m1, m2, options) {
            options = Utils.defaults(options, {
                friction: .3,
                restitution: .3,
                contactEquationStiffness: 1e7,
                contactEquationRelaxation: 3,
                frictionEquationStiffness: 1e7,
                frictionEquationRelaxation: 3
            }), this.id = ContactMaterial.idCounter++, this.materials = [ m1, m2 ], 
            this.friction = options.friction, this.restitution = options.restitution, 
            this.contactEquationStiffness = options.contactEquationStiffness, this.contactEquationRelaxation = options.contactEquationRelaxation, 
            this.frictionEquationStiffness = options.frictionEquationStiffness, 
            this.frictionEquationRelaxation = options.frictionEquationRelaxation;
        };
        ContactMaterial.idCounter = 0;
        var Material = function Material(options) {
            void 0 === options && (options = {});
            var name = "";
            "string" == typeof options && (name = options, options = {}), this.name = name, 
            this.id = Material.idCounter++, this.friction = void 0 !== options.friction ? options.friction : -1, 
            this.restitution = void 0 !== options.restitution ? options.restitution : -1;
        };
        Material.idCounter = 0;
        var Spring = function() {
            function Spring(bodyA, bodyB, options) {
                void 0 === options && (options = {}), this.restLength = "number" == typeof options.restLength ? options.restLength : 1, 
                this.stiffness = options.stiffness || 100, this.damping = options.damping || 1, 
                this.bodyA = bodyA, this.bodyB = bodyB, this.localAnchorA = new Vec3(), 
                this.localAnchorB = new Vec3(), options.localAnchorA && this.localAnchorA.copy(options.localAnchorA), 
                options.localAnchorB && this.localAnchorB.copy(options.localAnchorB), 
                options.worldAnchorA && this.setWorldAnchorA(options.worldAnchorA), 
                options.worldAnchorB && this.setWorldAnchorB(options.worldAnchorB);
            }
            var _proto = Spring.prototype;
            return _proto.setWorldAnchorA = function(worldAnchorA) {
                this.bodyA.pointToLocalFrame(worldAnchorA, this.localAnchorA);
            }, _proto.setWorldAnchorB = function(worldAnchorB) {
                this.bodyB.pointToLocalFrame(worldAnchorB, this.localAnchorB);
            }, _proto.getWorldAnchorA = function(result) {
                this.bodyA.pointToWorldFrame(this.localAnchorA, result);
            }, _proto.getWorldAnchorB = function(result) {
                this.bodyB.pointToWorldFrame(this.localAnchorB, result);
            }, _proto.applyForce = function() {
                var k = this.stiffness, d = this.damping, l = this.restLength, bodyA = this.bodyA, bodyB = this.bodyB, r = applyForce_r, r_unit = applyForce_r_unit, u = applyForce_u, f = applyForce_f, tmp = applyForce_tmp, worldAnchorA = applyForce_worldAnchorA, worldAnchorB = applyForce_worldAnchorB, ri = applyForce_ri, rj = applyForce_rj, ri_x_f = applyForce_ri_x_f, rj_x_f = applyForce_rj_x_f;
                this.getWorldAnchorA(worldAnchorA), this.getWorldAnchorB(worldAnchorB), 
                worldAnchorA.vsub(bodyA.position, ri), worldAnchorB.vsub(bodyB.position, rj), 
                worldAnchorB.vsub(worldAnchorA, r);
                var rlen = r.length();
                r_unit.copy(r), r_unit.normalize(), bodyB.velocity.vsub(bodyA.velocity, u), 
                bodyB.angularVelocity.cross(rj, tmp), u.vadd(tmp, u), bodyA.angularVelocity.cross(ri, tmp), 
                u.vsub(tmp, u), r_unit.scale(-k * (rlen - l) - d * u.dot(r_unit), f), 
                bodyA.force.vsub(f, bodyA.force), bodyB.force.vadd(f, bodyB.force), 
                ri.cross(f, ri_x_f), rj.cross(f, rj_x_f), bodyA.torque.vsub(ri_x_f, bodyA.torque), 
                bodyB.torque.vadd(rj_x_f, bodyB.torque);
            }, Spring;
        }(), applyForce_r = new Vec3(), applyForce_r_unit = new Vec3(), applyForce_u = new Vec3(), applyForce_f = new Vec3(), applyForce_worldAnchorA = new Vec3(), applyForce_worldAnchorB = new Vec3(), applyForce_ri = new Vec3(), applyForce_rj = new Vec3(), applyForce_ri_x_f = new Vec3(), applyForce_rj_x_f = new Vec3(), applyForce_tmp = new Vec3(), WheelInfo = function() {
            function WheelInfo(options) {
                void 0 === options && (options = {}), options = Utils.defaults(options, {
                    chassisConnectionPointLocal: new Vec3(),
                    chassisConnectionPointWorld: new Vec3(),
                    directionLocal: new Vec3(),
                    directionWorld: new Vec3(),
                    axleLocal: new Vec3(),
                    axleWorld: new Vec3(),
                    suspensionRestLength: 1,
                    suspensionMaxLength: 2,
                    radius: 1,
                    suspensionStiffness: 100,
                    dampingCompression: 10,
                    dampingRelaxation: 10,
                    frictionSlip: 1e4,
                    steering: 0,
                    rotation: 0,
                    deltaRotation: 0,
                    rollInfluence: .01,
                    maxSuspensionForce: Number.MAX_VALUE,
                    isFrontWheel: !0,
                    clippedInvContactDotSuspension: 1,
                    suspensionRelativeVelocity: 0,
                    suspensionForce: 0,
                    slipInfo: 0,
                    skidInfo: 0,
                    suspensionLength: 0,
                    maxSuspensionTravel: 1,
                    useCustomSlidingRotationalSpeed: !1,
                    customSlidingRotationalSpeed: -.1
                }), this.maxSuspensionTravel = options.maxSuspensionTravel, this.customSlidingRotationalSpeed = options.customSlidingRotationalSpeed, 
                this.useCustomSlidingRotationalSpeed = options.useCustomSlidingRotationalSpeed, 
                this.sliding = !1, this.chassisConnectionPointLocal = options.chassisConnectionPointLocal.clone(), 
                this.chassisConnectionPointWorld = options.chassisConnectionPointWorld.clone(), 
                this.directionLocal = options.directionLocal.clone(), this.directionWorld = options.directionWorld.clone(), 
                this.axleLocal = options.axleLocal.clone(), this.axleWorld = options.axleWorld.clone(), 
                this.suspensionRestLength = options.suspensionRestLength, this.suspensionMaxLength = options.suspensionMaxLength, 
                this.radius = options.radius, this.suspensionStiffness = options.suspensionStiffness, 
                this.dampingCompression = options.dampingCompression, this.dampingRelaxation = options.dampingRelaxation, 
                this.frictionSlip = options.frictionSlip, this.steering = 0, this.rotation = 0, 
                this.deltaRotation = 0, this.rollInfluence = options.rollInfluence, 
                this.maxSuspensionForce = options.maxSuspensionForce, this.engineForce = 0, 
                this.brake = 0, this.isFrontWheel = options.isFrontWheel, this.clippedInvContactDotSuspension = 1, 
                this.suspensionRelativeVelocity = 0, this.suspensionForce = 0, this.slipInfo = 0, 
                this.skidInfo = 0, this.suspensionLength = 0, this.sideImpulse = 0, 
                this.forwardImpulse = 0, this.raycastResult = new RaycastResult(), 
                this.worldTransform = new Transform(), this.isInContact = !1;
            }
            return WheelInfo.prototype.updateWheel = function(chassis) {
                var raycastResult = this.raycastResult;
                if (this.isInContact) {
                    var project = raycastResult.hitNormalWorld.dot(raycastResult.directionWorld);
                    raycastResult.hitPointWorld.vsub(chassis.position, relpos), 
                    chassis.getVelocityAtWorldPoint(relpos, chassis_velocity_at_contactPoint);
                    var projVel = raycastResult.hitNormalWorld.dot(chassis_velocity_at_contactPoint);
                    if (project >= -.1) this.suspensionRelativeVelocity = 0, this.clippedInvContactDotSuspension = 10; else {
                        var inv = -1 / project;
                        this.suspensionRelativeVelocity = projVel * inv, this.clippedInvContactDotSuspension = inv;
                    }
                } else raycastResult.suspensionLength = this.suspensionRestLength, 
                this.suspensionRelativeVelocity = 0, raycastResult.directionWorld.scale(-1, raycastResult.hitNormalWorld), 
                this.clippedInvContactDotSuspension = 1;
            }, WheelInfo;
        }(), chassis_velocity_at_contactPoint = new Vec3(), relpos = new Vec3(), RaycastVehicle = function() {
            function RaycastVehicle(options) {
                this.chassisBody = options.chassisBody, this.wheelInfos = [], this.sliding = !1, 
                this.world = null, this.indexRightAxis = void 0 !== options.indexRightAxis ? options.indexRightAxis : 1, 
                this.indexForwardAxis = void 0 !== options.indexForwardAxis ? options.indexForwardAxis : 0, 
                this.indexUpAxis = void 0 !== options.indexUpAxis ? options.indexUpAxis : 2, 
                this.constraints = [], this.preStepCallback = function() {}, this.currentVehicleSpeedKmHour = 0;
            }
            var _proto = RaycastVehicle.prototype;
            return _proto.addWheel = function(options) {
                void 0 === options && (options = {});
                var info = new WheelInfo(options), index = this.wheelInfos.length;
                return this.wheelInfos.push(info), index;
            }, _proto.setSteeringValue = function(value, wheelIndex) {
                this.wheelInfos[wheelIndex].steering = value;
            }, _proto.applyEngineForce = function(value, wheelIndex) {
                this.wheelInfos[wheelIndex].engineForce = value;
            }, _proto.setBrake = function(brake, wheelIndex) {
                this.wheelInfos[wheelIndex].brake = brake;
            }, _proto.addToWorld = function(world) {
                this.constraints;
                world.addBody(this.chassisBody);
                var that = this;
                this.preStepCallback = function() {
                    that.updateVehicle(world.dt);
                }, world.addEventListener("preStep", this.preStepCallback), this.world = world;
            }, _proto.getVehicleAxisWorld = function(axisIndex, result) {
                result.set(0 === axisIndex ? 1 : 0, 1 === axisIndex ? 1 : 0, 2 === axisIndex ? 1 : 0), 
                this.chassisBody.vectorToWorldFrame(result, result);
            }, _proto.updateVehicle = function(timeStep) {
                for (var wheelInfos = this.wheelInfos, numWheels = wheelInfos.length, chassisBody = this.chassisBody, i = 0; i < numWheels; i++) this.updateWheelTransform(i);
                this.currentVehicleSpeedKmHour = 3.6 * chassisBody.velocity.length();
                var forwardWorld = new Vec3();
                this.getVehicleAxisWorld(this.indexForwardAxis, forwardWorld), forwardWorld.dot(chassisBody.velocity) < 0 && (this.currentVehicleSpeedKmHour *= -1);
                for (var _i = 0; _i < numWheels; _i++) this.castRay(wheelInfos[_i]);
                this.updateSuspension(timeStep);
                for (var impulse = new Vec3(), relpos = new Vec3(), _i2 = 0; _i2 < numWheels; _i2++) {
                    var wheel = wheelInfos[_i2], suspensionForce = wheel.suspensionForce;
                    suspensionForce > wheel.maxSuspensionForce && (suspensionForce = wheel.maxSuspensionForce), 
                    wheel.raycastResult.hitNormalWorld.scale(suspensionForce * timeStep, impulse), 
                    wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, relpos), 
                    chassisBody.applyImpulse(impulse, relpos);
                }
                this.updateFriction(timeStep);
                for (var hitNormalWorldScaledWithProj = new Vec3(), fwd = new Vec3(), vel = new Vec3(), _i3 = 0; _i3 < numWheels; _i3++) {
                    var _wheel = wheelInfos[_i3];
                    chassisBody.getVelocityAtWorldPoint(_wheel.chassisConnectionPointWorld, vel);
                    var m = 1;
                    switch (this.indexUpAxis) {
                      case 1:
                        m = -1;
                    }
                    if (_wheel.isInContact) {
                        this.getVehicleAxisWorld(this.indexForwardAxis, fwd);
                        var proj = fwd.dot(_wheel.raycastResult.hitNormalWorld);
                        _wheel.raycastResult.hitNormalWorld.scale(proj, hitNormalWorldScaledWithProj), 
                        fwd.vsub(hitNormalWorldScaledWithProj, fwd);
                        var proj2 = fwd.dot(vel);
                        _wheel.deltaRotation = m * proj2 * timeStep / _wheel.radius;
                    }
                    !_wheel.sliding && _wheel.isInContact || 0 === _wheel.engineForce || !_wheel.useCustomSlidingRotationalSpeed || (_wheel.deltaRotation = (_wheel.engineForce > 0 ? 1 : -1) * _wheel.customSlidingRotationalSpeed * timeStep), 
                    Math.abs(_wheel.brake) > Math.abs(_wheel.engineForce) && (_wheel.deltaRotation = 0), 
                    _wheel.rotation += _wheel.deltaRotation, _wheel.deltaRotation *= .99;
                }
            }, _proto.updateSuspension = function(deltaTime) {
                for (var chassisMass = this.chassisBody.mass, wheelInfos = this.wheelInfos, numWheels = wheelInfos.length, w_it = 0; w_it < numWheels; w_it++) {
                    var wheel = wheelInfos[w_it];
                    if (wheel.isInContact) {
                        var force = void 0, length_diff = wheel.suspensionRestLength - wheel.suspensionLength;
                        force = wheel.suspensionStiffness * length_diff * wheel.clippedInvContactDotSuspension;
                        var projected_rel_vel = wheel.suspensionRelativeVelocity;
                        force -= (projected_rel_vel < 0 ? wheel.dampingCompression : wheel.dampingRelaxation) * projected_rel_vel, 
                        wheel.suspensionForce = force * chassisMass, wheel.suspensionForce < 0 && (wheel.suspensionForce = 0);
                    } else wheel.suspensionForce = 0;
                }
            }, _proto.removeFromWorld = function(world) {
                this.constraints;
                world.removeBody(this.chassisBody), world.removeEventListener("preStep", this.preStepCallback), 
                this.world = null;
            }, _proto.castRay = function(wheel) {
                var rayvector = castRay_rayvector, target = castRay_target;
                this.updateWheelTransformWorld(wheel);
                var chassisBody = this.chassisBody, depth = -1, raylen = wheel.suspensionRestLength + wheel.radius;
                wheel.directionWorld.scale(raylen, rayvector);
                var source = wheel.chassisConnectionPointWorld;
                source.vadd(rayvector, target);
                var raycastResult = wheel.raycastResult;
                raycastResult.reset();
                var oldState = chassisBody.collisionResponse;
                chassisBody.collisionResponse = !1, this.world.rayTest(source, target, raycastResult), 
                chassisBody.collisionResponse = oldState;
                var object = raycastResult.body;
                if (wheel.raycastResult.groundObject = 0, object) {
                    depth = raycastResult.distance, wheel.raycastResult.hitNormalWorld = raycastResult.hitNormalWorld, 
                    wheel.isInContact = !0;
                    var hitDistance = raycastResult.distance;
                    wheel.suspensionLength = hitDistance - wheel.radius;
                    var minSuspensionLength = wheel.suspensionRestLength - wheel.maxSuspensionTravel, maxSuspensionLength = wheel.suspensionRestLength + wheel.maxSuspensionTravel;
                    wheel.suspensionLength < minSuspensionLength && (wheel.suspensionLength = minSuspensionLength), 
                    wheel.suspensionLength > maxSuspensionLength && (wheel.suspensionLength = maxSuspensionLength, 
                    wheel.raycastResult.reset());
                    var denominator = wheel.raycastResult.hitNormalWorld.dot(wheel.directionWorld), chassis_velocity_at_contactPoint = new Vec3();
                    chassisBody.getVelocityAtWorldPoint(wheel.raycastResult.hitPointWorld, chassis_velocity_at_contactPoint);
                    var projVel = wheel.raycastResult.hitNormalWorld.dot(chassis_velocity_at_contactPoint);
                    if (denominator >= -.1) wheel.suspensionRelativeVelocity = 0, 
                    wheel.clippedInvContactDotSuspension = 10; else {
                        var inv = -1 / denominator;
                        wheel.suspensionRelativeVelocity = projVel * inv, wheel.clippedInvContactDotSuspension = inv;
                    }
                } else wheel.suspensionLength = wheel.suspensionRestLength + 0 * wheel.maxSuspensionTravel, 
                wheel.suspensionRelativeVelocity = 0, wheel.directionWorld.scale(-1, wheel.raycastResult.hitNormalWorld), 
                wheel.clippedInvContactDotSuspension = 1;
                return depth;
            }, _proto.updateWheelTransformWorld = function(wheel) {
                wheel.isInContact = !1;
                var chassisBody = this.chassisBody;
                chassisBody.pointToWorldFrame(wheel.chassisConnectionPointLocal, wheel.chassisConnectionPointWorld), 
                chassisBody.vectorToWorldFrame(wheel.directionLocal, wheel.directionWorld), 
                chassisBody.vectorToWorldFrame(wheel.axleLocal, wheel.axleWorld);
            }, _proto.updateWheelTransform = function(wheelIndex) {
                var up = tmpVec4, right = tmpVec5, fwd = tmpVec6, wheel = this.wheelInfos[wheelIndex];
                this.updateWheelTransformWorld(wheel), wheel.directionLocal.scale(-1, up), 
                right.copy(wheel.axleLocal), up.cross(right, fwd), fwd.normalize(), 
                right.normalize();
                var steering = wheel.steering, steeringOrn = new Quaternion();
                steeringOrn.setFromAxisAngle(up, steering);
                var rotatingOrn = new Quaternion();
                rotatingOrn.setFromAxisAngle(right, wheel.rotation);
                var q = wheel.worldTransform.quaternion;
                this.chassisBody.quaternion.mult(steeringOrn, q), q.mult(rotatingOrn, q), 
                q.normalize();
                var p = wheel.worldTransform.position;
                p.copy(wheel.directionWorld), p.scale(wheel.suspensionLength, p), 
                p.vadd(wheel.chassisConnectionPointWorld, p);
            }, _proto.getWheelTransformWorld = function(wheelIndex) {
                return this.wheelInfos[wheelIndex].worldTransform;
            }, _proto.updateFriction = function(timeStep) {
                for (var surfNormalWS_scaled_proj = updateFriction_surfNormalWS_scaled_proj, wheelInfos = this.wheelInfos, numWheels = wheelInfos.length, chassisBody = this.chassisBody, forwardWS = updateFriction_forwardWS, axle = updateFriction_axle, i = 0; i < numWheels; i++) {
                    var wheel = wheelInfos[i];
                    wheel.raycastResult.body;
                    wheel.sideImpulse = 0, wheel.forwardImpulse = 0, forwardWS[i] || (forwardWS[i] = new Vec3()), 
                    axle[i] || (axle[i] = new Vec3());
                }
                for (var _i4 = 0; _i4 < numWheels; _i4++) {
                    var _wheel2 = wheelInfos[_i4], _groundObject = _wheel2.raycastResult.body;
                    if (_groundObject) {
                        var axlei = axle[_i4];
                        this.getWheelTransformWorld(_i4).vectorToWorldFrame(directions[this.indexRightAxis], axlei);
                        var surfNormalWS = _wheel2.raycastResult.hitNormalWorld, proj = axlei.dot(surfNormalWS);
                        surfNormalWS.scale(proj, surfNormalWS_scaled_proj), axlei.vsub(surfNormalWS_scaled_proj, axlei), 
                        axlei.normalize(), surfNormalWS.cross(axlei, forwardWS[_i4]), 
                        forwardWS[_i4].normalize(), _wheel2.sideImpulse = resolveSingleBilateral(chassisBody, _wheel2.raycastResult.hitPointWorld, _groundObject, _wheel2.raycastResult.hitPointWorld, axlei), 
                        _wheel2.sideImpulse *= sideFrictionStiffness2;
                    }
                }
                this.sliding = !1;
                for (var _i5 = 0; _i5 < numWheels; _i5++) {
                    var _wheel3 = wheelInfos[_i5], _groundObject2 = _wheel3.raycastResult.body, rollingFriction = 0;
                    if (_wheel3.slipInfo = 1, _groundObject2) {
                        var maxImpulse = _wheel3.brake ? _wheel3.brake : 0;
                        rollingFriction = calcRollingFriction(chassisBody, _groundObject2, _wheel3.raycastResult.hitPointWorld, forwardWS[_i5], maxImpulse);
                        var factor = maxImpulse / (rollingFriction += _wheel3.engineForce * timeStep);
                        _wheel3.slipInfo *= factor;
                    }
                    if (_wheel3.forwardImpulse = 0, _wheel3.skidInfo = 1, _groundObject2) {
                        _wheel3.skidInfo = 1;
                        var maximp = _wheel3.suspensionForce * timeStep * _wheel3.frictionSlip, maximpSquared = maximp * maximp;
                        _wheel3.forwardImpulse = rollingFriction;
                        var x = .5 * _wheel3.forwardImpulse, y = 1 * _wheel3.sideImpulse, impulseSquared = x * x + y * y;
                        if (_wheel3.sliding = !1, impulseSquared > maximpSquared) {
                            this.sliding = !0, _wheel3.sliding = !0;
                            var _factor = maximp / Math.sqrt(impulseSquared);
                            _wheel3.skidInfo *= _factor;
                        }
                    }
                }
                if (this.sliding) for (var _i6 = 0; _i6 < numWheels; _i6++) {
                    var _wheel4 = wheelInfos[_i6];
                    0 !== _wheel4.sideImpulse && _wheel4.skidInfo < 1 && (_wheel4.forwardImpulse *= _wheel4.skidInfo, 
                    _wheel4.sideImpulse *= _wheel4.skidInfo);
                }
                for (var _i7 = 0; _i7 < numWheels; _i7++) {
                    var _wheel5 = wheelInfos[_i7], rel_pos = new Vec3();
                    if (_wheel5.raycastResult.hitPointWorld.vsub(chassisBody.position, rel_pos), 
                    0 !== _wheel5.forwardImpulse) {
                        var impulse = new Vec3();
                        forwardWS[_i7].scale(_wheel5.forwardImpulse, impulse), chassisBody.applyImpulse(impulse, rel_pos);
                    }
                    if (0 !== _wheel5.sideImpulse) {
                        var _groundObject3 = _wheel5.raycastResult.body, rel_pos2 = new Vec3();
                        _wheel5.raycastResult.hitPointWorld.vsub(_groundObject3.position, rel_pos2);
                        var sideImp = new Vec3();
                        axle[_i7].scale(_wheel5.sideImpulse, sideImp), chassisBody.vectorToLocalFrame(rel_pos, rel_pos), 
                        rel_pos["xyz"[this.indexUpAxis]] *= _wheel5.rollInfluence, 
                        chassisBody.vectorToWorldFrame(rel_pos, rel_pos), chassisBody.applyImpulse(sideImp, rel_pos), 
                        sideImp.scale(-1, sideImp), _groundObject3.applyImpulse(sideImp, rel_pos2);
                    }
                }
            }, RaycastVehicle;
        }(), tmpVec4 = (new Vec3(), new Vec3(), new Vec3(), new Vec3()), tmpVec5 = new Vec3(), tmpVec6 = new Vec3(), castRay_rayvector = (new Ray(), 
        new Vec3(), new Vec3()), castRay_target = new Vec3(), directions = [ new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1) ], updateFriction_surfNormalWS_scaled_proj = new Vec3(), updateFriction_axle = [], updateFriction_forwardWS = [], sideFrictionStiffness2 = 1, calcRollingFriction_vel1 = new Vec3(), calcRollingFriction_vel2 = new Vec3(), calcRollingFriction_vel = new Vec3();
        function calcRollingFriction(body0, body1, frictionPosWorld, frictionDirectionWorld, maxImpulse) {
            var j1 = 0, contactPosWorld = frictionPosWorld, vel1 = calcRollingFriction_vel1, vel2 = calcRollingFriction_vel2, vel = calcRollingFriction_vel;
            body0.getVelocityAtWorldPoint(contactPosWorld, vel1), body1.getVelocityAtWorldPoint(contactPosWorld, vel2), 
            vel1.vsub(vel2, vel);
            return maxImpulse < (j1 = -frictionDirectionWorld.dot(vel) * (1 / (computeImpulseDenominator(body0, frictionPosWorld, frictionDirectionWorld) + computeImpulseDenominator(body1, frictionPosWorld, frictionDirectionWorld)))) && (j1 = maxImpulse), 
            j1 < -maxImpulse && (j1 = -maxImpulse), j1;
        }
        var computeImpulseDenominator_r0 = new Vec3(), computeImpulseDenominator_c0 = new Vec3(), computeImpulseDenominator_vec = new Vec3(), computeImpulseDenominator_m = new Vec3();
        function computeImpulseDenominator(body, pos, normal) {
            var r0 = computeImpulseDenominator_r0, c0 = computeImpulseDenominator_c0, vec = computeImpulseDenominator_vec, m = computeImpulseDenominator_m;
            return pos.vsub(body.position, r0), r0.cross(normal, c0), body.invInertiaWorld.vmult(c0, m), 
            m.cross(r0, vec), body.invMass + normal.dot(vec);
        }
        var resolveSingleBilateral_vel1 = new Vec3(), resolveSingleBilateral_vel2 = new Vec3(), resolveSingleBilateral_vel = new Vec3();
        function resolveSingleBilateral(body1, pos1, body2, pos2, normal) {
            if (normal.lengthSquared() > 1.1) return 0;
            var vel1 = resolveSingleBilateral_vel1, vel2 = resolveSingleBilateral_vel2, vel = resolveSingleBilateral_vel;
            body1.getVelocityAtWorldPoint(pos1, vel1), body2.getVelocityAtWorldPoint(pos2, vel2), 
            vel1.vsub(vel2, vel);
            return -.2 * normal.dot(vel) * (1 / (body1.invMass + body2.invMass));
        }
        var Sphere = function(_Shape) {
            function Sphere(radius) {
                var _this;
                if ((_this = _Shape.call(this, {
                    type: Shape.types.SPHERE
                }) || this).radius = void 0 !== radius ? radius : 1, _this.radius < 0) throw new Error("The sphere radius cannot be negative.");
                return _this.updateBoundingSphereRadius(), _this;
            }
            _inheritsLoose(Sphere, _Shape);
            var _proto = Sphere.prototype;
            return _proto.calculateLocalInertia = function(mass, target) {
                void 0 === target && (target = new Vec3());
                var I = 2 * mass * this.radius * this.radius / 5;
                return target.x = I, target.y = I, target.z = I, target;
            }, _proto.volume = function() {
                return 4 * Math.PI * Math.pow(this.radius, 3) / 3;
            }, _proto.updateBoundingSphereRadius = function() {
                this.boundingSphereRadius = this.radius;
            }, _proto.calculateWorldAABB = function(pos, quat, min, max) {
                for (var r = this.radius, axes = [ "x", "y", "z" ], i = 0; i < axes.length; i++) {
                    var ax = axes[i];
                    min[ax] = pos[ax] - r, max[ax] = pos[ax] + r;
                }
            }, Sphere;
        }(Shape), RigidVehicle = function() {
            function RigidVehicle(options) {
                void 0 === options && (options = {}), this.wheelBodies = [], this.coordinateSystem = void 0 !== options.coordinateSystem ? options.coordinateSystem.clone() : new Vec3(1, 2, 3), 
                options.chassisBody ? this.chassisBody = options.chassisBody : this.chassisBody = new Body({
                    mass: 1,
                    shape: new Box(new Vec3(5, 2, .5))
                }), this.constraints = [], this.wheelAxes = [], this.wheelForces = [];
            }
            var _proto = RigidVehicle.prototype;
            return _proto.addWheel = function(options) {
                var wheelBody;
                void 0 === options && (options = {}), wheelBody = options.body ? options.body : new Body({
                    mass: 1,
                    shape: new Sphere(1.2)
                }), this.wheelBodies.push(wheelBody), this.wheelForces.push(0);
                new Vec3();
                var position = void 0 !== options.position ? options.position.clone() : new Vec3(), worldPosition = new Vec3();
                this.chassisBody.pointToWorldFrame(position, worldPosition), wheelBody.position.set(worldPosition.x, worldPosition.y, worldPosition.z);
                var axis = void 0 !== options.axis ? options.axis.clone() : new Vec3(0, 1, 0);
                this.wheelAxes.push(axis);
                var hingeConstraint = new HingeConstraint(this.chassisBody, wheelBody, {
                    pivotA: position,
                    axisA: axis,
                    pivotB: Vec3.ZERO,
                    axisB: axis,
                    collideConnected: !1
                });
                return this.constraints.push(hingeConstraint), this.wheelBodies.length - 1;
            }, _proto.setSteeringValue = function(value, wheelIndex) {
                var axis = this.wheelAxes[wheelIndex], c = Math.cos(value), s = Math.sin(value), x = axis.x, y = axis.y;
                this.constraints[wheelIndex].axisA.set(c * x - s * y, s * x + c * y, 0);
            }, _proto.setMotorSpeed = function(value, wheelIndex) {
                var hingeConstraint = this.constraints[wheelIndex];
                hingeConstraint.enableMotor(), hingeConstraint.motorTargetVelocity = value;
            }, _proto.disableMotor = function(wheelIndex) {
                this.constraints[wheelIndex].disableMotor();
            }, _proto.setWheelForce = function(value, wheelIndex) {
                this.wheelForces[wheelIndex] = value;
            }, _proto.applyWheelForce = function(value, wheelIndex) {
                var axis = this.wheelAxes[wheelIndex], wheelBody = this.wheelBodies[wheelIndex], bodyTorque = wheelBody.torque;
                axis.scale(value, torque$1), wheelBody.vectorToWorldFrame(torque$1, torque$1), 
                bodyTorque.vadd(torque$1, bodyTorque);
            }, _proto.addToWorld = function(world) {
                for (var constraints = this.constraints, bodies = this.wheelBodies.concat([ this.chassisBody ]), i = 0; i < bodies.length; i++) world.addBody(bodies[i]);
                for (var _i = 0; _i < constraints.length; _i++) world.addConstraint(constraints[_i]);
                world.addEventListener("preStep", this._update.bind(this));
            }, _proto._update = function() {
                for (var wheelForces = this.wheelForces, i = 0; i < wheelForces.length; i++) this.applyWheelForce(wheelForces[i], i);
            }, _proto.removeFromWorld = function(world) {
                for (var constraints = this.constraints, bodies = this.wheelBodies.concat([ this.chassisBody ]), i = 0; i < bodies.length; i++) world.removeBody(bodies[i]);
                for (var _i2 = 0; _i2 < constraints.length; _i2++) world.removeConstraint(constraints[_i2]);
            }, _proto.getWheelSpeed = function(wheelIndex) {
                var axis = this.wheelAxes[wheelIndex], w = this.wheelBodies[wheelIndex].angularVelocity;
                return this.chassisBody.vectorToWorldFrame(axis, worldAxis), w.dot(worldAxis);
            }, RigidVehicle;
        }(), torque$1 = new Vec3(), worldAxis = new Vec3(), SPHSystem = function() {
            function SPHSystem() {
                this.particles = [], this.density = 1, this.smoothingRadius = 1, 
                this.speedOfSound = 1, this.viscosity = .01, this.eps = 1e-6, this.pressures = [], 
                this.densities = [], this.neighbors = [];
            }
            var _proto = SPHSystem.prototype;
            return _proto.add = function(particle) {
                this.particles.push(particle), this.neighbors.length < this.particles.length && this.neighbors.push([]);
            }, _proto.remove = function(particle) {
                var idx = this.particles.indexOf(particle);
                -1 !== idx && (this.particles.splice(idx, 1), this.neighbors.length > this.particles.length && this.neighbors.pop());
            }, _proto.getNeighbors = function(particle, neighbors) {
                for (var N = this.particles.length, id = particle.id, R2 = this.smoothingRadius * this.smoothingRadius, dist = SPHSystem_getNeighbors_dist, i = 0; i !== N; i++) {
                    var p = this.particles[i];
                    p.position.vsub(particle.position, dist), id !== p.id && dist.lengthSquared() < R2 && neighbors.push(p);
                }
            }, _proto.update = function() {
                for (var N = this.particles.length, dist = SPHSystem_update_dist, cs = this.speedOfSound, eps = this.eps, i = 0; i !== N; i++) {
                    var p = this.particles[i], neighbors = this.neighbors[i];
                    neighbors.length = 0, this.getNeighbors(p, neighbors), neighbors.push(this.particles[i]);
                    for (var numNeighbors = neighbors.length, sum = 0, j = 0; j !== numNeighbors; j++) {
                        p.position.vsub(neighbors[j].position, dist);
                        var len = dist.length(), weight = this.w(len);
                        sum += neighbors[j].mass * weight;
                    }
                    this.densities[i] = sum, this.pressures[i] = cs * cs * (this.densities[i] - this.density);
                }
                for (var a_pressure = SPHSystem_update_a_pressure, a_visc = SPHSystem_update_a_visc, gradW = SPHSystem_update_gradW, r_vec = SPHSystem_update_r_vec, u = SPHSystem_update_u, _i = 0; _i !== N; _i++) {
                    var particle = this.particles[_i];
                    a_pressure.set(0, 0, 0), a_visc.set(0, 0, 0);
                    for (var Pij = void 0, nabla = void 0, _neighbors = this.neighbors[_i], _numNeighbors = _neighbors.length, _j = 0; _j !== _numNeighbors; _j++) {
                        var neighbor = _neighbors[_j];
                        particle.position.vsub(neighbor.position, r_vec);
                        var r = r_vec.length();
                        Pij = -neighbor.mass * (this.pressures[_i] / (this.densities[_i] * this.densities[_i] + eps) + this.pressures[_j] / (this.densities[_j] * this.densities[_j] + eps)), 
                        this.gradw(r_vec, gradW), gradW.scale(Pij, gradW), a_pressure.vadd(gradW, a_pressure), 
                        neighbor.velocity.vsub(particle.velocity, u), u.scale(1 / (1e-4 + this.densities[_i] * this.densities[_j]) * this.viscosity * neighbor.mass, u), 
                        nabla = this.nablaw(r), u.scale(nabla, u), a_visc.vadd(u, a_visc);
                    }
                    a_visc.scale(particle.mass, a_visc), a_pressure.scale(particle.mass, a_pressure), 
                    particle.force.vadd(a_visc, particle.force), particle.force.vadd(a_pressure, particle.force);
                }
            }, _proto.w = function(r) {
                var h = this.smoothingRadius;
                return 315 / (64 * Math.PI * Math.pow(h, 9)) * Math.pow(h * h - r * r, 3);
            }, _proto.gradw = function(rVec, resultVec) {
                var r = rVec.length(), h = this.smoothingRadius;
                rVec.scale(945 / (32 * Math.PI * Math.pow(h, 9)) * Math.pow(h * h - r * r, 2), resultVec);
            }, _proto.nablaw = function(r) {
                var h = this.smoothingRadius;
                return 945 / (32 * Math.PI * Math.pow(h, 9)) * (h * h - r * r) * (7 * r * r - 3 * h * h);
            }, SPHSystem;
        }(), SPHSystem_getNeighbors_dist = new Vec3(), SPHSystem_update_dist = new Vec3(), SPHSystem_update_a_pressure = new Vec3(), SPHSystem_update_a_visc = new Vec3(), SPHSystem_update_gradW = new Vec3(), SPHSystem_update_r_vec = new Vec3(), SPHSystem_update_u = new Vec3(), Cylinder = function(_ConvexPolyhedron) {
            function Cylinder(radiusTop, radiusBottom, height, numSegments) {
                var N = numSegments, vertices = [], axes = [], faces = [], bottomface = [], topface = [], cos = Math.cos, sin = Math.sin;
                vertices.push(new Vec3(radiusBottom * cos(0), radiusBottom * sin(0), .5 * -height)), 
                bottomface.push(0), vertices.push(new Vec3(radiusTop * cos(0), radiusTop * sin(0), .5 * height)), 
                topface.push(1);
                for (var i = 0; i < N; i++) {
                    var theta = 2 * Math.PI / N * (i + 1), thetaN = 2 * Math.PI / N * (i + .5);
                    i < N - 1 ? (vertices.push(new Vec3(radiusBottom * cos(theta), radiusBottom * sin(theta), .5 * -height)), 
                    bottomface.push(2 * i + 2), vertices.push(new Vec3(radiusTop * cos(theta), radiusTop * sin(theta), .5 * height)), 
                    topface.push(2 * i + 3), faces.push([ 2 * i + 2, 2 * i + 3, 2 * i + 1, 2 * i ])) : faces.push([ 0, 1, 2 * i + 1, 2 * i ]), 
                    (N % 2 == 1 || i < N / 2) && axes.push(new Vec3(cos(thetaN), sin(thetaN), 0));
                }
                faces.push(topface), axes.push(new Vec3(0, 0, 1));
                for (var temp = [], _i = 0; _i < bottomface.length; _i++) temp.push(bottomface[bottomface.length - _i - 1]);
                return faces.push(temp), _ConvexPolyhedron.call(this, {
                    vertices: vertices,
                    faces: faces,
                    axes: axes
                }) || this;
            }
            return _inheritsLoose(Cylinder, _ConvexPolyhedron), Cylinder;
        }(ConvexPolyhedron), Particle = function(_Shape) {
            function Particle() {
                return _Shape.call(this, {
                    type: Shape.types.PARTICLE
                }) || this;
            }
            _inheritsLoose(Particle, _Shape);
            var _proto = Particle.prototype;
            return _proto.calculateLocalInertia = function(mass, target) {
                return void 0 === target && (target = new Vec3()), target.set(0, 0, 0), 
                target;
            }, _proto.volume = function() {
                return 0;
            }, _proto.updateBoundingSphereRadius = function() {
                this.boundingSphereRadius = 0;
            }, _proto.calculateWorldAABB = function(pos, quat, min, max) {
                min.copy(pos), max.copy(pos);
            }, Particle;
        }(Shape), Plane = function(_Shape) {
            function Plane() {
                var _this;
                return (_this = _Shape.call(this, {
                    type: Shape.types.PLANE
                }) || this).worldNormal = new Vec3(), _this.worldNormalNeedsUpdate = !0, 
                _this.boundingSphereRadius = Number.MAX_VALUE, _this;
            }
            _inheritsLoose(Plane, _Shape);
            var _proto = Plane.prototype;
            return _proto.computeWorldNormal = function(quat) {
                var n = this.worldNormal;
                n.set(0, 0, 1), quat.vmult(n, n), this.worldNormalNeedsUpdate = !1;
            }, _proto.calculateLocalInertia = function(mass, target) {
                return void 0 === target && (target = new Vec3()), target;
            }, _proto.volume = function() {
                return Number.MAX_VALUE;
            }, _proto.calculateWorldAABB = function(pos, quat, min, max) {
                tempNormal.set(0, 0, 1), quat.vmult(tempNormal, tempNormal);
                var maxVal = Number.MAX_VALUE;
                min.set(-maxVal, -maxVal, -maxVal), max.set(maxVal, maxVal, maxVal), 
                1 === tempNormal.x ? max.x = pos.x : -1 === tempNormal.x && (min.x = pos.x), 
                1 === tempNormal.y ? max.y = pos.y : -1 === tempNormal.y && (min.y = pos.y), 
                1 === tempNormal.z ? max.z = pos.z : -1 === tempNormal.z && (min.z = pos.z);
            }, _proto.updateBoundingSphereRadius = function() {
                this.boundingSphereRadius = Number.MAX_VALUE;
            }, Plane;
        }(Shape), tempNormal = new Vec3(), Heightfield = function(_Shape) {
            function Heightfield(data, options) {
                var _this;
                return void 0 === options && (options = {}), options = Utils.defaults(options, {
                    maxValue: null,
                    minValue: null,
                    elementSize: 1
                }), (_this = _Shape.call(this, {
                    type: Shape.types.HEIGHTFIELD
                }) || this).data = data, _this.maxValue = options.maxValue, _this.minValue = options.minValue, 
                _this.elementSize = options.elementSize, null === options.minValue && _this.updateMinValue(), 
                null === options.maxValue && _this.updateMaxValue(), _this.cacheEnabled = !0, 
                _this.pillarConvex = new ConvexPolyhedron(), _this.pillarOffset = new Vec3(), 
                _this.updateBoundingSphereRadius(), _this._cachedPillars = {}, _this;
            }
            _inheritsLoose(Heightfield, _Shape);
            var _proto = Heightfield.prototype;
            return _proto.update = function() {
                this._cachedPillars = {};
            }, _proto.updateMinValue = function() {
                for (var data = this.data, minValue = data[0][0], i = 0; i !== data.length; i++) for (var j = 0; j !== data[i].length; j++) {
                    var v = data[i][j];
                    v < minValue && (minValue = v);
                }
                this.minValue = minValue;
            }, _proto.updateMaxValue = function() {
                for (var data = this.data, maxValue = data[0][0], i = 0; i !== data.length; i++) for (var j = 0; j !== data[i].length; j++) {
                    var v = data[i][j];
                    v > maxValue && (maxValue = v);
                }
                this.maxValue = maxValue;
            }, _proto.setHeightValueAtIndex = function(xi, yi, value) {
                this.data[xi][yi] = value, this.clearCachedConvexTrianglePillar(xi, yi, !1), 
                xi > 0 && (this.clearCachedConvexTrianglePillar(xi - 1, yi, !0), 
                this.clearCachedConvexTrianglePillar(xi - 1, yi, !1)), yi > 0 && (this.clearCachedConvexTrianglePillar(xi, yi - 1, !0), 
                this.clearCachedConvexTrianglePillar(xi, yi - 1, !1)), yi > 0 && xi > 0 && this.clearCachedConvexTrianglePillar(xi - 1, yi - 1, !0);
            }, _proto.getRectMinMax = function(iMinX, iMinY, iMaxX, iMaxY, result) {
                void 0 === result && (result = []);
                for (var data = this.data, max = this.minValue, i = iMinX; i <= iMaxX; i++) for (var j = iMinY; j <= iMaxY; j++) {
                    var height = data[i][j];
                    height > max && (max = height);
                }
                result[0] = this.minValue, result[1] = max;
            }, _proto.getIndexOfPosition = function(x, y, result, clamp) {
                var w = this.elementSize, data = this.data, xi = Math.floor(x / w), yi = Math.floor(y / w);
                return result[0] = xi, result[1] = yi, clamp && (xi < 0 && (xi = 0), 
                yi < 0 && (yi = 0), xi >= data.length - 1 && (xi = data.length - 1), 
                yi >= data[0].length - 1 && (yi = data[0].length - 1)), !(xi < 0 || yi < 0 || xi >= data.length - 1 || yi >= data[0].length - 1);
            }, _proto.getTriangleAt = function(x, y, edgeClamp, a, b, c) {
                var idx = getHeightAt_idx;
                this.getIndexOfPosition(x, y, idx, edgeClamp);
                var xi = idx[0], yi = idx[1], data = this.data;
                edgeClamp && (xi = Math.min(data.length - 2, Math.max(0, xi)), yi = Math.min(data[0].length - 2, Math.max(0, yi)));
                var elementSize = this.elementSize, upper = Math.pow(x / elementSize - xi, 2) + Math.pow(y / elementSize - yi, 2) > Math.pow(x / elementSize - (xi + 1), 2) + Math.pow(y / elementSize - (yi + 1), 2);
                return this.getTriangle(xi, yi, upper, a, b, c), upper;
            }, _proto.getNormalAt = function(x, y, edgeClamp, result) {
                var a = getNormalAt_a, b = getNormalAt_b, c = getNormalAt_c, e0 = getNormalAt_e0, e1 = getNormalAt_e1;
                this.getTriangleAt(x, y, edgeClamp, a, b, c), b.vsub(a, e0), c.vsub(a, e1), 
                e0.cross(e1, result), result.normalize();
            }, _proto.getAabbAtIndex = function(xi, yi, _ref) {
                var lowerBound = _ref.lowerBound, upperBound = _ref.upperBound, data = this.data, elementSize = this.elementSize;
                lowerBound.set(xi * elementSize, yi * elementSize, data[xi][yi]), 
                upperBound.set((xi + 1) * elementSize, (yi + 1) * elementSize, data[xi + 1][yi + 1]);
            }, _proto.getHeightAt = function(x, y, edgeClamp) {
                var data = this.data, a = getHeightAt_a, b = getHeightAt_b, c = getHeightAt_c, idx = getHeightAt_idx;
                this.getIndexOfPosition(x, y, idx, edgeClamp);
                var xi = idx[0], yi = idx[1];
                edgeClamp && (xi = Math.min(data.length - 2, Math.max(0, xi)), yi = Math.min(data[0].length - 2, Math.max(0, yi)));
                var upper = this.getTriangleAt(x, y, edgeClamp, a, b, c);
                !function(x, y, ax, ay, bx, by, cx, cy, result) {
                    result.x = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / ((by - cy) * (ax - cx) + (cx - bx) * (ay - cy)), 
                    result.y = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / ((by - cy) * (ax - cx) + (cx - bx) * (ay - cy)), 
                    result.z = 1 - result.x - result.y;
                }(x, y, a.x, a.y, b.x, b.y, c.x, c.y, getHeightAt_weights);
                var w = getHeightAt_weights;
                return upper ? data[xi + 1][yi + 1] * w.x + data[xi][yi + 1] * w.y + data[xi + 1][yi] * w.z : data[xi][yi] * w.x + data[xi + 1][yi] * w.y + data[xi][yi + 1] * w.z;
            }, _proto.getCacheConvexTrianglePillarKey = function(xi, yi, getUpperTriangle) {
                return xi + "_" + yi + "_" + (getUpperTriangle ? 1 : 0);
            }, _proto.getCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle) {
                return this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)];
            }, _proto.setCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle, convex, offset) {
                this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)] = {
                    convex: convex,
                    offset: offset
                };
            }, _proto.clearCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle) {
                delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)];
            }, _proto.getTriangle = function(xi, yi, upper, a, b, c) {
                var data = this.data, elementSize = this.elementSize;
                upper ? (a.set((xi + 1) * elementSize, (yi + 1) * elementSize, data[xi + 1][yi + 1]), 
                b.set(xi * elementSize, (yi + 1) * elementSize, data[xi][yi + 1]), 
                c.set((xi + 1) * elementSize, yi * elementSize, data[xi + 1][yi])) : (a.set(xi * elementSize, yi * elementSize, data[xi][yi]), 
                b.set((xi + 1) * elementSize, yi * elementSize, data[xi + 1][yi]), 
                c.set(xi * elementSize, (yi + 1) * elementSize, data[xi][yi + 1]));
            }, _proto.getConvexTrianglePillar = function(xi, yi, getUpperTriangle) {
                var result = this.pillarConvex, offsetResult = this.pillarOffset;
                if (this.cacheEnabled) {
                    var _data = this.getCachedConvexTrianglePillar(xi, yi, getUpperTriangle);
                    if (_data) return this.pillarConvex = _data.convex, void (this.pillarOffset = _data.offset);
                    result = new ConvexPolyhedron(), offsetResult = new Vec3(), 
                    this.pillarConvex = result, this.pillarOffset = offsetResult;
                }
                var data = this.data, elementSize = this.elementSize, faces = result.faces;
                result.vertices.length = 6;
                for (var i = 0; i < 6; i++) result.vertices[i] || (result.vertices[i] = new Vec3());
                faces.length = 5;
                for (var _i = 0; _i < 5; _i++) faces[_i] || (faces[_i] = []);
                var verts = result.vertices, h = (Math.min(data[xi][yi], data[xi + 1][yi], data[xi][yi + 1], data[xi + 1][yi + 1]) - this.minValue) / 2 + this.minValue;
                getUpperTriangle ? (offsetResult.set((xi + .75) * elementSize, (yi + .75) * elementSize, h), 
                verts[0].set(.25 * elementSize, .25 * elementSize, data[xi + 1][yi + 1] - h), 
                verts[1].set(-.75 * elementSize, .25 * elementSize, data[xi][yi + 1] - h), 
                verts[2].set(.25 * elementSize, -.75 * elementSize, data[xi + 1][yi] - h), 
                verts[3].set(.25 * elementSize, .25 * elementSize, -h - 1), verts[4].set(-.75 * elementSize, .25 * elementSize, -h - 1), 
                verts[5].set(.25 * elementSize, -.75 * elementSize, -h - 1), faces[0][0] = 0, 
                faces[0][1] = 1, faces[0][2] = 2, faces[1][0] = 5, faces[1][1] = 4, 
                faces[1][2] = 3, faces[2][0] = 2, faces[2][1] = 5, faces[2][2] = 3, 
                faces[2][3] = 0, faces[3][0] = 3, faces[3][1] = 4, faces[3][2] = 1, 
                faces[3][3] = 0, faces[4][0] = 1, faces[4][1] = 4, faces[4][2] = 5, 
                faces[4][3] = 2) : (offsetResult.set((xi + .25) * elementSize, (yi + .25) * elementSize, h), 
                verts[0].set(-.25 * elementSize, -.25 * elementSize, data[xi][yi] - h), 
                verts[1].set(.75 * elementSize, -.25 * elementSize, data[xi + 1][yi] - h), 
                verts[2].set(-.25 * elementSize, .75 * elementSize, data[xi][yi + 1] - h), 
                verts[3].set(-.25 * elementSize, -.25 * elementSize, -h - 1), verts[4].set(.75 * elementSize, -.25 * elementSize, -h - 1), 
                verts[5].set(-.25 * elementSize, .75 * elementSize, -h - 1), faces[0][0] = 0, 
                faces[0][1] = 1, faces[0][2] = 2, faces[1][0] = 5, faces[1][1] = 4, 
                faces[1][2] = 3, faces[2][0] = 0, faces[2][1] = 2, faces[2][2] = 5, 
                faces[2][3] = 3, faces[3][0] = 1, faces[3][1] = 0, faces[3][2] = 3, 
                faces[3][3] = 4, faces[4][0] = 4, faces[4][1] = 5, faces[4][2] = 2, 
                faces[4][3] = 1), result.computeNormals(), result.computeEdges(), 
                result.updateBoundingSphereRadius(), this.setCachedConvexTrianglePillar(xi, yi, getUpperTriangle, result, offsetResult);
            }, _proto.calculateLocalInertia = function(mass, target) {
                return void 0 === target && (target = new Vec3()), target.set(0, 0, 0), 
                target;
            }, _proto.volume = function() {
                return Number.MAX_VALUE;
            }, _proto.calculateWorldAABB = function(pos, quat, min, max) {
                min.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE), 
                max.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            }, _proto.updateBoundingSphereRadius = function() {
                var data = this.data, s = this.elementSize;
                this.boundingSphereRadius = new Vec3(data.length * s, data[0].length * s, Math.max(Math.abs(this.maxValue), Math.abs(this.minValue))).length();
            }, _proto.setHeightsFromImage = function(image, scale) {
                var x = scale.x, z = scale.z, y = scale.y, canvas = document.createElement("canvas");
                canvas.width = image.width, canvas.height = image.height;
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);
                var imageData = context.getImageData(0, 0, image.width, image.height), matrix = this.data;
                matrix.length = 0, this.elementSize = Math.abs(x) / imageData.width;
                for (var i = 0; i < imageData.height; i++) {
                    for (var row = [], j = 0; j < imageData.width; j++) {
                        var height = (imageData.data[4 * (i * imageData.height + j)] + imageData.data[4 * (i * imageData.height + j) + 1] + imageData.data[4 * (i * imageData.height + j) + 2]) / 4 / 255 * z;
                        x < 0 ? row.push(height) : row.unshift(height);
                    }
                    y < 0 ? matrix.unshift(row) : matrix.push(row);
                }
                this.updateMaxValue(), this.updateMinValue(), this.update();
            }, Heightfield;
        }(Shape), getHeightAt_idx = [], getHeightAt_weights = new Vec3(), getHeightAt_a = new Vec3(), getHeightAt_b = new Vec3(), getHeightAt_c = new Vec3(), getNormalAt_a = new Vec3(), getNormalAt_b = new Vec3(), getNormalAt_c = new Vec3(), getNormalAt_e0 = new Vec3(), getNormalAt_e1 = new Vec3();
        var Octree = function(_OctreeNode) {
            function Octree(aabb, options) {
                var _this;
                return void 0 === options && (options = {}), (_this = _OctreeNode.call(this, {
                    root: null,
                    aabb: aabb
                }) || this).maxDepth = void 0 !== options.maxDepth ? options.maxDepth : 8, 
                _this;
            }
            return _inheritsLoose(Octree, _OctreeNode), Octree;
        }(function() {
            function OctreeNode(options) {
                void 0 === options && (options = {}), this.root = options.root || null, 
                this.aabb = options.aabb ? options.aabb.clone() : new AABB(), this.data = [], 
                this.children = [];
            }
            var _proto = OctreeNode.prototype;
            return _proto.reset = function() {
                this.children.length = this.data.length = 0;
            }, _proto.insert = function(aabb, elementData, level) {
                void 0 === level && (level = 0);
                var nodeData = this.data;
                if (!this.aabb.contains(aabb)) return !1;
                var children = this.children;
                if (level < (this.maxDepth || this.root.maxDepth)) {
                    var subdivided = !1;
                    children.length || (this.subdivide(), subdivided = !0);
                    for (var i = 0; 8 !== i; i++) if (children[i].insert(aabb, elementData, level + 1)) return !0;
                    subdivided && (children.length = 0);
                }
                return nodeData.push(elementData), !0;
            }, _proto.subdivide = function() {
                var aabb = this.aabb, l = aabb.lowerBound, u = aabb.upperBound, children = this.children;
                children.push(new OctreeNode({
                    aabb: new AABB({
                        lowerBound: new Vec3(0, 0, 0)
                    })
                }), new OctreeNode({
                    aabb: new AABB({
                        lowerBound: new Vec3(1, 0, 0)
                    })
                }), new OctreeNode({
                    aabb: new AABB({
                        lowerBound: new Vec3(1, 1, 0)
                    })
                }), new OctreeNode({
                    aabb: new AABB({
                        lowerBound: new Vec3(1, 1, 1)
                    })
                }), new OctreeNode({
                    aabb: new AABB({
                        lowerBound: new Vec3(0, 1, 1)
                    })
                }), new OctreeNode({
                    aabb: new AABB({
                        lowerBound: new Vec3(0, 0, 1)
                    })
                }), new OctreeNode({
                    aabb: new AABB({
                        lowerBound: new Vec3(1, 0, 1)
                    })
                }), new OctreeNode({
                    aabb: new AABB({
                        lowerBound: new Vec3(0, 1, 0)
                    })
                })), u.vsub(l, halfDiagonal), halfDiagonal.scale(.5, halfDiagonal);
                for (var root = this.root || this, i = 0; 8 !== i; i++) {
                    var child = children[i];
                    child.root = root;
                    var lowerBound = child.aabb.lowerBound;
                    lowerBound.x *= halfDiagonal.x, lowerBound.y *= halfDiagonal.y, 
                    lowerBound.z *= halfDiagonal.z, lowerBound.vadd(l, lowerBound), 
                    lowerBound.vadd(halfDiagonal, child.aabb.upperBound);
                }
            }, _proto.aabbQuery = function(aabb, result) {
                this.data, this.children;
                for (var queue = [ this ]; queue.length; ) {
                    var node = queue.pop();
                    node.aabb.overlaps(aabb) && Array.prototype.push.apply(result, node.data), 
                    Array.prototype.push.apply(queue, node.children);
                }
                return result;
            }, _proto.rayQuery = function(ray, treeTransform, result) {
                return ray.getAABB(tmpAABB$1), tmpAABB$1.toLocalFrame(treeTransform, tmpAABB$1), 
                this.aabbQuery(tmpAABB$1, result), result;
            }, _proto.removeEmptyNodes = function() {
                for (var i = this.children.length - 1; i >= 0; i--) this.children[i].removeEmptyNodes(), 
                this.children[i].children.length || this.children[i].data.length || this.children.splice(i, 1);
            }, OctreeNode;
        }()), halfDiagonal = new Vec3(), tmpAABB$1 = new AABB(), Trimesh = function(_Shape) {
            function Trimesh(vertices, indices) {
                var _this;
                return (_this = _Shape.call(this, {
                    type: Shape.types.TRIMESH
                }) || this).vertices = new Float32Array(vertices), _this.indices = new Int16Array(indices), 
                _this.normals = new Float32Array(indices.length), _this.aabb = new AABB(), 
                _this.edges = null, _this.scale = new Vec3(1, 1, 1), _this.tree = new Octree(), 
                _this.updateEdges(), _this.updateNormals(), _this.updateAABB(), 
                _this.updateBoundingSphereRadius(), _this.updateTree(), _this;
            }
            _inheritsLoose(Trimesh, _Shape);
            var _proto = Trimesh.prototype;
            return _proto.updateTree = function() {
                var tree = this.tree;
                tree.reset(), tree.aabb.copy(this.aabb);
                var scale = this.scale;
                tree.aabb.lowerBound.x *= 1 / scale.x, tree.aabb.lowerBound.y *= 1 / scale.y, 
                tree.aabb.lowerBound.z *= 1 / scale.z, tree.aabb.upperBound.x *= 1 / scale.x, 
                tree.aabb.upperBound.y *= 1 / scale.y, tree.aabb.upperBound.z *= 1 / scale.z;
                for (var triangleAABB = new AABB(), a = new Vec3(), b = new Vec3(), c = new Vec3(), points = [ a, b, c ], i = 0; i < this.indices.length / 3; i++) {
                    var i3 = 3 * i;
                    this._getUnscaledVertex(this.indices[i3], a), this._getUnscaledVertex(this.indices[i3 + 1], b), 
                    this._getUnscaledVertex(this.indices[i3 + 2], c), triangleAABB.setFromPoints(points), 
                    tree.insert(triangleAABB, i);
                }
                tree.removeEmptyNodes();
            }, _proto.getTrianglesInAABB = function(aabb, result) {
                unscaledAABB.copy(aabb);
                var scale = this.scale, isx = scale.x, isy = scale.y, isz = scale.z, l = unscaledAABB.lowerBound, u = unscaledAABB.upperBound;
                return l.x /= isx, l.y /= isy, l.z /= isz, u.x /= isx, u.y /= isy, 
                u.z /= isz, this.tree.aabbQuery(unscaledAABB, result);
            }, _proto.setScale = function(scale) {
                var wasUniform = this.scale.x === this.scale.y && this.scale.y === this.scale.z, isUniform = scale.x === scale.y && scale.y === scale.z;
                wasUniform && isUniform || this.updateNormals(), this.scale.copy(scale), 
                this.updateAABB(), this.updateBoundingSphereRadius();
            }, _proto.updateNormals = function() {
                for (var n = computeNormals_n, normals = this.normals, i = 0; i < this.indices.length / 3; i++) {
                    var i3 = 3 * i, a = this.indices[i3], b = this.indices[i3 + 1], c = this.indices[i3 + 2];
                    this.getVertex(a, va), this.getVertex(b, vb), this.getVertex(c, vc), 
                    Trimesh.computeNormal(vb, va, vc, n), normals[i3] = n.x, normals[i3 + 1] = n.y, 
                    normals[i3 + 2] = n.z;
                }
            }, _proto.updateEdges = function() {
                for (var edges = {}, add = function(a, b) {
                    edges[a < b ? a + "_" + b : b + "_" + a] = !0;
                }, i = 0; i < this.indices.length / 3; i++) {
                    var i3 = 3 * i, a = this.indices[i3], b = this.indices[i3 + 1], c = this.indices[i3 + 2];
                    add(a, b), add(b, c), add(c, a);
                }
                var keys = Object.keys(edges);
                this.edges = new Int16Array(2 * keys.length);
                for (var _i = 0; _i < keys.length; _i++) {
                    var indices = keys[_i].split("_");
                    this.edges[2 * _i] = parseInt(indices[0], 10), this.edges[2 * _i + 1] = parseInt(indices[1], 10);
                }
            }, _proto.getEdgeVertex = function(edgeIndex, firstOrSecond, vertexStore) {
                var vertexIndex = this.edges[2 * edgeIndex + (firstOrSecond ? 1 : 0)];
                this.getVertex(vertexIndex, vertexStore);
            }, _proto.getEdgeVector = function(edgeIndex, vectorStore) {
                var va = getEdgeVector_va, vb = getEdgeVector_vb;
                this.getEdgeVertex(edgeIndex, 0, va), this.getEdgeVertex(edgeIndex, 1, vb), 
                vb.vsub(va, vectorStore);
            }, _proto.getVertex = function(i, out) {
                var scale = this.scale;
                return this._getUnscaledVertex(i, out), out.x *= scale.x, out.y *= scale.y, 
                out.z *= scale.z, out;
            }, _proto._getUnscaledVertex = function(i, out) {
                var i3 = 3 * i, vertices = this.vertices;
                return out.set(vertices[i3], vertices[i3 + 1], vertices[i3 + 2]);
            }, _proto.getWorldVertex = function(i, pos, quat, out) {
                return this.getVertex(i, out), Transform.pointToWorldFrame(pos, quat, out, out), 
                out;
            }, _proto.getTriangleVertices = function(i, a, b, c) {
                var i3 = 3 * i;
                this.getVertex(this.indices[i3], a), this.getVertex(this.indices[i3 + 1], b), 
                this.getVertex(this.indices[i3 + 2], c);
            }, _proto.getNormal = function(i, target) {
                var i3 = 3 * i;
                return target.set(this.normals[i3], this.normals[i3 + 1], this.normals[i3 + 2]);
            }, _proto.calculateLocalInertia = function(mass, target) {
                this.computeLocalAABB(cli_aabb);
                var x = cli_aabb.upperBound.x - cli_aabb.lowerBound.x, y = cli_aabb.upperBound.y - cli_aabb.lowerBound.y, z = cli_aabb.upperBound.z - cli_aabb.lowerBound.z;
                return target.set(1 / 12 * mass * (2 * y * 2 * y + 2 * z * 2 * z), 1 / 12 * mass * (2 * x * 2 * x + 2 * z * 2 * z), 1 / 12 * mass * (2 * y * 2 * y + 2 * x * 2 * x));
            }, _proto.computeLocalAABB = function(aabb) {
                var l = aabb.lowerBound, u = aabb.upperBound, n = this.vertices.length, v = (this.vertices, 
                computeLocalAABB_worldVert);
                this.getVertex(0, v), l.copy(v), u.copy(v);
                for (var i = 0; i !== n; i++) this.getVertex(i, v), v.x < l.x ? l.x = v.x : v.x > u.x && (u.x = v.x), 
                v.y < l.y ? l.y = v.y : v.y > u.y && (u.y = v.y), v.z < l.z ? l.z = v.z : v.z > u.z && (u.z = v.z);
            }, _proto.updateAABB = function() {
                this.computeLocalAABB(this.aabb);
            }, _proto.updateBoundingSphereRadius = function() {
                for (var max2 = 0, vertices = this.vertices, v = new Vec3(), i = 0, N = vertices.length / 3; i !== N; i++) {
                    this.getVertex(i, v);
                    var norm2 = v.lengthSquared();
                    norm2 > max2 && (max2 = norm2);
                }
                this.boundingSphereRadius = Math.sqrt(max2);
            }, _proto.calculateWorldAABB = function(pos, quat, min, max) {
                var frame = calculateWorldAABB_frame, result = calculateWorldAABB_aabb;
                frame.position = pos, frame.quaternion = quat, this.aabb.toWorldFrame(frame, result), 
                min.copy(result.lowerBound), max.copy(result.upperBound);
            }, _proto.volume = function() {
                return 4 * Math.PI * this.boundingSphereRadius / 3;
            }, Trimesh;
        }(Shape), computeNormals_n = new Vec3(), unscaledAABB = new AABB(), getEdgeVector_va = new Vec3(), getEdgeVector_vb = new Vec3(), cb = new Vec3(), ab = new Vec3();
        Trimesh.computeNormal = function(va, vb, vc, target) {
            vb.vsub(va, ab), vc.vsub(vb, cb), cb.cross(ab, target), target.isZero() || target.normalize();
        };
        var va = new Vec3(), vb = new Vec3(), vc = new Vec3(), cli_aabb = new AABB(), computeLocalAABB_worldVert = new Vec3(), calculateWorldAABB_frame = new Transform(), calculateWorldAABB_aabb = new AABB();
        Trimesh.createTorus = function(radius, tube, radialSegments, tubularSegments, arc) {
            void 0 === radius && (radius = 1), void 0 === tube && (tube = .5), void 0 === radialSegments && (radialSegments = 8), 
            void 0 === tubularSegments && (tubularSegments = 6), void 0 === arc && (arc = 2 * Math.PI);
            for (var vertices = [], indices = [], j = 0; j <= radialSegments; j++) for (var i = 0; i <= tubularSegments; i++) {
                var u = i / tubularSegments * arc, v = j / radialSegments * Math.PI * 2, x = (radius + tube * Math.cos(v)) * Math.cos(u), y = (radius + tube * Math.cos(v)) * Math.sin(u), z = tube * Math.sin(v);
                vertices.push(x, y, z);
            }
            for (var _j = 1; _j <= radialSegments; _j++) for (var _i2 = 1; _i2 <= tubularSegments; _i2++) {
                var a = (tubularSegments + 1) * _j + _i2 - 1, b = (tubularSegments + 1) * (_j - 1) + _i2 - 1, c = (tubularSegments + 1) * (_j - 1) + _i2, d = (tubularSegments + 1) * _j + _i2;
                indices.push(a, b, d), indices.push(b, c, d);
            }
            return new Trimesh(vertices, indices);
        };
        var Solver = function() {
            function Solver() {
                this.equations = [];
            }
            var _proto = Solver.prototype;
            return _proto.solve = function(dt, world) {
                return 0;
            }, _proto.addEquation = function(eq) {
                eq.enabled && this.equations.push(eq);
            }, _proto.removeEquation = function(eq) {
                var eqs = this.equations, i = eqs.indexOf(eq);
                -1 !== i && eqs.splice(i, 1);
            }, _proto.removeAllEquations = function() {
                this.equations.length = 0;
            }, Solver;
        }(), GSSolver = function(_Solver) {
            function GSSolver() {
                var _this;
                return (_this = _Solver.call(this) || this).iterations = 10, _this.tolerance = 1e-7, 
                _this;
            }
            return _inheritsLoose(GSSolver, _Solver), GSSolver.prototype.solve = function(dt, world) {
                var B, invC, deltalambda, deltalambdaTot, lambdaj, iter = 0, maxIter = this.iterations, tolSquared = this.tolerance * this.tolerance, equations = this.equations, Neq = equations.length, bodies = world.bodies, Nbodies = bodies.length, h = dt;
                if (0 !== Neq) for (var i = 0; i !== Nbodies; i++) bodies[i].updateSolveMassProperties();
                var invCs = GSSolver_solve_invCs, Bs = GSSolver_solve_Bs, lambda = GSSolver_solve_lambda;
                invCs.length = Neq, Bs.length = Neq, lambda.length = Neq;
                for (var _i = 0; _i !== Neq; _i++) {
                    var c = equations[_i];
                    lambda[_i] = 0, Bs[_i] = c.computeB(h), invCs[_i] = 1 / c.computeC();
                }
                if (0 !== Neq) {
                    for (var _i2 = 0; _i2 !== Nbodies; _i2++) {
                        var b = bodies[_i2], vlambda = b.vlambda, wlambda = b.wlambda;
                        vlambda.set(0, 0, 0), wlambda.set(0, 0, 0);
                    }
                    for (iter = 0; iter !== maxIter; iter++) {
                        deltalambdaTot = 0;
                        for (var j = 0; j !== Neq; j++) {
                            var _c = equations[j];
                            B = Bs[j], invC = invCs[j], (lambdaj = lambda[j]) + (deltalambda = invC * (B - _c.computeGWlambda() - _c.eps * lambdaj)) < _c.minForce ? deltalambda = _c.minForce - lambdaj : lambdaj + deltalambda > _c.maxForce && (deltalambda = _c.maxForce - lambdaj), 
                            lambda[j] += deltalambda, deltalambdaTot += deltalambda > 0 ? deltalambda : -deltalambda, 
                            _c.addToWlambda(deltalambda);
                        }
                        if (deltalambdaTot * deltalambdaTot < tolSquared) break;
                    }
                    for (var _i3 = 0; _i3 !== Nbodies; _i3++) {
                        var _b = bodies[_i3], v = _b.velocity, w = _b.angularVelocity;
                        _b.vlambda.vmul(_b.linearFactor, _b.vlambda), v.vadd(_b.vlambda, v), 
                        _b.wlambda.vmul(_b.angularFactor, _b.wlambda), w.vadd(_b.wlambda, w);
                    }
                    for (var l = equations.length, invDt = 1 / h; l--; ) equations[l].multiplier = lambda[l] * invDt;
                }
                return iter;
            }, GSSolver;
        }(Solver), GSSolver_solve_lambda = [], GSSolver_solve_invCs = [], GSSolver_solve_Bs = [], SplitSolver = function(_Solver) {
            function SplitSolver(subsolver) {
                var _this;
                for ((_this = _Solver.call(this) || this).iterations = 10, _this.tolerance = 1e-7, 
                _this.subsolver = subsolver, _this.nodes = [], _this.nodePool = []; _this.nodePool.length < 128; ) _this.nodePool.push(_this.createNode());
                return _this;
            }
            _inheritsLoose(SplitSolver, _Solver);
            var _proto = SplitSolver.prototype;
            return _proto.createNode = function() {
                return {
                    body: null,
                    children: [],
                    eqs: [],
                    visited: !1
                };
            }, _proto.solve = function(dt, world) {
                for (var child, nodes = SplitSolver_solve_nodes, nodePool = this.nodePool, bodies = world.bodies, equations = this.equations, Neq = equations.length, Nbodies = bodies.length, subsolver = this.subsolver; nodePool.length < Nbodies; ) nodePool.push(this.createNode());
                nodes.length = Nbodies;
                for (var i = 0; i < Nbodies; i++) nodes[i] = nodePool[i];
                for (var _i = 0; _i !== Nbodies; _i++) {
                    var _node = nodes[_i];
                    _node.body = bodies[_i], _node.children.length = 0, _node.eqs.length = 0, 
                    _node.visited = !1;
                }
                for (var k = 0; k !== Neq; k++) {
                    var eq = equations[k], _i2 = bodies.indexOf(eq.bi), j = bodies.indexOf(eq.bj), ni = nodes[_i2], nj = nodes[j];
                    ni.children.push(nj), ni.eqs.push(eq), nj.children.push(ni), 
                    nj.eqs.push(eq);
                }
                var n = 0, eqs = SplitSolver_solve_eqs;
                subsolver.tolerance = this.tolerance, subsolver.iterations = this.iterations;
                for (var dummyWorld = SplitSolver_solve_dummyWorld; child = getUnvisitedNode(nodes); ) {
                    eqs.length = 0, dummyWorld.bodies.length = 0, bfs(child, visitFunc, dummyWorld.bodies, eqs);
                    var Neqs = eqs.length;
                    eqs = eqs.sort(sortById);
                    for (var _i3 = 0; _i3 !== Neqs; _i3++) subsolver.addEquation(eqs[_i3]);
                    subsolver.solve(dt, dummyWorld);
                    subsolver.removeAllEquations(), n++;
                }
                return n;
            }, SplitSolver;
        }(Solver), SplitSolver_solve_nodes = [], SplitSolver_solve_eqs = [], SplitSolver_solve_dummyWorld = {
            bodies: []
        }, STATIC = Body.STATIC;
        function getUnvisitedNode(nodes) {
            for (var Nnodes = nodes.length, i = 0; i !== Nnodes; i++) {
                var _node2 = nodes[i];
                if (!(_node2.visited || _node2.body.type & STATIC)) return _node2;
            }
            return !1;
        }
        var queue = [];
        function bfs(root, visitFunc, bds, eqs) {
            for (queue.push(root), root.visited = !0, visitFunc(root, bds, eqs); queue.length; ) for (var _node3 = queue.pop(), child = void 0; child = getUnvisitedNode(_node3.children); ) child.visited = !0, 
            visitFunc(child, bds, eqs), queue.push(child);
        }
        function visitFunc(node, bds, eqs) {
            bds.push(node.body);
            for (var Neqs = node.eqs.length, i = 0; i !== Neqs; i++) {
                var eq = node.eqs[i];
                eqs.includes(eq) || eqs.push(eq);
            }
        }
        function sortById(a, b) {
            return b.id - a.id;
        }
        var Pool = function() {
            function Pool() {
                this.objects = [], this.type = Object;
            }
            var _proto = Pool.prototype;
            return _proto.release = function() {
                for (var Nargs = arguments.length, i = 0; i !== Nargs; i++) this.objects.push(i < 0 || arguments.length <= i ? void 0 : arguments[i]);
                return this;
            }, _proto.get = function() {
                return 0 === this.objects.length ? this.constructObject() : this.objects.pop();
            }, _proto.constructObject = function() {
                throw new Error("constructObject() not implemented in this Pool subclass yet!");
            }, _proto.resize = function(size) {
                for (var objects = this.objects; objects.length > size; ) objects.pop();
                for (;objects.length < size; ) objects.push(this.constructObject());
                return this;
            }, Pool;
        }(), Vec3Pool = function(_Pool) {
            function Vec3Pool() {
                var _this;
                return (_this = _Pool.call(this) || this).type = Vec3, _this;
            }
            return _inheritsLoose(Vec3Pool, _Pool), Vec3Pool.prototype.constructObject = function() {
                return new Vec3();
            }, Vec3Pool;
        }(Pool), COLLISION_TYPES = {
            sphereSphere: Shape.types.SPHERE,
            spherePlane: Shape.types.SPHERE | Shape.types.PLANE,
            boxBox: Shape.types.BOX | Shape.types.BOX,
            sphereBox: Shape.types.SPHERE | Shape.types.BOX,
            planeBox: Shape.types.PLANE | Shape.types.BOX,
            convexConvex: Shape.types.CONVEXPOLYHEDRON,
            sphereConvex: Shape.types.SPHERE | Shape.types.CONVEXPOLYHEDRON,
            planeConvex: Shape.types.PLANE | Shape.types.CONVEXPOLYHEDRON,
            boxConvex: Shape.types.BOX | Shape.types.CONVEXPOLYHEDRON,
            sphereHeightfield: Shape.types.SPHERE | Shape.types.HEIGHTFIELD,
            boxHeightfield: Shape.types.BOX | Shape.types.HEIGHTFIELD,
            convexHeightfield: Shape.types.CONVEXPOLYHEDRON | Shape.types.HEIGHTFIELD,
            sphereParticle: Shape.types.PARTICLE | Shape.types.SPHERE,
            planeParticle: Shape.types.PLANE | Shape.types.PARTICLE,
            boxParticle: Shape.types.BOX | Shape.types.PARTICLE,
            convexParticle: Shape.types.PARTICLE | Shape.types.CONVEXPOLYHEDRON,
            sphereTrimesh: Shape.types.SPHERE | Shape.types.TRIMESH,
            planeTrimesh: Shape.types.PLANE | Shape.types.TRIMESH
        }, Narrowphase = function() {
            function Narrowphase(world) {
                this.contactPointPool = [], this.frictionEquationPool = [], this.result = [], 
                this.frictionResult = [], this.v3pool = new Vec3Pool(), this.world = world, 
                this.currentContactMaterial = world.defaultContactMaterial, this.enableFrictionReduction = !1;
            }
            var _proto = Narrowphase.prototype;
            return _proto.createContactEquation = function(bi, bj, si, sj, overrideShapeA, overrideShapeB) {
                var c;
                this.contactPointPool.length ? ((c = this.contactPointPool.pop()).bi = bi, 
                c.bj = bj) : c = new ContactEquation(bi, bj), c.enabled = bi.collisionResponse && bj.collisionResponse && si.collisionResponse && sj.collisionResponse;
                var cm = this.currentContactMaterial;
                c.restitution = cm.restitution, c.setSpookParams(cm.contactEquationStiffness, cm.contactEquationRelaxation, this.world.dt);
                var matA = si.material || bi.material, matB = sj.material || bj.material;
                return matA && matB && matA.restitution >= 0 && matB.restitution >= 0 && (c.restitution = matA.restitution * matB.restitution), 
                c.si = overrideShapeA || si, c.sj = overrideShapeB || sj, c;
            }, _proto.createFrictionEquationsFromContact = function(contactEquation, outArray) {
                var bodyA = contactEquation.bi, bodyB = contactEquation.bj, shapeA = contactEquation.si, shapeB = contactEquation.sj, world = this.world, cm = this.currentContactMaterial, friction = cm.friction, matA = shapeA.material || bodyA.material, matB = shapeB.material || bodyB.material;
                if (matA && matB && matA.friction >= 0 && matB.friction >= 0 && (friction = matA.friction * matB.friction), 
                friction > 0) {
                    var mug = friction * world.gravity.length(), reducedMass = bodyA.invMass + bodyB.invMass;
                    reducedMass > 0 && (reducedMass = 1 / reducedMass);
                    var pool = this.frictionEquationPool, c1 = pool.length ? pool.pop() : new FrictionEquation(bodyA, bodyB, mug * reducedMass), c2 = pool.length ? pool.pop() : new FrictionEquation(bodyA, bodyB, mug * reducedMass);
                    return c1.bi = c2.bi = bodyA, c1.bj = c2.bj = bodyB, c1.minForce = c2.minForce = -mug * reducedMass, 
                    c1.maxForce = c2.maxForce = mug * reducedMass, c1.ri.copy(contactEquation.ri), 
                    c1.rj.copy(contactEquation.rj), c2.ri.copy(contactEquation.ri), 
                    c2.rj.copy(contactEquation.rj), contactEquation.ni.tangents(c1.t, c2.t), 
                    c1.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, world.dt), 
                    c2.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, world.dt), 
                    c1.enabled = c2.enabled = contactEquation.enabled, outArray.push(c1, c2), 
                    !0;
                }
                return !1;
            }, _proto.createFrictionFromAverage = function(numContacts) {
                var c = this.result[this.result.length - 1];
                if (this.createFrictionEquationsFromContact(c, this.frictionResult) && 1 !== numContacts) {
                    var f1 = this.frictionResult[this.frictionResult.length - 2], f2 = this.frictionResult[this.frictionResult.length - 1];
                    averageNormal.setZero(), averageContactPointA.setZero(), averageContactPointB.setZero();
                    for (var bodyA = c.bi, i = (c.bj, 0); i !== numContacts; i++) (c = this.result[this.result.length - 1 - i]).bi !== bodyA ? (averageNormal.vadd(c.ni, averageNormal), 
                    averageContactPointA.vadd(c.ri, averageContactPointA), averageContactPointB.vadd(c.rj, averageContactPointB)) : (averageNormal.vsub(c.ni, averageNormal), 
                    averageContactPointA.vadd(c.rj, averageContactPointA), averageContactPointB.vadd(c.ri, averageContactPointB));
                    var invNumContacts = 1 / numContacts;
                    averageContactPointA.scale(invNumContacts, f1.ri), averageContactPointB.scale(invNumContacts, f1.rj), 
                    f2.ri.copy(f1.ri), f2.rj.copy(f1.rj), averageNormal.normalize(), 
                    averageNormal.tangents(f1.t, f2.t);
                }
            }, _proto.getContacts = function(p1, p2, world, result, oldcontacts, frictionResult, frictionPool) {
                this.contactPointPool = oldcontacts, this.frictionEquationPool = frictionPool, 
                this.result = result, this.frictionResult = frictionResult;
                for (var qi = tmpQuat1, qj = tmpQuat2, xi = tmpVec1$3, xj = tmpVec2$3, k = 0, N = p1.length; k !== N; k++) {
                    var bi = p1[k], bj = p2[k], bodyContactMaterial = null;
                    bi.material && bj.material && (bodyContactMaterial = world.getContactMaterial(bi.material, bj.material) || null);
                    for (var justTest = bi.type & Body.KINEMATIC && bj.type & Body.STATIC || bi.type & Body.STATIC && bj.type & Body.KINEMATIC || bi.type & Body.KINEMATIC && bj.type & Body.KINEMATIC, i = 0; i < bi.shapes.length; i++) {
                        bi.quaternion.mult(bi.shapeOrientations[i], qi), bi.quaternion.vmult(bi.shapeOffsets[i], xi), 
                        xi.vadd(bi.position, xi);
                        for (var si = bi.shapes[i], j = 0; j < bj.shapes.length; j++) {
                            bj.quaternion.mult(bj.shapeOrientations[j], qj), bj.quaternion.vmult(bj.shapeOffsets[j], xj), 
                            xj.vadd(bj.position, xj);
                            var sj = bj.shapes[j];
                            if (si.collisionFilterMask & sj.collisionFilterGroup && sj.collisionFilterMask & si.collisionFilterGroup && !(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius)) {
                                var shapeContactMaterial = null;
                                si.material && sj.material && (shapeContactMaterial = world.getContactMaterial(si.material, sj.material) || null), 
                                this.currentContactMaterial = shapeContactMaterial || bodyContactMaterial || world.defaultContactMaterial;
                                var resolver = this[si.type | sj.type];
                                if (resolver) {
                                    (si.type < sj.type ? resolver.call(this, si, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest) : resolver.call(this, sj, si, xj, xi, qj, qi, bj, bi, si, sj, justTest)) && justTest && (world.shapeOverlapKeeper.set(si.id, sj.id), 
                                    world.bodyOverlapKeeper.set(bi.id, bj.id));
                                }
                            }
                        }
                    }
                }
            }, _proto.sphereSphere = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                if (justTest) return xi.distanceSquared(xj) < Math.pow(si.radius + sj.radius, 2);
                var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                xj.vsub(xi, r.ni), r.ni.normalize(), r.ri.copy(r.ni), r.rj.copy(r.ni), 
                r.ri.scale(si.radius, r.ri), r.rj.scale(-sj.radius, r.rj), r.ri.vadd(xi, r.ri), 
                r.ri.vsub(bi.position, r.ri), r.rj.vadd(xj, r.rj), r.rj.vsub(bj.position, r.rj), 
                this.result.push(r), this.createFrictionEquationsFromContact(r, this.frictionResult);
            }, _proto.spherePlane = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                if (r.ni.set(0, 0, 1), qj.vmult(r.ni, r.ni), r.ni.negate(r.ni), 
                r.ni.normalize(), r.ni.scale(si.radius, r.ri), xi.vsub(xj, point_on_plane_to_sphere), 
                r.ni.scale(r.ni.dot(point_on_plane_to_sphere), plane_to_sphere_ortho), 
                point_on_plane_to_sphere.vsub(plane_to_sphere_ortho, r.rj), -point_on_plane_to_sphere.dot(r.ni) <= si.radius) {
                    if (justTest) return !0;
                    var ri = r.ri, rj = r.rj;
                    ri.vadd(xi, ri), ri.vsub(bi.position, ri), rj.vadd(xj, rj), 
                    rj.vsub(bj.position, rj), this.result.push(r), this.createFrictionEquationsFromContact(r, this.frictionResult);
                }
            }, _proto.boxBox = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                return si.convexPolyhedronRepresentation.material = si.material, 
                sj.convexPolyhedronRepresentation.material = sj.material, si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse, 
                sj.convexPolyhedronRepresentation.collisionResponse = sj.collisionResponse, 
                this.convexConvex(si.convexPolyhedronRepresentation, sj.convexPolyhedronRepresentation, xi, xj, qi, qj, bi, bj, si, sj, justTest);
            }, _proto.sphereBox = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                var v3pool = this.v3pool, sides = sphereBox_sides;
                xi.vsub(xj, box_to_sphere), sj.getSideNormals(sides, qj);
                for (var R = si.radius, found = !1, side_ns = sphereBox_side_ns, side_ns1 = sphereBox_side_ns1, side_ns2 = sphereBox_side_ns2, side_h = null, side_penetrations = 0, side_dot1 = 0, side_dot2 = 0, side_distance = null, idx = 0, nsides = sides.length; idx !== nsides && !1 === found; idx++) {
                    var ns = sphereBox_ns;
                    ns.copy(sides[idx]);
                    var h = ns.length();
                    ns.normalize();
                    var dot = box_to_sphere.dot(ns);
                    if (dot < h + R && dot > 0) {
                        var ns1 = sphereBox_ns1, ns2 = sphereBox_ns2;
                        ns1.copy(sides[(idx + 1) % 3]), ns2.copy(sides[(idx + 2) % 3]);
                        var h1 = ns1.length(), h2 = ns2.length();
                        ns1.normalize(), ns2.normalize();
                        var dot1 = box_to_sphere.dot(ns1), dot2 = box_to_sphere.dot(ns2);
                        if (dot1 < h1 && dot1 > -h1 && dot2 < h2 && dot2 > -h2) {
                            var _dist = Math.abs(dot - h - R);
                            if ((null === side_distance || _dist < side_distance) && (side_distance = _dist, 
                            side_dot1 = dot1, side_dot2 = dot2, side_h = h, side_ns.copy(ns), 
                            side_ns1.copy(ns1), side_ns2.copy(ns2), side_penetrations++, 
                            justTest)) return !0;
                        }
                    }
                }
                if (side_penetrations) {
                    found = !0;
                    var _r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                    side_ns.scale(-R, _r.ri), _r.ni.copy(side_ns), _r.ni.negate(_r.ni), 
                    side_ns.scale(side_h, side_ns), side_ns1.scale(side_dot1, side_ns1), 
                    side_ns.vadd(side_ns1, side_ns), side_ns2.scale(side_dot2, side_ns2), 
                    side_ns.vadd(side_ns2, _r.rj), _r.ri.vadd(xi, _r.ri), _r.ri.vsub(bi.position, _r.ri), 
                    _r.rj.vadd(xj, _r.rj), _r.rj.vsub(bj.position, _r.rj), this.result.push(_r), 
                    this.createFrictionEquationsFromContact(_r, this.frictionResult);
                }
                for (var rj = v3pool.get(), sphere_to_corner = sphereBox_sphere_to_corner, j = 0; 2 !== j && !found; j++) for (var k = 0; 2 !== k && !found; k++) for (var l = 0; 2 !== l && !found; l++) if (rj.set(0, 0, 0), 
                j ? rj.vadd(sides[0], rj) : rj.vsub(sides[0], rj), k ? rj.vadd(sides[1], rj) : rj.vsub(sides[1], rj), 
                l ? rj.vadd(sides[2], rj) : rj.vsub(sides[2], rj), xj.vadd(rj, sphere_to_corner), 
                sphere_to_corner.vsub(xi, sphere_to_corner), sphere_to_corner.lengthSquared() < R * R) {
                    if (justTest) return !0;
                    found = !0;
                    var _r2 = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                    _r2.ri.copy(sphere_to_corner), _r2.ri.normalize(), _r2.ni.copy(_r2.ri), 
                    _r2.ri.scale(R, _r2.ri), _r2.rj.copy(rj), _r2.ri.vadd(xi, _r2.ri), 
                    _r2.ri.vsub(bi.position, _r2.ri), _r2.rj.vadd(xj, _r2.rj), _r2.rj.vsub(bj.position, _r2.rj), 
                    this.result.push(_r2), this.createFrictionEquationsFromContact(_r2, this.frictionResult);
                }
                v3pool.release(rj), rj = null;
                for (var edgeTangent = v3pool.get(), edgeCenter = v3pool.get(), r = v3pool.get(), orthogonal = v3pool.get(), dist = v3pool.get(), Nsides = sides.length, _j = 0; _j !== Nsides && !found; _j++) for (var _k = 0; _k !== Nsides && !found; _k++) if (_j % 3 != _k % 3) {
                    sides[_k].cross(sides[_j], edgeTangent), edgeTangent.normalize(), 
                    sides[_j].vadd(sides[_k], edgeCenter), r.copy(xi), r.vsub(edgeCenter, r), 
                    r.vsub(xj, r);
                    var orthonorm = r.dot(edgeTangent);
                    edgeTangent.scale(orthonorm, orthogonal);
                    for (var _l = 0; _l === _j % 3 || _l === _k % 3; ) _l++;
                    dist.copy(xi), dist.vsub(orthogonal, dist), dist.vsub(edgeCenter, dist), 
                    dist.vsub(xj, dist);
                    var tdist = Math.abs(orthonorm), ndist = dist.length();
                    if (tdist < sides[_l].length() && ndist < R) {
                        if (justTest) return !0;
                        found = !0;
                        var res = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                        edgeCenter.vadd(orthogonal, res.rj), res.rj.copy(res.rj), 
                        dist.negate(res.ni), res.ni.normalize(), res.ri.copy(res.rj), 
                        res.ri.vadd(xj, res.ri), res.ri.vsub(xi, res.ri), res.ri.normalize(), 
                        res.ri.scale(R, res.ri), res.ri.vadd(xi, res.ri), res.ri.vsub(bi.position, res.ri), 
                        res.rj.vadd(xj, res.rj), res.rj.vsub(bj.position, res.rj), 
                        this.result.push(res), this.createFrictionEquationsFromContact(res, this.frictionResult);
                    }
                }
                v3pool.release(edgeTangent, edgeCenter, r, orthogonal, dist);
            }, _proto.planeBox = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                return sj.convexPolyhedronRepresentation.material = sj.material, 
                sj.convexPolyhedronRepresentation.collisionResponse = sj.collisionResponse, 
                sj.convexPolyhedronRepresentation.id = sj.id, this.planeConvex(si, sj.convexPolyhedronRepresentation, xi, xj, qi, qj, bi, bj, si, sj, justTest);
            }, _proto.convexConvex = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest, faceListA, faceListB) {
                var sepAxis = convexConvex_sepAxis;
                if (!(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius) && si.findSeparatingAxis(sj, xi, qi, xj, qj, sepAxis, faceListA, faceListB)) {
                    var res = [], q = convexConvex_q;
                    si.clipAgainstHull(xi, qi, sj, xj, qj, sepAxis, -100, 100, res);
                    for (var numContacts = 0, j = 0; j !== res.length; j++) {
                        if (justTest) return !0;
                        var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj), ri = r.ri, rj = r.rj;
                        sepAxis.negate(r.ni), res[j].normal.negate(q), q.scale(res[j].depth, q), 
                        res[j].point.vadd(q, ri), rj.copy(res[j].point), ri.vsub(xi, ri), 
                        rj.vsub(xj, rj), ri.vadd(xi, ri), ri.vsub(bi.position, ri), 
                        rj.vadd(xj, rj), rj.vsub(bj.position, rj), this.result.push(r), 
                        numContacts++, this.enableFrictionReduction || this.createFrictionEquationsFromContact(r, this.frictionResult);
                    }
                    this.enableFrictionReduction && numContacts && this.createFrictionFromAverage(numContacts);
                }
            }, _proto.sphereConvex = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                var v3pool = this.v3pool;
                xi.vsub(xj, convex_to_sphere);
                for (var normals = sj.faceNormals, faces = sj.faces, verts = sj.vertices, R = si.radius, found = !1, i = 0; i !== verts.length; i++) {
                    var v = verts[i], worldCorner = sphereConvex_worldCorner;
                    qj.vmult(v, worldCorner), xj.vadd(worldCorner, worldCorner);
                    var sphere_to_corner = sphereConvex_sphereToCorner;
                    if (worldCorner.vsub(xi, sphere_to_corner), sphere_to_corner.lengthSquared() < R * R) {
                        if (justTest) return !0;
                        found = !0;
                        var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                        return r.ri.copy(sphere_to_corner), r.ri.normalize(), r.ni.copy(r.ri), 
                        r.ri.scale(R, r.ri), worldCorner.vsub(xj, r.rj), r.ri.vadd(xi, r.ri), 
                        r.ri.vsub(bi.position, r.ri), r.rj.vadd(xj, r.rj), r.rj.vsub(bj.position, r.rj), 
                        this.result.push(r), void this.createFrictionEquationsFromContact(r, this.frictionResult);
                    }
                }
                for (var _i = 0, nfaces = faces.length; _i !== nfaces && !1 === found; _i++) {
                    var normal = normals[_i], face = faces[_i], worldNormal = sphereConvex_worldNormal;
                    qj.vmult(normal, worldNormal);
                    var worldPoint = sphereConvex_worldPoint;
                    qj.vmult(verts[face[0]], worldPoint), worldPoint.vadd(xj, worldPoint);
                    var worldSpherePointClosestToPlane = sphereConvex_worldSpherePointClosestToPlane;
                    worldNormal.scale(-R, worldSpherePointClosestToPlane), xi.vadd(worldSpherePointClosestToPlane, worldSpherePointClosestToPlane);
                    var penetrationVec = sphereConvex_penetrationVec;
                    worldSpherePointClosestToPlane.vsub(worldPoint, penetrationVec);
                    var penetration = penetrationVec.dot(worldNormal), worldPointToSphere = sphereConvex_sphereToWorldPoint;
                    if (xi.vsub(worldPoint, worldPointToSphere), penetration < 0 && worldPointToSphere.dot(worldNormal) > 0) {
                        for (var faceVerts = [], j = 0, Nverts = face.length; j !== Nverts; j++) {
                            var worldVertex = v3pool.get();
                            qj.vmult(verts[face[j]], worldVertex), xj.vadd(worldVertex, worldVertex), 
                            faceVerts.push(worldVertex);
                        }
                        if (pointInPolygon(faceVerts, worldNormal, xi)) {
                            if (justTest) return !0;
                            found = !0;
                            var _r3 = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                            worldNormal.scale(-R, _r3.ri), worldNormal.negate(_r3.ni);
                            var penetrationVec2 = v3pool.get();
                            worldNormal.scale(-penetration, penetrationVec2);
                            var penetrationSpherePoint = v3pool.get();
                            worldNormal.scale(-R, penetrationSpherePoint), xi.vsub(xj, _r3.rj), 
                            _r3.rj.vadd(penetrationSpherePoint, _r3.rj), _r3.rj.vadd(penetrationVec2, _r3.rj), 
                            _r3.rj.vadd(xj, _r3.rj), _r3.rj.vsub(bj.position, _r3.rj), 
                            _r3.ri.vadd(xi, _r3.ri), _r3.ri.vsub(bi.position, _r3.ri), 
                            v3pool.release(penetrationVec2), v3pool.release(penetrationSpherePoint), 
                            this.result.push(_r3), this.createFrictionEquationsFromContact(_r3, this.frictionResult);
                            for (var _j2 = 0, Nfaceverts = faceVerts.length; _j2 !== Nfaceverts; _j2++) v3pool.release(faceVerts[_j2]);
                            return;
                        }
                        for (var _j3 = 0; _j3 !== face.length; _j3++) {
                            var v1 = v3pool.get(), v2 = v3pool.get();
                            qj.vmult(verts[face[(_j3 + 1) % face.length]], v1), 
                            qj.vmult(verts[face[(_j3 + 2) % face.length]], v2), 
                            xj.vadd(v1, v1), xj.vadd(v2, v2);
                            var edge = sphereConvex_edge;
                            v2.vsub(v1, edge);
                            var edgeUnit = sphereConvex_edgeUnit;
                            edge.unit(edgeUnit);
                            var p = v3pool.get(), v1_to_xi = v3pool.get();
                            xi.vsub(v1, v1_to_xi);
                            var dot = v1_to_xi.dot(edgeUnit);
                            edgeUnit.scale(dot, p), p.vadd(v1, p);
                            var xi_to_p = v3pool.get();
                            if (p.vsub(xi, xi_to_p), dot > 0 && dot * dot < edge.lengthSquared() && xi_to_p.lengthSquared() < R * R) {
                                if (justTest) return !0;
                                var _r4 = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                                p.vsub(xj, _r4.rj), p.vsub(xi, _r4.ni), _r4.ni.normalize(), 
                                _r4.ni.scale(R, _r4.ri), _r4.rj.vadd(xj, _r4.rj), 
                                _r4.rj.vsub(bj.position, _r4.rj), _r4.ri.vadd(xi, _r4.ri), 
                                _r4.ri.vsub(bi.position, _r4.ri), this.result.push(_r4), 
                                this.createFrictionEquationsFromContact(_r4, this.frictionResult);
                                for (var _j4 = 0, _Nfaceverts = faceVerts.length; _j4 !== _Nfaceverts; _j4++) v3pool.release(faceVerts[_j4]);
                                return v3pool.release(v1), v3pool.release(v2), v3pool.release(p), 
                                v3pool.release(xi_to_p), void v3pool.release(v1_to_xi);
                            }
                            v3pool.release(v1), v3pool.release(v2), v3pool.release(p), 
                            v3pool.release(xi_to_p), v3pool.release(v1_to_xi);
                        }
                        for (var _j5 = 0, _Nfaceverts2 = faceVerts.length; _j5 !== _Nfaceverts2; _j5++) v3pool.release(faceVerts[_j5]);
                    }
                }
            }, _proto.planeConvex = function(planeShape, convexShape, planePosition, convexPosition, planeQuat, convexQuat, planeBody, convexBody, si, sj, justTest) {
                var worldVertex = planeConvex_v, worldNormal = planeConvex_normal;
                worldNormal.set(0, 0, 1), planeQuat.vmult(worldNormal, worldNormal);
                for (var numContacts = 0, relpos = planeConvex_relpos, i = 0; i !== convexShape.vertices.length; i++) {
                    if (worldVertex.copy(convexShape.vertices[i]), convexQuat.vmult(worldVertex, worldVertex), 
                    convexPosition.vadd(worldVertex, worldVertex), worldVertex.vsub(planePosition, relpos), 
                    worldNormal.dot(relpos) <= 0) {
                        if (justTest) return !0;
                        var r = this.createContactEquation(planeBody, convexBody, planeShape, convexShape, si, sj), projected = planeConvex_projected;
                        worldNormal.scale(worldNormal.dot(relpos), projected), worldVertex.vsub(projected, projected), 
                        projected.vsub(planePosition, r.ri), r.ni.copy(worldNormal), 
                        worldVertex.vsub(convexPosition, r.rj), r.ri.vadd(planePosition, r.ri), 
                        r.ri.vsub(planeBody.position, r.ri), r.rj.vadd(convexPosition, r.rj), 
                        r.rj.vsub(convexBody.position, r.rj), this.result.push(r), 
                        numContacts++, this.enableFrictionReduction || this.createFrictionEquationsFromContact(r, this.frictionResult);
                    }
                }
                this.enableFrictionReduction && numContacts && this.createFrictionFromAverage(numContacts);
            }, _proto.boxConvex = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                return si.convexPolyhedronRepresentation.material = si.material, 
                si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse, 
                this.convexConvex(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
            }, _proto.sphereHeightfield = function(sphereShape, hfShape, spherePos, hfPos, sphereQuat, hfQuat, sphereBody, hfBody, rsi, rsj, justTest) {
                var data = hfShape.data, radius = sphereShape.radius, w = hfShape.elementSize, worldPillarOffset = sphereHeightfield_tmp2, localSpherePos = sphereHeightfield_tmp1;
                Transform.pointToLocalFrame(hfPos, hfQuat, spherePos, localSpherePos);
                var iMinX = Math.floor((localSpherePos.x - radius) / w) - 1, iMaxX = Math.ceil((localSpherePos.x + radius) / w) + 1, iMinY = Math.floor((localSpherePos.y - radius) / w) - 1, iMaxY = Math.ceil((localSpherePos.y + radius) / w) + 1;
                if (!(iMaxX < 0 || iMaxY < 0 || iMinX > data.length || iMinY > data[0].length)) {
                    iMinX < 0 && (iMinX = 0), iMaxX < 0 && (iMaxX = 0), iMinY < 0 && (iMinY = 0), 
                    iMaxY < 0 && (iMaxY = 0), iMinX >= data.length && (iMinX = data.length - 1), 
                    iMaxX >= data.length && (iMaxX = data.length - 1), iMaxY >= data[0].length && (iMaxY = data[0].length - 1), 
                    iMinY >= data[0].length && (iMinY = data[0].length - 1);
                    var minMax = [];
                    hfShape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
                    var min = minMax[0], max = minMax[1];
                    if (!(localSpherePos.z - radius > max || localSpherePos.z + radius < min)) for (var result = this.result, i = iMinX; i < iMaxX; i++) for (var j = iMinY; j < iMaxY; j++) {
                        var numContactsBefore = result.length, intersecting = !1;
                        if (hfShape.getConvexTrianglePillar(i, j, !1), Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset), 
                        spherePos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + sphereShape.boundingSphereRadius && (intersecting = this.sphereConvex(sphereShape, hfShape.pillarConvex, spherePos, worldPillarOffset, sphereQuat, hfQuat, sphereBody, hfBody, sphereShape, hfShape, justTest)), 
                        justTest && intersecting) return !0;
                        if (hfShape.getConvexTrianglePillar(i, j, !0), Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset), 
                        spherePos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + sphereShape.boundingSphereRadius && (intersecting = this.sphereConvex(sphereShape, hfShape.pillarConvex, spherePos, worldPillarOffset, sphereQuat, hfQuat, sphereBody, hfBody, sphereShape, hfShape, justTest)), 
                        justTest && intersecting) return !0;
                        if (result.length - numContactsBefore > 2) return;
                    }
                }
            }, _proto.boxHeightfield = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                return si.convexPolyhedronRepresentation.material = si.material, 
                si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse, 
                this.convexHeightfield(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
            }, _proto.convexHeightfield = function(convexShape, hfShape, convexPos, hfPos, convexQuat, hfQuat, convexBody, hfBody, rsi, rsj, justTest) {
                var data = hfShape.data, w = hfShape.elementSize, radius = convexShape.boundingSphereRadius, worldPillarOffset = convexHeightfield_tmp2, faceList = convexHeightfield_faceList, localConvexPos = convexHeightfield_tmp1;
                Transform.pointToLocalFrame(hfPos, hfQuat, convexPos, localConvexPos);
                var iMinX = Math.floor((localConvexPos.x - radius) / w) - 1, iMaxX = Math.ceil((localConvexPos.x + radius) / w) + 1, iMinY = Math.floor((localConvexPos.y - radius) / w) - 1, iMaxY = Math.ceil((localConvexPos.y + radius) / w) + 1;
                if (!(iMaxX < 0 || iMaxY < 0 || iMinX > data.length || iMinY > data[0].length)) {
                    iMinX < 0 && (iMinX = 0), iMaxX < 0 && (iMaxX = 0), iMinY < 0 && (iMinY = 0), 
                    iMaxY < 0 && (iMaxY = 0), iMinX >= data.length && (iMinX = data.length - 1), 
                    iMaxX >= data.length && (iMaxX = data.length - 1), iMaxY >= data[0].length && (iMaxY = data[0].length - 1), 
                    iMinY >= data[0].length && (iMinY = data[0].length - 1);
                    var minMax = [];
                    hfShape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
                    var min = minMax[0], max = minMax[1];
                    if (!(localConvexPos.z - radius > max || localConvexPos.z + radius < min)) for (var i = iMinX; i < iMaxX; i++) for (var j = iMinY; j < iMaxY; j++) {
                        var intersecting = !1;
                        if (hfShape.getConvexTrianglePillar(i, j, !1), Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset), 
                        convexPos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + convexShape.boundingSphereRadius && (intersecting = this.convexConvex(convexShape, hfShape.pillarConvex, convexPos, worldPillarOffset, convexQuat, hfQuat, convexBody, hfBody, null, null, justTest, faceList, null)), 
                        justTest && intersecting) return !0;
                        if (hfShape.getConvexTrianglePillar(i, j, !0), Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset), 
                        convexPos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + convexShape.boundingSphereRadius && (intersecting = this.convexConvex(convexShape, hfShape.pillarConvex, convexPos, worldPillarOffset, convexQuat, hfQuat, convexBody, hfBody, null, null, justTest, faceList, null)), 
                        justTest && intersecting) return !0;
                    }
                }
            }, _proto.sphereParticle = function(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
                var normal = particleSphere_normal;
                if (normal.set(0, 0, 1), xi.vsub(xj, normal), normal.lengthSquared() <= sj.radius * sj.radius) {
                    if (justTest) return !0;
                    var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                    normal.normalize(), r.rj.copy(normal), r.rj.scale(sj.radius, r.rj), 
                    r.ni.copy(normal), r.ni.negate(r.ni), r.ri.set(0, 0, 0), this.result.push(r), 
                    this.createFrictionEquationsFromContact(r, this.frictionResult);
                }
            }, _proto.planeParticle = function(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
                var normal = particlePlane_normal;
                normal.set(0, 0, 1), bj.quaternion.vmult(normal, normal);
                var relpos = particlePlane_relpos;
                if (xi.vsub(bj.position, relpos), normal.dot(relpos) <= 0) {
                    if (justTest) return !0;
                    var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                    r.ni.copy(normal), r.ni.negate(r.ni), r.ri.set(0, 0, 0);
                    var projected = particlePlane_projected;
                    normal.scale(normal.dot(xi), projected), xi.vsub(projected, projected), 
                    r.rj.copy(projected), this.result.push(r), this.createFrictionEquationsFromContact(r, this.frictionResult);
                }
            }, _proto.boxParticle = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
                return si.convexPolyhedronRepresentation.material = si.material, 
                si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse, 
                this.convexParticle(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
            }, _proto.convexParticle = function(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
                var penetratedFaceIndex = -1, penetratedFaceNormal = convexParticle_penetratedFaceNormal, worldPenetrationVec = convexParticle_worldPenetrationVec, minPenetration = null, local = convexParticle_local;
                if (local.copy(xi), local.vsub(xj, local), qj.conjugate(cqj), cqj.vmult(local, local), 
                sj.pointIsInside(local)) {
                    sj.worldVerticesNeedsUpdate && sj.computeWorldVertices(xj, qj), 
                    sj.worldFaceNormalsNeedsUpdate && sj.computeWorldFaceNormals(qj);
                    for (var i = 0, nfaces = sj.faces.length; i !== nfaces; i++) {
                        var verts = [ sj.worldVertices[sj.faces[i][0]] ], normal = sj.worldFaceNormals[i];
                        xi.vsub(verts[0], convexParticle_vertexToParticle);
                        var penetration = -normal.dot(convexParticle_vertexToParticle);
                        if (null === minPenetration || Math.abs(penetration) < Math.abs(minPenetration)) {
                            if (justTest) return !0;
                            minPenetration = penetration, penetratedFaceIndex = i, 
                            penetratedFaceNormal.copy(normal);
                        }
                    }
                    if (-1 !== penetratedFaceIndex) {
                        var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                        penetratedFaceNormal.scale(minPenetration, worldPenetrationVec), 
                        worldPenetrationVec.vadd(xi, worldPenetrationVec), worldPenetrationVec.vsub(xj, worldPenetrationVec), 
                        r.rj.copy(worldPenetrationVec), penetratedFaceNormal.negate(r.ni), 
                        r.ri.set(0, 0, 0);
                        var ri = r.ri, rj = r.rj;
                        ri.vadd(xi, ri), ri.vsub(bi.position, ri), rj.vadd(xj, rj), 
                        rj.vsub(bj.position, rj), this.result.push(r), this.createFrictionEquationsFromContact(r, this.frictionResult);
                    } else console.warn("Point found inside convex, but did not find penetrating face!");
                }
            }, _proto.sphereTrimesh = function(sphereShape, trimeshShape, spherePos, trimeshPos, sphereQuat, trimeshQuat, sphereBody, trimeshBody, rsi, rsj, justTest) {
                var edgeVertexA = sphereTrimesh_edgeVertexA, edgeVertexB = sphereTrimesh_edgeVertexB, edgeVector = sphereTrimesh_edgeVector, edgeVectorUnit = sphereTrimesh_edgeVectorUnit, localSpherePos = sphereTrimesh_localSpherePos, tmp = sphereTrimesh_tmp, localSphereAABB = sphereTrimesh_localSphereAABB, v2 = sphereTrimesh_v2, relpos = sphereTrimesh_relpos, triangles = sphereTrimesh_triangles;
                Transform.pointToLocalFrame(trimeshPos, trimeshQuat, spherePos, localSpherePos);
                var sphereRadius = sphereShape.radius;
                localSphereAABB.lowerBound.set(localSpherePos.x - sphereRadius, localSpherePos.y - sphereRadius, localSpherePos.z - sphereRadius), 
                localSphereAABB.upperBound.set(localSpherePos.x + sphereRadius, localSpherePos.y + sphereRadius, localSpherePos.z + sphereRadius), 
                trimeshShape.getTrianglesInAABB(localSphereAABB, triangles);
                for (var v = sphereTrimesh_v, radiusSquared = sphereShape.radius * sphereShape.radius, i = 0; i < triangles.length; i++) for (var j = 0; j < 3; j++) if (trimeshShape.getVertex(trimeshShape.indices[3 * triangles[i] + j], v), 
                v.vsub(localSpherePos, relpos), relpos.lengthSquared() <= radiusSquared) {
                    if (v2.copy(v), Transform.pointToWorldFrame(trimeshPos, trimeshQuat, v2, v), 
                    v.vsub(spherePos, relpos), justTest) return !0;
                    var r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj);
                    r.ni.copy(relpos), r.ni.normalize(), r.ri.copy(r.ni), r.ri.scale(sphereShape.radius, r.ri), 
                    r.ri.vadd(spherePos, r.ri), r.ri.vsub(sphereBody.position, r.ri), 
                    r.rj.copy(v), r.rj.vsub(trimeshBody.position, r.rj), this.result.push(r), 
                    this.createFrictionEquationsFromContact(r, this.frictionResult);
                }
                for (var _i2 = 0; _i2 < triangles.length; _i2++) for (var _j6 = 0; _j6 < 3; _j6++) {
                    trimeshShape.getVertex(trimeshShape.indices[3 * triangles[_i2] + _j6], edgeVertexA), 
                    trimeshShape.getVertex(trimeshShape.indices[3 * triangles[_i2] + (_j6 + 1) % 3], edgeVertexB), 
                    edgeVertexB.vsub(edgeVertexA, edgeVector), localSpherePos.vsub(edgeVertexB, tmp);
                    var positionAlongEdgeB = tmp.dot(edgeVector);
                    localSpherePos.vsub(edgeVertexA, tmp);
                    var positionAlongEdgeA = tmp.dot(edgeVector);
                    if (positionAlongEdgeA > 0 && positionAlongEdgeB < 0) if (localSpherePos.vsub(edgeVertexA, tmp), 
                    edgeVectorUnit.copy(edgeVector), edgeVectorUnit.normalize(), 
                    positionAlongEdgeA = tmp.dot(edgeVectorUnit), edgeVectorUnit.scale(positionAlongEdgeA, tmp), 
                    tmp.vadd(edgeVertexA, tmp), tmp.distanceTo(localSpherePos) < sphereShape.radius) {
                        if (justTest) return !0;
                        var _r5 = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj);
                        tmp.vsub(localSpherePos, _r5.ni), _r5.ni.normalize(), _r5.ni.scale(sphereShape.radius, _r5.ri), 
                        _r5.ri.vadd(spherePos, _r5.ri), _r5.ri.vsub(sphereBody.position, _r5.ri), 
                        Transform.pointToWorldFrame(trimeshPos, trimeshQuat, tmp, tmp), 
                        tmp.vsub(trimeshBody.position, _r5.rj), Transform.vectorToWorldFrame(trimeshQuat, _r5.ni, _r5.ni), 
                        Transform.vectorToWorldFrame(trimeshQuat, _r5.ri, _r5.ri), 
                        this.result.push(_r5), this.createFrictionEquationsFromContact(_r5, this.frictionResult);
                    }
                }
                for (var va = sphereTrimesh_va, vb = sphereTrimesh_vb, vc = sphereTrimesh_vc, normal = sphereTrimesh_normal, _i3 = 0, N = triangles.length; _i3 !== N; _i3++) {
                    trimeshShape.getTriangleVertices(triangles[_i3], va, vb, vc), 
                    trimeshShape.getNormal(triangles[_i3], normal), localSpherePos.vsub(va, tmp);
                    var _dist2 = tmp.dot(normal);
                    if (normal.scale(_dist2, tmp), localSpherePos.vsub(tmp, tmp), 
                    _dist2 = tmp.distanceTo(localSpherePos), Ray.pointInTriangle(tmp, va, vb, vc) && _dist2 < sphereShape.radius) {
                        if (justTest) return !0;
                        var _r6 = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj);
                        tmp.vsub(localSpherePos, _r6.ni), _r6.ni.normalize(), _r6.ni.scale(sphereShape.radius, _r6.ri), 
                        _r6.ri.vadd(spherePos, _r6.ri), _r6.ri.vsub(sphereBody.position, _r6.ri), 
                        Transform.pointToWorldFrame(trimeshPos, trimeshQuat, tmp, tmp), 
                        tmp.vsub(trimeshBody.position, _r6.rj), Transform.vectorToWorldFrame(trimeshQuat, _r6.ni, _r6.ni), 
                        Transform.vectorToWorldFrame(trimeshQuat, _r6.ri, _r6.ri), 
                        this.result.push(_r6), this.createFrictionEquationsFromContact(_r6, this.frictionResult);
                    }
                }
                triangles.length = 0;
            }, _proto.planeTrimesh = function(planeShape, trimeshShape, planePos, trimeshPos, planeQuat, trimeshQuat, planeBody, trimeshBody, rsi, rsj, justTest) {
                var v = new Vec3(), normal = planeTrimesh_normal;
                normal.set(0, 0, 1), planeQuat.vmult(normal, normal);
                for (var i = 0; i < trimeshShape.vertices.length / 3; i++) {
                    trimeshShape.getVertex(i, v);
                    var v2 = new Vec3();
                    v2.copy(v), Transform.pointToWorldFrame(trimeshPos, trimeshQuat, v2, v);
                    var relpos = planeTrimesh_relpos;
                    if (v.vsub(planePos, relpos), normal.dot(relpos) <= 0) {
                        if (justTest) return !0;
                        var r = this.createContactEquation(planeBody, trimeshBody, planeShape, trimeshShape, rsi, rsj);
                        r.ni.copy(normal);
                        var projected = planeTrimesh_projected;
                        normal.scale(relpos.dot(normal), projected), v.vsub(projected, projected), 
                        r.ri.copy(projected), r.ri.vsub(planeBody.position, r.ri), 
                        r.rj.copy(v), r.rj.vsub(trimeshBody.position, r.rj), this.result.push(r), 
                        this.createFrictionEquationsFromContact(r, this.frictionResult);
                    }
                }
            }, Narrowphase;
        }(), averageNormal = new Vec3(), averageContactPointA = new Vec3(), averageContactPointB = new Vec3(), tmpVec1$3 = new Vec3(), tmpVec2$3 = new Vec3(), tmpQuat1 = new Quaternion(), tmpQuat2 = new Quaternion();
        Narrowphase.prototype[COLLISION_TYPES.boxBox] = Narrowphase.prototype.boxBox, 
        Narrowphase.prototype[COLLISION_TYPES.boxConvex] = Narrowphase.prototype.boxConvex, 
        Narrowphase.prototype[COLLISION_TYPES.boxParticle] = Narrowphase.prototype.boxParticle, 
        Narrowphase.prototype[COLLISION_TYPES.sphereSphere] = Narrowphase.prototype.sphereSphere;
        var planeTrimesh_normal = new Vec3(), planeTrimesh_relpos = new Vec3(), planeTrimesh_projected = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.planeTrimesh] = Narrowphase.prototype.planeTrimesh;
        var sphereTrimesh_normal = new Vec3(), sphereTrimesh_relpos = new Vec3(), sphereTrimesh_v = (new Vec3(), 
        new Vec3()), sphereTrimesh_v2 = new Vec3(), sphereTrimesh_edgeVertexA = new Vec3(), sphereTrimesh_edgeVertexB = new Vec3(), sphereTrimesh_edgeVector = new Vec3(), sphereTrimesh_edgeVectorUnit = new Vec3(), sphereTrimesh_localSpherePos = new Vec3(), sphereTrimesh_tmp = new Vec3(), sphereTrimesh_va = new Vec3(), sphereTrimesh_vb = new Vec3(), sphereTrimesh_vc = new Vec3(), sphereTrimesh_localSphereAABB = new AABB(), sphereTrimesh_triangles = [];
        Narrowphase.prototype[COLLISION_TYPES.sphereTrimesh] = Narrowphase.prototype.sphereTrimesh;
        var point_on_plane_to_sphere = new Vec3(), plane_to_sphere_ortho = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.spherePlane] = Narrowphase.prototype.spherePlane;
        var pointInPolygon_edge = new Vec3(), pointInPolygon_edge_x_normal = new Vec3(), pointInPolygon_vtp = new Vec3();
        function pointInPolygon(verts, normal, p) {
            for (var positiveResult = null, N = verts.length, i = 0; i !== N; i++) {
                var v = verts[i], edge = pointInPolygon_edge;
                verts[(i + 1) % N].vsub(v, edge);
                var edge_x_normal = pointInPolygon_edge_x_normal;
                edge.cross(normal, edge_x_normal);
                var vertex_to_p = pointInPolygon_vtp;
                p.vsub(v, vertex_to_p);
                var r = edge_x_normal.dot(vertex_to_p);
                if (!(null === positiveResult || r > 0 && !0 === positiveResult || r <= 0 && !1 === positiveResult)) return !1;
                null === positiveResult && (positiveResult = r > 0);
            }
            return !0;
        }
        var box_to_sphere = new Vec3(), sphereBox_ns = new Vec3(), sphereBox_ns1 = new Vec3(), sphereBox_ns2 = new Vec3(), sphereBox_sides = [ new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3() ], sphereBox_sphere_to_corner = new Vec3(), sphereBox_side_ns = new Vec3(), sphereBox_side_ns1 = new Vec3(), sphereBox_side_ns2 = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.sphereBox] = Narrowphase.prototype.sphereBox;
        var convex_to_sphere = new Vec3(), sphereConvex_edge = new Vec3(), sphereConvex_edgeUnit = new Vec3(), sphereConvex_sphereToCorner = new Vec3(), sphereConvex_worldCorner = new Vec3(), sphereConvex_worldNormal = new Vec3(), sphereConvex_worldPoint = new Vec3(), sphereConvex_worldSpherePointClosestToPlane = new Vec3(), sphereConvex_penetrationVec = new Vec3(), sphereConvex_sphereToWorldPoint = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.sphereConvex] = Narrowphase.prototype.sphereConvex;
        new Vec3(), new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.planeBox] = Narrowphase.prototype.planeBox;
        var planeConvex_v = new Vec3(), planeConvex_normal = new Vec3(), planeConvex_relpos = new Vec3(), planeConvex_projected = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.planeConvex] = Narrowphase.prototype.planeConvex;
        var convexConvex_sepAxis = new Vec3(), convexConvex_q = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.convexConvex] = Narrowphase.prototype.convexConvex;
        var particlePlane_normal = new Vec3(), particlePlane_relpos = new Vec3(), particlePlane_projected = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.planeParticle] = Narrowphase.prototype.planeParticle;
        var particleSphere_normal = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.sphereParticle] = Narrowphase.prototype.sphereParticle;
        var cqj = new Quaternion(), convexParticle_local = new Vec3(), convexParticle_penetratedFaceNormal = (new Vec3(), 
        new Vec3()), convexParticle_vertexToParticle = new Vec3(), convexParticle_worldPenetrationVec = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.convexParticle] = Narrowphase.prototype.convexParticle, 
        Narrowphase.prototype[COLLISION_TYPES.boxHeightfield] = Narrowphase.prototype.boxHeightfield;
        var convexHeightfield_tmp1 = new Vec3(), convexHeightfield_tmp2 = new Vec3(), convexHeightfield_faceList = [ 0 ];
        Narrowphase.prototype[COLLISION_TYPES.convexHeightfield] = Narrowphase.prototype.convexHeightfield;
        var sphereHeightfield_tmp1 = new Vec3(), sphereHeightfield_tmp2 = new Vec3();
        Narrowphase.prototype[COLLISION_TYPES.sphereHeightfield] = Narrowphase.prototype.sphereHeightfield;
        var OverlapKeeper = function() {
            function OverlapKeeper() {
                this.current = [], this.previous = [];
            }
            var _proto = OverlapKeeper.prototype;
            return _proto.getKey = function(i, j) {
                if (j < i) {
                    var temp = j;
                    j = i, i = temp;
                }
                return i << 16 | j;
            }, _proto.set = function(i, j) {
                for (var key = this.getKey(i, j), current = this.current, index = 0; key > current[index]; ) index++;
                if (key !== current[index]) {
                    for (var _j = current.length - 1; _j >= index; _j--) current[_j + 1] = current[_j];
                    current[index] = key;
                }
            }, _proto.tick = function() {
                var tmp = this.current;
                this.current = this.previous, this.previous = tmp, this.current.length = 0;
            }, _proto.getDiff = function(additions, removals) {
                for (var a = this.current, b = this.previous, al = a.length, bl = b.length, j = 0, i = 0; i < al; i++) {
                    for (var keyA = a[i]; keyA > b[j]; ) j++;
                    keyA === b[j] || unpackAndPush(additions, keyA);
                }
                j = 0;
                for (var _i = 0; _i < bl; _i++) {
                    for (var keyB = b[_i]; keyB > a[j]; ) j++;
                    a[j] === keyB || unpackAndPush(removals, keyB);
                }
            }, OverlapKeeper;
        }();
        function unpackAndPush(array, key) {
            array.push((4294901760 & key) >> 16, 65535 & key);
        }
        var TupleDictionary = function() {
            function TupleDictionary() {
                this.data = {
                    keys: []
                };
            }
            var _proto = TupleDictionary.prototype;
            return _proto.get = function(i, j) {
                if (i > j) {
                    var temp = j;
                    j = i, i = temp;
                }
                return this.data[i + "-" + j];
            }, _proto.set = function(i, j, value) {
                if (i > j) {
                    var temp = j;
                    j = i, i = temp;
                }
                var key = i + "-" + j;
                this.get(i, j) || this.data.keys.push(key), this.data[key] = value;
            }, _proto.reset = function() {
                for (var data = this.data, keys = data.keys; keys.length > 0; ) {
                    delete data[keys.pop()];
                }
            }, TupleDictionary;
        }(), World = function(_EventTarget) {
            function World(options) {
                var _this;
                return void 0 === options && (options = {}), (_this = _EventTarget.call(this) || this).dt = -1, 
                _this.allowSleep = !!options.allowSleep, _this.contacts = [], _this.frictionEquations = [], 
                _this.quatNormalizeSkip = void 0 !== options.quatNormalizeSkip ? options.quatNormalizeSkip : 0, 
                _this.quatNormalizeFast = void 0 !== options.quatNormalizeFast && options.quatNormalizeFast, 
                _this.time = 0, _this.stepnumber = 0, _this.default_dt = 1 / 60, 
                _this.nextId = 0, _this.gravity = new Vec3(), options.gravity && _this.gravity.copy(options.gravity), 
                _this.broadphase = void 0 !== options.broadphase ? options.broadphase : new NaiveBroadphase(), 
                _this.bodies = [], _this.hasActiveBodies = !1, _this.solver = void 0 !== options.solver ? options.solver : new GSSolver(), 
                _this.constraints = [], _this.narrowphase = new Narrowphase(_assertThisInitialized(_this)), 
                _this.collisionMatrix = new ArrayCollisionMatrix(), _this.collisionMatrixPrevious = new ArrayCollisionMatrix(), 
                _this.bodyOverlapKeeper = new OverlapKeeper(), _this.shapeOverlapKeeper = new OverlapKeeper(), 
                _this.materials = [], _this.contactmaterials = [], _this.contactMaterialTable = new TupleDictionary(), 
                _this.defaultMaterial = new Material("default"), _this.defaultContactMaterial = new ContactMaterial(_this.defaultMaterial, _this.defaultMaterial, {
                    friction: .3,
                    restitution: 0
                }), _this.doProfiling = !1, _this.profile = {
                    solve: 0,
                    makeContactConstraints: 0,
                    broadphase: 0,
                    integrate: 0,
                    narrowphase: 0
                }, _this.accumulator = 0, _this.subsystems = [], _this.addBodyEvent = {
                    type: "addBody",
                    body: null
                }, _this.removeBodyEvent = {
                    type: "removeBody",
                    body: null
                }, _this.idToBodyMap = {}, _this.broadphase.setWorld(_assertThisInitialized(_this)), 
                _this;
            }
            _inheritsLoose(World, _EventTarget);
            var _proto = World.prototype;
            return _proto.getContactMaterial = function(m1, m2) {
                return this.contactMaterialTable.get(m1.id, m2.id);
            }, _proto.numObjects = function() {
                return this.bodies.length;
            }, _proto.collisionMatrixTick = function() {
                var temp = this.collisionMatrixPrevious;
                this.collisionMatrixPrevious = this.collisionMatrix, this.collisionMatrix = temp, 
                this.collisionMatrix.reset(), this.bodyOverlapKeeper.tick(), this.shapeOverlapKeeper.tick();
            }, _proto.addConstraint = function(c) {
                this.constraints.push(c);
            }, _proto.removeConstraint = function(c) {
                var idx = this.constraints.indexOf(c);
                -1 !== idx && this.constraints.splice(idx, 1);
            }, _proto.rayTest = function(from, to, result) {
                result instanceof RaycastResult ? this.raycastClosest(from, to, {
                    skipBackfaces: !0
                }, result) : this.raycastAll(from, to, {
                    skipBackfaces: !0
                }, result);
            }, _proto.raycastAll = function(from, to, options, callback) {
                return void 0 === options && (options = {}), options.mode = Ray.ALL, 
                options.from = from, options.to = to, options.callback = callback, 
                tmpRay$1.intersectWorld(this, options);
            }, _proto.raycastAny = function(from, to, options, result) {
                return void 0 === options && (options = {}), options.mode = Ray.ANY, 
                options.from = from, options.to = to, options.result = result, tmpRay$1.intersectWorld(this, options);
            }, _proto.raycastClosest = function(from, to, options, result) {
                return void 0 === options && (options = {}), options.mode = Ray.CLOSEST, 
                options.from = from, options.to = to, options.result = result, tmpRay$1.intersectWorld(this, options);
            }, _proto.addBody = function(body) {
                this.bodies.includes(body) || (body.index = this.bodies.length, 
                this.bodies.push(body), body.world = this, body.initPosition.copy(body.position), 
                body.initVelocity.copy(body.velocity), body.timeLastSleepy = this.time, 
                body instanceof Body && (body.initAngularVelocity.copy(body.angularVelocity), 
                body.initQuaternion.copy(body.quaternion)), this.collisionMatrix.setNumObjects(this.bodies.length), 
                this.addBodyEvent.body = body, this.idToBodyMap[body.id] = body, 
                this.dispatchEvent(this.addBodyEvent));
            }, _proto.removeBody = function(body) {
                body.world = null;
                var n = this.bodies.length - 1, bodies = this.bodies, idx = bodies.indexOf(body);
                if (-1 !== idx) {
                    bodies.splice(idx, 1);
                    for (var i = 0; i !== bodies.length; i++) bodies[i].index = i;
                    this.collisionMatrix.setNumObjects(n), this.removeBodyEvent.body = body, 
                    delete this.idToBodyMap[body.id], this.dispatchEvent(this.removeBodyEvent);
                }
            }, _proto.getBodyById = function(id) {
                return this.idToBodyMap[id];
            }, _proto.getShapeById = function(id) {
                for (var bodies = this.bodies, i = 0, bl = bodies.length; i < bl; i++) for (var shapes = bodies[i].shapes, j = 0, sl = shapes.length; j < sl; j++) {
                    var shape = shapes[j];
                    if (shape.id === id) return shape;
                }
            }, _proto.addMaterial = function(m) {
                this.materials.push(m);
            }, _proto.addContactMaterial = function(cmat) {
                this.contactmaterials.push(cmat), this.contactMaterialTable.set(cmat.materials[0].id, cmat.materials[1].id, cmat);
            }, _proto.step = function(dt, timeSinceLastCalled, maxSubSteps) {
                if (void 0 === timeSinceLastCalled && (timeSinceLastCalled = 0), 
                void 0 === maxSubSteps && (maxSubSteps = 10), 0 === timeSinceLastCalled) this.internalStep(dt), 
                this.time += dt; else {
                    this.accumulator += timeSinceLastCalled;
                    for (var substeps = 0; this.accumulator >= dt && substeps < maxSubSteps; ) this.internalStep(dt), 
                    this.accumulator -= dt, substeps++;
                    for (var t = this.accumulator % dt / dt, j = 0; j !== this.bodies.length; j++) {
                        var b = this.bodies[j];
                        b.previousPosition.lerp(b.position, t, b.interpolatedPosition), 
                        b.previousQuaternion.slerp(b.quaternion, t, b.interpolatedQuaternion), 
                        b.previousQuaternion.normalize();
                    }
                    this.time += timeSinceLastCalled;
                }
            }, _proto.internalStep = function(dt) {
                this.dt = dt;
                var contacts = this.contacts, p1 = World_step_p1, p2 = World_step_p2, N = this.numObjects(), bodies = this.bodies, solver = this.solver, gravity = this.gravity, doProfiling = this.doProfiling, profile = this.profile, DYNAMIC = Body.DYNAMIC, profilingStart = -1 / 0, constraints = this.constraints, frictionEquationPool = World_step_frictionEquationPool, gx = (gravity.length(), 
                gravity.x), gy = gravity.y, gz = gravity.z, i = 0;
                for (doProfiling && (profilingStart = performance.now()), i = 0; i !== N; i++) {
                    var bi = bodies[i];
                    if (bi.type === DYNAMIC) {
                        var f = bi.force, m = bi.mass;
                        f.x += m * gx, f.y += m * gy, f.z += m * gz;
                    }
                }
                for (var _i = 0, Nsubsystems = this.subsystems.length; _i !== Nsubsystems; _i++) this.subsystems[_i].update();
                doProfiling && (profilingStart = performance.now()), p1.length = 0, 
                p2.length = 0, this.broadphase.collisionPairs(this, p1, p2), doProfiling && (profile.broadphase = performance.now() - profilingStart);
                var Nconstraints = constraints.length;
                for (i = 0; i !== Nconstraints; i++) {
                    var c = constraints[i];
                    if (!c.collideConnected) for (var j = p1.length - 1; j >= 0; j -= 1) (c.bodyA === p1[j] && c.bodyB === p2[j] || c.bodyB === p1[j] && c.bodyA === p2[j]) && (p1.splice(j, 1), 
                    p2.splice(j, 1));
                }
                this.collisionMatrixTick(), doProfiling && (profilingStart = performance.now());
                var oldcontacts = World_step_oldContacts, NoldContacts = contacts.length;
                for (i = 0; i !== NoldContacts; i++) oldcontacts.push(contacts[i]);
                contacts.length = 0;
                var NoldFrictionEquations = this.frictionEquations.length;
                for (i = 0; i !== NoldFrictionEquations; i++) frictionEquationPool.push(this.frictionEquations[i]);
                for (this.frictionEquations.length = 0, this.narrowphase.getContacts(p1, p2, this, contacts, oldcontacts, this.frictionEquations, frictionEquationPool), 
                doProfiling && (profile.narrowphase = performance.now() - profilingStart), 
                doProfiling && (profilingStart = performance.now()), i = 0; i < this.frictionEquations.length; i++) solver.addEquation(this.frictionEquations[i]);
                for (var ncontacts = contacts.length, k = 0; k !== ncontacts; k++) {
                    var _c = contacts[k], _bi = _c.bi, bj = _c.bj, si = _c.si, sj = _c.sj;
                    (_bi.material && bj.material && this.getContactMaterial(_bi.material, bj.material) || this.defaultContactMaterial).friction;
                    if (_bi.material && bj.material && (_bi.material.friction >= 0 && bj.material.friction >= 0 && _bi.material.friction * bj.material.friction, 
                    _bi.material.restitution >= 0 && bj.material.restitution >= 0 && (_c.restitution = _bi.material.restitution * bj.material.restitution)), 
                    solver.addEquation(_c), _bi.allowSleep && _bi.type === Body.DYNAMIC && _bi.sleepState === Body.SLEEPING && bj.sleepState === Body.AWAKE && bj.type !== Body.STATIC) bj.velocity.lengthSquared() + bj.angularVelocity.lengthSquared() >= 2 * Math.pow(bj.sleepSpeedLimit, 2) && (_bi.wakeUpAfterNarrowphase = !0);
                    if (bj.allowSleep && bj.type === Body.DYNAMIC && bj.sleepState === Body.SLEEPING && _bi.sleepState === Body.AWAKE && _bi.type !== Body.STATIC) _bi.velocity.lengthSquared() + _bi.angularVelocity.lengthSquared() >= 2 * Math.pow(_bi.sleepSpeedLimit, 2) && (bj.wakeUpAfterNarrowphase = !0);
                    this.collisionMatrix.set(_bi, bj, !0), this.collisionMatrixPrevious.get(_bi, bj) || (World_step_collideEvent.body = bj, 
                    World_step_collideEvent.contact = _c, _bi.dispatchEvent(World_step_collideEvent), 
                    World_step_collideEvent.body = _bi, bj.dispatchEvent(World_step_collideEvent)), 
                    this.bodyOverlapKeeper.set(_bi.id, bj.id), this.shapeOverlapKeeper.set(si.id, sj.id);
                }
                for (this.emitContactEvents(), doProfiling && (profile.makeContactConstraints = performance.now() - profilingStart, 
                profilingStart = performance.now()), i = 0; i !== N; i++) {
                    var _bi2 = bodies[i];
                    _bi2.wakeUpAfterNarrowphase && (_bi2.wakeUp(), _bi2.wakeUpAfterNarrowphase = !1);
                }
                for (Nconstraints = constraints.length, i = 0; i !== Nconstraints; i++) {
                    var _c2 = constraints[i];
                    _c2.update();
                    for (var _j = 0, Neq = _c2.equations.length; _j !== Neq; _j++) {
                        var eq = _c2.equations[_j];
                        solver.addEquation(eq);
                    }
                }
                solver.solve(dt, this), doProfiling && (profile.solve = performance.now() - profilingStart), 
                solver.removeAllEquations();
                var pow = Math.pow;
                for (i = 0; i !== N; i++) {
                    var _bi3 = bodies[i];
                    if (_bi3.type & DYNAMIC) {
                        var ld = pow(1 - _bi3.linearDamping, dt), v = _bi3.velocity;
                        v.scale(ld, v);
                        var av = _bi3.angularVelocity;
                        if (av) {
                            var ad = pow(1 - _bi3.angularDamping, dt);
                            av.scale(ad, av);
                        }
                    }
                }
                for (this.dispatchEvent(World_step_preStepEvent), i = 0; i !== N; i++) {
                    var _bi4 = bodies[i];
                    _bi4.preStep && _bi4.preStep.call(_bi4);
                }
                doProfiling && (profilingStart = performance.now());
                var quatNormalize = this.stepnumber % (this.quatNormalizeSkip + 1) == 0, quatNormalizeFast = this.quatNormalizeFast;
                for (i = 0; i !== N; i++) bodies[i].integrate(dt, quatNormalize, quatNormalizeFast);
                for (this.clearForces(), this.broadphase.dirty = !0, doProfiling && (profile.integrate = performance.now() - profilingStart), 
                this.time += dt, this.stepnumber += 1, this.dispatchEvent(World_step_postStepEvent), 
                i = 0; i !== N; i++) {
                    var _bi5 = bodies[i], postStep = _bi5.postStep;
                    postStep && postStep.call(_bi5);
                }
                var hasActiveBodies = !0;
                if (this.allowSleep) for (hasActiveBodies = !1, i = 0; i !== N; i++) {
                    var _bi6 = bodies[i];
                    _bi6.sleepTick(this.time), _bi6.sleepState !== Body.SLEEPING && (hasActiveBodies = !0);
                }
                this.hasActiveBodies = hasActiveBodies;
            }, _proto.clearForces = function() {
                for (var bodies = this.bodies, N = bodies.length, i = 0; i !== N; i++) {
                    var b = bodies[i];
                    b.force, b.torque;
                    b.force.set(0, 0, 0), b.torque.set(0, 0, 0);
                }
            }, World;
        }(EventTarget), tmpRay$1 = (new AABB(), new Ray());
        if ("undefined" == typeof performance && (performance = {}), !performance.now) {
            var nowOffset = Date.now();
            performance.timing && performance.timing.navigationStart && (nowOffset = performance.timing.navigationStart), 
            performance.now = function() {
                return Date.now() - nowOffset;
            };
        }
        new Vec3();
        var additions, removals, beginContactEvent, endContactEvent, beginShapeContactEvent, endShapeContactEvent, World_step_postStepEvent = {
            type: "postStep"
        }, World_step_preStepEvent = {
            type: "preStep"
        }, World_step_collideEvent = {
            type: Body.COLLIDE_EVENT_NAME,
            body: null,
            contact: null
        }, World_step_oldContacts = [], World_step_frictionEquationPool = [], World_step_p1 = [], World_step_p2 = [];
        World.prototype.emitContactEvents = (additions = [], removals = [], beginContactEvent = {
            type: "beginContact",
            bodyA: null,
            bodyB: null
        }, endContactEvent = {
            type: "endContact",
            bodyA: null,
            bodyB: null
        }, beginShapeContactEvent = {
            type: "beginShapeContact",
            bodyA: null,
            bodyB: null,
            shapeA: null,
            shapeB: null
        }, endShapeContactEvent = {
            type: "endShapeContact",
            bodyA: null,
            bodyB: null,
            shapeA: null,
            shapeB: null
        }, function() {
            var hasBeginContact = this.hasAnyEventListener("beginContact"), hasEndContact = this.hasAnyEventListener("endContact");
            if ((hasBeginContact || hasEndContact) && this.bodyOverlapKeeper.getDiff(additions, removals), 
            hasBeginContact) {
                for (var i = 0, l = additions.length; i < l; i += 2) beginContactEvent.bodyA = this.getBodyById(additions[i]), 
                beginContactEvent.bodyB = this.getBodyById(additions[i + 1]), this.dispatchEvent(beginContactEvent);
                beginContactEvent.bodyA = beginContactEvent.bodyB = null;
            }
            if (hasEndContact) {
                for (var _i2 = 0, _l = removals.length; _i2 < _l; _i2 += 2) endContactEvent.bodyA = this.getBodyById(removals[_i2]), 
                endContactEvent.bodyB = this.getBodyById(removals[_i2 + 1]), this.dispatchEvent(endContactEvent);
                endContactEvent.bodyA = endContactEvent.bodyB = null;
            }
            additions.length = removals.length = 0;
            var hasBeginShapeContact = this.hasAnyEventListener("beginShapeContact"), hasEndShapeContact = this.hasAnyEventListener("endShapeContact");
            if ((hasBeginShapeContact || hasEndShapeContact) && this.shapeOverlapKeeper.getDiff(additions, removals), 
            hasBeginShapeContact) {
                for (var _i3 = 0, _l2 = additions.length; _i3 < _l2; _i3 += 2) {
                    var shapeA = this.getShapeById(additions[_i3]), shapeB = this.getShapeById(additions[_i3 + 1]);
                    beginShapeContactEvent.shapeA = shapeA, beginShapeContactEvent.shapeB = shapeB, 
                    beginShapeContactEvent.bodyA = shapeA.body, beginShapeContactEvent.bodyB = shapeB.body, 
                    this.dispatchEvent(beginShapeContactEvent);
                }
                beginShapeContactEvent.bodyA = beginShapeContactEvent.bodyB = beginShapeContactEvent.shapeA = beginShapeContactEvent.shapeB = null;
            }
            if (hasEndShapeContact) {
                for (var _i4 = 0, _l3 = removals.length; _i4 < _l3; _i4 += 2) {
                    var _shapeA = this.getShapeById(removals[_i4]), _shapeB = this.getShapeById(removals[_i4 + 1]);
                    endShapeContactEvent.shapeA = _shapeA, endShapeContactEvent.shapeB = _shapeB, 
                    endShapeContactEvent.bodyA = _shapeA.body, endShapeContactEvent.bodyB = _shapeB.body, 
                    this.dispatchEvent(endShapeContactEvent);
                }
                endShapeContactEvent.bodyA = endShapeContactEvent.bodyB = endShapeContactEvent.shapeA = endShapeContactEvent.shapeB = null;
            }
        }), exports.AABB = AABB, exports.ArrayCollisionMatrix = ArrayCollisionMatrix, 
        exports.BODY_SLEEP_STATES = BODY_SLEEP_STATES, exports.BODY_TYPES = {
            DYNAMIC: 1,
            STATIC: 2,
            KINEMATIC: 4
        }, exports.Body = Body, exports.Box = Box, exports.Broadphase = Broadphase, 
        exports.COLLISION_TYPES = COLLISION_TYPES, exports.ConeTwistConstraint = ConeTwistConstraint, 
        exports.Constraint = Constraint, exports.ContactEquation = ContactEquation, 
        exports.ContactMaterial = ContactMaterial, exports.ConvexPolyhedron = ConvexPolyhedron, 
        exports.Cylinder = Cylinder, exports.DistanceConstraint = DistanceConstraint, 
        exports.Equation = Equation, exports.EventTarget = EventTarget, exports.FrictionEquation = FrictionEquation, 
        exports.GSSolver = GSSolver, exports.GridBroadphase = GridBroadphase, exports.Heightfield = Heightfield, 
        exports.HingeConstraint = HingeConstraint, exports.JacobianElement = JacobianElement, 
        exports.LockConstraint = LockConstraint, exports.Mat3 = Mat3, exports.Material = Material, 
        exports.NaiveBroadphase = NaiveBroadphase, exports.Narrowphase = Narrowphase, 
        exports.ObjectCollisionMatrix = ObjectCollisionMatrix, exports.Particle = Particle, 
        exports.Plane = Plane, exports.PointToPointConstraint = PointToPointConstraint, 
        exports.Pool = Pool, exports.Quaternion = Quaternion, exports.RAY_MODES = {
            CLOSEST: 1,
            ANY: 2,
            ALL: 4
        }, exports.Ray = Ray, exports.RaycastResult = RaycastResult, exports.RaycastVehicle = RaycastVehicle, 
        exports.RigidVehicle = RigidVehicle, exports.RotationalEquation = RotationalEquation, 
        exports.RotationalMotorEquation = RotationalMotorEquation, exports.SAPBroadphase = SAPBroadphase, 
        exports.SHAPE_TYPES = SHAPE_TYPES, exports.SPHSystem = SPHSystem, exports.Shape = Shape, 
        exports.Solver = Solver, exports.Sphere = Sphere, exports.SplitSolver = SplitSolver, 
        exports.Spring = Spring, exports.Transform = Transform, exports.Trimesh = Trimesh, 
        exports.Vec3 = Vec3, exports.Vec3Pool = Vec3Pool, exports.World = World;
    }, {} ],
    5: [ function(require, module, exports) {
        "use strict";
        const TYPE = exports.TYPE = {
            BOX: "box",
            CYLINDER: "cylinder",
            SPHERE: "sphere",
            CAPSULE: "capsule",
            CONE: "cone",
            HULL: "hull",
            HACD: "hacd",
            VHACD: "vhacd",
            MESH: "mesh",
            HEIGHTFIELD: "heightfield"
        }, FIT = exports.FIT = {
            ALL: "all",
            MANUAL: "manual"
        }, hasUpdateMatricesFunction = (exports.HEIGHTFIELD_DATA_TYPE = {
            short: "short",
            float: "float"
        }, THREE.Object3D.prototype.hasOwnProperty("updateMatrices"));
        function _setOptions(options) {
            options.fit = options.hasOwnProperty("fit") ? options.fit : FIT.ALL, 
            options.type = options.type || TYPE.HULL, options.minHalfExtent = options.hasOwnProperty("minHalfExtent") ? options.minHalfExtent : 0, 
            options.maxHalfExtent = options.hasOwnProperty("maxHalfExtent") ? options.maxHalfExtent : Number.POSITIVE_INFINITY, 
            options.cylinderAxis = options.cylinderAxis || "y", options.margin = options.hasOwnProperty("margin") ? options.margin : .01, 
            options.includeInvisible = !!options.hasOwnProperty("includeInvisible") && options.includeInvisible, 
            options.offset || (options.offset = new THREE.Vector3()), options.orientation || (options.orientation = new THREE.Quaternion());
        }
        exports.createCollisionShapes = function(root, options) {
            switch (options.type) {
              case TYPE.BOX:
                return [ this.createBoxShape(root, options) ];

              case TYPE.CYLINDER:
                return [ this.createCylinderShape(root, options) ];

              case TYPE.CAPSULE:
                return [ this.createCapsuleShape(root, options) ];

              case TYPE.CONE:
                return [ this.createConeShape(root, options) ];

              case TYPE.SPHERE:
                return [ this.createSphereShape(root, options) ];

              case TYPE.HULL:
                return [ this.createHullShape(root, options) ];

              case TYPE.HACD:
                return this.createHACDShapes(root, options);

              case TYPE.VHACD:
                return this.createVHACDShapes(root, options);

              case TYPE.MESH:
                return [ this.createTriMeshShape(root, options) ];

              case TYPE.HEIGHTFIELD:
                return [ this.createHeightfieldTerrainShape(root, options) ];

              default:
                return console.warn(options.type + " is not currently supported"), 
                [];
            }
        }, exports.createBoxShape = function(root, options) {
            options.type = TYPE.BOX, _setOptions(options), options.fit === FIT.ALL && (options.halfExtents = _computeHalfExtents(root, _computeBounds(root, options), options.minHalfExtent, options.maxHalfExtent));
            const btHalfExtents = new Ammo.btVector3(options.halfExtents.x, options.halfExtents.y, options.halfExtents.z), collisionShape = new Ammo.btBoxShape(btHalfExtents);
            return Ammo.destroy(btHalfExtents), _finishCollisionShape(collisionShape, options, _computeScale(root, options)), 
            collisionShape;
        }, exports.createCylinderShape = function(root, options) {
            options.type = TYPE.CYLINDER, _setOptions(options), options.fit === FIT.ALL && (options.halfExtents = _computeHalfExtents(root, _computeBounds(root, options), options.minHalfExtent, options.maxHalfExtent));
            const btHalfExtents = new Ammo.btVector3(options.halfExtents.x, options.halfExtents.y, options.halfExtents.z), collisionShape = (() => {
                switch (options.cylinderAxis) {
                  case "y":
                    return new Ammo.btCylinderShape(btHalfExtents);

                  case "x":
                    return new Ammo.btCylinderShapeX(btHalfExtents);

                  case "z":
                    return new Ammo.btCylinderShapeZ(btHalfExtents);
                }
                return null;
            })();
            return Ammo.destroy(btHalfExtents), _finishCollisionShape(collisionShape, options, _computeScale(root, options)), 
            collisionShape;
        }, exports.createCapsuleShape = function(root, options) {
            options.type = TYPE.CAPSULE, _setOptions(options), options.fit === FIT.ALL && (options.halfExtents = _computeHalfExtents(root, _computeBounds(root, options), options.minHalfExtent, options.maxHalfExtent));
            const {
                x,
                y,
                z
            } = options.halfExtents, collisionShape = (() => {
                switch (options.cylinderAxis) {
                  case "y":
                    return new Ammo.btCapsuleShape(Math.max(x, z), 2 * y);

                  case "x":
                    return new Ammo.btCapsuleShapeX(Math.max(y, z), 2 * x);

                  case "z":
                    return new Ammo.btCapsuleShapeZ(Math.max(x, y), 2 * z);
                }
                return null;
            })();
            return _finishCollisionShape(collisionShape, options, _computeScale(root, options)), 
            collisionShape;
        }, exports.createConeShape = function(root, options) {
            options.type = TYPE.CONE, _setOptions(options), options.fit === FIT.ALL && (options.halfExtents = _computeHalfExtents(root, _computeBounds(root, options), options.minHalfExtent, options.maxHalfExtent));
            const {
                x,
                y,
                z
            } = options.halfExtents, collisionShape = (() => {
                switch (options.cylinderAxis) {
                  case "y":
                    return new Ammo.btConeShape(Math.max(x, z), 2 * y);

                  case "x":
                    return new Ammo.btConeShapeX(Math.max(y, z), 2 * x);

                  case "z":
                    return new Ammo.btConeShapeZ(Math.max(x, y), 2 * z);
                }
                return null;
            })();
            return _finishCollisionShape(collisionShape, options, _computeScale(root, options)), 
            collisionShape;
        }, exports.createSphereShape = function(root, options) {
            let radius;
            options.type = TYPE.SPHERE, _setOptions(options), radius = options.fit !== FIT.MANUAL || isNaN(options.sphereRadius) ? _computeRadius(root, options, _computeBounds(root, options)) : options.sphereRadius;
            const collisionShape = new Ammo.btSphereShape(radius);
            return _finishCollisionShape(collisionShape, options, _computeScale(root, options)), 
            collisionShape;
        }, exports.createHullShape = function() {
            const vertex = new THREE.Vector3(), center = new THREE.Vector3();
            return function(root, options) {
                if (options.type = TYPE.HULL, _setOptions(options), options.fit === FIT.MANUAL) return console.warn("cannot use fit: manual with type: hull"), 
                null;
                const bounds = _computeBounds(root, options), btVertex = new Ammo.btVector3(), originalHull = new Ammo.btConvexHullShape();
                originalHull.setMargin(options.margin), center.addVectors(bounds.max, bounds.min).multiplyScalar(.5);
                let vertexCount = 0;
                _iterateGeometries(root, options, geo => {
                    vertexCount += geo.attributes.position.array.length / 3;
                });
                const maxVertices = options.hullMaxVertices || 1e5;
                vertexCount > maxVertices && console.warn(`too many vertices for hull shape; sampling ~${maxVertices} from ~${vertexCount} vertices`);
                const p = Math.min(1, maxVertices / vertexCount);
                _iterateGeometries(root, options, (geo, transform) => {
                    const components = geo.attributes.position.array;
                    for (let i = 0; i < components.length; i += 3) Math.random() <= p && (vertex.set(components[i], components[i + 1], components[i + 2]).applyMatrix4(transform).sub(center), 
                    btVertex.setValue(vertex.x, vertex.y, vertex.z), originalHull.addPoint(btVertex, i === components.length - 3));
                });
                let collisionShape = originalHull;
                if (originalHull.getNumVertices() >= 100) {
                    const shapeHull = new Ammo.btShapeHull(originalHull);
                    shapeHull.buildHull(options.margin), Ammo.destroy(originalHull), 
                    collisionShape = new Ammo.btConvexHullShape(Ammo.getPointer(shapeHull.getVertexPointer()), shapeHull.numVertices()), 
                    Ammo.destroy(shapeHull);
                }
                return Ammo.destroy(btVertex), _finishCollisionShape(collisionShape, options, _computeScale(root, options)), 
                collisionShape;
            };
        }(), exports.createHACDShapes = function() {
            const v = new THREE.Vector3(), center = new THREE.Vector3();
            return function(root, options) {
                if (options.type = TYPE.HACD, _setOptions(options), options.fit === FIT.MANUAL) return console.warn("cannot use fit: manual with type: hacd"), 
                [];
                if (!Ammo.hasOwnProperty("HACD")) return console.warn("HACD unavailable in included build of Ammo.js. Visit https://github.com/mozillareality/ammo.js for the latest version."), 
                [];
                const bounds = _computeBounds(root), scale = _computeScale(root, options);
                let vertexCount = 0, triCount = 0;
                center.addVectors(bounds.max, bounds.min).multiplyScalar(.5), _iterateGeometries(root, options, geo => {
                    vertexCount += geo.attributes.position.array.length / 3, geo.index ? triCount += geo.index.array.length / 3 : triCount += geo.attributes.position.array.length / 9;
                });
                const hacd = new Ammo.HACD();
                options.hasOwnProperty("compacityWeight") && hacd.SetCompacityWeight(options.compacityWeight), 
                options.hasOwnProperty("volumeWeight") && hacd.SetVolumeWeight(options.volumeWeight), 
                options.hasOwnProperty("nClusters") && hacd.SetNClusters(options.nClusters), 
                options.hasOwnProperty("nVerticesPerCH") && hacd.SetNVerticesPerCH(options.nVerticesPerCH), 
                options.hasOwnProperty("concavity") && hacd.SetConcavity(options.concavity);
                const points = Ammo._malloc(3 * vertexCount * 8), triangles = Ammo._malloc(3 * triCount * 4);
                hacd.SetPoints(points), hacd.SetTriangles(triangles), hacd.SetNPoints(vertexCount), 
                hacd.SetNTriangles(triCount);
                const pptr = points / 8, tptr = triangles / 4;
                _iterateGeometries(root, options, (geo, transform) => {
                    const components = geo.attributes.position.array, indices = geo.index ? geo.index.array : null;
                    for (let i = 0; i < components.length; i += 3) v.set(components[i + 0], components[i + 1], components[i + 2]).applyMatrix4(transform).sub(center), 
                    Ammo.HEAPF64[pptr + i + 0] = v.x, Ammo.HEAPF64[pptr + i + 1] = v.y, 
                    Ammo.HEAPF64[pptr + i + 2] = v.z;
                    if (indices) for (let i = 0; i < indices.length; i++) Ammo.HEAP32[tptr + i] = indices[i]; else for (let i = 0; i < components.length / 3; i++) Ammo.HEAP32[tptr + i] = i;
                }), hacd.Compute(), Ammo._free(points), Ammo._free(triangles);
                const nClusters = hacd.GetNClusters(), shapes = [];
                for (let i = 0; i < nClusters; i++) {
                    const hull = new Ammo.btConvexHullShape();
                    hull.setMargin(options.margin);
                    const nPoints = hacd.GetNPointsCH(i), nTriangles = hacd.GetNTrianglesCH(i), hullPoints = Ammo._malloc(3 * nPoints * 8), hullTriangles = Ammo._malloc(3 * nTriangles * 4);
                    hacd.GetCH(i, hullPoints, hullTriangles);
                    const pptr = hullPoints / 8;
                    for (let pi = 0; pi < nPoints; pi++) {
                        const btVertex = new Ammo.btVector3(), px = Ammo.HEAPF64[pptr + 3 * pi + 0], py = Ammo.HEAPF64[pptr + 3 * pi + 1], pz = Ammo.HEAPF64[pptr + 3 * pi + 2];
                        btVertex.setValue(px, py, pz), hull.addPoint(btVertex, pi === nPoints - 1), 
                        Ammo.destroy(btVertex);
                    }
                    _finishCollisionShape(hull, options, scale), shapes.push(hull);
                }
                return shapes;
            };
        }(), exports.createVHACDShapes = function() {
            const v = new THREE.Vector3(), center = new THREE.Vector3();
            return function(root, options) {
                if (options.type = TYPE.VHACD, _setOptions(options), options.fit === FIT.MANUAL) return console.warn("cannot use fit: manual with type: vhacd"), 
                [];
                if (!Ammo.hasOwnProperty("VHACD")) return console.warn("VHACD unavailable in included build of Ammo.js. Visit https://github.com/mozillareality/ammo.js for the latest version."), 
                [];
                const bounds = _computeBounds(root, options), scale = _computeScale(root, options);
                let vertexCount = 0, triCount = 0;
                center.addVectors(bounds.max, bounds.min).multiplyScalar(.5), _iterateGeometries(root, options, geo => {
                    vertexCount += geo.attributes.position.count, geo.index ? triCount += geo.index.count / 3 : triCount += geo.attributes.position.count / 3;
                });
                const vhacd = new Ammo.VHACD(), params = new Ammo.Parameters();
                options.hasOwnProperty("resolution") && params.set_m_resolution(options.resolution), 
                options.hasOwnProperty("depth") && params.set_m_depth(options.depth), 
                options.hasOwnProperty("concavity") && params.set_m_concavity(options.concavity), 
                options.hasOwnProperty("planeDownsampling") && params.set_m_planeDownsampling(options.planeDownsampling), 
                options.hasOwnProperty("convexhullDownsampling") && params.set_m_convexhullDownsampling(options.convexhullDownsampling), 
                options.hasOwnProperty("alpha") && params.set_m_alpha(options.alpha), 
                options.hasOwnProperty("beta") && params.set_m_beta(options.beta), 
                options.hasOwnProperty("gamma") && params.set_m_gamma(options.gamma), 
                options.hasOwnProperty("pca") && params.set_m_pca(options.pca), 
                options.hasOwnProperty("mode") && params.set_m_mode(options.mode), 
                options.hasOwnProperty("maxNumVerticesPerCH") && params.set_m_maxNumVerticesPerCH(options.maxNumVerticesPerCH), 
                options.hasOwnProperty("minVolumePerCH") && params.set_m_minVolumePerCH(options.minVolumePerCH), 
                options.hasOwnProperty("convexhullApproximation") && params.set_m_convexhullApproximation(options.convexhullApproximation), 
                options.hasOwnProperty("oclAcceleration") && params.set_m_oclAcceleration(options.oclAcceleration);
                const points = Ammo._malloc(3 * vertexCount * 8), triangles = Ammo._malloc(3 * triCount * 4);
                let pptr = points / 8, tptr = triangles / 4;
                _iterateGeometries(root, options, (geo, transform) => {
                    const components = geo.attributes.position.array, indices = geo.index ? geo.index.array : null;
                    for (let i = 0; i < components.length; i += 3) v.set(components[i + 0], components[i + 1], components[i + 2]).applyMatrix4(transform).sub(center), 
                    Ammo.HEAPF64[pptr + 0] = v.x, Ammo.HEAPF64[pptr + 1] = v.y, 
                    Ammo.HEAPF64[pptr + 2] = v.z, pptr += 3;
                    if (indices) for (let i = 0; i < indices.length; i++) Ammo.HEAP32[tptr] = indices[i], 
                    tptr++; else for (let i = 0; i < components.length / 3; i++) Ammo.HEAP32[tptr] = i, 
                    tptr++;
                }), vhacd.Compute(points, 3, vertexCount, triangles, 3, triCount, params), 
                Ammo._free(points), Ammo._free(triangles);
                const nHulls = vhacd.GetNConvexHulls(), shapes = [], ch = new Ammo.ConvexHull();
                for (let i = 0; i < nHulls; i++) {
                    vhacd.GetConvexHull(i, ch);
                    const nPoints = ch.get_m_nPoints(), hull = (ch.get_m_points(), 
                    new Ammo.btConvexHullShape());
                    hull.setMargin(options.margin);
                    for (let pi = 0; pi < nPoints; pi++) {
                        const btVertex = new Ammo.btVector3(), px = ch.get_m_points(3 * pi + 0), py = ch.get_m_points(3 * pi + 1), pz = ch.get_m_points(3 * pi + 2);
                        btVertex.setValue(px, py, pz), hull.addPoint(btVertex, pi === nPoints - 1), 
                        Ammo.destroy(btVertex);
                    }
                    _finishCollisionShape(hull, options, scale), shapes.push(hull);
                }
                return Ammo.destroy(ch), Ammo.destroy(vhacd), shapes;
            };
        }(), exports.createTriMeshShape = function() {
            const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3();
            return function(root, options) {
                if (options.type = TYPE.MESH, _setOptions(options), options.fit === FIT.MANUAL) return console.warn("cannot use fit: manual with type: mesh"), 
                null;
                const scale = _computeScale(root, options), bta = new Ammo.btVector3(), btb = new Ammo.btVector3(), btc = new Ammo.btVector3(), triMesh = new Ammo.btTriangleMesh(!0, !1);
                _iterateGeometries(root, options, (geo, transform) => {
                    const components = geo.attributes.position.array;
                    if (geo.index) for (let i = 0; i < geo.index.count; i += 3) {
                        const ai = 3 * geo.index.array[i], bi = 3 * geo.index.array[i + 1], ci = 3 * geo.index.array[i + 2];
                        va.set(components[ai], components[ai + 1], components[ai + 2]).applyMatrix4(transform), 
                        vb.set(components[bi], components[bi + 1], components[bi + 2]).applyMatrix4(transform), 
                        vc.set(components[ci], components[ci + 1], components[ci + 2]).applyMatrix4(transform), 
                        bta.setValue(va.x, va.y, va.z), btb.setValue(vb.x, vb.y, vb.z), 
                        btc.setValue(vc.x, vc.y, vc.z), triMesh.addTriangle(bta, btb, btc, !1);
                    } else for (let i = 0; i < components.length; i += 9) va.set(components[i + 0], components[i + 1], components[i + 2]).applyMatrix4(transform), 
                    vb.set(components[i + 3], components[i + 4], components[i + 5]).applyMatrix4(transform), 
                    vc.set(components[i + 6], components[i + 7], components[i + 8]).applyMatrix4(transform), 
                    bta.setValue(va.x, va.y, va.z), btb.setValue(vb.x, vb.y, vb.z), 
                    btc.setValue(vc.x, vc.y, vc.z), triMesh.addTriangle(bta, btb, btc, !1);
                });
                const localScale = new Ammo.btVector3(scale.x, scale.y, scale.z);
                triMesh.setScaling(localScale), Ammo.destroy(localScale);
                const collisionShape = new Ammo.btBvhTriangleMeshShape(triMesh, !0, !0);
                return collisionShape.resources = [ triMesh ], Ammo.destroy(bta), 
                Ammo.destroy(btb), Ammo.destroy(btc), _finishCollisionShape(collisionShape, options), 
                collisionShape;
            };
        }(), exports.createHeightfieldTerrainShape = function(root, options) {
            if (_setOptions(options), options.fit === FIT.ALL) return console.warn("cannot use fit: all with type: heightfield"), 
            null;
            const heightfieldDistance = options.heightfieldDistance || 1, heightfieldData = options.heightfieldData || [], heightScale = options.heightScale || 0, upAxis = options.hasOwnProperty("upAxis") ? options.upAxis : 1, hdt = (() => {
                switch (options.heightDataType) {
                  case "short":
                    return Ammo.PHY_SHORT;

                  case "float":
                  default:
                    return Ammo.PHY_FLOAT;
                }
            })(), flipQuadEdges = !options.hasOwnProperty("flipQuadEdges") || options.flipQuadEdges, heightStickLength = heightfieldData.length, heightStickWidth = heightStickLength > 0 ? heightfieldData[0].length : 0, data = Ammo._malloc(heightStickLength * heightStickWidth * 4), ptr = data / 4;
            let minHeight = Number.POSITIVE_INFINITY, maxHeight = Number.NEGATIVE_INFINITY, index = 0;
            for (let l = 0; l < heightStickLength; l++) for (let w = 0; w < heightStickWidth; w++) {
                const height = heightfieldData[l][w];
                Ammo.HEAPF32[ptr + index] = height, index++, minHeight = Math.min(minHeight, height), 
                maxHeight = Math.max(maxHeight, height);
            }
            const collisionShape = new Ammo.btHeightfieldTerrainShape(heightStickWidth, heightStickLength, data, heightScale, minHeight, maxHeight, upAxis, hdt, flipQuadEdges), scale = new Ammo.btVector3(heightfieldDistance, 1, heightfieldDistance);
            return collisionShape.setLocalScaling(scale), Ammo.destroy(scale), collisionShape.heightfieldData = data, 
            _finishCollisionShape(collisionShape, options), collisionShape;
        };
        const _finishCollisionShape = function(collisionShape, options, scale) {
            collisionShape.type = options.type, collisionShape.setMargin(options.margin), 
            collisionShape.destroy = () => {
                for (let res of collisionShape.resources || []) Ammo.destroy(res);
                collisionShape.heightfieldData && Ammo._free(collisionShape.heightfieldData), 
                Ammo.destroy(collisionShape);
            };
            const localTransform = new Ammo.btTransform(), rotation = new Ammo.btQuaternion();
            if (localTransform.setIdentity(), localTransform.getOrigin().setValue(options.offset.x, options.offset.y, options.offset.z), 
            rotation.setValue(options.orientation.x, options.orientation.y, options.orientation.z, options.orientation.w), 
            localTransform.setRotation(rotation), Ammo.destroy(rotation), scale) {
                const localScale = new Ammo.btVector3(scale.x, scale.y, scale.z);
                collisionShape.setLocalScaling(localScale), Ammo.destroy(localScale);
            }
            collisionShape.localTransform = localTransform;
        }, _iterateGeometries = function() {
            const transform = new THREE.Matrix4(), inverse = new THREE.Matrix4(), bufferGeometry = new THREE.BufferGeometry();
            return function(root, options, cb) {
                inverse.copy(root.matrixWorld).invert(), root.traverse(mesh => {
                    !mesh.isMesh || THREE.Sky && mesh.__proto__ == THREE.Sky.prototype || !(options.includeInvisible || mesh.el && mesh.el.object3D.visible || mesh.visible) || (mesh === root ? transform.identity() : (hasUpdateMatricesFunction && mesh.updateMatrices(), 
                    transform.multiplyMatrices(inverse, mesh.matrixWorld)), cb(mesh.geometry.isBufferGeometry ? mesh.geometry : bufferGeometry.fromGeometry(mesh.geometry), transform));
                });
            };
        }(), _computeScale = function(root, options) {
            const scale = new THREE.Vector3(1, 1, 1);
            return options.fit === FIT.ALL && scale.setFromMatrixScale(root.matrixWorld), 
            scale;
        }, _computeRadius = function() {
            const v = new THREE.Vector3(), center = new THREE.Vector3();
            return function(root, options, bounds) {
                let maxRadiusSq = 0, {
                    x: cx,
                    y: cy,
                    z: cz
                } = bounds.getCenter(center);
                return _iterateGeometries(root, options, (geo, transform) => {
                    const components = geo.attributes.position.array;
                    for (let i = 0; i < components.length; i += 3) {
                        v.set(components[i], components[i + 1], components[i + 2]).applyMatrix4(transform);
                        const dx = cx - v.x, dy = cy - v.y, dz = cz - v.z;
                        maxRadiusSq = Math.max(maxRadiusSq, dx * dx + dy * dy + dz * dz);
                    }
                }), Math.sqrt(maxRadiusSq);
            };
        }(), _computeHalfExtents = function(root, bounds, minHalfExtent, maxHalfExtent) {
            return new THREE.Vector3().subVectors(bounds.max, bounds.min).multiplyScalar(.5).clampScalar(minHalfExtent, maxHalfExtent);
        }, _computeBounds = function() {
            const v = new THREE.Vector3();
            return function(root, options) {
                const bounds = new THREE.Box3();
                let minX = 1 / 0, minY = 1 / 0, minZ = 1 / 0, maxX = -1 / 0, maxY = -1 / 0, maxZ = -1 / 0;
                return bounds.min.set(0, 0, 0), bounds.max.set(0, 0, 0), _iterateGeometries(root, options, (geo, transform) => {
                    const components = geo.attributes.position.array;
                    for (let i = 0; i < components.length; i += 3) v.set(components[i], components[i + 1], components[i + 2]).applyMatrix4(transform), 
                    v.x < minX && (minX = v.x), v.y < minY && (minY = v.y), v.z < minZ && (minZ = v.z), 
                    v.x > maxX && (maxX = v.x), v.y > maxY && (maxY = v.y), v.z > maxZ && (maxZ = v.z);
                }), bounds.min.set(minX, minY, minZ), bounds.max.set(maxX, maxY, maxZ), 
                bounds;
            };
        }();
    }, {} ],
    6: [ function(require, module, exports) {
        (function(global) {
            var e = require("cannon-es"), t = "undefined" != typeof window ? window.THREE : void 0 !== global ? global.THREE : null, n = function() {
                var e, n, r, i, o = new t.Vector3();
                function a() {
                    this.tolerance = -1, this.faces = [], this.newFaces = [], this.assigned = new l(), 
                    this.unassigned = new l(), this.vertices = [];
                }
                function s() {
                    this.normal = new t.Vector3(), this.midpoint = new t.Vector3(), 
                    this.area = 0, this.constant = 0, this.outside = null, this.mark = 0, 
                    this.edge = null;
                }
                function u(e, t) {
                    this.vertex = e, this.prev = null, this.next = null, this.twin = null, 
                    this.face = t;
                }
                function h(e) {
                    this.point = e, this.prev = null, this.next = null, this.face = null;
                }
                function l() {
                    this.head = null, this.tail = null;
                }
                return Object.assign(a.prototype, {
                    setFromPoints: function(e) {
                        !0 !== Array.isArray(e) && console.error("THREE.ConvexHull: Points parameter is not an array."), 
                        e.length < 4 && console.error("THREE.ConvexHull: The algorithm needs at least four points."), 
                        this.makeEmpty();
                        for (var t = 0, n = e.length; t < n; t++) this.vertices.push(new h(e[t]));
                        return this.compute(), this;
                    },
                    setFromObject: function(e) {
                        var n = [];
                        return e.updateMatrixWorld(!0), e.traverse(function(e) {
                            var r, i, o, a = e.geometry;
                            if (void 0 !== a) if (a.isGeometry) {
                                var s = a.vertices;
                                for (r = 0, i = s.length; r < i; r++) (o = s[r].clone()).applyMatrix4(e.matrixWorld), 
                                n.push(o);
                            } else if (a.isBufferGeometry) {
                                var u = a.attributes.position;
                                if (void 0 !== u) for (r = 0, i = u.count; r < i; r++) (o = new t.Vector3()).fromBufferAttribute(u, r).applyMatrix4(e.matrixWorld), 
                                n.push(o);
                            }
                        }), this.setFromPoints(n);
                    },
                    containsPoint: function(e) {
                        for (var t = this.faces, n = 0, r = t.length; n < r; n++) if (t[n].distanceToPoint(e) > this.tolerance) return !1;
                        return !0;
                    },
                    intersectRay: function(e, t) {
                        for (var n = this.faces, r = -1 / 0, i = 1 / 0, o = 0, a = n.length; o < a; o++) {
                            var s = n[o], u = s.distanceToPoint(e.origin), h = s.normal.dot(e.direction);
                            if (u > 0 && h >= 0) return null;
                            var l = 0 !== h ? -u / h : 0;
                            if (!(l <= 0) && (h > 0 ? i = Math.min(l, i) : r = Math.max(l, r), 
                            r > i)) return null;
                        }
                        return e.at(-1 / 0 !== r ? r : i, t), t;
                    },
                    intersectsRay: function(e) {
                        return null !== this.intersectRay(e, o);
                    },
                    makeEmpty: function() {
                        return this.faces = [], this.vertices = [], this;
                    },
                    addVertexToFace: function(e, t) {
                        return e.face = t, null === t.outside ? this.assigned.append(e) : this.assigned.insertBefore(t.outside, e), 
                        t.outside = e, this;
                    },
                    removeVertexFromFace: function(e, t) {
                        return e === t.outside && (t.outside = null !== e.next && e.next.face === t ? e.next : null), 
                        this.assigned.remove(e), this;
                    },
                    removeAllVerticesFromFace: function(e) {
                        if (null !== e.outside) {
                            for (var t = e.outside, n = e.outside; null !== n.next && n.next.face === e; ) n = n.next;
                            return this.assigned.removeSubList(t, n), t.prev = n.next = null, 
                            e.outside = null, t;
                        }
                    },
                    deleteFaceVertices: function(e, t) {
                        var n = this.removeAllVerticesFromFace(e);
                        if (void 0 !== n) if (void 0 === t) this.unassigned.appendChain(n); else {
                            var r = n;
                            do {
                                var i = r.next;
                                t.distanceToPoint(r.point) > this.tolerance ? this.addVertexToFace(r, t) : this.unassigned.append(r), 
                                r = i;
                            } while (null !== r);
                        }
                        return this;
                    },
                    resolveUnassignedPoints: function(e) {
                        if (!1 === this.unassigned.isEmpty()) {
                            var t = this.unassigned.first();
                            do {
                                for (var n = t.next, r = this.tolerance, i = null, o = 0; o < e.length; o++) {
                                    var a = e[o];
                                    if (0 === a.mark) {
                                        var s = a.distanceToPoint(t.point);
                                        if (s > r && (r = s, i = a), r > 1e3 * this.tolerance) break;
                                    }
                                }
                                null !== i && this.addVertexToFace(t, i), t = n;
                            } while (null !== t);
                        }
                        return this;
                    },
                    computeExtremes: function() {
                        var e, n, r, i = new t.Vector3(), o = new t.Vector3(), a = [], s = [];
                        for (e = 0; e < 3; e++) a[e] = s[e] = this.vertices[0];
                        for (i.copy(this.vertices[0].point), o.copy(this.vertices[0].point), 
                        e = 0, n = this.vertices.length; e < n; e++) {
                            var u = this.vertices[e], h = u.point;
                            for (r = 0; r < 3; r++) h.getComponent(r) < i.getComponent(r) && (i.setComponent(r, h.getComponent(r)), 
                            a[r] = u);
                            for (r = 0; r < 3; r++) h.getComponent(r) > o.getComponent(r) && (o.setComponent(r, h.getComponent(r)), 
                            s[r] = u);
                        }
                        return this.tolerance = 3 * Number.EPSILON * (Math.max(Math.abs(i.x), Math.abs(o.x)) + Math.max(Math.abs(i.y), Math.abs(o.y)) + Math.max(Math.abs(i.z), Math.abs(o.z))), 
                        {
                            min: a,
                            max: s
                        };
                    },
                    computeInitialHull: function() {
                        void 0 === e && (e = new t.Line3(), n = new t.Plane(), r = new t.Vector3());
                        var i, o, a, u, h, l, c, d, m, p = this.vertices, f = this.computeExtremes(), v = f.min, g = f.max, x = 0, y = 0;
                        for (l = 0; l < 3; l++) (m = g[l].point.getComponent(l) - v[l].point.getComponent(l)) > x && (x = m, 
                        y = l);
                        for (x = 0, e.set((o = v[y]).point, (a = g[y]).point), l = 0, 
                        c = this.vertices.length; l < c; l++) (i = p[l]) !== o && i !== a && (e.closestPointToPoint(i.point, !0, r), 
                        (m = r.distanceToSquared(i.point)) > x && (x = m, u = i));
                        for (x = -1, n.setFromCoplanarPoints(o.point, a.point, u.point), 
                        l = 0, c = this.vertices.length; l < c; l++) (i = p[l]) !== o && i !== a && i !== u && (m = Math.abs(n.distanceToPoint(i.point))) > x && (x = m, 
                        h = i);
                        var w = [];
                        if (n.distanceToPoint(h.point) < 0) for (w.push(s.create(o, a, u), s.create(h, a, o), s.create(h, u, a), s.create(h, o, u)), 
                        l = 0; l < 3; l++) d = (l + 1) % 3, w[l + 1].getEdge(2).setTwin(w[0].getEdge(d)), 
                        w[l + 1].getEdge(1).setTwin(w[d + 1].getEdge(0)); else for (w.push(s.create(o, u, a), s.create(h, o, a), s.create(h, a, u), s.create(h, u, o)), 
                        l = 0; l < 3; l++) d = (l + 1) % 3, w[l + 1].getEdge(2).setTwin(w[0].getEdge((3 - l) % 3)), 
                        w[l + 1].getEdge(0).setTwin(w[d + 1].getEdge(1));
                        for (l = 0; l < 4; l++) this.faces.push(w[l]);
                        for (l = 0, c = p.length; l < c; l++) if ((i = p[l]) !== o && i !== a && i !== u && i !== h) {
                            x = this.tolerance;
                            var T = null;
                            for (d = 0; d < 4; d++) (m = this.faces[d].distanceToPoint(i.point)) > x && (x = m, 
                            T = this.faces[d]);
                            null !== T && this.addVertexToFace(i, T);
                        }
                        return this;
                    },
                    reindexFaces: function() {
                        for (var e = [], t = 0; t < this.faces.length; t++) {
                            var n = this.faces[t];
                            0 === n.mark && e.push(n);
                        }
                        return this.faces = e, this;
                    },
                    nextVertexToAdd: function() {
                        if (!1 === this.assigned.isEmpty()) {
                            var e, t = 0, n = this.assigned.first().face, r = n.outside;
                            do {
                                var i = n.distanceToPoint(r.point);
                                i > t && (t = i, e = r), r = r.next;
                            } while (null !== r && r.face === n);
                            return e;
                        }
                    },
                    computeHorizon: function(e, t, n, r) {
                        var i;
                        this.deleteFaceVertices(n), n.mark = 1, i = null === t ? t = n.getEdge(0) : t.next;
                        do {
                            var o = i.twin, a = o.face;
                            0 === a.mark && (a.distanceToPoint(e) > this.tolerance ? this.computeHorizon(e, o, a, r) : r.push(i)), 
                            i = i.next;
                        } while (i !== t);
                        return this;
                    },
                    addAdjoiningFace: function(e, t) {
                        var n = s.create(e, t.tail(), t.head());
                        return this.faces.push(n), n.getEdge(-1).setTwin(t.twin), 
                        n.getEdge(0);
                    },
                    addNewFaces: function(e, t) {
                        this.newFaces = [];
                        for (var n = null, r = null, i = 0; i < t.length; i++) {
                            var o = this.addAdjoiningFace(e, t[i]);
                            null === n ? n = o : o.next.setTwin(r), this.newFaces.push(o.face), 
                            r = o;
                        }
                        return n.next.setTwin(r), this;
                    },
                    addVertexToHull: function(e) {
                        var t = [];
                        return this.unassigned.clear(), this.removeVertexFromFace(e, e.face), 
                        this.computeHorizon(e.point, null, e.face, t), this.addNewFaces(e, t), 
                        this.resolveUnassignedPoints(this.newFaces), this;
                    },
                    cleanup: function() {
                        return this.assigned.clear(), this.unassigned.clear(), this.newFaces = [], 
                        this;
                    },
                    compute: function() {
                        var e;
                        for (this.computeInitialHull(); void 0 !== (e = this.nextVertexToAdd()); ) this.addVertexToHull(e);
                        return this.reindexFaces(), this.cleanup(), this;
                    }
                }), Object.assign(s, {
                    create: function(e, t, n) {
                        var r = new s(), i = new u(e, r), o = new u(t, r), a = new u(n, r);
                        return i.next = a.prev = o, o.next = i.prev = a, a.next = o.prev = i, 
                        r.edge = i, r.compute();
                    }
                }), Object.assign(s.prototype, {
                    getEdge: function(e) {
                        for (var t = this.edge; e > 0; ) t = t.next, e--;
                        for (;e < 0; ) t = t.prev, e++;
                        return t;
                    },
                    compute: function() {
                        void 0 === i && (i = new t.Triangle());
                        var e = this.edge.tail(), n = this.edge.head(), r = this.edge.next.head();
                        return i.set(e.point, n.point, r.point), i.getNormal(this.normal), 
                        i.getMidpoint(this.midpoint), this.area = i.getArea(), this.constant = this.normal.dot(this.midpoint), 
                        this;
                    },
                    distanceToPoint: function(e) {
                        return this.normal.dot(e) - this.constant;
                    }
                }), Object.assign(u.prototype, {
                    head: function() {
                        return this.vertex;
                    },
                    tail: function() {
                        return this.prev ? this.prev.vertex : null;
                    },
                    length: function() {
                        var e = this.head(), t = this.tail();
                        return null !== t ? t.point.distanceTo(e.point) : -1;
                    },
                    lengthSquared: function() {
                        var e = this.head(), t = this.tail();
                        return null !== t ? t.point.distanceToSquared(e.point) : -1;
                    },
                    setTwin: function(e) {
                        return this.twin = e, e.twin = this, this;
                    }
                }), Object.assign(l.prototype, {
                    first: function() {
                        return this.head;
                    },
                    last: function() {
                        return this.tail;
                    },
                    clear: function() {
                        return this.head = this.tail = null, this;
                    },
                    insertBefore: function(e, t) {
                        return t.prev = e.prev, t.next = e, null === t.prev ? this.head = t : t.prev.next = t, 
                        e.prev = t, this;
                    },
                    insertAfter: function(e, t) {
                        return t.prev = e, t.next = e.next, null === t.next ? this.tail = t : t.next.prev = t, 
                        e.next = t, this;
                    },
                    append: function(e) {
                        return null === this.head ? this.head = e : this.tail.next = e, 
                        e.prev = this.tail, e.next = null, this.tail = e, this;
                    },
                    appendChain: function(e) {
                        for (null === this.head ? this.head = e : this.tail.next = e, 
                        e.prev = this.tail; null !== e.next; ) e = e.next;
                        return this.tail = e, this;
                    },
                    remove: function(e) {
                        return null === e.prev ? this.head = e.next : e.prev.next = e.next, 
                        null === e.next ? this.tail = e.prev : e.next.prev = e.prev, 
                        this;
                    },
                    removeSubList: function(e, t) {
                        return null === e.prev ? this.head = t.next : e.prev.next = t.next, 
                        null === t.next ? this.tail = e.prev : t.next.prev = e.prev, 
                        this;
                    },
                    isEmpty: function() {
                        return null === this.head;
                    }
                }), a;
            }(), r = Math.PI / 2, i = {
                BOX: "Box",
                CYLINDER: "Cylinder",
                SPHERE: "Sphere",
                HULL: "ConvexPolyhedron",
                MESH: "Trimesh"
            }, o = function(o, l) {
                var c;
                if ((l = l || {}).type === i.BOX) return s(o);
                if (l.type === i.CYLINDER) return function(n, i) {
                    var o = [ "x", "y", "z" ], a = i.cylinderAxis || "y", s = o.splice(o.indexOf(a), 1) && o, u = new t.Box3().setFromObject(n);
                    if (!isFinite(u.min.lengthSq())) return null;
                    var h = u.max[a] - u.min[a], l = .5 * Math.max(u.max[s[0]] - u.min[s[0]], u.max[s[1]] - u.min[s[1]]), c = new e.Cylinder(l, l, h, 12);
                    return c._type = e.Shape.types.CYLINDER, c.radiusTop = l, c.radiusBottom = l, 
                    c.height = h, c.numSegments = 12, c.orientation = new e.Quaternion(), 
                    c.orientation.setFromEuler("y" === a ? r : 0, "z" === a ? r : 0, 0, "XYZ").normalize(), 
                    c;
                }(o, l);
                if (l.type === i.SPHERE) return function(t, n) {
                    if (n.sphereRadius) return new e.Sphere(n.sphereRadius);
                    var r = u(t);
                    return r ? (r.computeBoundingSphere(), new e.Sphere(r.boundingSphere.radius)) : null;
                }(o, l);
                if (l.type === i.HULL) return function(r) {
                    var i = u(r);
                    if (!i || !i.vertices.length) return null;
                    for (var o = 0; o < i.vertices.length; o++) i.vertices[o].x += 1e-4 * (Math.random() - .5), 
                    i.vertices[o].y += 1e-4 * (Math.random() - .5), i.vertices[o].z += 1e-4 * (Math.random() - .5);
                    var a = new n().setFromObject(new t.Mesh(i)).faces, s = [], h = [];
                    for (o = 0; o < a.length; o++) {
                        var l = a[o], c = l.edge;
                        do {
                            var d = c.head().point;
                            s.push(new e.Vec3(d.x, d.y, d.z)), h.push(new e.Vec3(l.normal.x, l.normal.y, l.normal.z)), 
                            c = c.next;
                        } while (c !== l.edge);
                    }
                    return new e.ConvexPolyhedron({
                        vertices: s,
                        normals: h
                    });
                }(o);
                if (l.type === i.MESH) return (c = u(o)) ? function(t) {
                    var n = h(c);
                    if (!n.length) return null;
                    var r = Object.keys(n).map(Number);
                    return new e.Trimesh(n, r);
                }() : null;
                if (l.type) throw new Error('[CANNON.threeToCannon] Invalid type "%s".', l.type);
                if (!(c = u(o))) return null;
                switch (c.metadata ? c.metadata.type : c.type) {
                  case "BoxGeometry":
                  case "BoxBufferGeometry":
                    return a(c);

                  case "CylinderGeometry":
                  case "CylinderBufferGeometry":
                    return function(n) {
                        var r = n.metadata ? n.metadata.parameters : n.parameters, i = new e.Cylinder(r.radiusTop, r.radiusBottom, r.height, r.radialSegments);
                        return i._type = e.Shape.types.CYLINDER, i.radiusTop = r.radiusTop, 
                        i.radiusBottom = r.radiusBottom, i.height = r.height, i.numSegments = r.radialSegments, 
                        i.orientation = new e.Quaternion(), i.orientation.setFromEuler(t.Math.degToRad(-90), 0, 0, "XYZ").normalize(), 
                        i;
                    }(c);

                  case "PlaneGeometry":
                  case "PlaneBufferGeometry":
                    return function(t) {
                        t.computeBoundingBox();
                        var n = t.boundingBox;
                        return new e.Box(new e.Vec3((n.max.x - n.min.x) / 2 || .1, (n.max.y - n.min.y) / 2 || .1, (n.max.z - n.min.z) / 2 || .1));
                    }(c);

                  case "SphereGeometry":
                  case "SphereBufferGeometry":
                    return function(t) {
                        return new e.Sphere((t.metadata ? t.metadata.parameters : t.parameters).radius);
                    }(c);

                  case "TubeGeometry":
                  case "Geometry":
                  case "BufferGeometry":
                    return s(o);

                  default:
                    return console.warn('Unrecognized geometry: "%s". Using bounding box as shape.', c.type), 
                    a(c);
                }
            };
            function a(t) {
                if (!h(t).length) return null;
                t.computeBoundingBox();
                var n = t.boundingBox;
                return new e.Box(new e.Vec3((n.max.x - n.min.x) / 2, (n.max.y - n.min.y) / 2, (n.max.z - n.min.z) / 2));
            }
            function s(n) {
                var r = n.clone();
                r.quaternion.set(0, 0, 0, 1), r.updateMatrixWorld();
                var i = new t.Box3().setFromObject(r);
                if (!isFinite(i.min.lengthSq())) return null;
                var o = new e.Box(new e.Vec3((i.max.x - i.min.x) / 2, (i.max.y - i.min.y) / 2, (i.max.z - i.min.z) / 2)), a = i.translate(r.position.negate()).getCenter(new t.Vector3());
                return a.lengthSq() && (o.offset = a), o;
            }
            function u(e) {
                var n, r = function(e) {
                    var t = [];
                    return e.traverse(function(e) {
                        "Mesh" === e.type && t.push(e);
                    }), t;
                }(e), i = new t.Geometry(), o = new t.Geometry();
                if (0 === r.length) return null;
                if (1 === r.length) {
                    var a = new t.Vector3(), s = new t.Quaternion(), u = new t.Vector3();
                    return r[0].geometry.isBufferGeometry ? r[0].geometry.attributes.position && r[0].geometry.attributes.position.itemSize > 2 && i.fromBufferGeometry(r[0].geometry) : i = r[0].geometry.clone(), 
                    i.metadata = r[0].geometry.metadata, r[0].updateMatrixWorld(), 
                    r[0].matrixWorld.decompose(a, s, u), i.scale(u.x, u.y, u.z);
                }
                for (;n = r.pop(); ) if (n.updateMatrixWorld(), n.geometry.isBufferGeometry) {
                    if (n.geometry.attributes.position && n.geometry.attributes.position.itemSize > 2) {
                        var h = new t.Geometry();
                        h.fromBufferGeometry(n.geometry), o.merge(h, n.matrixWorld), 
                        h.dispose();
                    }
                } else o.merge(n.geometry, n.matrixWorld);
                var l = new t.Matrix4();
                return l.scale(e.scale), o.applyMatrix(l), o;
            }
            function h(e) {
                return e.attributes || (e = new t.BufferGeometry().fromGeometry(e)), 
                (e.attributes.position || {}).array || [];
            }
            o.Type = i, exports.threeToCannon = o;
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
        "cannon-es": 4
    } ],
    7: [ function(require, module, exports) {
        var bundleFn = arguments[3], sources = arguments[4], cache = arguments[5], stringify = JSON.stringify;
        module.exports = function(fn, options) {
            for (var wkey, cacheKeys = Object.keys(cache), i = 0, l = cacheKeys.length; i < l; i++) {
                var key = cacheKeys[i], exp = cache[key].exports;
                if (exp === fn || exp && exp.default === fn) {
                    wkey = key;
                    break;
                }
            }
            if (!wkey) {
                wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                var wcache = {};
                for (i = 0, l = cacheKeys.length; i < l; i++) {
                    wcache[key = cacheKeys[i]] = key;
                }
                sources[wkey] = [ Function([ "require", "module", "exports" ], "(" + fn + ")(self)"), wcache ];
            }
            var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16), scache = {};
            scache[wkey] = wkey, sources[skey] = [ Function([ "require" ], "var f = require(" + stringify(wkey) + ");(f.default ? f.default : f)(self);"), scache ];
            var workerSources = {};
            !function resolveSources(key) {
                workerSources[key] = !0;
                for (var depPath in sources[key][1]) {
                    var depKey = sources[key][1][depPath];
                    workerSources[depKey] || resolveSources(depKey);
                }
            }(skey);
            var src = "(" + bundleFn + ")({" + Object.keys(workerSources).map(function(key) {
                return stringify(key) + ":[" + sources[key][0] + "," + stringify(sources[key][1]) + "]";
            }).join(",") + "},{},[" + stringify(skey) + "])", URL = window.URL || window.webkitURL || window.mozURL || window.msURL, blob = new Blob([ src ], {
                type: "text/javascript"
            });
            if (options && options.bare) return blob;
            var workerUrl = URL.createObjectURL(blob), worker = new Worker(workerUrl);
            return worker.objectURL = workerUrl, worker;
        };
    }, {} ],
    8: [ function(require, module, exports) {
        const CONSTRAINT = require("../constants").CONSTRAINT;
        module.exports = AFRAME.registerComponent("ammo-constraint", {
            multiple: !0,
            schema: {
                type: {
                    default: CONSTRAINT.LOCK,
                    oneOf: [ CONSTRAINT.LOCK, CONSTRAINT.FIXED, CONSTRAINT.SPRING, CONSTRAINT.SLIDER, CONSTRAINT.HINGE, CONSTRAINT.CONE_TWIST, CONSTRAINT.POINT_TO_POINT ]
                },
                target: {
                    type: "selector"
                },
                pivot: {
                    type: "vec3"
                },
                targetPivot: {
                    type: "vec3"
                },
                axis: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 1
                    }
                },
                targetAxis: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 1
                    }
                }
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics, this.constraint = null;
            },
            remove: function() {
                this.constraint && (this.system.removeConstraint(this.constraint), 
                this.constraint = null);
            },
            update: function() {
                const el = this.el, data = this.data;
                this.remove(), el.body && data.target.body ? (this.constraint = this.createConstraint(), 
                this.system.addConstraint(this.constraint)) : (el.body ? data.target : el).addEventListener("body-loaded", this.update.bind(this, {}), {
                    once: !0
                });
            },
            createConstraint: function() {
                let constraint;
                const data = this.data, body = this.el.body, targetBody = data.target.body, bodyTransform = body.getCenterOfMassTransform().invert().op_mul(targetBody.getWorldTransform()), targetTransform = new Ammo.btTransform();
                switch (targetTransform.setIdentity(), data.type) {
                  case CONSTRAINT.LOCK:
                    {
                        constraint = new Ammo.btGeneric6DofConstraint(body, targetBody, bodyTransform, targetTransform, !0);
                        const zero = new Ammo.btVector3(0, 0, 0);
                        constraint.setLinearLowerLimit(zero), constraint.setLinearUpperLimit(zero), 
                        constraint.setAngularLowerLimit(zero), constraint.setAngularUpperLimit(zero), 
                        Ammo.destroy(zero);
                        break;
                    }

                  case CONSTRAINT.FIXED:
                    bodyTransform.setRotation(body.getWorldTransform().getRotation()), 
                    targetTransform.setRotation(targetBody.getWorldTransform().getRotation()), 
                    constraint = new Ammo.btFixedConstraint(body, targetBody, bodyTransform, targetTransform);
                    break;

                  case CONSTRAINT.SPRING:
                    constraint = new Ammo.btGeneric6DofSpringConstraint(body, targetBody, bodyTransform, targetTransform, !0);
                    break;

                  case CONSTRAINT.SLIDER:
                    (constraint = new Ammo.btSliderConstraint(body, targetBody, bodyTransform, targetTransform, !0)).setLowerLinLimit(-1), 
                    constraint.setUpperLinLimit(1);
                    break;

                  case CONSTRAINT.HINGE:
                    {
                        const pivot = new Ammo.btVector3(data.pivot.x, data.pivot.y, data.pivot.z), targetPivot = new Ammo.btVector3(data.targetPivot.x, data.targetPivot.y, data.targetPivot.z), axis = new Ammo.btVector3(data.axis.x, data.axis.y, data.axis.z), targetAxis = new Ammo.btVector3(data.targetAxis.x, data.targetAxis.y, data.targetAxis.z);
                        constraint = new Ammo.btHingeConstraint(body, targetBody, pivot, targetPivot, axis, targetAxis, !0), 
                        Ammo.destroy(pivot), Ammo.destroy(targetPivot), Ammo.destroy(axis), 
                        Ammo.destroy(targetAxis);
                        break;
                    }

                  case CONSTRAINT.CONE_TWIST:
                    {
                        const pivotTransform = new Ammo.btTransform();
                        pivotTransform.setIdentity(), pivotTransform.getOrigin().setValue(data.pivot.x, data.pivot.y, data.pivot.z);
                        const targetPivotTransform = new Ammo.btTransform();
                        targetPivotTransform.setIdentity(), targetPivotTransform.getOrigin().setValue(data.targetPivot.x, data.targetPivot.y, data.targetPivot.z), 
                        constraint = new Ammo.btConeTwistConstraint(body, targetBody, pivotTransform, targetPivotTransform), 
                        Ammo.destroy(pivotTransform), Ammo.destroy(targetPivotTransform);
                        break;
                    }

                  case CONSTRAINT.POINT_TO_POINT:
                    {
                        const pivot = new Ammo.btVector3(data.pivot.x, data.pivot.y, data.pivot.z), targetPivot = new Ammo.btVector3(data.targetPivot.x, data.targetPivot.y, data.targetPivot.z);
                        constraint = new Ammo.btPoint2PointConstraint(body, targetBody, pivot, targetPivot), 
                        Ammo.destroy(pivot), Ammo.destroy(targetPivot);
                        break;
                    }

                  default:
                    throw new Error("[constraint] Unexpected type: " + data.type);
                }
                return Ammo.destroy(bodyTransform), Ammo.destroy(targetTransform), 
                constraint;
            }
        });
    }, {
        "../constants": 19
    } ],
    9: [ function(require, module, exports) {
        require("ammo-debug-drawer");
        const threeToAmmo = require("three-to-ammo"), CONSTANTS = require("../../constants"), ACTIVATION_STATE = CONSTANTS.ACTIVATION_STATE, COLLISION_FLAG = CONSTANTS.COLLISION_FLAG, SHAPE = CONSTANTS.SHAPE, TYPE = CONSTANTS.TYPE, ACTIVATION_STATES = (CONSTANTS.FIT, 
        [ ACTIVATION_STATE.ACTIVE_TAG, ACTIVATION_STATE.ISLAND_SLEEPING, ACTIVATION_STATE.WANTS_DEACTIVATION, ACTIVATION_STATE.DISABLE_DEACTIVATION, ACTIVATION_STATE.DISABLE_SIMULATION ]), RIGID_BODY_FLAGS_NONE = 0, RIGID_BODY_FLAGS_DISABLE_WORLD_GRAVITY = 1;
        function almostEqualsVector3(epsilon, u, v) {
            return Math.abs(u.x - v.x) < epsilon && Math.abs(u.y - v.y) < epsilon && Math.abs(u.z - v.z) < epsilon;
        }
        function almostEqualsBtVector3(epsilon, u, v) {
            return Math.abs(u.x() - v.x()) < epsilon && Math.abs(u.y() - v.y()) < epsilon && Math.abs(u.z() - v.z()) < epsilon;
        }
        let AmmoBody = {
            schema: {
                loadedEvent: {
                    default: ""
                },
                mass: {
                    default: 1
                },
                gravity: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: -9.8,
                        z: 0
                    }
                },
                linearDamping: {
                    default: .01
                },
                angularDamping: {
                    default: .01
                },
                linearSleepingThreshold: {
                    default: 1.6
                },
                angularSleepingThreshold: {
                    default: 2.5
                },
                angularFactor: {
                    type: "vec3",
                    default: {
                        x: 1,
                        y: 1,
                        z: 1
                    }
                },
                activationState: {
                    default: ACTIVATION_STATE.ACTIVE_TAG,
                    oneOf: ACTIVATION_STATES
                },
                type: {
                    default: "dynamic",
                    oneOf: [ TYPE.STATIC, TYPE.DYNAMIC, TYPE.KINEMATIC ]
                },
                emitCollisionEvents: {
                    default: !1
                },
                disableCollision: {
                    default: !1
                },
                collisionFilterGroup: {
                    default: 1
                },
                collisionFilterMask: {
                    default: 1
                },
                scaleAutoUpdate: {
                    default: !0
                }
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics, this.shapeComponents = [], 
                "" === this.data.loadedEvent ? this.loadedEventFired = !0 : this.el.addEventListener(this.data.loadedEvent, () => {
                    this.loadedEventFired = !0;
                }, {
                    once: !0
                }), this.system.initialized && this.loadedEventFired && this.initBody();
            },
            initBody: function() {
                const pos = new THREE.Vector3(), quat = new THREE.Quaternion();
                new THREE.Box3();
                return function() {
                    const el = this.el, data = this.data;
                    this.localScaling = new Ammo.btVector3();
                    const obj = this.el.object3D;
                    obj.getWorldPosition(pos), obj.getWorldQuaternion(quat), this.prevScale = new THREE.Vector3(1, 1, 1), 
                    this.prevNumChildShapes = 0, this.msTransform = new Ammo.btTransform(), 
                    this.msTransform.setIdentity(), this.rotation = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w), 
                    this.msTransform.getOrigin().setValue(pos.x, pos.y, pos.z), 
                    this.msTransform.setRotation(this.rotation), this.motionState = new Ammo.btDefaultMotionState(this.msTransform), 
                    this.localInertia = new Ammo.btVector3(0, 0, 0), this.compoundShape = new Ammo.btCompoundShape(!0), 
                    this.rbInfo = new Ammo.btRigidBodyConstructionInfo(data.mass, this.motionState, this.compoundShape, this.localInertia), 
                    this.body = new Ammo.btRigidBody(this.rbInfo), this.body.setActivationState(ACTIVATION_STATES.indexOf(data.activationState) + 1), 
                    this.body.setSleepingThresholds(data.linearSleepingThreshold, data.angularSleepingThreshold), 
                    this.body.setDamping(data.linearDamping, data.angularDamping);
                    const angularFactor = new Ammo.btVector3(data.angularFactor.x, data.angularFactor.y, data.angularFactor.z);
                    this.body.setAngularFactor(angularFactor), Ammo.destroy(angularFactor);
                    const gravity = new Ammo.btVector3(data.gravity.x, data.gravity.y, data.gravity.z);
                    almostEqualsBtVector3(.001, gravity, this.system.driver.physicsWorld.getGravity()) || (this.body.setGravity(gravity), 
                    this.body.setFlags(RIGID_BODY_FLAGS_DISABLE_WORLD_GRAVITY)), 
                    Ammo.destroy(gravity), this.updateCollisionFlags(), this.el.body = this.body, 
                    this.body.el = el, this.isLoaded = !0, this.el.emit("body-loaded", {
                        body: this.el.body
                    }), this._addToSystem();
                };
            }(),
            tick: function() {
                this.system.initialized && !this.isLoaded && this.loadedEventFired && this.initBody();
            },
            _updateShapes: function() {
                const needsPolyhedralInitialization = [ SHAPE.HULL, SHAPE.HACD, SHAPE.VHACD ];
                return function() {
                    let updated = !1;
                    const obj = this.el.object3D;
                    if (this.data.scaleAutoUpdate && this.prevScale && !almostEqualsVector3(.001, obj.scale, this.prevScale) && (this.prevScale.copy(obj.scale), 
                    updated = !0, this.localScaling.setValue(this.prevScale.x, this.prevScale.y, this.prevScale.z), 
                    this.compoundShape.setLocalScaling(this.localScaling)), this.shapeComponentsChanged) {
                        this.shapeComponentsChanged = !1, updated = !0;
                        for (let i = 0; i < this.shapeComponents.length; i++) {
                            const shapeComponent = this.shapeComponents[i];
                            0 === shapeComponent.getShapes().length && this._createCollisionShape(shapeComponent);
                            const collisionShapes = shapeComponent.getShapes();
                            for (let j = 0; j < collisionShapes.length; j++) {
                                const collisionShape = collisionShapes[j];
                                collisionShape.added || (this.compoundShape.addChildShape(collisionShape.localTransform, collisionShape), 
                                collisionShape.added = !0);
                            }
                        }
                        this.data.type === TYPE.DYNAMIC && this.updateMass(), this.system.driver.updateBody(this.body);
                    }
                    if (this.system.debug && (updated || !this.polyHedralFeaturesInitialized)) {
                        for (let i = 0; i < this.shapeComponents.length; i++) {
                            const collisionShapes = this.shapeComponents[i].getShapes();
                            for (let j = 0; j < collisionShapes.length; j++) {
                                const collisionShape = collisionShapes[j];
                                -1 !== needsPolyhedralInitialization.indexOf(collisionShape.type) && collisionShape.initializePolyhedralFeatures(0);
                            }
                        }
                        this.polyHedralFeaturesInitialized = !0;
                    }
                };
            }(),
            _createCollisionShape: function(shapeComponent) {
                const data = shapeComponent.data, collisionShapes = threeToAmmo.createCollisionShapes(shapeComponent.getMesh(), data);
                shapeComponent.addShapes(collisionShapes);
            },
            play: function() {
                this.isLoaded && this._addToSystem();
            },
            _addToSystem: function() {
                this.addedToSystem || (this.system.addBody(this.body, this.data.collisionFilterGroup, this.data.collisionFilterMask), 
                this.data.emitCollisionEvents && this.system.driver.addEventListener(this.body), 
                this.system.addComponent(this), this.addedToSystem = !0);
            },
            pause: function() {
                this.addedToSystem && (this.system.removeComponent(this), this.system.removeBody(this.body), 
                this.addedToSystem = !1);
            },
            update: function(prevData) {
                if (this.isLoaded) {
                    if (!this.hasUpdated) return void (this.hasUpdated = !0);
                    const data = this.data;
                    if (prevData.type === data.type && prevData.disableCollision === data.disableCollision || this.updateCollisionFlags(), 
                    prevData.activationState !== data.activationState && (this.body.forceActivationState(ACTIVATION_STATES.indexOf(data.activationState) + 1), 
                    data.activationState === ACTIVATION_STATE.ACTIVE_TAG && this.body.activate(!0)), 
                    prevData.collisionFilterGroup !== data.collisionFilterGroup || prevData.collisionFilterMask !== data.collisionFilterMask) {
                        const broadphaseProxy = this.body.getBroadphaseProxy();
                        broadphaseProxy.set_m_collisionFilterGroup(data.collisionFilterGroup), 
                        broadphaseProxy.set_m_collisionFilterMask(data.collisionFilterMask), 
                        this.system.driver.broadphase.getOverlappingPairCache().removeOverlappingPairsContainingProxy(broadphaseProxy, this.system.driver.dispatcher);
                    }
                    if (prevData.linearDamping == data.linearDamping && prevData.angularDamping == data.angularDamping || this.body.setDamping(data.linearDamping, data.angularDamping), 
                    !almostEqualsVector3(.001, prevData.gravity, data.gravity)) {
                        const gravity = new Ammo.btVector3(data.gravity.x, data.gravity.y, data.gravity.z);
                        almostEqualsBtVector3(.001, gravity, this.system.driver.physicsWorld.getGravity()) ? this.body.setFlags(RIGID_BODY_FLAGS_NONE) : this.body.setFlags(RIGID_BODY_FLAGS_DISABLE_WORLD_GRAVITY), 
                        this.body.setGravity(gravity), Ammo.destroy(gravity);
                    }
                    if (prevData.linearSleepingThreshold == data.linearSleepingThreshold && prevData.angularSleepingThreshold == data.angularSleepingThreshold || this.body.setSleepingThresholds(data.linearSleepingThreshold, data.angularSleepingThreshold), 
                    !almostEqualsVector3(.001, prevData.angularFactor, data.angularFactor)) {
                        const angularFactor = new Ammo.btVector3(data.angularFactor.x, data.angularFactor.y, data.angularFactor.z);
                        this.body.setAngularFactor(angularFactor), Ammo.destroy(angularFactor);
                    }
                }
            },
            remove: function() {
                this.triMesh && Ammo.destroy(this.triMesh), this.localScaling && Ammo.destroy(this.localScaling), 
                this.compoundShape && Ammo.destroy(this.compoundShape), this.body && (Ammo.destroy(this.body), 
                delete this.body), Ammo.destroy(this.rbInfo), Ammo.destroy(this.msTransform), 
                Ammo.destroy(this.motionState), Ammo.destroy(this.localInertia), 
                Ammo.destroy(this.rotation);
            },
            beforeStep: function() {
                this._updateShapes(), this.data.type !== TYPE.DYNAMIC && this.syncToPhysics();
            },
            step: function() {
                this.data.type === TYPE.DYNAMIC && this.syncFromPhysics();
            },
            syncToPhysics: function() {
                const q = new THREE.Quaternion(), v = new THREE.Vector3(), q2 = new THREE.Vector3(), v2 = new THREE.Vector3();
                return function() {
                    const el = this.el, parentEl = el.parentEl;
                    if (!this.body) return;
                    this.motionState.getWorldTransform(this.msTransform), parentEl.isScene ? (v.copy(el.object3D.position), 
                    q.copy(el.object3D.quaternion)) : (el.object3D.getWorldPosition(v), 
                    el.object3D.getWorldQuaternion(q));
                    const position = this.msTransform.getOrigin();
                    v2.set(position.x(), position.y(), position.z());
                    const quaternion = this.msTransform.getRotation();
                    q2.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w()), 
                    almostEqualsVector3(.001, v, v2) && function(epsilon, u, v) {
                        return Math.abs(u.x - v.x) < epsilon && Math.abs(u.y - v.y) < epsilon && Math.abs(u.z - v.z) < epsilon && Math.abs(u.w - v.w) < epsilon || Math.abs(u.x + v.x) < epsilon && Math.abs(u.y + v.y) < epsilon && Math.abs(u.z + v.z) < epsilon && Math.abs(u.w + v.w) < epsilon;
                    }(.001, q, q2) || (this.body.isActive() || this.body.activate(!0), 
                    this.msTransform.getOrigin().setValue(v.x, v.y, v.z), this.rotation.setValue(q.x, q.y, q.z, q.w), 
                    this.msTransform.setRotation(this.rotation), this.motionState.setWorldTransform(this.msTransform), 
                    this.data.type === TYPE.STATIC && this.body.setCenterOfMassTransform(this.msTransform));
                };
            }(),
            syncFromPhysics: function() {
                const v = new THREE.Vector3(), q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion();
                return function() {
                    this.motionState.getWorldTransform(this.msTransform);
                    const position = this.msTransform.getOrigin(), quaternion = this.msTransform.getRotation(), el = this.el, parentEl = el.parentEl;
                    this.body && parentEl && (parentEl.isScene ? (el.object3D.position.set(position.x(), position.y(), position.z()), 
                    el.object3D.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w())) : (q1.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w()), 
                    parentEl.object3D.getWorldQuaternion(q2), q1.multiply(q2.invert()), 
                    el.object3D.quaternion.copy(q1), v.set(position.x(), position.y(), position.z()), 
                    parentEl.object3D.worldToLocal(v), el.object3D.position.copy(v)));
                };
            }(),
            addShapeComponent: function(shapeComponent) {
                shapeComponent.data.type !== SHAPE.MESH || this.data.type === TYPE.STATIC ? (this.shapeComponents.push(shapeComponent), 
                this.shapeComponentsChanged = !0) : console.warn("non-static mesh colliders not supported");
            },
            removeShapeComponent: function(shapeComponent) {
                const index = this.shapeComponents.indexOf(shapeComponent);
                if (this.compoundShape && -1 !== index && this.body) {
                    const shapes = shapeComponent.getShapes();
                    for (var i = 0; i < shapes.length; i++) this.compoundShape.removeChildShape(shapes[i]);
                    this.shapeComponentsChanged = !0, this.shapeComponents.splice(index, 1);
                }
            },
            updateMass: function() {
                const shape = this.body.getCollisionShape(), mass = this.data.type === TYPE.DYNAMIC ? this.data.mass : 0;
                shape.calculateLocalInertia(mass, this.localInertia), this.body.setMassProps(mass, this.localInertia), 
                this.body.updateInertiaTensor();
            },
            updateCollisionFlags: function() {
                let flags = this.data.disableCollision ? 4 : 0;
                switch (this.data.type) {
                  case TYPE.STATIC:
                    flags |= COLLISION_FLAG.STATIC_OBJECT;
                    break;

                  case TYPE.KINEMATIC:
                    flags |= COLLISION_FLAG.KINEMATIC_OBJECT;
                    break;

                  default:
                    this.body.applyGravity();
                }
                this.body.setCollisionFlags(flags), this.updateMass(), this.system.driver.updateBody(this.body);
            },
            getVelocity: function() {
                return this.body.getLinearVelocity();
            }
        };
        module.exports.definition = AmmoBody, module.exports.Component = AFRAME.registerComponent("ammo-body", AmmoBody);
    }, {
        "../../constants": 19,
        "ammo-debug-drawer": 3,
        "three-to-ammo": 5
    } ],
    10: [ function(require, module, exports) {
        var CANNON = require("cannon-es"), mesh2shape = require("three-to-cannon").threeToCannon;
        require("../../../lib/CANNON-shape2mesh");
        var q, v, Body = {
            dependencies: [ "velocity" ],
            schema: {
                mass: {
                    default: 5,
                    if: {
                        type: "dynamic"
                    }
                },
                linearDamping: {
                    default: .01,
                    if: {
                        type: "dynamic"
                    }
                },
                angularDamping: {
                    default: .01,
                    if: {
                        type: "dynamic"
                    }
                },
                shape: {
                    default: "auto",
                    oneOf: [ "auto", "box", "cylinder", "sphere", "hull", "mesh", "none" ]
                },
                cylinderAxis: {
                    default: "y",
                    oneOf: [ "x", "y", "z" ]
                },
                sphereRadius: {
                    default: NaN
                },
                type: {
                    default: "dynamic",
                    oneOf: [ "static", "dynamic" ]
                }
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics, this.el.sceneEl.hasLoaded ? this.initBody() : this.el.sceneEl.addEventListener("loaded", this.initBody.bind(this));
            },
            initBody: function() {
                var el = this.el, data = this.data, obj = this.el.object3D, pos = obj.position, quat = obj.quaternion;
                if (this.body = new CANNON.Body({
                    mass: "static" === data.type ? 0 : data.mass || 0,
                    material: this.system.getMaterial("defaultMaterial"),
                    position: new CANNON.Vec3(pos.x, pos.y, pos.z),
                    quaternion: new CANNON.Quaternion(quat.x, quat.y, quat.z, quat.w),
                    linearDamping: data.linearDamping,
                    angularDamping: data.angularDamping,
                    type: "dynamic" === data.type ? CANNON.Body.DYNAMIC : CANNON.Body.STATIC
                }), this.el.object3D.updateMatrixWorld(!0), "none" !== data.shape) {
                    var options = "auto" === data.shape ? void 0 : AFRAME.utils.extend({}, this.data, {
                        type: mesh2shape.Type[data.shape.toUpperCase()]
                    }), shape = mesh2shape(this.el.object3D, options);
                    if (!shape) return void el.addEventListener("object3dset", this.initBody.bind(this));
                    this.body.addShape(shape, shape.offset, shape.orientation), 
                    this.system.debug && (this.shouldUpdateWireframe = !0), this.isLoaded = !0;
                }
                this.el.body = this.body, this.body.el = el, this.isPlaying && this._play(), 
                this.isLoaded && this.el.emit("body-loaded", {
                    body: this.el.body
                });
            },
            addShape: function(shape, offset, orientation) {
                "none" === this.data.shape ? shape ? this.body ? (this.body.addShape(shape, offset, orientation), 
                this.system.debug && (this.shouldUpdateWireframe = !0), this.shouldUpdateBody = !0) : console.warn("shape cannot be added before body is loaded") : console.warn("shape cannot be null") : console.warn("shape can only be added if shape property is none");
            },
            tick: function() {
                this.shouldUpdateBody && (this.isLoaded = !0, this._play(), this.el.emit("body-loaded", {
                    body: this.el.body
                }), this.shouldUpdateBody = !1), this.shouldUpdateWireframe && (this.createWireframe(this.body), 
                this.shouldUpdateWireframe = !1);
            },
            play: function() {
                this.isLoaded && this._play();
            },
            _play: function() {
                this.syncToPhysics();
                this.el.emit("body-played", {body: this.el.body});
                this.system.addComponent(this);
                this.system.addBody(this.body);
                this.wireframe && this.el.sceneEl.object3D.add(this.wireframe);
            },
            pause: function() {
                this.isLoaded && this._pause();
            },
            _pause: function() {
                this.system.removeComponent(this), this.body && this.system.removeBody(this.body), 
                this.wireframe && this.el.sceneEl.object3D.remove(this.wireframe);
            },
            update: function(prevData) {
                if (this.body) {
                    var data = this.data;
                    void 0 != prevData.type && data.type != prevData.type && (this.body.type = "dynamic" === data.type ? CANNON.Body.DYNAMIC : CANNON.Body.STATIC), 
                    this.body.mass = data.mass || 0, "dynamic" === data.type && (this.body.linearDamping = data.linearDamping, 
                    this.body.angularDamping = data.angularDamping), data.mass !== prevData.mass && this.body.updateMassProperties(), 
                    this.body.updateProperties && this.body.updateProperties();
                }
            },
            remove: function() {
                this.body && (delete this.body.el, delete this.body), delete this.el.body, 
                delete this.wireframe;
            },
            beforeStep: function() {
                0 === this.body.mass && this.syncToPhysics();
            },
            step: function() {
                0 !== this.body.mass && this.syncFromPhysics();
            },
            createWireframe: function(body) {
                var offset, mesh;
                this.wireframe && (this.el.sceneEl.object3D.remove(this.wireframe), 
                delete this.wireframe), this.wireframe = new THREE.Object3D(), this.el.sceneEl.object3D.add(this.wireframe);
                for (var orientation = new THREE.Quaternion(), i = 0; i < this.body.shapes.length; i++) {
                    offset = this.body.shapeOffsets[i], orientation.copy(this.body.shapeOrientations[i]), 
                    mesh = CANNON.shape2mesh(this.body).children[i];
                    var wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({
                        color: 16711680
                    }));
                    offset && wireframe.position.copy(offset), orientation && wireframe.quaternion.copy(orientation), 
                    this.wireframe.add(wireframe);
                }
                this.syncWireframe();
            },
            syncWireframe: function() {
                var offset, wireframe = this.wireframe;
                this.wireframe && (wireframe.quaternion.copy(this.body.quaternion), 
                wireframe.orientation && wireframe.quaternion.multiply(wireframe.orientation), 
                wireframe.position.copy(this.body.position), wireframe.offset && (offset = wireframe.offset.clone().applyQuaternion(wireframe.quaternion), 
                wireframe.position.add(offset)), wireframe.updateMatrix());
            },
            syncToPhysics: (q = new THREE.Quaternion(), v = new THREE.Vector3(), 
            function() {
                var el = this.el, parentEl = el.parentEl, body = this.body;
                body && (el.components.velocity && body.velocity.copy(el.getAttribute("velocity")), 
                parentEl.isScene ? (body.quaternion.copy(el.object3D.quaternion), 
                body.position.copy(el.object3D.position)) : (el.object3D.getWorldQuaternion(q), 
                body.quaternion.copy(q), el.object3D.getWorldPosition(v), body.position.copy(v)), 
                this.body.updateProperties && this.body.updateProperties(), this.wireframe && this.syncWireframe());
            }),
            syncFromPhysics: function() {
                var v = new THREE.Vector3(), q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion();
                return function() {
                    var el = this.el, parentEl = el.parentEl, body = this.body;
                    body && parentEl && (parentEl.isScene ? (el.object3D.quaternion.copy(body.quaternion), 
                    el.object3D.position.copy(body.position)) : (q1.copy(body.quaternion), 
                    parentEl.object3D.getWorldQuaternion(q2), q1.premultiply(q2.invert()), 
                    el.object3D.quaternion.copy(q1), v.copy(body.position), parentEl.object3D.worldToLocal(v), 
                    el.object3D.position.copy(v)), this.wireframe && this.syncWireframe());
                };
            }()
        };
        module.exports.definition = Body, module.exports.Component = AFRAME.registerComponent("body", Body);
    }, {
        "../../../lib/CANNON-shape2mesh": 2,
        "cannon-es": 4,
        "three-to-cannon": 6
    } ],
    11: [ function(require, module, exports) {
        var Body = require("./body"), DynamicBody = AFRAME.utils.extend({}, Body.definition);
        module.exports = AFRAME.registerComponent("dynamic-body", DynamicBody);
    }, {
        "./body": 10
    } ],
    12: [ function(require, module, exports) {
        var Body = require("./body"), StaticBody = AFRAME.utils.extend({}, Body.definition);
        StaticBody.schema = AFRAME.utils.extend({}, Body.definition.schema, {
            type: {
                default: "static",
                oneOf: [ "static", "dynamic" ]
            },
            mass: {
                default: 0
            }
        }), module.exports = AFRAME.registerComponent("static-body", StaticBody);
    }, {
        "./body": 10
    } ],
    13: [ function(require, module, exports) {
        var CANNON = require("cannon-es");
        module.exports = AFRAME.registerComponent("constraint", {
            multiple: !0,
            schema: {
                type: {
                    default: "lock",
                    oneOf: [ "coneTwist", "distance", "hinge", "lock", "pointToPoint" ]
                },
                target: {
                    type: "selector"
                },
                maxForce: {
                    default: 1e6,
                    min: 0
                },
                collideConnected: {
                    default: !0
                },
                wakeUpBodies: {
                    default: !0
                },
                distance: {
                    default: 0,
                    min: 0
                },
                pivot: {
                    type: "vec3"
                },
                targetPivot: {
                    type: "vec3"
                },
                axis: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 1
                    }
                },
                targetAxis: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 1
                    }
                }
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics, this.constraint = null;
            },
            remove: function() {
                this.constraint && (this.system.removeConstraint(this.constraint), 
                this.constraint = null);
            },
            update: function() {
                var el = this.el, data = this.data;
                this.remove(), el.body && data.target.body ? (this.constraint = this.createConstraint(), 
                this.system.addConstraint(this.constraint)) : (el.body ? data.target : el).addEventListener("body-loaded", this.update.bind(this, {}));
            },
            createConstraint: function() {
                var constraint, data = this.data, pivot = new CANNON.Vec3(data.pivot.x, data.pivot.y, data.pivot.z), targetPivot = new CANNON.Vec3(data.targetPivot.x, data.targetPivot.y, data.targetPivot.z), axis = new CANNON.Vec3(data.axis.x, data.axis.y, data.axis.z), targetAxis = new CANNON.Vec3(data.targetAxis.x, data.targetAxis.y, data.targetAxis.z);
                switch (data.type) {
                  case "lock":
                    (constraint = new CANNON.LockConstraint(this.el.body, data.target.body, {
                        maxForce: data.maxForce
                    })).type = "LockConstraint";
                    break;

                  case "distance":
                    (constraint = new CANNON.DistanceConstraint(this.el.body, data.target.body, data.distance, data.maxForce)).type = "DistanceConstraint";
                    break;

                  case "hinge":
                    (constraint = new CANNON.HingeConstraint(this.el.body, data.target.body, {
                        pivotA: pivot,
                        pivotB: targetPivot,
                        axisA: axis,
                        axisB: targetAxis,
                        maxForce: data.maxForce
                    })).type = "HingeConstraint";
                    break;

                  case "coneTwist":
                    (constraint = new CANNON.ConeTwistConstraint(this.el.body, data.target.body, {
                        pivotA: pivot,
                        pivotB: targetPivot,
                        axisA: axis,
                        axisB: targetAxis,
                        maxForce: data.maxForce
                    })).type = "ConeTwistConstraint";
                    break;

                  case "pointToPoint":
                    (constraint = new CANNON.PointToPointConstraint(this.el.body, pivot, data.target.body, targetPivot, data.maxForce)).type = "PointToPointConstraint";
                    break;

                  default:
                    throw new Error("[constraint] Unexpected type: " + data.type);
                }
                return constraint.collideConnected = data.collideConnected, constraint;
            }
        });
    }, {
        "cannon-es": 4
    } ],
    14: [ function(require, module, exports) {
        module.exports = {
            velocity: require("./velocity"),
            registerAll: function(AFRAME) {
                this._registered || ((AFRAME = AFRAME || window.AFRAME).components.velocity || AFRAME.registerComponent("velocity", this.velocity), 
                this._registered = !0);
            }
        };
    }, {
        "./velocity": 15
    } ],
    15: [ function(require, module, exports) {
        module.exports = AFRAME.registerComponent("velocity", {
            schema: {
                type: "vec3"
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics, this.system && this.system.addComponent(this);
            },
            remove: function() {
                this.system && this.system.removeComponent(this);
            },
            tick: function(t, dt) {
                dt && (this.system || this.afterStep(t, dt));
            },
            afterStep: function(t, dt) {
                if (dt) {
                    var physics = this.el.sceneEl.systems.physics || {
                        data: {
                            maxInterval: 1 / 60
                        }
                    }, velocity = this.el.getAttribute("velocity") || {
                        x: 0,
                        y: 0,
                        z: 0
                    }, position = this.el.object3D.position || {
                        x: 0,
                        y: 0,
                        z: 0
                    };
                    dt = Math.min(dt, 1e3 * physics.data.maxInterval), this.el.object3D.position.set(position.x + velocity.x * dt / 1e3, position.y + velocity.y * dt / 1e3, position.z + velocity.z * dt / 1e3);
                }
            }
        });
    }, {} ],
    16: [ function(require, module, exports) {
        require("three-to-ammo");
        const CONSTANTS = require("../../constants"), SHAPE = CONSTANTS.SHAPE, FIT = CONSTANTS.FIT;
        var AmmoShape = {
            schema: {
                type: {
                    default: SHAPE.HULL,
                    oneOf: [ SHAPE.BOX, SHAPE.CYLINDER, SHAPE.SPHERE, SHAPE.CAPSULE, SHAPE.CONE, SHAPE.HULL, SHAPE.HACD, SHAPE.VHACD, SHAPE.MESH, SHAPE.HEIGHTFIELD ]
                },
                fit: {
                    default: FIT.ALL,
                    oneOf: [ FIT.ALL, FIT.MANUAL ]
                },
                halfExtents: {
                    type: "vec3",
                    default: {
                        x: 1,
                        y: 1,
                        z: 1
                    }
                },
                minHalfExtent: {
                    default: 0
                },
                maxHalfExtent: {
                    default: Number.POSITIVE_INFINITY
                },
                sphereRadius: {
                    default: NaN
                },
                cylinderAxis: {
                    default: "y",
                    oneOf: [ "x", "y", "z" ]
                },
                margin: {
                    default: .01
                },
                offset: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                },
                orientation: {
                    type: "vec4",
                    default: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 1
                    }
                },
                heightfieldData: {
                    default: []
                },
                heightfieldDistance: {
                    default: 1
                },
                includeInvisible: {
                    default: !1
                }
            },
            multiple: !0,
            init: function() {
                this.system = this.el.sceneEl.systems.physics, this.collisionShapes = [];
                let bodyEl = this.el;
                for (this.body = bodyEl.components["ammo-body"] || null; !this.body && bodyEl.parentNode != this.el.sceneEl; ) (bodyEl = bodyEl.parentNode).components["ammo-body"] && (this.body = bodyEl.components["ammo-body"]);
                if (this.body) {
                    if (this.data.fit !== FIT.MANUAL) {
                        if (!this.el.object3DMap.mesh) return void console.error("Cannot use FIT.ALL without object3DMap.mesh");
                        this.mesh = this.el.object3DMap.mesh;
                    }
                    this.body.addShapeComponent(this);
                } else console.warn("body not found");
            },
            getMesh: function() {
                return this.mesh || null;
            },
            addShapes: function(collisionShapes) {
                this.collisionShapes = collisionShapes;
            },
            getShapes: function() {
                return this.collisionShapes;
            },
            remove: function() {
                if (this.body) for (this.body.removeShapeComponent(this); this.collisionShapes.length > 0; ) {
                    const collisionShape = this.collisionShapes.pop();
                    collisionShape.destroy(), Ammo.destroy(collisionShape.localTransform);
                }
            }
        };
        module.exports.definition = AmmoShape, module.exports.Component = AFRAME.registerComponent("ammo-shape", AmmoShape);
    }, {
        "../../constants": 19,
        "three-to-ammo": 5
    } ],
    17: [ function(require, module, exports) {
        var CANNON = require("cannon-es"), Shape = {
            schema: {
                shape: {
                    default: "box",
                    oneOf: [ "box", "sphere", "cylinder" ]
                },
                offset: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                },
                orientation: {
                    type: "vec4",
                    default: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 1
                    }
                },
                radius: {
                    type: "number",
                    default: 1,
                    if: {
                        shape: [ "sphere" ]
                    }
                },
                halfExtents: {
                    type: "vec3",
                    default: {
                        x: .5,
                        y: .5,
                        z: .5
                    },
                    if: {
                        shape: [ "box" ]
                    }
                },
                radiusTop: {
                    type: "number",
                    default: 1,
                    if: {
                        shape: [ "cylinder" ]
                    }
                },
                radiusBottom: {
                    type: "number",
                    default: 1,
                    if: {
                        shape: [ "cylinder" ]
                    }
                },
                height: {
                    type: "number",
                    default: 1,
                    if: {
                        shape: [ "cylinder" ]
                    }
                },
                numSegments: {
                    type: "int",
                    default: 8,
                    if: {
                        shape: [ "cylinder" ]
                    }
                }
            },
            multiple: !0,
            init: function() {
                this.el.sceneEl.hasLoaded ? this.initShape() : this.el.sceneEl.addEventListener("loaded", this.initShape.bind(this));
            },
            initShape: function() {
                this.bodyEl = this.el;
                for (var bodyType = this._findType(this.bodyEl), data = this.data; !bodyType && this.bodyEl.parentNode != this.el.sceneEl; ) this.bodyEl = this.bodyEl.parentNode, 
                bodyType = this._findType(this.bodyEl);
                if (bodyType) {
                    var shape, offset, orientation, scale = new THREE.Vector3();
                    switch (this.bodyEl.object3D.getWorldScale(scale), data.hasOwnProperty("offset") && (offset = new CANNON.Vec3(data.offset.x * scale.x, data.offset.y * scale.y, data.offset.z * scale.z)), 
                    data.hasOwnProperty("orientation") && (orientation = new CANNON.Quaternion()).copy(data.orientation), 
                    data.shape) {
                      case "sphere":
                        shape = new CANNON.Sphere(data.radius * scale.x);
                        break;

                      case "box":
                        var halfExtents = new CANNON.Vec3(data.halfExtents.x * scale.x, data.halfExtents.y * scale.y, data.halfExtents.z * scale.z);
                        shape = new CANNON.Box(halfExtents);
                        break;

                      case "cylinder":
                        shape = new CANNON.Cylinder(data.radiusTop * scale.x, data.radiusBottom * scale.x, data.height * scale.y, data.numSegments);
                        var quat = new CANNON.Quaternion();
                        quat.setFromEuler(90 * THREE.Math.DEG2RAD, 0, 0, "XYZ").normalize(), 
                        orientation.mult(quat, orientation);
                        break;

                      default:
                        return void console.warn(data.shape + " shape not supported");
                    }
                    this.bodyEl.body ? this.bodyEl.components[bodyType].addShape(shape, offset, orientation) : this.bodyEl.addEventListener("body-loaded", function() {
                        this.bodyEl.components[bodyType].addShape(shape, offset, orientation);
                    }, {
                        once: !0
                    });
                } else console.warn("body not found");
            },
            _findType: function(el) {
                return el.hasAttribute("body") ? "body" : el.hasAttribute("dynamic-body") ? "dynamic-body" : el.hasAttribute("static-body") ? "static-body" : null;
            },
            remove: function() {
                this.bodyEl.parentNode && console.warn("removing shape component not currently supported");
            }
        };
        module.exports.definition = Shape, module.exports.Component = AFRAME.registerComponent("shape", Shape);
    }, {
        "cannon-es": 4
    } ],
    18: [ function(require, module, exports) {
        var CANNON = require("cannon-es");
        module.exports = AFRAME.registerComponent("spring", {
            multiple: !0,
            schema: {
                target: {
                    type: "selector"
                },
                restLength: {
                    default: 1,
                    min: 0
                },
                stiffness: {
                    default: 100,
                    min: 0
                },
                damping: {
                    default: 1,
                    min: 0
                },
                localAnchorA: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                },
                localAnchorB: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                }
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics, this.system.addComponent(this), 
                this.isActive = !0, this.spring = null;
            },
            update: function(oldData) {
                var el = this.el, data = this.data;
                data.target ? el.body && data.target.body ? (this.createSpring(), 
                this.updateSpring(oldData)) : (el.body ? data.target : el).addEventListener("body-loaded", this.update.bind(this, {})) : console.warn("Spring: invalid target specified.");
            },
            updateSpring: function(oldData) {
                if (this.spring) {
                    var data = this.data, spring = this.spring;
                    Object.keys(data).forEach(function(attr) {
                        if (data[attr] !== oldData[attr]) {
                            if ("target" === attr) return void (spring.bodyB = data.target.body);
                            spring[attr] = data[attr];
                        }
                    });
                } else console.warn("Spring: Component attempted to change spring before its created. No changes made.");
            },
            createSpring: function() {
                this.spring || (this.spring = new CANNON.Spring(this.el.body));
            },
            step: function(t, dt) {
                return this.spring && this.isActive ? this.spring.applyForce() : void 0;
            },
            play: function() {
                this.isActive = !0;
            },
            pause: function() {
                this.isActive = !1;
            },
            remove: function() {
                this.spring && delete this.spring, this.spring = null;
            }
        });
    }, {
        "cannon-es": 4
    } ],
    19: [ function(require, module, exports) {
        module.exports = {
            GRAVITY: -9.8,
            MAX_INTERVAL: 4 / 60,
            ITERATIONS: 10,
            CONTACT_MATERIAL: {
                friction: .01,
                restitution: .3,
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3,
                frictionEquationStiffness: 1e8,
                frictionEquationRegularization: 3
            },
            ACTIVATION_STATE: {
                ACTIVE_TAG: "active",
                ISLAND_SLEEPING: "islandSleeping",
                WANTS_DEACTIVATION: "wantsDeactivation",
                DISABLE_DEACTIVATION: "disableDeactivation",
                DISABLE_SIMULATION: "disableSimulation"
            },
            COLLISION_FLAG: {
                STATIC_OBJECT: 1,
                KINEMATIC_OBJECT: 2,
                NO_CONTACT_RESPONSE: 4,
                CUSTOM_MATERIAL_CALLBACK: 8,
                CHARACTER_OBJECT: 16,
                DISABLE_VISUALIZE_OBJECT: 32,
                DISABLE_SPU_COLLISION_PROCESSING: 64
            },
            TYPE: {
                STATIC: "static",
                DYNAMIC: "dynamic",
                KINEMATIC: "kinematic"
            },
            SHAPE: {
                BOX: "box",
                CYLINDER: "cylinder",
                SPHERE: "sphere",
                CAPSULE: "capsule",
                CONE: "cone",
                HULL: "hull",
                HACD: "hacd",
                VHACD: "vhacd",
                MESH: "mesh",
                HEIGHTFIELD: "heightfield"
            },
            FIT: {
                ALL: "all",
                MANUAL: "manual"
            },
            CONSTRAINT: {
                LOCK: "lock",
                FIXED: "fixed",
                SPRING: "spring",
                SLIDER: "slider",
                HINGE: "hinge",
                CONE_TWIST: "coneTwist",
                POINT_TO_POINT: "pointToPoint"
            }
        };
    }, {} ],
    20: [ function(require, module, exports) {
        const Driver = require("./driver");
        "undefined" != typeof window && (window.AmmoModule = window.Ammo, window.Ammo = null);
        function AmmoDriver() {
            this.collisionConfiguration = null, this.dispatcher = null, this.broadphase = null, 
            this.solver = null, this.physicsWorld = null, this.debugDrawer = null, 
            this.els = new Map(), this.eventListeners = [], this.collisions = new Map(), 
            this.collisionKeys = [], this.currentCollisions = new Map();
        }
        AmmoDriver.prototype = new Driver(), AmmoDriver.prototype.constructor = AmmoDriver, 
        module.exports = AmmoDriver, AmmoDriver.prototype.init = function(worldConfig) {
            return new Promise(resolve => {
                AmmoModule().then(result => {
                    Ammo = result, this.epsilon = worldConfig.epsilon || 1e-5, this.debugDrawMode = worldConfig.debugDrawMode || THREE.AmmoDebugConstants.NoDebug, 
                    this.maxSubSteps = worldConfig.maxSubSteps || 4, this.fixedTimeStep = worldConfig.fixedTimeStep || 1 / 60, 
                    this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(), 
                    this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration), 
                    this.broadphase = new Ammo.btDbvtBroadphase(), this.solver = new Ammo.btSequentialImpulseConstraintSolver(), 
                    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration), 
                    this.physicsWorld.setForceUpdateAllAabbs(!1), this.physicsWorld.setGravity(new Ammo.btVector3(0, worldConfig.hasOwnProperty("gravity") ? worldConfig.gravity : -9.8, 0)), 
                    this.physicsWorld.getSolverInfo().set_m_numIterations(worldConfig.solverIterations), 
                    resolve();
                });
            });
        }, AmmoDriver.prototype.addBody = function(body, group, mask) {
            this.physicsWorld.addRigidBody(body, group, mask), this.els.set(Ammo.getPointer(body), body.el);
        }, AmmoDriver.prototype.removeBody = function(body) {
            this.physicsWorld.removeRigidBody(body), this.removeEventListener(body);
            const bodyptr = Ammo.getPointer(body);
            this.els.delete(bodyptr), this.collisions.delete(bodyptr), this.collisionKeys.splice(this.collisionKeys.indexOf(bodyptr), 1), 
            this.currentCollisions.delete(bodyptr);
        }, AmmoDriver.prototype.updateBody = function(body) {
            this.els.has(Ammo.getPointer(body)) && this.physicsWorld.updateSingleAabb(body);
        }, AmmoDriver.prototype.step = function(deltaTime) {
            this.physicsWorld.stepSimulation(deltaTime, this.maxSubSteps, this.fixedTimeStep);
            const numManifolds = this.dispatcher.getNumManifolds();
            for (let i = 0; i < numManifolds; i++) {
                const persistentManifold = this.dispatcher.getManifoldByIndexInternal(i), numContacts = persistentManifold.getNumContacts(), body0ptr = Ammo.getPointer(persistentManifold.getBody0()), body1ptr = Ammo.getPointer(persistentManifold.getBody1());
                let collided = !1;
                for (let j = 0; j < numContacts; j++) {
                    if (persistentManifold.getContactPoint(j).getDistance() <= this.epsilon) {
                        collided = !0;
                        break;
                    }
                }
                collided && (this.collisions.has(body0ptr) || (this.collisions.set(body0ptr, []), 
                this.collisionKeys.push(body0ptr)), -1 === this.collisions.get(body0ptr).indexOf(body1ptr) && (this.collisions.get(body0ptr).push(body1ptr), 
                -1 !== this.eventListeners.indexOf(body0ptr) && this.els.get(body0ptr).emit("collidestart", {
                    targetEl: this.els.get(body1ptr)
                }), -1 !== this.eventListeners.indexOf(body1ptr) && this.els.get(body1ptr).emit("collidestart", {
                    targetEl: this.els.get(body0ptr)
                })), this.currentCollisions.has(body0ptr) || this.currentCollisions.set(body0ptr, new Set()), 
                this.currentCollisions.get(body0ptr).add(body1ptr));
            }
            for (let i = 0; i < this.collisionKeys.length; i++) {
                const body0ptr = this.collisionKeys[i], body1ptrs = this.collisions.get(body0ptr);
                for (let j = body1ptrs.length - 1; j >= 0; j--) {
                    const body1ptr = body1ptrs[j];
                    this.currentCollisions.get(body0ptr).has(body1ptr) || (-1 !== this.eventListeners.indexOf(body0ptr) && this.els.get(body0ptr).emit("collideend", {
                        targetEl: this.els.get(body1ptr)
                    }), -1 !== this.eventListeners.indexOf(body1ptr) && this.els.get(body1ptr).emit("collideend", {
                        targetEl: this.els.get(body0ptr)
                    }), body1ptrs.splice(j, 1));
                }
                this.currentCollisions.get(body0ptr).clear();
            }
            this.debugDrawer && this.debugDrawer.update();
        }, AmmoDriver.prototype.addConstraint = function(constraint) {
            this.physicsWorld.addConstraint(constraint, !1);
        }, AmmoDriver.prototype.removeConstraint = function(constraint) {
            this.physicsWorld.removeConstraint(constraint);
        }, AmmoDriver.prototype.addEventListener = function(body) {
            this.eventListeners.push(Ammo.getPointer(body));
        }, AmmoDriver.prototype.removeEventListener = function(body) {
            const ptr = Ammo.getPointer(body);
            -1 !== this.eventListeners.indexOf(ptr) && this.eventListeners.splice(this.eventListeners.indexOf(ptr), 1);
        }, AmmoDriver.prototype.destroy = function() {
            Ammo.destroy(this.collisionConfiguration), Ammo.destroy(this.dispatcher), 
            Ammo.destroy(this.broadphase), Ammo.destroy(this.solver), Ammo.destroy(this.physicsWorld), 
            Ammo.destroy(this.debugDrawer);
        }, AmmoDriver.prototype.getDebugDrawer = function(scene, options) {
            return this.debugDrawer || ((options = options || {}).debugDrawMode = options.debugDrawMode || this.debugDrawMode, 
            this.debugDrawer = new THREE.AmmoDebugDrawer(scene, this.physicsWorld, options)), 
            this.debugDrawer;
        };
    }, {
        "./driver": 21
    } ],
    21: [ function(require, module, exports) {
        function Driver() {}
        function abstractMethod() {
            throw new Error("Method not implemented.");
        }
        module.exports = Driver, Driver.prototype.init = abstractMethod, Driver.prototype.step = abstractMethod, 
        Driver.prototype.destroy = abstractMethod, Driver.prototype.addBody = abstractMethod, 
        Driver.prototype.removeBody = abstractMethod, Driver.prototype.applyBodyMethod = abstractMethod, 
        Driver.prototype.updateBodyProperties = abstractMethod, Driver.prototype.addMaterial = abstractMethod, 
        Driver.prototype.addContactMaterial = abstractMethod, Driver.prototype.addConstraint = abstractMethod, 
        Driver.prototype.removeConstraint = abstractMethod, Driver.prototype.getContacts = abstractMethod;
    }, {} ],
    22: [ function(require, module, exports) {
        module.exports = {
            INIT: "init",
            STEP: "step",
            ADD_BODY: "add-body",
            REMOVE_BODY: "remove-body",
            APPLY_BODY_METHOD: "apply-body-method",
            UPDATE_BODY_PROPERTIES: "update-body-properties",
            ADD_MATERIAL: "add-material",
            ADD_CONTACT_MATERIAL: "add-contact-material",
            ADD_CONSTRAINT: "add-constraint",
            REMOVE_CONSTRAINT: "remove-constraint",
            COLLIDE: "collide"
        };
    }, {} ],
    23: [ function(require, module, exports) {
        var CANNON = require("cannon-es"), Driver = require("./driver");
        function LocalDriver() {
            this.world = null, this.materials = {}, this.contactMaterial = null;
        }
        LocalDriver.prototype = new Driver(), LocalDriver.prototype.constructor = LocalDriver, 
        module.exports = LocalDriver, LocalDriver.prototype.init = function(worldConfig) {
            var world = new CANNON.World();
            world.quatNormalizeSkip = worldConfig.quatNormalizeSkip, world.quatNormalizeFast = worldConfig.quatNormalizeFast, 
            world.solver.iterations = worldConfig.solverIterations, world.gravity.set(0, worldConfig.gravity, 0), 
            world.broadphase = new CANNON.NaiveBroadphase(), this.world = world;
        }, LocalDriver.prototype.step = function(deltaMS) {
            this.world.step(deltaMS);
        }, LocalDriver.prototype.destroy = function() {
            delete this.world, delete this.contactMaterial, this.materials = {};
        }, LocalDriver.prototype.addBody = function(body) {
            this.world.addBody(body);
        }, LocalDriver.prototype.removeBody = function(body) {
            this.world.removeBody(body);
        }, LocalDriver.prototype.applyBodyMethod = function(body, methodName, args) {
            body["__" + methodName].apply(body, args);
        }, LocalDriver.prototype.updateBodyProperties = function() {}, LocalDriver.prototype.getMaterial = function(name) {
            return this.materials[name];
        }, LocalDriver.prototype.addMaterial = function(materialConfig) {
            this.materials[materialConfig.name] = new CANNON.Material(materialConfig), 
            this.materials[materialConfig.name].name = materialConfig.name;
        }, LocalDriver.prototype.addContactMaterial = function(matName1, matName2, contactMaterialConfig) {
            var mat1 = this.materials[matName1], mat2 = this.materials[matName2];
            this.contactMaterial = new CANNON.ContactMaterial(mat1, mat2, contactMaterialConfig), 
            this.world.addContactMaterial(this.contactMaterial);
        }, LocalDriver.prototype.addConstraint = function(constraint) {
            constraint.type || (constraint instanceof CANNON.LockConstraint ? constraint.type = "LockConstraint" : constraint instanceof CANNON.DistanceConstraint ? constraint.type = "DistanceConstraint" : constraint instanceof CANNON.HingeConstraint ? constraint.type = "HingeConstraint" : constraint instanceof CANNON.ConeTwistConstraint ? constraint.type = "ConeTwistConstraint" : constraint instanceof CANNON.PointToPointConstraint && (constraint.type = "PointToPointConstraint")), 
            this.world.addConstraint(constraint);
        }, LocalDriver.prototype.removeConstraint = function(constraint) {
            this.world.removeConstraint(constraint);
        }, LocalDriver.prototype.getContacts = function() {
            return this.world.contacts;
        };
    }, {
        "./driver": 21,
        "cannon-es": 4
    } ],
    24: [ function(require, module, exports) {
        var Driver = require("./driver");
        function NetworkDriver() {
            throw new Error("[NetworkDriver] Driver not implemented.");
        }
        NetworkDriver.prototype = new Driver(), NetworkDriver.prototype.constructor = NetworkDriver, 
        module.exports = NetworkDriver;
    }, {
        "./driver": 21
    } ],
    25: [ function(require, module, exports) {
        function EventTarget() {
            this.listeners = [];
        }
        module.exports = function(worker) {
            var targetA = new EventTarget(), targetB = new EventTarget();
            return targetA.setTarget(targetB), targetB.setTarget(targetA), worker(targetA), 
            targetB;
        }, EventTarget.prototype.setTarget = function(target) {
            this.target = target;
        }, EventTarget.prototype.addEventListener = function(type, fn) {
            this.listeners.push(fn);
        }, EventTarget.prototype.dispatchEvent = function(type, event) {
            for (var i = 0; i < this.listeners.length; i++) this.listeners[i](event);
        }, EventTarget.prototype.postMessage = function(msg) {
            this.target.dispatchEvent("message", {
                data: msg
            });
        };
    }, {} ],
    26: [ function(require, module, exports) {
        var webworkify = require("webworkify"), webworkifyDebug = require("./webworkify-debug"), Driver = require("./driver"), Event = require("./event"), worker = require("./worker"), protocol = require("../utils/protocol"), ID = protocol.ID;
        function WorkerDriver(options) {
            this.fps = options.fps, this.engine = options.engine, this.interpolate = options.interpolate, 
            this.interpBufferSize = options.interpolationBufferSize, this.debug = options.debug, 
            this.bodies = {}, this.contacts = [], this.frameDelay = 1e3 * this.interpBufferSize / this.fps, 
            this.frameBuffer = [], this.worker = this.debug ? webworkifyDebug(worker) : webworkify(worker), 
            this.worker.addEventListener("message", this._onMessage.bind(this));
        }
        WorkerDriver.prototype = new Driver(), WorkerDriver.prototype.constructor = WorkerDriver, 
        module.exports = WorkerDriver, WorkerDriver.prototype.init = function(worldConfig) {
            this.worker.postMessage({
                type: Event.INIT,
                worldConfig: worldConfig,
                fps: this.fps,
                engine: this.engine
            });
        }, WorkerDriver.prototype.step = function() {
            if (this.interpolate) {
                for (var prevFrame = this.frameBuffer[0], nextFrame = this.frameBuffer[1], timestamp = performance.now(); prevFrame && nextFrame && timestamp - prevFrame.timestamp > this.frameDelay; ) this.frameBuffer.shift(), 
                prevFrame = this.frameBuffer[0], nextFrame = this.frameBuffer[1];
                if (prevFrame && nextFrame) {
                    var mix = (timestamp - prevFrame.timestamp) / this.frameDelay;
                    for (var id in mix = (mix - (1 - 1 / this.interpBufferSize)) * this.interpBufferSize, 
                    prevFrame.bodies) prevFrame.bodies.hasOwnProperty(id) && nextFrame.bodies.hasOwnProperty(id) && protocol.deserializeInterpBodyUpdate(prevFrame.bodies[id], nextFrame.bodies[id], this.bodies[id], mix);
                }
            }
        }, WorkerDriver.prototype.destroy = function() {
            this.worker.terminate(), delete this.worker;
        }, WorkerDriver.prototype._onMessage = function(event) {
            if (event.data.type === Event.STEP) {
                var bodies = event.data.bodies;
                if (this.contacts = event.data.contacts, this.interpolate) this.frameBuffer.push({
                    timestamp: performance.now(),
                    bodies: bodies
                }); else for (var id in bodies) bodies.hasOwnProperty(id) && protocol.deserializeBodyUpdate(bodies[id], this.bodies[id]);
            } else {
                if (event.data.type !== Event.COLLIDE) throw new Error("[WorkerDriver] Unexpected message type.");
                var body = this.bodies[event.data.bodyID], target = this.bodies[event.data.targetID], contact = protocol.deserializeContact(event.data.contact, this.bodies);
                if (!body._listeners || !body._listeners.collide) return;
                for (var i = 0; i < body._listeners.collide.length; i++) body._listeners.collide[i]({
                    target: target,
                    body: body,
                    contact: contact
                });
            }
        }, WorkerDriver.prototype.addBody = function(body) {
            protocol.assignID("body", body), this.bodies[body[ID]] = body, this.worker.postMessage({
                type: Event.ADD_BODY,
                body: protocol.serializeBody(body)
            });
        }, WorkerDriver.prototype.removeBody = function(body) {
            this.worker.postMessage({
                type: Event.REMOVE_BODY,
                bodyID: body[ID]
            }), delete this.bodies[body[ID]];
        }, WorkerDriver.prototype.applyBodyMethod = function(body, methodName, args) {
            switch (methodName) {
              case "applyForce":
              case "applyImpulse":
                this.worker.postMessage({
                    type: Event.APPLY_BODY_METHOD,
                    bodyID: body[ID],
                    methodName: methodName,
                    args: [ args[0].toArray(), args[1].toArray() ]
                });
                break;

              default:
                throw new Error("Unexpected methodName: %s", methodName);
            }
        }, WorkerDriver.prototype.updateBodyProperties = function(body) {
            this.worker.postMessage({
                type: Event.UPDATE_BODY_PROPERTIES,
                body: protocol.serializeBody(body)
            });
        }, WorkerDriver.prototype.getMaterial = function(name) {}, WorkerDriver.prototype.addMaterial = function(materialConfig) {
            this.worker.postMessage({
                type: Event.ADD_MATERIAL,
                materialConfig: materialConfig
            });
        }, WorkerDriver.prototype.addContactMaterial = function(matName1, matName2, contactMaterialConfig) {
            this.worker.postMessage({
                type: Event.ADD_CONTACT_MATERIAL,
                materialName1: matName1,
                materialName2: matName2,
                contactMaterialConfig: contactMaterialConfig
            });
        }, WorkerDriver.prototype.addConstraint = function(constraint) {
            constraint.type || (constraint instanceof CANNON.LockConstraint ? constraint.type = "LockConstraint" : constraint instanceof CANNON.DistanceConstraint ? constraint.type = "DistanceConstraint" : constraint instanceof CANNON.HingeConstraint ? constraint.type = "HingeConstraint" : constraint instanceof CANNON.ConeTwistConstraint ? constraint.type = "ConeTwistConstraint" : constraint instanceof CANNON.PointToPointConstraint && (constraint.type = "PointToPointConstraint")), 
            protocol.assignID("constraint", constraint), this.worker.postMessage({
                type: Event.ADD_CONSTRAINT,
                constraint: protocol.serializeConstraint(constraint)
            });
        }, WorkerDriver.prototype.removeConstraint = function(constraint) {
            this.worker.postMessage({
                type: Event.REMOVE_CONSTRAINT,
                constraintID: constraint[ID]
            });
        }, WorkerDriver.prototype.getContacts = function() {
            var bodies = this.bodies;
            return this.contacts.map(function(message) {
                return protocol.deserializeContact(message, bodies);
            });
        };
    }, {
        "../utils/protocol": 30,
        "./driver": 21,
        "./event": 22,
        "./webworkify-debug": 25,
        "./worker": 27,
        webworkify: 7
    } ],
    27: [ function(require, module, exports) {
        var Event = require("./event"), LocalDriver = require("./local-driver"), AmmoDriver = require("./ammo-driver"), protocol = require("../utils/protocol"), ID = protocol.ID;
        module.exports = function(self) {
            var stepSize, driver = null, bodies = {}, constraints = {};
            function step() {
                driver.step(stepSize);
                var bodyMessages = {};
                Object.keys(bodies).forEach(function(id) {
                    bodyMessages[id] = protocol.serializeBody(bodies[id]);
                }), self.postMessage({
                    type: Event.STEP,
                    bodies: bodyMessages,
                    contacts: driver.getContacts().map(protocol.serializeContact)
                });
            }
            self.addEventListener("message", function(event) {
                var data = event.data;
                switch (data.type) {
                  case Event.INIT:
                    (driver = "cannon" === data.engine ? new LocalDriver() : new AmmoDriver()).init(data.worldConfig), 
                    stepSize = 1 / data.fps, setInterval(step, 1e3 / data.fps);
                    break;

                  case Event.ADD_BODY:
                    var body = protocol.deserializeBody(data.body);
                    body.material = driver.getMaterial("defaultMaterial"), bodies[body[ID]] = body, 
                    body.addEventListener("collide", function(evt) {
                        var message = {
                            type: Event.COLLIDE,
                            bodyID: evt.target[ID],
                            targetID: evt.body[ID],
                            contact: protocol.serializeContact(evt.contact)
                        };
                        self.postMessage(message);
                    }), driver.addBody(body);
                    break;

                  case Event.REMOVE_BODY:
                    driver.removeBody(bodies[data.bodyID]), delete bodies[data.bodyID];
                    break;

                  case Event.APPLY_BODY_METHOD:
                    bodies[data.bodyID][data.methodName](protocol.deserializeVec3(data.args[0]), protocol.deserializeVec3(data.args[1]));
                    break;

                  case Event.UPDATE_BODY_PROPERTIES:
                    protocol.deserializeBodyUpdate(data.body, bodies[data.body.id]);
                    break;

                  case Event.ADD_MATERIAL:
                    driver.addMaterial(data.materialConfig);
                    break;

                  case Event.ADD_CONTACT_MATERIAL:
                    driver.addContactMaterial(data.materialName1, data.materialName2, data.contactMaterialConfig);
                    break;

                  case Event.ADD_CONSTRAINT:
                    var constraint = protocol.deserializeConstraint(data.constraint, bodies);
                    constraints[constraint[ID]] = constraint, driver.addConstraint(constraint);
                    break;

                  case Event.REMOVE_CONSTRAINT:
                    driver.removeConstraint(constraints[data.constraintID]), delete constraints[data.constraintID];
                    break;

                  default:
                    throw new Error("[Worker] Unexpected event type: %s", data.type);
                }
            });
        };
    }, {
        "../utils/protocol": 30,
        "./ammo-driver": 20,
        "./event": 22,
        "./local-driver": 23
    } ],
    28: [ function(require, module, exports) {
        require("cannon-es");
        var CONSTANTS = require("./constants"), C_GRAV = CONSTANTS.GRAVITY, C_MAT = CONSTANTS.CONTACT_MATERIAL, LocalDriver = require("./drivers/local-driver"), WorkerDriver = require("./drivers/worker-driver"), NetworkDriver = require("./drivers/network-driver"), AmmoDriver = require("./drivers/ammo-driver");
        module.exports = AFRAME.registerSystem("physics", {
            schema: {
                driver: {
                    default: "local",
                    oneOf: [ "local", "worker", "network", "ammo" ]
                },
                networkUrl: {
                    default: "",
                    if: {
                        driver: "network"
                    }
                },
                workerFps: {
                    default: 60,
                    if: {
                        driver: "worker"
                    }
                },
                workerInterpolate: {
                    default: !0,
                    if: {
                        driver: "worker"
                    }
                },
                workerInterpBufferSize: {
                    default: 2,
                    if: {
                        driver: "worker"
                    }
                },
                workerEngine: {
                    default: "cannon",
                    if: {
                        driver: "worker"
                    },
                    oneOf: [ "cannon" ]
                },
                workerDebug: {
                    default: !1,
                    if: {
                        driver: "worker"
                    }
                },
                gravity: {
                    default: C_GRAV
                },
                iterations: {
                    default: CONSTANTS.ITERATIONS
                },
                friction: {
                    default: C_MAT.friction
                },
                restitution: {
                    default: C_MAT.restitution
                },
                contactEquationStiffness: {
                    default: C_MAT.contactEquationStiffness
                },
                contactEquationRelaxation: {
                    default: C_MAT.contactEquationRelaxation
                },
                frictionEquationStiffness: {
                    default: C_MAT.frictionEquationStiffness
                },
                frictionEquationRegularization: {
                    default: C_MAT.frictionEquationRegularization
                },
                maxInterval: {
                    default: 4 / 60
                },
                debug: {
                    default: !1
                },
                debugDrawMode: {
                    default: THREE.AmmoDebugConstants.NoDebug
                },
                maxSubSteps: {
                    default: 4
                },
                fixedTimeStep: {
                    default: 1 / 60
                }
            },
            async init() {
                var data = this.data;
                switch (this.debug = data.debug, this.callbacks = {
                    beforeStep: [],
                    step: [],
                    afterStep: []
                }, this.listeners = {}, this.driver = null, data.driver) {
                  case "local":
                    this.driver = new LocalDriver();
                    break;

                  case "ammo":
                    this.driver = new AmmoDriver();
                    break;

                  case "network":
                    this.driver = new NetworkDriver(data.networkUrl);
                    break;

                  case "worker":
                    this.driver = new WorkerDriver({
                        fps: data.workerFps,
                        engine: data.workerEngine,
                        interpolate: data.workerInterpolate,
                        interpolationBufferSize: data.workerInterpBufferSize,
                        debug: data.workerDebug
                    });
                    break;

                  default:
                    throw new Error('[physics] Driver not recognized: "%s".', data.driver);
                }
                "ammo" !== data.driver ? (await this.driver.init({
                    quatNormalizeSkip: 0,
                    quatNormalizeFast: !1,
                    solverIterations: data.iterations,
                    gravity: data.gravity
                }), this.driver.addMaterial({
                    name: "defaultMaterial"
                }), this.driver.addMaterial({
                    name: "staticMaterial"
                }), this.driver.addContactMaterial("defaultMaterial", "defaultMaterial", {
                    friction: data.friction,
                    restitution: data.restitution,
                    contactEquationStiffness: data.contactEquationStiffness,
                    contactEquationRelaxation: data.contactEquationRelaxation,
                    frictionEquationStiffness: data.frictionEquationStiffness,
                    frictionEquationRegularization: data.frictionEquationRegularization
                }), this.driver.addContactMaterial("staticMaterial", "defaultMaterial", {
                    friction: 1,
                    restitution: 0,
                    contactEquationStiffness: data.contactEquationStiffness,
                    contactEquationRelaxation: data.contactEquationRelaxation,
                    frictionEquationStiffness: data.frictionEquationStiffness,
                    frictionEquationRegularization: data.frictionEquationRegularization
                })) : await this.driver.init({
                    gravity: data.gravity,
                    debugDrawMode: data.debugDrawMode,
                    solverIterations: data.iterations,
                    maxSubSteps: data.maxSubSteps,
                    fixedTimeStep: data.fixedTimeStep
                }), this.initialized = !0, this.debug && this.setDebug(!0);
            },
            tick: function(t, dt) {
                if (this.initialized && dt) {
                    var i, callbacks = this.callbacks;
                    for (i = 0; i < this.callbacks.beforeStep.length; i++) this.callbacks.beforeStep[i].beforeStep(t, dt);
                    for (this.driver.step(Math.min(dt / 1e3, this.data.maxInterval)), 
                    i = 0; i < callbacks.step.length; i++) callbacks.step[i].step(t, dt);
                    for (i = 0; i < callbacks.afterStep.length; i++) callbacks.afterStep[i].afterStep(t, dt);
                }
            },
            setDebug: function(debug) {
                this.debug = debug, "ammo" === this.data.driver && this.initialized && (debug && !this.debugDrawer ? (this.debugDrawer = this.driver.getDebugDrawer(this.el.object3D), 
                this.debugDrawer.enable()) : this.debugDrawer && (this.debugDrawer.disable(), 
                this.debugDrawer = null));
            },
            addBody: function(body, group, mask) {
                var driver = this.driver;
                "local" === this.data.driver && (body.__applyImpulse = body.applyImpulse, 
                body.applyImpulse = function() {
                    driver.applyBodyMethod(body, "applyImpulse", arguments);
                }, body.__applyForce = body.applyForce, body.applyForce = function() {
                    driver.applyBodyMethod(body, "applyForce", arguments);
                }, body.updateProperties = function() {
                    driver.updateBodyProperties(body);
                }, this.listeners[body.id] = function(e) {
                    body.el.emit("collide", e);
                }, body.addEventListener("collide", this.listeners[body.id])), this.driver.addBody(body, group, mask);
            },
            removeBody: function(body) {
                this.driver.removeBody(body), "local" !== this.data.driver && "worker" !== this.data.driver || (body.removeEventListener("collide", this.listeners[body.id]), 
                delete this.listeners[body.id], body.applyImpulse = body.__applyImpulse, 
                delete body.__applyImpulse, body.applyForce = body.__applyForce, 
                delete body.__applyForce, delete body.updateProperties);
            },
            addConstraint: function(constraint) {
                this.driver.addConstraint(constraint);
            },
            removeConstraint: function(constraint) {
                this.driver.removeConstraint(constraint);
            },
            addComponent: function(component) {
                var callbacks = this.callbacks;
                component.beforeStep && callbacks.beforeStep.push(component), component.step && callbacks.step.push(component), 
                component.afterStep && callbacks.afterStep.push(component);
            },
            removeComponent: function(component) {
                var callbacks = this.callbacks;
                component.beforeStep && callbacks.beforeStep.splice(callbacks.beforeStep.indexOf(component), 1), 
                component.step && callbacks.step.splice(callbacks.step.indexOf(component), 1), 
                component.afterStep && callbacks.afterStep.splice(callbacks.afterStep.indexOf(component), 1);
            },
            getContacts: function() {
                return this.driver.getContacts();
            },
            getMaterial: function(name) {
                return this.driver.getMaterial(name);
            }
        });
    }, {
        "./constants": 19,
        "./drivers/ammo-driver": 20,
        "./drivers/local-driver": 23,
        "./drivers/network-driver": 24,
        "./drivers/worker-driver": 26,
        "cannon-es": 4
    } ],
    29: [ function(require, module, exports) {
        module.exports.slerp = function(a, b, t) {
            if (t <= 0) return a;
            if (t >= 1) return b;
            var x = a[0], y = a[1], z = a[2], w = a[3], cosHalfTheta = w * b[3] + x * b[0] + y * b[1] + z * b[2];
            if (!(cosHalfTheta < 0)) return b;
            if ((a = a.slice())[3] = -b[3], a[0] = -b[0], a[1] = -b[1], a[2] = -b[2], 
            (cosHalfTheta = -cosHalfTheta) >= 1) return a[3] = w, a[0] = x, a[1] = y, 
            a[2] = z, this;
            var sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < .001) return a[3] = .5 * (w + a[3]), a[0] = .5 * (x + a[0]), 
            a[1] = .5 * (y + a[1]), a[2] = .5 * (z + a[2]), this;
            var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta), ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            return a[3] = w * ratioA + a[3] * ratioB, a[0] = x * ratioA + a[0] * ratioB, 
            a[1] = y * ratioA + a[1] * ratioB, a[2] = z * ratioA + a[2] * ratioB, 
            a;
        };
    }, {} ],
    30: [ function(require, module, exports) {
        var CANNON = require("cannon-es"), mathUtils = require("./math"), ID = "__id";
        module.exports.ID = ID;
        var nextID = {};
        function serializeShape(shape) {
            var shapeMsg = {
                type: shape.type
            };
            if (shape.type === CANNON.Shape.types.BOX) shapeMsg.halfExtents = serializeVec3(shape.halfExtents); else if (shape.type === CANNON.Shape.types.SPHERE) shapeMsg.radius = shape.radius; else {
                if (shape._type !== CANNON.Shape.types.CYLINDER) throw new Error("Unimplemented shape type: %s", shape.type);
                shapeMsg.type = CANNON.Shape.types.CYLINDER, shapeMsg.radiusTop = shape.radiusTop, 
                shapeMsg.radiusBottom = shape.radiusBottom, shapeMsg.height = shape.height, 
                shapeMsg.numSegments = shape.numSegments;
            }
            return shapeMsg;
        }
        function deserializeShape(message) {
            var shape;
            if (message.type === CANNON.Shape.types.BOX) shape = new CANNON.Box(deserializeVec3(message.halfExtents)); else if (message.type === CANNON.Shape.types.SPHERE) shape = new CANNON.Sphere(message.radius); else {
                if (message.type !== CANNON.Shape.types.CYLINDER) throw new Error("Unimplemented shape type: %s", message.type);
                (shape = new CANNON.Cylinder(message.radiusTop, message.radiusBottom, message.height, message.numSegments))._type = CANNON.Shape.types.CYLINDER;
            }
            return shape;
        }
        function serializeVec3(vec3) {
            return vec3.toArray();
        }
        function deserializeVec3(message) {
            return new CANNON.Vec3(message[0], message[1], message[2]);
        }
        function serializeQuaternion(quat) {
            return quat.toArray();
        }
        function deserializeQuaternion(message) {
            return new CANNON.Quaternion(message[0], message[1], message[2], message[3]);
        }
        module.exports.assignID = function(prefix, object) {
            object[ID] || (nextID[prefix] = nextID[prefix] || 1, object[ID] = prefix + "_" + nextID[prefix]++);
        }, module.exports.serializeBody = function(body) {
            return {
                shapes: body.shapes.map(serializeShape),
                shapeOffsets: body.shapeOffsets.map(serializeVec3),
                shapeOrientations: body.shapeOrientations.map(serializeQuaternion),
                position: serializeVec3(body.position),
                quaternion: body.quaternion.toArray(),
                velocity: serializeVec3(body.velocity),
                angularVelocity: serializeVec3(body.angularVelocity),
                id: body[ID],
                mass: body.mass,
                linearDamping: body.linearDamping,
                angularDamping: body.angularDamping,
                fixedRotation: body.fixedRotation,
                allowSleep: body.allowSleep,
                sleepSpeedLimit: body.sleepSpeedLimit,
                sleepTimeLimit: body.sleepTimeLimit
            };
        }, module.exports.deserializeBodyUpdate = function(message, body) {
            return body.position.set(message.position[0], message.position[1], message.position[2]), 
            body.quaternion.set(message.quaternion[0], message.quaternion[1], message.quaternion[2], message.quaternion[3]), 
            body.velocity.set(message.velocity[0], message.velocity[1], message.velocity[2]), 
            body.angularVelocity.set(message.angularVelocity[0], message.angularVelocity[1], message.angularVelocity[2]), 
            body.linearDamping = message.linearDamping, body.angularDamping = message.angularDamping, 
            body.fixedRotation = message.fixedRotation, body.allowSleep = message.allowSleep, 
            body.sleepSpeedLimit = message.sleepSpeedLimit, body.sleepTimeLimit = message.sleepTimeLimit, 
            body.mass !== message.mass && (body.mass = message.mass, body.updateMassProperties()), 
            body;
        }, module.exports.deserializeInterpBodyUpdate = function(message1, message2, body, mix) {
            var weight1 = 1 - mix, weight2 = mix;
            body.position.set(message1.position[0] * weight1 + message2.position[0] * weight2, message1.position[1] * weight1 + message2.position[1] * weight2, message1.position[2] * weight1 + message2.position[2] * weight2);
            var quaternion = mathUtils.slerp(message1.quaternion, message2.quaternion, mix);
            return body.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]), 
            body.velocity.set(message1.velocity[0] * weight1 + message2.velocity[0] * weight2, message1.velocity[1] * weight1 + message2.velocity[1] * weight2, message1.velocity[2] * weight1 + message2.velocity[2] * weight2), 
            body.angularVelocity.set(message1.angularVelocity[0] * weight1 + message2.angularVelocity[0] * weight2, message1.angularVelocity[1] * weight1 + message2.angularVelocity[1] * weight2, message1.angularVelocity[2] * weight1 + message2.angularVelocity[2] * weight2), 
            body.linearDamping = message2.linearDamping, body.angularDamping = message2.angularDamping, 
            body.fixedRotation = message2.fixedRotation, body.allowSleep = message2.allowSleep, 
            body.sleepSpeedLimit = message2.sleepSpeedLimit, body.sleepTimeLimit = message2.sleepTimeLimit, 
            body.mass !== message2.mass && (body.mass = message2.mass, body.updateMassProperties()), 
            body;
        }, module.exports.deserializeBody = function(message) {
            for (var shapeMsg, body = new CANNON.Body({
                mass: message.mass,
                position: deserializeVec3(message.position),
                quaternion: deserializeQuaternion(message.quaternion),
                velocity: deserializeVec3(message.velocity),
                angularVelocity: deserializeVec3(message.angularVelocity),
                linearDamping: message.linearDamping,
                angularDamping: message.angularDamping,
                fixedRotation: message.fixedRotation,
                allowSleep: message.allowSleep,
                sleepSpeedLimit: message.sleepSpeedLimit,
                sleepTimeLimit: message.sleepTimeLimit
            }), i = 0; shapeMsg = message.shapes[i]; i++) body.addShape(deserializeShape(shapeMsg), deserializeVec3(message.shapeOffsets[i]), deserializeQuaternion(message.shapeOrientations[i]));
            return body[ID] = message.id, body;
        }, module.exports.serializeShape = serializeShape, module.exports.deserializeShape = deserializeShape, 
        module.exports.serializeConstraint = function(constraint) {
            var message = {
                id: constraint[ID],
                type: constraint.type,
                maxForce: constraint.maxForce,
                bodyA: constraint.bodyA[ID],
                bodyB: constraint.bodyB[ID]
            };
            switch (constraint.type) {
              case "LockConstraint":
                break;

              case "DistanceConstraint":
                message.distance = constraint.distance;
                break;

              case "HingeConstraint":
              case "ConeTwistConstraint":
                message.axisA = serializeVec3(constraint.axisA), message.axisB = serializeVec3(constraint.axisB), 
                message.pivotA = serializeVec3(constraint.pivotA), message.pivotB = serializeVec3(constraint.pivotB);
                break;

              case "PointToPointConstraint":
                message.pivotA = serializeVec3(constraint.pivotA), message.pivotB = serializeVec3(constraint.pivotB);
                break;

              default:
                throw new Error("Unexpected constraint type: " + constraint.type + '. You may need to manually set `constraint.type = "FooConstraint";`.');
            }
            return message;
        }, module.exports.deserializeConstraint = function(message, bodies) {
            var constraint, TypedConstraint = CANNON[message.type], bodyA = bodies[message.bodyA], bodyB = bodies[message.bodyB];
            switch (message.type) {
              case "LockConstraint":
                constraint = new CANNON.LockConstraint(bodyA, bodyB, message);
                break;

              case "DistanceConstraint":
                constraint = new CANNON.DistanceConstraint(bodyA, bodyB, message.distance, message.maxForce);
                break;

              case "HingeConstraint":
              case "ConeTwistConstraint":
                constraint = new TypedConstraint(bodyA, bodyB, {
                    pivotA: deserializeVec3(message.pivotA),
                    pivotB: deserializeVec3(message.pivotB),
                    axisA: deserializeVec3(message.axisA),
                    axisB: deserializeVec3(message.axisB),
                    maxForce: message.maxForce
                });
                break;

              case "PointToPointConstraint":
                constraint = new CANNON.PointToPointConstraint(bodyA, deserializeVec3(message.pivotA), bodyB, deserializeVec3(message.pivotB), message.maxForce);
                break;

              default:
                throw new Error("Unexpected constraint type: " + message.type);
            }
            return constraint[ID] = message.id, constraint;
        }, module.exports.serializeContact = function(contact) {
            return {
                bi: contact.bi[ID],
                bj: contact.bj[ID],
                ni: serializeVec3(contact.ni),
                ri: serializeVec3(contact.ri),
                rj: serializeVec3(contact.rj)
            };
        }, module.exports.deserializeContact = function(message, bodies) {
            return {
                bi: bodies[message.bi],
                bj: bodies[message.bj],
                ni: deserializeVec3(message.ni),
                ri: deserializeVec3(message.ri),
                rj: deserializeVec3(message.rj)
            };
        }, module.exports.serializeVec3 = serializeVec3, module.exports.deserializeVec3 = deserializeVec3, 
        module.exports.serializeQuaternion = serializeQuaternion, module.exports.deserializeQuaternion = deserializeQuaternion;
    }, {
        "./math": 29,
        "cannon-es": 4
    } ]
}, {}, [ 1 ]);
