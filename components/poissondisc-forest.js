/* global AFRAME, THREE */

/**
based on an awesome poisson function from https://bl.ocks.org/mbostock/19168c663618b7f07158

todo: 
merge geometries
test physics bodies
maybe work in local object space so that the whole thing can be 000 centered 
 */
AFRAME.registerComponent('poissondisc-forest', {
    schema: {
        samplecount: {
            type: 'int',
            default: 20
        },
        width: {
            type: 'int',
            default: 20
        },
        length: {
            type: 'int',
            default: 20
        },
        spacing: {
            type: 'int',
            default: 5
        }
    },

    init: function() {
        //create a buncha trees on a plane
        this.sampler = this.poissonDiscSampler(this.data.width, this.data.length, this.data.spacing);
        var treeCount;
        this.trees = [];

        this.centerForest();

        for (treeCount = 0; treeCount < this.data.samplecount; treeCount++) {
            //xy position
            var sample = this.sampler();
            if (sample === undefined) {
                return;
            }
            var tree = this.createSingleTreeBlock();
            var treePosition = new THREE.Vector3(sample[0], tree.getAttribute('height') / 2, sample[1]);

            tree.setAttribute('position', treePosition);
            this.el.appendChild(tree)
            this.trees.push(tree);

        }

    },

    centerForest: function() {

        var lengthTransform = this.data.length / 2;
        var widthTransform = this.data.width / 2;

        var position = new THREE.Vector3(-lengthTransform, 0, -widthTransform);

        this.el.setAttribute('position', position);
    },

    createSingleTreeBlock: function(treeString) {
        //created simple boxes with physics entities
        var tree = document.createElement('a-box');
        var height = 1 + Math.random() * 9;
        tree.setAttribute('depth', '0.75');
        tree.setAttribute('width', '0.75');
        tree.setAttribute('height', height);
        var which = Math.random();
        if (which < 0.5) {
            tree.setAttribute('color', 'green')
            tree.setAttribute('dynamic-body', '')
        } else {
            tree.setAttribute('color', 'grey')
            tree.setAttribute('static-body', '')
        }

        return tree;

    },

    createSingleTreeObj: function(treeString) {
        //our assets for the tree
        var treeString = treeString || "obj: #tree-toon-obj; mtl: #tree-toon-mtl";

        var tree = document.createElement('a-entity');
        tree.setAttribute('obj-model', treeString);
        var height = 1 + Math.random() * 9;
        tree.setAttribute('scale', {
            x: 0.75,
            y: height,
            z: 0.75
        });

        return tree;

    },

    poissonDiscSampler: function(width, height, radius) {
        var k = 30, // maximum number of samples before rejection
            radius2 = radius * radius,
            R = 3 * radius2,
            cellSize = radius * Math.SQRT1_2,
            gridWidth = Math.ceil(width / cellSize),
            gridHeight = Math.ceil(height / cellSize),
            grid = new Array(gridWidth * gridHeight),
            queue = [],
            queueSize = 0,
            sampleSize = 0;

        return function() {
            if (!sampleSize) return sample(Math.random() * width, Math.random() * height);

            // Pick a random existing sample and remove it from the queue.
            while (queueSize) {
                var i = Math.random() * queueSize | 0,
                    s = queue[i];

                // Make a new candidate between [radius, 2 * radius] from the existing sample.
                for (var j = 0; j < k; ++j) {
                    var a = 2 * Math.PI * Math.random(),
                        r = Math.sqrt(Math.random() * R + radius2),
                        x = s[0] + r * Math.cos(a),
                        y = s[1] + r * Math.sin(a);

                    // Reject candidates that are outside the allowed extent,
                    // or closer than 2 * radius to any existing sample.
                    if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) return sample(x, y);
                }

                queue[i] = queue[--queueSize];
                queue.length = queueSize;
            }
        };

        function far(x, y) {
            var i = x / cellSize | 0,
                j = y / cellSize | 0,
                i0 = Math.max(i - 2, 0),
                j0 = Math.max(j - 2, 0),
                i1 = Math.min(i + 3, gridWidth),
                j1 = Math.min(j + 3, gridHeight);

            for (j = j0; j < j1; ++j) {
                var o = j * gridWidth;
                for (i = i0; i < i1; ++i) {
                    if (s = grid[o + i]) {
                        var s,
                            dx = s[0] - x,
                            dy = s[1] - y;
                        if (dx * dx + dy * dy < radius2) return false;
                    }
                }
            }

            return true;
        }

        function sample(x, y) {
            var s = [x, y];
            queue.push(s);
            grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;
            ++sampleSize;
            ++queueSize;
            return s;
        }
    }

});