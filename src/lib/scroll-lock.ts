type ScrollBody = { style: { overflow: string } };
const locks = new WeakMap<ScrollBody, { count: number; previous: string }>();

/** Restore the initial value only after every overlay has released its lock. */
export function lockBodyScroll(body: ScrollBody = document.body): () => void {
  let state = locks.get(body);
  if (!state) {
    state = { count: 0, previous: body.style.overflow };
    locks.set(body, state);
  }
  state.count++;
  body.style.overflow = 'hidden';
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count--;
    if (state.count === 0) {
      body.style.overflow = state.previous;
      locks.delete(body);
    }
  };
}
