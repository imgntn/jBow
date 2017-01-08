/* global AFRAME, THREE */

/**
todo: 
merge geometries
test physics bodies
maybe work in local object space so that the whole thing can be 000 centered 
 */
AFRAME.registerComponent('poissondisc-forest', {
    schema: {
        samplecount: {
            type: 'int',
            default: 60
        },
        width: {
            type: 'int',
            default: 30
        },
        length: {
            type: 'int',
            default: 30
        },
        spacing:{
            type:'int',
            default:5
        }
    },

    init: function() {
        console.log('should make a forest',this)

        //create a buncha trees on a plane
        this.sampler = this.poissonDiscSampler(this.data.width, this.data.length, this.data.spacing);
        var treeCount;
        this.trees = [];

        for (treeCount = 0; treeCount < this.data.samplecount; treeCount++) {
            //xy position
            var sample = this.sampler();
            if( sample===undefined){
                return;
            }
            console.log('sample is:',sample)
            var tree = this.createSingleTree();
            var treePosition = new THREE.Vector3(sample[0],0,sample[1]);
            console.log('treePosition',treePosition)
            tree.setAttribute('position',treePosition);
            this.el.appendChild(tree);
            this.trees.push(tree);
        }

    },

    tick: function(time, delta) {

    },

    createSingleTree: function(treeString) {

        var treeString = treeString || "obj: #tree-toon-obj; mtl: #tree-toon-mtl";

        var tree = document.createElement('a-entity');
        tree.class = "tree";
        tree.setAttribute('obj-model', treeString);
        var width = Math.random();
        var length=Math.random();
        var height=Math.random()*10;
        console.log('wlh',width,length,height)
        tree.setAttribute('scale', '0.5'+" "+height+" "+'0.5');
        //tree.setAttribute('scale','1 1 1');

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