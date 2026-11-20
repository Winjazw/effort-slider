<p align="center">
  <img src="docs/assets/hero-zh.png" alt="Effort Slider：把 DeepSeek Harness 的模型选择器换成一个能拖的档位滑块" width="100%">
</p>

<h1 align="center">Effort Slider</h1>

<p align="center"><b>DeepSeek Harness 插件。将原生的模型选择器替换为可拖拽的推理档位滑块。</b></p>

<p align="center">
  <a href="#安装"><b>安装</b></a> ·
  <a href="#核心功能">核心功能</a> ·
  <a href="#常见问题">常见问题</a> ·
  <a href="README.en.md">English</a>
</p>

## 它是什么
一个输入框内嵌控件，平替原有的模型选择按钮。它支持通过拖拽直观调整模型的推理强度。

## 核心功能
- **拖拽式档位调节**：支持 4-6 档切换，操作跟手，松手自动吸附。
- **全息视觉反馈**：轨道内置实时粒子系统。推至 `Max` 档时，轨道呈现宇宙紫并伴随动态粒子流，视觉反馈极佳。
- **直观模型胶囊**：收起后在输入框显示模型全名与当前档位，状态一目了然。
- **深度融合**：通过 `session.selectModel` 切换，不影响全局配置，完美兼容原厂逻辑。

## 安装
1. **获取源码**：`git clone https://github.com/Winjazw/dsh-effort-tiers.git`
2. **添加插件**：运行 `dsh plugin --profile desktop add /path/to/dsh-effort-tiers`（桌面版）。
3. **启用插件**：在 DeepSeek Harness 的「插件」页面找到 `Effort Slider` 并开启开关。
4. **重载**：重启应用或按下 `Cmd + R` 刷新界面。

## 常见问题
- **会影响全局模型设置吗？** 不会，切换仅针对当前会话。
- **它会改变模型的运行速度吗？** 不会。插件仅调用模型自身声明的推理档位，不额外引入 Prompt 干扰。
- **可以自定义外观吗？** 可以。修改 `client.js` 顶部的 CSS 常量即可调整尺寸与配色，无需重新安装。

## 开发
本插件为客户端纯 UI 插件。修改 `client.js` 后，只需在应用内按下 `Cmd + R` 即可实时预览更改。

---
[MIT](LICENSE) · Community Plugin
