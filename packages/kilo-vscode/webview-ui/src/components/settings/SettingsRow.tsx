import { Component, JSX } from "solid-js"
import { Card } from "@kilocode/kilo-ui/card"

const SettingsRow: Component<{ title: string; description: string; last?: boolean; children: JSX.Element }> = (
  props,
) => (
  <Card class="settings-row" style={{ padding: "16px", border: "none" }}>
    <div
      style={{
        display: "flex",
        "flex-wrap": "wrap",
        gap: "12px",
        "align-items": "center",
        "justify-content": "space-between",
      }}
    >
      <div style={{ flex: "1 1 200px", "min-width": "150px" }}>
        <div style={{ "font-weight": "500" }}>{props.title}</div>
        <div style={{ "font-size": "11px", color: "var(--text-weak-base, var(--vscode-descriptionForeground))" }}>
          {props.description}
        </div>
      </div>
      {props.children}
    </div>
  </Card>
)

export default SettingsRow
