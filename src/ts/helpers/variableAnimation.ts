let then = Date.now();

export function animate(getFps, cb) {

  // stop
  if (stop) {
      return;
  }

  const fps = getFps();
  let fpsInterval = 1000 / fps;
  
  // request another frame

  requestAnimationFrame(() => animate(getFps, cb));

  // calc elapsed time since last loop

  const now = Date.now();
  let elapsed = now - then;

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {

      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      then = now - (elapsed % fpsInterval);

      // draw stuff here
      cb()

  }
}