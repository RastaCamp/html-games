export function bindInput({ onKey, onPointer }) {
  const keyHandler = (event) => {
    const key = event.key.toLowerCase();
    onKey(key, event);
  };
  const pointerHandler = (event) => onPointer(event);

  window.addEventListener("keydown", keyHandler);
  window.addEventListener("mousedown", pointerHandler);

  return () => {
    window.removeEventListener("keydown", keyHandler);
    window.removeEventListener("mousedown", pointerHandler);
  };
}
