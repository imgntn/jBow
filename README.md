This project shows how to make a two-handed bow and arrow in webVR.

You can pick it up using either hand.  Then, take aim and pull the trigger on your back hand.  Releasing the trigger shoots an arrow.  The force with which the arrow travels depends on the distance between your back hand and the bow.

I made modifications to the ```grab``` component to communicate with the bow about which hand was used to grab.  

Since I reuse arrows from a pool to improve performance, I also made slight modifications to the physics system in ```a-frame-physics-system``` so that it would emit a 'body-played' when the dynamic 

My ```rotate-toward-velocity``` component keeps the arrow pointed in the direction of travel.

# todo:

0.1
- [x] reduce lag at shot (try a pool, try more specific selectors)
- [x] when arrows collide, remove dynamic body and make them stick
- [x] arrow rotation at shot should be front of bow
- [x] why does arrow flip end over end?  because impulse position is middle? -- had to set fixedRotation since i'm doing it myself
- [x] realistic trajectory -- rotate toward velocity. probably its own component. 
- [x] add some targets
- [x] sound for nocking arrow
- [x] sound for shooting arrow
- [x] haptic pulse for shooting arrow
- [x] haptic pulse on item grab (doesnt seem to be actually in FF yet)

0.2
- [] add a cooldown otherwise we run through the whole pool of arrows.
- [] arrow is not hitting 'static-body' target obj.  does hit primitive box, so its not a lack of CCD (continuous collision detection)
- [] arrows that disappear from sight never collide
- [] string animations
- [] pull arrow back in bow
- [] how to better see the arrow during flight -- glow, particle trail?
- [] animate targets
