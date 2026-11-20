<p align="center">
  <img src="docs/assets/hero-en.png" alt="Effort Slider: replaces the DeepSeek Harness model picker with a draggable tier slider" width="100%">
</p>

<h1 align="center">Effort Slider</h1>

<p align="center"><b>A DeepSeek Harness plugin. Swaps the native model picker for a draggable reasoning-effort slider.</b></p>

<p align="center">
  <a href="#install"><b>Install</b></a> ·
  <a href="#features">Features</a> ·
  <a href="#faq">FAQ</a> ·
  <a href="README.md">中文</a>
</p>

## What it is
An in-line composer control that replaces the standard model picker. It enables intuitive, drag-based reasoning effort adjustment.

## Features
- **Drag-to-Snap Slider**: Supports 4-6 tiers with native feel and automatic snap-to-tier behavior.
- **Cosmic Visuals**: Built-in real-time particle system. At `Max` tier, the track transforms into a vibrant cosmic field with drifting nebulae and stars.
- **Persistent State**: Displays the full model name and active tier in a compact composer pill for glanceable context.
- **Host Integration**: Leverages `session.selectModel` to maintain session-specific scope without overriding global defaults.

## Install
1. **Clone**: `git clone https://github.com/Winjazw/dsh-effort-tiers.git`
2. **Add**: Run `dsh plugin --profile desktop add /path/to/dsh-effort-tiers` (for Desktop).
3. **Enable**: Go to the Plugins page in DeepSeek Harness, find `Effort Slider`, and toggle it on.
4. **Reload**: Restart the app or press `Cmd + R` to refresh the window.

## FAQ
- **Does it override global model settings?** No. Switching is scoped to the current conversation session only.
- **Does it affect model latency?** No. It simply calls the model's self-declared reasoning efforts without adding overhead.
- **Can I theme it?** Yes. Tweak the CSS constants at the top of `client.js` and reload (`Cmd + R`) to apply.

## Development
This is a client-side UI plugin. Edits to `client.js` reflect instantly after a window reload.

---
[MIT](LICENSE) · Community Plugin
