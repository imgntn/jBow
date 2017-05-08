This project shows how to make a two-handed bow and arrow in webVR using A-Frame.

[Read "The Bow and Arrow is Virtual Reality's Hello World" on Medium](https://medium.com/@jamesbpollack/the-bow-arrow-is-virtual-realitys-hello-world-b0556faa3ef8)

![Alt text](captures/cap1.png?raw=true "Taking Aim")

## General Info

You can pick up the bow using either hand.  Then, pull the trigger on your back hand to take aim.  Releasing the trigger shoots an arrow.  The force with which the arrow travels depends on the distance between your back hand and the bow. 

It currently works much better in Firefox Nightly than in Chrome.  You'll have to download a [webVR capable browser](https://webvr.info/)

[You can try a live demo here](https://imgntn.github.io/jBow/) | [Motion Capture Demp](https://hazardu5.github.io/jBow/?avatar-recording=recording-jbow.json)

## Models Used

- Bow model from Clara.io https://clara.io/view/96531052-8e7c-45db-992e-9eaa127349a6
- Arrow model from Clara.io https://clara.io/view/95c6882f-9216-4415-a06b-2e9591ad04b1
- Tree model from Clara.io https://clara.io/view/6ce48237-f4d4-4852-90f9-8f067fd09b29

## Components + Modifications

- [ground, grab and aabb-collider](https://github.com/aframevr/aframe/tree/master/examples/showcase/tracked-controls/components)
- [aframe-physics-system](https://github.com/donmccurdy/aframe-physics-system)
- [aframe-meshline](https://github.com/andreasplesch/aframe-meshline-component)

I made modifications to the ```grab``` component to communicate with the bow about which hand was used to grab it and apply rotations to the held object.

Since I reuse arrows from a pool to improve performance, I also made slight modifications to the physics system in ```a-frame-physics-system``` so that it would emit a 'body-played' when the dynamic body is synced.

The ```rotate-toward-velocity``` component keeps the arrow pointed in the direction of travel.

The ```poissondisc-forest``` component distributes 'trees' around you in an attempt to mimic realistic vegetation distribution.  Here I'm using boxes instead of the default tree model to showcase the physics system.  Some are static and cannot be move, others are dynamic and will topple over when you shoot them.

## Interaction Flow 

- Listen to event for picking up the bow with primary hand
- Play nocking sound at bow position
- Measure distance between hands (shot force) while aiming
- Move the arrow back in the nock proportional to the shot force
- Draw a line to the back of the arrow
- Detect trigger release from back hand
- Apply impulse force to arrow toward front of bow to shoot arrow
- Play shooting sound at bow position
- Vibrate the controller when we release an arrow
- Rotate the arrow toward its velocity to get a nice arc during flight
- Collision detection to play hit sound at collision position and cleanup

## To-Do:

1.0
- [x] reduce lag at shot (try a pool, try more specific selectors)
- [x] when arrows collide, return arrows to pool
- [x] arrow rotation at shot should be front of bow
- [x] why does arrow flip end over end?  because impulse position is middle? -- had to set fixedRotation since i'm doing it myself
- [x] realistic trajectory -- rotate toward velocity. probably its own component. 
- [x] add some targets
- [x] sound for nocking arrow
- [x] sound for shooting arrow
- [x] haptic pulse for shooting arrow (doesnt seem to be supported anywhere yet)
- [x] extend ground otherwise out of sight arrows might never collide

2.0
- [x] add a cooldown otherwise we run through the whole pool of arrows.
- [x] once you're reusing an arrow from the pool, it gets double the force every time.  probably because we're reusing the physics body and it isnt fresh. 
- [x] add some trees at various locations to give some depth 
- [x] poisson disc for tree distribution
- [x] string animations - meshline to back of arrow 
- [x] pull arrow back in bow to match force
- [x] remove string from arrow model
- [x] add some mountains

3.0
- [] after pickup the rotation of the bow should be controlled by the line between the hands, not the controller rotation at all. followed by a short slerp back to real controller rotation after firing.  ala the lab
- [] arrow is not hitting 'static-body' target obj.  does hit primitive box, so its not a lack of CCD (continuous collision detection)
- [] increase poolsize for sounds to allow them to overlap
- [] how to better see the arrow during flight -- glow, particle trail?
- [] make arrow stick and then add cooldown delay before disappearing them
- [] visual indicator of target hit.  
- [] animated targets (and their phyiscs bodies)
- [] haptic pulse on bow grab (working yet in FF/Chrome?)

5.0
- [] fire arrows
- [] nightmode
- [] enemy ai
- [] tower
- [] teleport
- [] multiplayer (syncing physics...??? hmm)