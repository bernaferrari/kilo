import { Component, For, createMemo } from "solid-js"
import { Select } from "@kilocode/kilo-ui/select"
import { Card } from "@kilocode/kilo-ui/card"
import { useConfig } from "../../context/config"
import { useLanguage } from "../../context/language"
import type { PermissionLevel } from "../../types/messages"

const TOOLS = [
  "read",
  "edit",
  "glob",
  "grep",
  "list",
  "bash",
  "task",
  "skill",
  "lsp",
  "todoread",
  "todowrite",
  "webfetch",
  "websearch",
  "codesearch",
  "external_directory",
  "doom_loop",
] as const

interface LevelOption {
  value: PermissionLevel
  labelKey: string
}

const LEVEL_OPTIONS: LevelOption[] = [
  { value: "allow", labelKey: "settings.autoApprove.level.allow" },
  { value: "ask", labelKey: "settings.autoApprove.level.ask" },
  { value: "deny", labelKey: "settings.autoApprove.level.deny" },
]

const AutoApproveTab: Component = () => {
  const { config, updateConfig } = useConfig()
  const language = useLanguage()

  const permissions = createMemo(() => config().permission ?? {})

  const getLevel = (tool: string): PermissionLevel => {
    return permissions()[tool] ?? permissions()["*"] ?? "ask"
  }

  const setPermission = (tool: string, level: PermissionLevel) => {
    updateConfig({
      permission: { ...permissions(), [tool]: level },
    })
  }

  const setAll = (level: PermissionLevel) => {
    const updated: Record<string, PermissionLevel> = {}
    for (const tool of TOOLS) {
      updated[tool] = level
    }
    updateConfig({ permission: updated })
  }

  return (
    <div data-component="auto-approve-settings">
      {/* Set All control */}
      <Card style={{ padding: "16px", "border-radius": "16px", border: "none" }}>
        <div
          data-slot="settings-row"
          style={{
            display: "flex",
            "flex-wrap": "wrap",
            gap: "12px",
            "align-items": "center",
            "justify-content": "space-between",
          }}
        >
          <span style={{ "font-weight": "600", flex: "1 1 150px", "min-width": "150px" }}>
            {language.t("settings.autoApprove.setAll")}
          </span>
          <Select
            options={LEVEL_OPTIONS}
            value={(o) => o.value}
            label={(o) => language.t(o.labelKey)}
            onSelect={(option) => option && setAll(option.value)}
            variant="secondary"
            size="small"
            triggerVariant="settings"
            placeholder={language.t("common.choose")}
          />
        </div>
      </Card>

      <div style={{ "margin-top": "12px" }} />

      {/* Tool permission list */}
      <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
        <For each={[...TOOLS]}>
          {(tool, index) => {
            const isFirst = index() === 0
            const isLast = index() === TOOLS.length - 1
            const radius = isFirst ? "16px 16px 4px 4px" : isLast ? "4px 4px 16px 16px" : "4px"

            return (
              <Card
                style={{
                  padding: "16px",
                  "border-radius": radius,
                  border: "none",
                }}
              >
                <div
                  data-slot="settings-row"
                  style={{
                    display: "flex",
                    "flex-wrap": "wrap",
                    gap: "12px",
                    "align-items": "center",
                    "justify-content": "space-between",
                  }}
                >
                  <div style={{ flex: "1 1 200px", "min-width": "150px" }}>
                    <div
                      style={{
                        "font-family": "var(--vscode-editor-font-family, monospace)",
                        "font-size": "12px",
                        "font-weight": "500",
                      }}
                    >
                      {tool}
                    </div>
                    <div
                      style={{
                        "font-size": "11px",
                        color: "var(--text-weak-base, var(--vscode-descriptionForeground))",
                        "margin-top": "4px",
                      }}
                    >
                      {language.t(`settings.autoApprove.tool.${tool}`)}
                    </div>
                  </div>
                  <Select
                    options={LEVEL_OPTIONS}
                    current={LEVEL_OPTIONS.find((o) => o.value === getLevel(tool))}
                    value={(o) => o.value}
                    label={(o) => language.t(o.labelKey)}
                    onSelect={(option) => option && setPermission(tool, option.value)}
                    variant="secondary"
                    size="small"
                    triggerVariant="settings"
                  />
                </div>
              </Card>
            )
          }}
        </For>
      </div>
    </div>
  )
}

export default AutoApproveTab
