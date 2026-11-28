/**
 * Effort tiers — browser half.
 *
 * Adds one compact control to the composer's left tool row. The control shows
 * the current reasoning tier and opens a panel whose track is a real draggable
 * slider over the Session model's declared reasoning efforts. The top tier
 * lights the track up as a drifting cosmic particle field.
 *
 * State comes from the shared per-Session model directory that
 * `@deepseek-ai/dsh-client-ui-model-selection` provides as
 * `ctx.modelDirectories`; writes go through `directory.select`, which is the
 * same `session.selectModel` call the shipped selector uses.
 */

const CSS = `
.det-pill, .det-pill__dot, .det-panel, .det-head, .det-models, .det-models__row, .det-track, .det-track__dim, .det-track__ticks i { corner-shape: round; }
.det-pill { display: inline-flex; align-items: center; gap: 5px; max-width: 220px; height: 24px; padding: 0 8px; border: 1px solid var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.1)); border-radius: 999px; background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.05)); color: var(--dsw-alias-label-secondary, #b9b6c6); font: 500 11.5px/1 Inter, system-ui, -apple-system, sans-serif; letter-spacing: 0.01em; cursor: pointer; transition: background 140ms ease, color 140ms ease, border-color 140ms ease; }
.det-pill:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.09)); color: var(--dsw-alias-label-primary, #ece9f6); border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.16)); }
.det-pill[aria-expanded='true'] { background: rgba(139, 92, 246, 0.18); border-color: rgba(167, 139, 250, 0.45); color: var(--dsw-alias-label-primary, #efeafd); }
.det-pill:disabled { opacity: 0.45; cursor: default; }
.det-pill__dot { flex: none; width: 5px; height: 5px; border-radius: 50%; background: var(--dsw-alias-label-caption, #7f74a0); transition: background 160ms ease, box-shadow 160ms ease; }
.det-pill__dot[data-max='1'] { background: var(--det-accent-soft, #c4b5fd); box-shadow: 0 0 7px var(--det-accent-glow, rgba(196, 181, 253, 0.9)); }
.det-pill__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.det-pill__tier { flex: none; color: var(--dsw-alias-label-secondary, #9a91bd); }
.det-pill__tier[data-max='1'] { color: var(--det-accent-soft, #c4b5fd); }
.det-pill__chev { flex: none; opacity: 0.55; }
.det-panel { position: fixed; z-index: 90; width: 220px; box-sizing: border-box; padding: 10px 10px 9px; border: 1px solid var(--det-line, rgba(255, 255, 255, 0.09)); border-radius: 14px; background: var(--det-surface, rgba(43, 40, 46, 0.97)); box-shadow: 0 14px 32px -16px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05); color: var(--dsw-alias-label-primary, #e8e5f2); font-family: Inter, system-ui, -apple-system, sans-serif; animation: det-in 150ms cubic-bezier(0.22, 0.7, 0.3, 1); }
@keyframes det-in { from { opacity: 0; transform: translateY(5px) scale(0.99); } to { opacity: 1; transform: none; } }
.det-head { display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%; margin: 0 0 8px; padding: 6px 4px 7px; border: 0; border-radius: 10px; background: transparent; color: inherit; cursor: pointer; transition: background 140ms ease; }
.det-head:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.055)); }
.det-head:focus-visible { outline: 2px solid rgba(167, 139, 250, 0.75); outline-offset: 1px; }
.det-head__tier { width: 100%; text-align: center; font-size: 12px; font-weight: 600; line-height: 1.15; color: var(--det-tier, #a99bd6); transition: color 200ms ease; }
.det-head__tier[data-max='1'] { background: linear-gradient(96deg, var(--det-grad-a, #cdb9ff) 0%, var(--det-grad-b, #a98cf7) 46%, var(--det-grad-c, #8b5cf6) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.det-head__model { display: flex; align-items: center; gap: 3px; width: fit-content; max-width: 100%; margin: 0 auto; color: var(--dsw-alias-label-secondary, #a9a6b8); font: 400 10.5px/1.3 Inter, system-ui, -apple-system, sans-serif; }
.det-head:hover .det-head__model { color: var(--dsw-alias-label-primary, #ddd9ea); }
.det-head__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.det-models { max-height: 208px; margin: -2px 0 8px; padding: 3px; overflow-y: auto; border-radius: 10px; background: var(--det-surface-2, rgba(0, 0, 0, 0.28)); scrollbar-width: thin; }
.det-models[data-edge='bottom'] { -webkit-mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 16px), transparent 100%); mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 16px), transparent 100%); }
.det-models[data-edge='top'] { -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 16px, #000 100%); mask-image: linear-gradient(to bottom, transparent 0, #000 16px, #000 100%); }
.det-models[data-edge='both'] { -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%); mask-image: linear-gradient(to bottom, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%); }
.det-models__group { padding: 7px 6px 3px; color: var(--dsw-alias-label-secondary, #74718a); font-size: 9px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.det-models__row { display: flex; flex-wrap: nowrap; align-items: center; gap: 6px; width: 100%; min-height: 29px; padding: 5px 8px; border: 0; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-primary, #cfcbdd); font: 400 11.5px/1.3 Inter, system-ui, -apple-system, sans-serif; text-align: left; cursor: pointer; }
.det-models__name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.det-models__row:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.07)); color: var(--dsw-alias-label-primary, #fff); }
.det-models__row[data-on='1'] { color: #fff; background: rgba(139, 92, 246, 0.2); }
.det-models__effort { margin-left: auto; flex: none; color: var(--dsw-alias-label-secondary, #8b87a0); font-size: 9.5px; }
.det-track { position: relative; height: 23px; border-radius: 999px; overflow: hidden; background: linear-gradient(92deg, #4566ea 0%, #6560dd 34%, #7a55cf 66%, #8a55d6 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.32), 0 6px 14px -10px rgba(126, 76, 240, 0.9); cursor: pointer; touch-action: none; outline: none; -webkit-tap-highlight-color: transparent; }
.det-track:focus-visible, .det-slider:focus-visible .det-track { box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 0 2px rgba(167, 139, 250, 0.75), 0 6px 14px -10px rgba(126, 76, 240, 0.9); }
.det-slider[data-disabled='1'] { cursor: default; }
.det-slider[data-disabled='1'] .det-knob { opacity: 0.5; }
.det-track__gloss { position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.05) 46%, rgba(0, 0, 0, 0.16) 100%); pointer-events: none; }
.det-track__nebula { position: absolute; inset: 0; border-radius: inherit; opacity: calc(var(--e) * 0.95); background: radial-gradient(46px 28px at 16% 26%, rgba(168,85,247,0.72), transparent 72%), radial-gradient(54px 31px at 56% 76%, rgba(99,102,241,0.66), transparent 72%), radial-gradient(42px 24px at 84% 28%, rgba(139,92,246,0.62), transparent 72%), radial-gradient(32px 20px at 36% 60%, rgba(56,189,248,0.28), transparent 72%); filter: blur(5px); mix-blend-mode: screen; animation: det-breathe 9s ease-in-out infinite alternate; pointer-events: none; }
@keyframes det-breathe { from { transform: translate3d(-4px, 1px, 0) scale(1); } to { transform: translate3d(5px, -1px, 0) scale(1.08); } }
.det-track__stars { position: absolute; top: 0; bottom: 0; left: -75px; right: -75px; pointer-events: none; background-repeat: repeat; background-size: 75px 23px; background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='30'><circle cx='7' cy='7' r='0.9' fill='%23ffffff' fill-opacity='0.95'/><circle cx='21' cy='19' r='0.6' fill='%23ffffff' fill-opacity='0.7'/><circle cx='34' cy='4' r='0.8' fill='%23ffffff' fill-opacity='0.85'/><circle cx='46' cy='13' r='1.0' fill='%23ffffff' fill-opacity='1.0'/><circle cx='58' cy='24' r='0.6' fill='%23ffffff' fill-opacity='0.65'/><circle cx='67' cy='9' r='0.7' fill='%23ffffff' fill-opacity='0.8'/><circle cx='78' cy='17' r='1.05' fill='%23ffffff' fill-opacity='0.95'/><circle cx='88' cy='6' r='0.6' fill='%23ffffff' fill-opacity='0.7'/><circle cx='91' cy='26' r='0.75' fill='%23ffffff' fill-opacity='0.8'/><circle cx='14' cy='26' r='0.65' fill='%23ffffff' fill-opacity='0.7'/><circle cx='41' cy='27' r='0.55' fill='%23ffffff' fill-opacity='0.6'/><circle cx='72' cy='29' r='0.5' fill='%23ffffff' fill-opacity='0.55'/><circle cx='52' cy='3' r='0.55' fill='%23ffffff' fill-opacity='0.6'/><circle cx='27' cy='10' r='0.5' fill='%23ffffff' fill-opacity='0.55'/></svg>"); opacity: calc(0.35 + var(--e) * 0.6); animation: det-drift 15s linear infinite; }
@keyframes det-drift { from { transform: translateX(0); } to { transform: translateX(-75px); } }
@keyframes det-twinkle { 0%, 100% { opacity: calc(var(--e) * 0.95); } 50% { opacity: calc(var(--e) * 0.55); } }
.det-track__aura { position: absolute; top: -40%; bottom: -40%; left: 0; width: 52%; opacity: calc(var(--e) * 0.9); background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(226,218,255,0.62) 46%, rgba(147,110,255,0.42) 64%, rgba(255,255,255,0) 100%); filter: blur(8px); animation: det-sweep 7.5s ease-in-out infinite; pointer-events: none; }
@keyframes det-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }
.det-track__dim { position: absolute; top: 0; bottom: 0; right: 0; width: calc(100% - 13px - var(--p) * (100% - 26px)); border-radius: 999px; background: rgba(6, 6, 9, 0.34); pointer-events: none; }
.det-track__ticks { position: absolute; inset: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 13px; pointer-events: none; }
.det-track__ticks i { width: 2px; height: 2px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); }
.det-track__ticks i[data-on='1'] { background: rgba(255, 255, 255, 0.92); }
.det-slider { position: relative; touch-action: none; }
.det-knob { position: absolute; top: -1.5px; left: 0; width: 100%; height: 26px; transform: translateX(calc(var(--p) * (100% - 26px))); transition: transform 60ms linear; pointer-events: none; }
.det-slider[data-dragging='1'] .det-knob { transition: none; }
.det-knob__disc { position: absolute; left: 0; top: 0; width: 26px; height: 26px; overflow: visible; filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.42)) drop-shadow(0 0 calc(var(--e) * 5px) rgba(196, 181, 253, calc(var(--e) * 0.85))); }
.det-knob__disc circle { transform-box: fill-box; transform-origin: center; }
.det-knob__ring { opacity: calc(0.3 + var(--e) * 0.7); transform: scale(calc(1 + var(--e) * 0.06)); }
.det-scale { position: relative; height: 10px; margin-top: 7px; color: var(--dsw-alias-label-secondary, #7b7790); font-size: 9px; line-height: 1.2; }
.det-scale span { position: absolute; top: 0; white-space: nowrap; transform: translateX(-50%); transition: color 160ms ease; }
.det-scale span[data-on='1'] { color: var(--dsw-alias-label-primary, #ddd8ef); }
.det-empty { margin: 8px 0 1px; color: var(--dsw-alias-label-secondary, #8a869c); font-size: 10.5px; line-height: 1.45; text-align: center; }

/* Theme accents: the dark defaults keep the cosmic palette; light resolves to
   deeper violets so the tinted text keeps contrast on a white surface. */
.det-pill, .det-panel { --det-accent-soft: #c4b5fd; --det-accent-glow: rgba(196, 181, 253, 0.9); --det-accent-solid: #8b5cf6; --det-tier: #a99bd6; --det-grad-a: #cdb9ff; --det-grad-b: #a98cf7; --det-grad-c: #8b5cf6; --det-surface: rgba(43, 40, 46, 0.97); --det-surface-2: rgba(0, 0, 0, 0.28); --det-line: rgba(255, 255, 255, 0.09); }
body:not([data-ds-dark-theme]) .det-pill, body:not([data-ds-dark-theme]) .det-panel { --det-accent-soft: #7c3aed; --det-accent-glow: rgba(124, 58, 237, 0.45); --det-accent-solid: #7c3aed; --det-tier: #6d28d9; --det-grad-a: #7c3aed; --det-grad-b: #6d28d9; --det-grad-c: #5b21b6; --det-surface: #ffffff; --det-surface-2: rgba(15, 17, 21, 0.045); --det-line: rgba(15, 17, 21, 0.09); }
body:not([data-ds-dark-theme]) .det-panel { box-shadow: 0 16px 34px -18px rgba(24, 20, 40, 0.42), 0 0 0 1px rgba(24, 20, 40, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9); }
body:not([data-ds-dark-theme]) .det-pill { background: rgba(38, 49, 72, 0.06); }
body:not([data-ds-dark-theme]) .det-pill:hover { background: rgba(38, 49, 72, 0.1); }
body:not([data-ds-dark-theme]) .det-pill[aria-expanded='true'] { color: #4c1d95; }
body:not([data-ds-dark-theme]) .det-models__row[data-on='1'] { color: #2a2340; background: rgba(124, 58, 237, 0.12); }
body:not([data-ds-dark-theme]) .det-track__dim { background: rgba(255, 255, 255, 0.3); }

/* Team switch: one row under the ladder, the same selection the shipped model
   menu carries in conversation.input.model.options. */
.det-team { display: flex; align-items: center; gap: 7px; width: 100%; margin: 9px 0 0; padding: 8px 5px 0; border: 0; border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.1)); border-radius: 0 0 8px 8px; background: transparent; color: var(--dsw-alias-label-secondary, #a9a6b8); font: 500 11px/1.2 Inter, system-ui, -apple-system, sans-serif; text-align: left; cursor: pointer; transition: color 140ms ease; }
.det-team:hover { color: var(--dsw-alias-label-primary, #ece9f6); }
.det-team:focus-visible { outline: 2px solid var(--det-accent-glow, rgba(167, 139, 250, 0.75)); outline-offset: 1px; }
.det-team:disabled { opacity: 0.55; cursor: default; }
.det-team__box { flex: none; display: grid; place-items: center; width: 14px; height: 14px; border: 1px solid var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.3)); border-radius: 4px; background: transparent; transition: background 140ms ease, border-color 140ms ease; }
.det-team__box[data-on='1'] { border-color: transparent; background: var(--det-accent-solid, #8b5cf6); }
.det-team__tick { display: block; }
.det-team__label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.det-team__note { flex: none; color: var(--dsw-alias-state-error-primary, #f87171); font-size: 9.5px; }
`;

const EMPTY_STATE = {
  current: null,
  groups: [],
  failures: [],
  status: 'idle',
  error: null,
  pending: null,
  routable: null,
};

const INSET = 13;

function modelNameOf(state, selection) {
  if (!selection) return '选择模型';
  for (const group of state.groups || []) {
    if (group.id !== selection.provider) continue;
    for (const model of group.models || []) {
      if (model.id === selection.model) return model.name;
    }
    return group.name;
  }
  return selection.model;
}

function reasoningOf(state, selection) {
  if (!selection) return null;
  for (const group of state.groups || []) {
    if (group.id !== selection.provider) continue;
    for (const model of group.models || []) {
      if (model.id === selection.model) return model.reasoning || null;
    }
  }
  return null;
}

function effortIndexOf(efforts, selection, reasoning) {
  if (!efforts.length) return 0;
  const wanted = (selection && selection.reasoningEffort) || (reasoning && reasoning.defaultEffort);
  const found = efforts.findIndex(effort => effort.id === wanted);
  return found < 0 ? 0 : found;
}

function ratioOfIndex(index, count) {
  if (count <= 1) return 1;
  return index / (count - 1);
}

/** Only the last ~44% of travel lights particles, so the top tier is the payoff. */
function energyOf(ratio) {
  const t = Math.max(0, Math.min(1, (ratio - 0.56) / 0.44));
  return t * t * (3 - 2 * t);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function edgeOf(el) {
  if (!el) return 'none';
  const moreBelow = el.scrollHeight - el.scrollTop - el.clientHeight > 2;
  const moreAbove = el.scrollTop > 2;
  if (moreAbove && moreBelow) return 'both';
  if (moreBelow) return 'bottom';
  if (moreAbove) return 'top';
  return 'none';
}

window.__ModuleLoader__.load({
  id: 'effort-slider',
  factory(require) {
    const React = require('react');
    const e = React.createElement;

    let createPortal = null;
    try {
      createPortal = require('react-dom').createPortal;
    } catch (error) {
      createPortal = null;
    }

    function useStoreSnapshot(store) {
      const subscribe = React.useCallback(
        notify => (store ? store.subscribe(notify) : () => {}),
        [store],
      );
      const snapshot = React.useCallback(
        () => (store ? store.getSnapshot() : EMPTY_STATE),
        [store],
      );
      const sync = React.useSyncExternalStore;
      const [fallback, setFallback] = React.useState(snapshot);
      React.useEffect(() => {
        if (!store || sync) return undefined;
        setFallback(store.getSnapshot());
        return store.subscribe(() => setFallback(store.getSnapshot()));
      }, [store, sync]);
      if (sync) return sync(subscribe, snapshot);
      return fallback;
    }

    function Chevron(props) {
      return e(
        'svg',
        {
          className: props.className,
          viewBox: '0 0 24 24',
          width: props.size || 12,
          height: props.size || 12,
          fill: 'none',
          'aria-hidden': 'true',
        },
        e('path', {
          d: props.up ? 'M6 14.5 12 8.5l6 6' : 'M9 6l6 6-6 6',
          stroke: 'currentColor',
          'stroke-width': 1.9,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }),
      );
    }

    function TierControl(props) {
      const state = useStoreSnapshot(props.store) || EMPTY_STATE;
      const locked = props.locked === true;
      const available = props.available !== false && !locked;

      const [open, setOpen] = React.useState(false);
      const [listEdge, setListEdge] = React.useState('none');
      const [showModels, setShowModels] = React.useState(false);
      const [draft, setDraft] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [anchor, setAnchor] = React.useState(null);

      const triggerRef = React.useRef(null);
      const panelRef = React.useRef(null);
      const trackRef = React.useRef(null);
      const listRef = React.useRef(null);
      const draggingRef = React.useRef(false);

      const reasoning = reasoningOf(state, state.current);
      const efforts = (reasoning && reasoning.efforts) || [];
      const count = efforts.length;
      const index = effortIndexOf(efforts, state.current, reasoning);
      const ratio = draft === null ? (count ? ratioOfIndex(index, count) : 0) : draft;
      const energy = count ? energyOf(ratio) : 0;
      const top = count > 0 && index === count - 1;

      const commit = React.useCallback(
        nextIndex => {
          if (!available || !count || busy) return;
          const effort = efforts[nextIndex];
          const current = state.current;
          if (!effort || !current || current.reasoningEffort === effort.id) return;
          setBusy(true);
          Promise.resolve(
            props.select({
              provider: current.provider,
              model: current.model,
              reasoningEffort: effort.id,
            }),
          )
            .catch(() => {})
            .then(() => setBusy(false));
        },
        [available, busy, count, efforts, props.select, state.current],
      );

      const openPanel = () => {
        const rect = triggerRef.current && triggerRef.current.getBoundingClientRect();
        if (rect) {
          const width = 220;
          setAnchor({
            left: clamp(rect.left, 12, Math.max(12, window.innerWidth - width - 12)),
            bottom: window.innerHeight - rect.top + 10,
          });
        }
        setOpen(true);
        if (props.load) props.load();
      };

      React.useEffect(() => {
        if (!open) return undefined;
        const reposition = () => {
          const rect = triggerRef.current && triggerRef.current.getBoundingClientRect();
          if (!rect) return;
          setAnchor({
            left: clamp(rect.left, 12, Math.max(12, window.innerWidth - 232)),
            bottom: window.innerHeight - rect.top + 10,
          });
        };
        window.addEventListener('resize', reposition);
        window.addEventListener('scroll', reposition, true);
        return () => {
          window.removeEventListener('resize', reposition);
          window.removeEventListener('scroll', reposition, true);
        };
      }, [open]);

      React.useEffect(() => {
        if (!showModels) {
          setListEdge('none');
          return undefined;
        }
        const raf = requestAnimationFrame(() => {
          const el = listRef.current;
          if (el) setListEdge(edgeOf(el));
        });
        return () => cancelAnimationFrame(raf);
      }, [showModels]);

      React.useEffect(() => {
        if (!open) return undefined;
        const onDown = event => {
          const panel = panelRef.current;
          const trigger = triggerRef.current;
          if (panel && panel.contains(event.target)) return;
          if (trigger && trigger.contains(event.target)) return;
          setOpen(false);
          setShowModels(false);
        };
        const onKey = event => {
          if (event.key !== 'Escape') return;
          setOpen(false);
          setShowModels(false);
        };
        document.addEventListener('pointerdown', onDown, true);
        document.addEventListener('keydown', onKey);
        return () => {
          document.removeEventListener('pointerdown', onDown, true);
          document.removeEventListener('keydown', onKey);
        };
      }, [open]);

      const rectRef = React.useRef(null);
      const frameRef = React.useRef(0);
      const queuedRef = React.useRef(null);

      const ratioAt = event => {
        const el = trackRef.current;
        if (!el) return 0;
        const rect = rectRef.current || el.getBoundingClientRect();
        const span = Math.max(1, rect.width - INSET * 2);
        return clamp((event.clientX - rect.left - INSET) / span, 0, 1);
      };

      const queueDraft = value => {
        queuedRef.current = value;
        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = 0;
          if (queuedRef.current !== null) setDraft(queuedRef.current);
        });
      };

      const flushDraft = () => {
        if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = 0; }
        queuedRef.current = null;
      };

      React.useEffect(() => () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      }, []);

      const onPointerDown = event => {
        if (!available || !count || busy) return;
        event.preventDefault();
        draggingRef.current = true;
        rectRef.current = event.currentTarget.getBoundingClientRect();
        if (event.currentTarget.setPointerCapture) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
        setDraft(ratioAt(event));
      };

      const onPointerMove = event => {
        if (!draggingRef.current) return;
        queueDraft(ratioAt(event));
      };

      const onPointerUp = event => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        const released = ratioAt(event);
        flushDraft();
        rectRef.current = null;
        setDraft(null);
        commit(Math.round(released * (count - 1)));
      };

      const onKeyDown = event => {
        if (!available || !count) return;
        const { key } = event;
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
          event.preventDefault();
          let next = index;
          if (key === 'ArrowLeft') next = index - 1;
          if (key === 'ArrowRight') next = index + 1;
          if (key === 'Home') next = 0;
          if (key === 'End') next = count - 1;
          commit(clamp(next, 0, count - 1));
        }
      };

      const chooseModel = (providerId, model) => {
        if (!available) return;
        setShowModels(false);
        const modelReasoning = model.reasoning || null;
        const effortId =
          (modelReasoning && modelReasoning.defaultEffort) ||
          (modelReasoning && modelReasoning.efforts && modelReasoning.efforts[0] && modelReasoning.efforts[0].id);
        const selection = { provider: providerId, model: model.id };
        if (effortId) selection.reasoningEffort = effortId;
        Promise.resolve(props.select(selection)).catch(() => {});
      };

      const pill = e(
        'button',
        {
          ref: triggerRef,
          type: 'button',
          className: 'det-pill',
          disabled: locked,
          title: '推理强度',
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          onClick: () => (open ? (setOpen(false), setShowModels(false)) : openPanel()),
        },
        e('span', { className: 'det-pill__dot', 'data-max': top ? '1' : undefined }),
        e('span', { className: 'det-pill__name' }, modelNameOf(state, state.current)),
        e(
          'span',
          { className: 'det-pill__tier', 'data-max': top ? '1' : undefined },
          count ? efforts[index].name : '无档位',
        ),
        e(Chevron, { className: 'det-pill__chev', size: 10 }),
      );

      if (!open) return pill;

      const rows = [];
      for (const group of state.groups || []) {
        rows.push(
          e('div', { className: 'det-models__group', key: 'g:' + group.id }, group.name),
        );
        for (const model of group.models || []) {
          const on =
            state.current && state.current.provider === group.id && state.current.model === model.id;
          const effortName =
            model.reasoning && model.reasoning.efforts && model.reasoning.efforts.length
              ? model.reasoning.efforts.length + ' 档'
              : '无档位';
          rows.push(
            e(
              'button',
              {
                type: 'button',
                key: 'm:' + group.id + '/' + model.id,
                className: 'det-models__row',
                'data-on': on ? '1' : undefined,
                onClick: () => chooseModel(group.id, model),
              },
              e('span', { className: 'det-models__name', title: model.name }, model.name),
              e('span', { className: 'det-models__effort' }, effortName),
            ),
          );
        }
      }
      for (const failure of state.failures || []) {
        rows.push(
          e(
            'div',
            { className: 'det-models__group', key: 'f:' + failure.id },
            failure.name + ' · ' + failure.message,
          ),
        );
      }

      const selectableTeam =
        props.team && props.sessionId
          ? e(TeamToggle, {
              key: 'team',
              api: props.team,
              sessionId: props.sessionId,
              useProjection: props.useProjection,
              useSession: props.useSession,
            })
          : null;

      const panel = e(
        'div',
        {
          ref: panelRef,
          className: 'det-panel',
          role: 'dialog',
          'aria-label': '推理强度',
          style: anchor ? { left: anchor.left + 'px', bottom: anchor.bottom + 'px' } : { left: 12 },
        },
        e(
          'button',
          {
            type: 'button',
            className: 'det-head',
            'aria-expanded': showModels,
            'aria-label': '切换模型',
            onClick: () => setShowModels(value => !value),
          },
          e('span', { className: 'det-head__tier', 'data-max': top ? '1' : undefined }, count ? efforts[index].name : '无推理档位'),
          e(
            'span',
            { className: 'det-head__model' },
            e('span', { className: 'det-head__name' }, modelNameOf(state, state.current)),
            e(Chevron, { size: 12 }),
          ),
        ),
        showModels
          ? e(
              'div',
              {
                ref: listRef,
                className: 'det-models',
                'data-edge': listEdge,
                onScroll: () => setListEdge(edgeOf(listRef.current)),
              },
              rows.length ? rows : e('div', { className: 'det-models__group' }, '正在读取模型目录…'),
            )
          : null,
        e(
          'div',
          {
            ref: trackRef,
            className: 'det-slider',
            role: 'slider',
            tabIndex: count ? 0 : -1,
            'aria-label': '推理强度',
            'aria-orientation': 'horizontal',
            'aria-valuemin': 1,
            'aria-valuemax': Math.max(count, 1),
            'aria-valuenow': index + 1,
            'aria-valuetext': count ? efforts[index].name : '不可用',
            'data-disabled': !available || !count ? '1' : undefined,
            'data-dragging': draft === null ? undefined : '1',
            style: { '--p': String(ratio), '--e': String(energy) },
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel: onPointerUp,
            onKeyDown,
          },
          e(
            'div',
            { className: 'det-track', 'aria-hidden': 'true' },
            e('div', { className: 'det-track__gloss', 'aria-hidden': 'true' }),
            e('div', { className: 'det-track__nebula', 'aria-hidden': 'true' }),
            e('div', { className: 'det-track__stars', 'aria-hidden': 'true' }),
            e('div', { className: 'det-track__aura', 'aria-hidden': 'true' }),
            e('div', { className: 'det-track__dim', 'aria-hidden': 'true' }),
            e(
              'div',
              { className: 'det-track__ticks', 'aria-hidden': 'true' },
              efforts.map((effort, position) =>
                e('i', { key: effort.id, 'data-on': position <= index ? '1' : undefined }),
              ),
            ),
          ),
          e(
            'div',
            { className: 'det-knob', 'aria-hidden': 'true' },
            e(
              'svg',
              { className: 'det-knob__disc', viewBox: '0 0 34 34', width: 26, height: 26 },
              e('circle', { className: 'det-knob__ring', cx: 17, cy: 17, r: 16.5, fill: 'none', stroke: '#ffffff', strokeWidth: 1, strokeOpacity: 0.55, vectorEffect: 'non-scaling-stroke' }),
              e('circle', { cx: 17, cy: 17, r: 15.6, fill: '#ffffff' }),
            ),
            ),
        ),
        count
          ? e(
              'div',
              { className: 'det-scale', 'aria-hidden': 'true' },
              efforts.map((effort, position) =>
                e(
                  'span',
                  {
                    key: effort.id,
                    'data-on': position === index ? '1' : undefined,
                    style: { left: 'calc(13px + (100% - 26px) * ' + ratioOfIndex(position, count) + ')' },
                  },
                  effort.name,
                ),
              ),
            )
          : e('p', { className: 'det-empty' }, '当前模型没有推理档位，换一个带档位的模型试试。'),
        selectableTeam,
      );

      return e(
        React.Fragment,
        null,
        pill,
        createPortal ? createPortal(panel, document.body) : panel,
      );
    }

    /**
     * Team selection bound to the Client Session services: the same
     * `agentTeams.setEnabled` call the shipped model menu runs from
     * `conversation.input.model.options`, plus the `agentTeam` projection for
     * the saved state that menu read through `useProjection`.
     */
    function makeTeam(ctx) {
      const lookup = name => {
        try {
          return ctx.get(name);
        } catch (error) {
          return undefined;
        }
      };
      const apiOf = () => {
        const direct = lookup('remote.agentTeams');
        if (direct && typeof direct.setEnabled === 'function') return direct;
        const remote = lookup('remote');
        if (remote && remote.agentTeams && typeof remote.agentTeams.setEnabled === 'function') {
          return remote.agentTeams;
        }
        return null;
      };
      return {
        available() {
          return apiOf() !== null;
        },
        /** null means the Session is not resolvable yet; root:false means a subagent. */
        probe(sessionId) {
          const sessions = lookup('sessions');
          if (!sessions || typeof sessions.binding !== 'function' || !sessionId) return null;
          let binding = null;
          try {
            binding = sessions.binding(sessionId);
          } catch (error) {
            return null;
          }
          if (!binding || !binding.session) return null;
          let snapshot = null;
          try {
            snapshot = binding.session.getSnapshot();
          } catch (error) {
            snapshot = null;
          }
          if (snapshot && snapshot.subagent) return { root: false, face: null };
          const projections = binding.session.projections;
          let face = null;
          if (projections && typeof projections.faceOf === 'function') {
            try {
              face = projections.faceOf('agentTeam') || null;
            } catch (error) {
              face = null;
            }
          }
          return { root: true, face };
        },
        set(sessionId, enabled) {
          const api = apiOf();
          if (!api) return Promise.reject(new Error('当前版本没有智能体团队服务'));
          return Promise.resolve(api.setEnabled(sessionId, enabled)).then(result => {
            if (result && result.ok === false) {
              throw new Error((result.error && result.error.message) || '保存失败');
            }
          });
        },
      };
    }

    function TeamToggle(props) {
      const api = props.api;
      const sessionId = props.sessionId;
      const useProjection = props.useProjection;
      const useSession = props.useSession;
      const subagent = useSession ? useSession(snapshot => !!(snapshot && snapshot.subagent)) : false;
      const projected = useProjection ? useProjection('agentTeam') : undefined;
      const [state, setState] = React.useState({ stage: 'probe', on: false, note: null, busy: false });
      const [override, setOverride] = React.useState(null);

      React.useEffect(() => {
        if (useProjection) return undefined;
        let alive = true;
        let tries = 0;
        let timer = 0;
        let unsubscribe = null;
        const attach = () => {
          if (!alive) return;
          if (!api.available()) {
            setState({ stage: 'hidden', on: false, note: null, busy: false });
            return;
          }
          const found = api.probe(sessionId);
          if (!found) {
            if (tries < 8) {
              tries += 1;
              timer = setTimeout(attach, 200);
            }
            return;
          }
          if (found.root === false) {
            setState({ stage: 'hidden', on: false, note: null, busy: false });
            return;
          }
          const face = found.face || null;
          const readOn = () => {
            if (!face) return false;
            let snapshot = undefined;
            try {
              snapshot = face.getSnapshot();
            } catch (error) {
              snapshot = undefined;
            }
            return !!(snapshot && snapshot.enabled);
          };
          setState(current => ({ stage: 'ready', on: readOn(), note: current.note, busy: current.busy }));
          if (face && typeof face.subscribe === 'function') {
            unsubscribe = face.subscribe(() => {
              if (alive) setState(current => (current.busy ? current : { ...current, on: readOn() }));
            });
          }
        };
        attach();
        return () => {
          alive = false;
          if (timer) clearTimeout(timer);
          if (unsubscribe) {
            try {
              unsubscribe();
            } catch (error) {
              /* already gone */
            }
          }
        };
      }, [api, sessionId, useProjection]);

      let stage = 'hidden';
      let saved = false;
      if (subagent) {
        stage = 'hidden';
      } else if (!api || (typeof api.available === 'function' && !api.available())) {
        stage = 'hidden';
      } else if (useProjection) {
        stage = projected === undefined ? 'hidden' : 'ready';
        saved = !!(projected && projected.enabled);
      } else {
        stage = state.stage;
        saved = state.on;
      }
      const on = override === null ? saved : override;

      React.useEffect(() => {
        if (override !== null && !state.busy && saved === override) setOverride(null);
      }, [override, saved, state.busy]);

      const toggle = () => {
        if (state.busy || stage !== 'ready') return;
        const next = !on;
        setOverride(next);
        setState(current => ({ ...current, busy: true, note: null, on: next }));
        Promise.resolve()
          .then(() => api.set(sessionId, next))
          .then(
            () => setState(current => ({ ...current, busy: false, note: null, on: next })),
            error => {
              setOverride(null);
              setState(current => ({
                ...current,
                busy: false,
                note: (error && error.message) || '保存失败',
                on: !next,
              }));
            },
          );
      };

      if (stage !== 'ready') return null;

      return e(
        'button',
        {
          className: 'det-team',
          type: 'button',
          role: 'checkbox',
          'aria-checked': on,
          disabled: state.busy,
          title:
            state.note ||
            '启用智能体团队协作：用共享任务板协调多个智能体的分工与进度，复杂任务表现更好，token 开销也相应更高。',
          onClick: toggle,
        },
        e(
          'span',
          { className: 'det-team__box', 'data-on': on ? '1' : undefined },
          on
            ? e(
                'svg',
                {
                  className: 'det-team__tick',
                  viewBox: '0 0 12 12',
                  width: 9,
                  height: 9,
                  'aria-hidden': 'true',
                },
                e('path', {
                  d: 'M2.4 6.3 4.7 8.6 9.7 3.5',
                  fill: 'none',
                  stroke: '#ffffff',
                  'stroke-width': 1.9,
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                }),
              )
            : null,
        ),
        e('span', { className: 'det-team__label' }, '智能体团队'),
        state.note ? e('span', { className: 'det-team__note' }, '未保存') : null,
      );
    }

    /**
     * Bind the directory resolver per Session so the control works whether or
     * not the slot passes injected props.
     */
    function makeBound(models, team) {
      return function BoundTierControl(props) {
        let face = props;
        if (!props.store && models && props.sessionId) {
          try {
            const directory = models.directoryFor(props.sessionId);
            face = {
              locked: props.locked,
              available: true,
              store: directory.store,
              load: () => {
                directory.load().catch(() => {});
              },
              select: selection => directory.select(selection),
            };
          } catch (error) {
            face = { locked: props.locked, available: false, store: null };
          }
        }
        return e(TierControl, {
          ...face,
          sessionId: props.sessionId,
          team,
          useProjection: props.useProjection,
          useSession: props.useSession,
        });
      };
    }

    return {
      inject: ['slots', 'modelDirectories'],
      apply(ctx) {
        let disposeStyles = null;
        try {
          if (typeof styles !== 'undefined' && styles && typeof styles.insert === 'function') {
            const handle = styles.insert(CSS);
            disposeStyles =
              typeof handle === 'function'
                ? handle
                : () => {
                    if (handle && typeof handle.dispose === 'function') handle.dispose();
                  };
          }
        } catch (error) {
          disposeStyles = null;
        }
        if (!disposeStyles) {
          const element = document.createElement('style');
          element.setAttribute('data-dsh-plugin', 'effort-slider');
          element.textContent = CSS;
          document.head.appendChild(element);
          disposeStyles = () => element.remove();
        }
        ctx.effect(
          () => () => {
            try {
              disposeStyles();
            } catch (error) {
              /* already gone */
            }
          },
          'effort-tiers: styles',
        );

        let models = null;
        try {
          models = ctx.modelDirectories || null;
        } catch (error) {
          models = null;
        }
        let team = null;
        try {
          team = makeTeam(ctx);
        } catch (error) {
          team = null;
        }
        ctx.slots.inject(
          'conversation.input.model',
          () =>
            ctx.slots.register({ name: 'conversation.input.model' }, makeBound(models, team)),
        );
      },
    };
  },
});
