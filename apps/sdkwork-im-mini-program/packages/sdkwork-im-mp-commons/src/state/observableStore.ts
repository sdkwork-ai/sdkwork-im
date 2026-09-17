/**
 * Domain-neutral observable store for mini program packages.
 *
 * Authority: `APP_MINI_PROGRAM_UI_SPEC.md`. WeChat pages drive rendering
 * through `setData`, so a capability package cannot own a rendering library.
 * It owns a plain store instead, and the page subscribes and forwards a
 * projection into `setData`. That keeps one source of truth per capability
 * while the platform binding stays in the page.
 *
 * Deliberately dependency-free: adding a state library would pull a framework
 * into a runtime that ships a fixed bundle budget per subpackage.
 */

export interface ImMpStoreReadResult<TState> {
  readonly state: TState;
  readonly changed: boolean;
}

export type ImMpStoreListener<TState> = (
  state: TState,
  previous: TState,
) => void;

export type ImMpStoreSelector<TState, TSelected> = (state: TState) => TSelected;

export interface ImMpObservableStore<TState> {
  getState(): TState;
  /**
   * Merges a partial patch and notifies listeners only when the result differs.
   *
   * Returns whether anything changed, so callers can skip a `setData` round
   * trip on a no-op update (a repeated list refresh, for example).
   */
  setState(patch: Partial<TState>): boolean;
  /** Replaces state wholesale; used by reset/logout paths. */
  replaceState(state: TState): void;
  subscribe(listener: ImMpStoreListener<TState>): () => void;
  /** Subscribes to a derived slice; fires only when the slice changes. */
  select<TSelected>(
    selector: ImMpStoreSelector<TState, TSelected>,
    listener: (selected: TSelected, previous: TSelected) => void,
  ): () => void;
}

function defaultEquals<TValue>(left: TValue, right: TValue): boolean {
  return Object.is(left, right);
}

export interface ImMpObservableStoreOptions<TState> {
  /** Override slice comparison for `select` (e.g. shallow object compare). */
  readonly equals?: <TValue>(left: TValue, right: TValue) => boolean;
}

export function createImMpObservableStore<TState>(
  initialState: TState,
  options: ImMpObservableStoreOptions<TState> = {},
): ImMpObservableStore<TState> {
  const equals = options.equals ?? defaultEquals;
  let state = initialState;
  const listeners = new Set<ImMpStoreListener<TState>>();

  const notify = (previous: TState): void => {
    for (const listener of [...listeners]) {
      listener(state, previous);
    }
  };

  return {
    getState(): TState {
      return state;
    },
    setState(patch: Partial<TState>): boolean {
      const previous = state;
      let changed = false;
      for (const key of Object.keys(patch) as (keyof TState)[]) {
        const next = patch[key];
        if (next === undefined) {
          continue;
        }
        if (!Object.is(previous[key], next)) {
          changed = true;
          break;
        }
      }
      if (!changed) {
        return false;
      }
      state = { ...previous, ...patch };
      notify(previous);
      return true;
    },
    replaceState(next: TState): void {
      const previous = state;
      state = next;
      notify(previous);
    },
    subscribe(listener: ImMpStoreListener<TState>): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    select<TSelected>(
      selector: ImMpStoreSelector<TState, TSelected>,
      listener: (selected: TSelected, previous: TSelected) => void,
    ): () => void {
      let selected = selector(state);
      return this.subscribe((next) => {
        const nextSelected = selector(next);
        if (equals(nextSelected, selected)) {
          return;
        }
        const previousSelected = selected;
        selected = nextSelected;
        listener(nextSelected, previousSelected);
      });
    },
  };
}
