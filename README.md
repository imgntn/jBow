todo:

- [x] reduce lag at shot (try a pool, try more specific selectors)
- [x] when arrows collide, remove dynamic body and make them stick
- [x] arrow rotation at shot should be front of bow
- [] why does arrow flip end over end?  because impulse position is middle? 
- [] realistic trajectory -- rotate toward velocity. probably its own component. 
- [x] add some targets
- [x] sound for nocking arrow
- [x] sound for shooting arrow
- [x] haptic pulse for shooting arrow
- [x] haptic pulse on item grab (doesnt seem to be actually in FF yet)


https://vilbeyli.github.io/Simple-Trajectory-Motion-Example-Unity3D/
```
    void Update ()
    {
        Vector3 vel = GetComponent<Rigidbody>().velocity;
        if(_rotate)
            transform.rotation = Quaternion.LookRotation(vel);
    }
myArrow.transform.forward =
    Vector3.Slerp(myArrow.transform.forward, myArrow.rigidbody.velocity.normalized, Time.deltaTime);

```
https://sites.google.com/site/technicalarchery/technical-discussions-1/trajectory
http://physics.stackexchange.com/questions/264165/why-do-archery-arrows-tilt-downwards-in-their-descent


https://github.com/schteppe/cannon.js/issues/232
```
var updateCOM = function( body ) {

//first calculate the center of mass
// NOTE: this method assumes all the shapes are voxels of equal mass.
// If you're not using voxels, you'll need to calculate the COM a different way.
var com = new CANNON.Vec3();
body.shapeOffsets.forEach( function( offset ) {
    com.vadd( offset, com );
});
com.scale( 1/body.shapes.length, com );

//move the shapes so the body origin is at the COM
body.shapeOffsets.forEach( function( offset ) {
    offset.vsub( com, offset );
});

//now move the body so the shapes' net displacement is 0
var worldCOM = new CANNON.Vec3();
body.vectorToWorldFrame( com, worldCOM );
body.position.vadd( worldCOM, body.position );
};
```