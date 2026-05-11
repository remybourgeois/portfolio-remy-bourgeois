// src/lib/actions/sfx.ts
import { audioStore } from '$lib/stores/audio';

export function sfx(node: HTMLElement) {
  function handle() {
    audioStore.engine?.playRandomSFX();
  }
  node.addEventListener('click', handle);
  return {
    destroy() {
      node.removeEventListener('click', handle);
    }
  };
}
