// runs simulation from given WorldState
export default function bigBang({ ws, onDraw, onTick, onKey }) {
  const TRACKED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  const ks = (function(keys) {
    const keyStore = Object.create(null);

    function track(event) {
      if (keys.includes(event.key)) {
        keyStore[event.key] = event.type == 'keydown';
        event.preventDefault();
      }
    }

    window.addEventListener('keyup', track);
    window.addEventListener('keydown', track);

    return keyStore;
  })(TRACKED_KEYS);

  const run = function(ws, onDraw, onTick, onKey = null) {
    requestAnimationFrame(function() {
      onDraw(ws);
      const newState = onKey ? onTick(onKey(ws, ks)) : onTick(ws, ks);
      run(newState, onDraw, onTick, onKey)
    });
  }

  run(ws, onDraw, onTick, onKey);
}
