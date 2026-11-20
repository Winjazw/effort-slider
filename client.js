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
.det-pill { display: inline-flex; align-items: center; gap: 5px; max-width: 220px; height: 24px; padding: 0 8px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 999px; background: rgba(255, 255, 255, 0.05); color: #b9b6c6; font: 500 11.5px/1 Inter, system-ui, -apple-system, sans-serif; letter-spacing: 0.01em; cursor: pointer; transition: background 140ms ease, color 140ms ease, border-color 140ms ease; }
.det-pill:hover { background: rgba(255, 255, 255, 0.09); color: #ece9f6; border-color: rgba(255, 255, 255, 0.16); }
.det-pill[aria-expanded='true'] { background: rgba(139, 92, 246, 0.18); border-color: rgba(167, 139, 250, 0.45); color: #efeafd; }
.det-pill:disabled { opacity: 0.45; cursor: default; }
.det-pill__dot { flex: none; width: 5px; height: 5px; border-radius: 50%; background: #7f74a0; transition: background 160ms ease, box-shadow 160ms ease; }
.det-pill__dot[data-max='1'] { background: #c4b5fd; box-shadow: 0 0 7px rgba(196, 181, 253, 0.9); }
.det-pill__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.det-pill__tier { flex: none; color: #9a91bd; }
.det-pill__tier[data-max='1'] { color: #c4b5fd; }
.det-pill__chev { flex: none; opacity: 0.55; }
.det-panel { position: fixed; z-index: 90; width: 220px; box-sizing: border-box; padding: 10px 10px 9px; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; background: rgba(43, 40, 46, 0.97); box-shadow: 0 14px 32px -16px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05); color: #e8e5f2; font-family: Inter, system-ui, -apple-system, sans-serif; animation: det-in 150ms cubic-bezier(0.22, 0.7, 0.3, 1); }
@keyframes det-in { from { opacity: 0; transform: translateY(5px) scale(0.99); } to { opacity: 1; transform: none; } }
.det-head { display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%; margin: 0 0 8px; padding: 6px 4px 7px; border: 0; border-radius: 10px; background: transparent; color: inherit; cursor: pointer; transition: background 140ms ease; }
.det-head:hover { background: rgba(255, 255, 255, 0.055); }
.det-head:focus-visible { outline: 2px solid rgba(167, 139, 250, 0.75); outline-offset: 1px; }
.det-head__tier { width: 100%; text-align: center; font-size: 12px; font-weight: 600; line-height: 1.15; color: #a99bd6; transition: color 200ms ease; }
.det-head__tier[data-max='1'] { background: linear-gradient(96deg, #cdb9ff 0%, #a98cf7 46%, #8b5cf6 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.det-head__model { display: flex; align-items: center; gap: 3px; width: fit-content; max-width: 100%; margin: 0 auto; color: #a9a6b8; font: 400 10.5px/1.3 Inter, system-ui, -apple-system, sans-serif; }
.det-head:hover .det-head__model { color: #ddd9ea; }
.det-head__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.det-models { max-height: 208px; margin: -2px 0 8px; padding: 3px; overflow-y: auto; border-radius: 10px; background: rgba(0, 0, 0, 0.28); scrollbar-width: thin; -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 16px), transparent); mask-image: linear-gradient(to bottom, #000 calc(100% - 16px), transparent); }
.det-models__group { padding: 7px 6px 3px; color: #74718a; font-size: 9px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.det-models__row { display: flex; align-items: center; gap: 6px; width: 100%; min-height: 29px; padding: 5px 8px; border: 0; border-radius: 7px; background: transparent; color: #cfcbdd; font: 400 11.5px/1.3 Inter, system-ui, -apple-system, sans-serif; text-align: left; cursor: pointer; }
.det-models__row:hover { background: rgba(255, 255, 255, 0.07); color: #fff; }
.det-models__row[data-on='1'] { color: #fff; background: rgba(139, 92, 246, 0.2); }
.det-models__effort { margin-left: auto; flex: none; color: #8b87a0; font-size: 9.5px; }
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
.det-scale { position: relative; height: 10px; margin-top: 7px; color: #7b7790; font-size: 9px; line-height: 1.2; }
.det-scale span { position: absolute; top: 0; white-space: nowrap; transform: translateX(-50%); transition: color 160ms ease; }
.det-scale span[data-on='1'] { color: #ddd8ef; }
.det-empty { margin: 8px 0 1px; color: #8a869c; font-size: 10.5px; line-height: 1.45; text-align: center; }
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

window.__ModuleLoader__.load({
  id: 'dsh-effort-tiers',
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
      const [showModels, setShowModels] = React.useState(false);
      const [draft, setDraft] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [anchor, setAnchor] = React.useState(null);

      const triggerRef = React.useRef(null);
      const panelRef = React.useRef(null);
      const trackRef = React.useRef(null);
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
              e('span', { className: 'det-models__name' }, model.name),
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
          ? e('div', { className: 'det-models' }, rows.length ? rows : e('div', { className: 'det-models__group' }, '正在读取模型目录…'))
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
      );

      return e(
        React.Fragment,
        null,
        pill,
        createPortal ? createPortal(panel, document.body) : panel,
      );
    }

    /**
     * Bind the directory resolver per Session so the control works whether or
     * not the slot passes injected props.
     */
    function makeBound(models) {
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
        return e(TierControl, face);
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
          element.setAttribute('data-dsh-plugin', 'dsh-effort-tiers');
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
        ctx.slots.inject('conversation.input.model', () =>
          ctx.slots.register(
            { name: 'conversation.input.model' },
            makeBound(models),
            ),
        );
      },
    };
  },
});
