任务一：长按 tree node 标记为重点（橙色）并持久化

目标
	•	支持用户在 tree / timeline 的某个 node 上「长按」将其标记为重点。
	•	被标记的节点：
	•	样式变为橙色（或加橙色外圈），表示重点。
	•	标记状态持久化到存储中：同一条对话再次打开 / 刷新后仍然保持。

⸻

1. 增加 conversationId 概念
	1.	在导航组件或上层容器中，增加 conversationId 概念：
	•	从当前页面获取一个稳定的对话 ID（根据实际项目）：
	•	优先从 URL 中解析（如 /chat/:conversationId）。
	•	拿不到时，可以从 data-conversation-id 或全局变量中读取。
	2.	将 conversationId 作为 prop 传给负责渲染 tree / timeline 的组件：
	•	确保该组件在初始化和更新时都能拿到正确的 conversationId。

⸻

2. 为每个 node 确定稳定的 nodeId
	1.	在构建 tree / timeline 数据的时候，为每个节点添加 nodeId 字段：
	•	可以使用在对话中的顺序 index（字符串化，例如 "0", "1"）。
	•	或 messageId + role 的组合。
	2.	确保渲染节点时能拿到 conversationId + nodeId 这两个信息。

⸻

3. 设计并实现「重点标记」存储结构
	1.	定义存储 key 规则（由 Cursor 实现具体存取函数）：
	•	const STORAGE_KEY = 'llm-nav-pinned';
	•	实际持久化格式类似：

{
  [conversationId: string]: {
    [nodeId: string]: boolean; // true = pinned
  }
}


	2.	在当前架构里选择存储方式：
	•	若为 Chrome 扩展：使用 chrome.storage.local 或 chrome.storage.sync。
	•	若为纯前端组件：使用 localStorage。
	3.	封装一个小模块，例如 PinnedStore：
	•	loadPinned(conversationId) -> Promise<Record<nodeId, boolean>>
	•	togglePinned(conversationId, nodeId) -> Promise<void>
	•	setPinned(conversationId, nodeId, value) -> Promise<void>

⸻

4. 实现节点「长按」交互逻辑
	1.	在渲染每个 node 的地方，为节点 DOM 绑定长按事件：
	•	onMouseDown / onTouchStart：记录按下时间，启动 setTimeout。
	•	onMouseUp / onMouseLeave / onTouchEnd：若未达到阈值（比如 500ms），取消长按判定。
	•	当按下持续时间超过阈值时，判断为「长按」，触发标记逻辑。
	2.	长按触发时：
	•	调用 togglePinned(conversationId, nodeId)。
	•	更新当前组件 state：该 node 的 isPinned 取反。
	•	根据 isPinned 刷新样式（变橙色或恢复默认）。

注意：长按和短按要区分好：
	•	短按：正常跳转。
	•	长按：只切换标记，不触发 scroll 跳转。

⸻

5. 初始化时加载 pinned 状态并应用到节点
	1.	在 tree / timeline 组件初始化时：
	•	根据 conversationId 调用 loadPinned(conversationId)。
	•	得到当前对话的 pinned map。
	•	将其合并到组件内部 state / node 数据上，对应节点标记 isPinned = true。
	2.	渲染节点时：
	•	如果 isPinned 为 true，则添加 pinned 的 CSS class。

⸻

6. 橙色重点样式实现
	1.	为 pinned 节点增加一个 class，例如 .nav-node--pinned：
	•	背景或填充色改为橙色；
	•	或增加一圈橙色外环；
	•	要与「当前 active 节点」的样式兼容：
	•	active + pinned 时可以叠加：例如橙色外环 + 白色内部点。
	2.	把样式写在对应的 CSS / style module 中，并保证不会影响原站点样式（用有前缀的 class 名）。

⸻

7. 验证与调试
	1.	打开一条对话：
	•	长按某几个节点 → 它们变成橙色。
	•	刷新页面 → 这些节点仍保持橙色。
	2.	打开另一条 不同的 对话：
	•	pinned 状态应独立，不受上一条对话的影响。
	3.	再次返回第一条对话：
	•	pinned 状态正确恢复。

完成后提交：
git commit -m "Feat: support long-press pinning of timeline nodes with per-conversation persistence"

⸻