/**
 * Package-local state slice descriptors and observable store primitives.
 *
 * Authority: `APP_HARMONY_NATIVE_UI_SPEC.md`. State stays package-local unless
 * declared as a public integration contract; view models own the mapping from
 * store state to what a page renders.
 *
 * The store is intentionally tiny: ArkUI re-renders from `@State`, and a heavier
 * state library in a native root buys nothing that the view-model + store pair
 * does not already give.
 */

export type ImHarmonyChatListener<TState> = (state: TState) => void;

export interface ImHarmonyObservableStore<TState> {
  getState(): TState;
  replaceState(state: TState): void;
  subscribe(listener: ImHarmonyChatListener<TState>): () => void;
}

export function createImHarmonyObservableStore<TState>(
  initialState: TState,
): ImHarmonyObservableStore<TState> {
  let state: TState = initialState;
  const listeners: Array<ImHarmonyChatListener<TState>> = [];
  return {
    getState(): TState {
      return state;
    },
    replaceState(next: TState): void {
      state = next;
      for (const listener of listeners) {
        listener(state);
      }
    },
    subscribe(listener: ImHarmonyChatListener<TState>): () => void {
      listeners.push(listener);
      return () => {
        const index: number = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
      };
    },
  };
}
