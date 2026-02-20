import { Component } from "solid-js"
import { TextField } from "@kilocode/kilo-ui/text-field"
import { Card } from "@kilocode/kilo-ui/card"
import { useConfig } from "../../context/config"
import { useLanguage } from "../../context/language"
import SettingsRow from "./SettingsRow"
import { SegmentedControl } from "./SegmentedControl"

interface LayoutOption {
  value: string
  labelKey: string
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  { value: "auto", labelKey: "settings.display.layout.auto" },
  { value: "stretch", labelKey: "settings.display.layout.stretch" },
]

const DisplayTab: Component = () => {
  const { config, updateConfig } = useConfig()
  const language = useLanguage()

  return (
    <div>
      <div class="settings-group">
        <SettingsRow
          title={language.t("settings.display.username.title")}
          description={language.t("settings.display.username.description")}
        >
          <div style={{ width: "160px" }}>
            <TextField
              value={config().username ?? ""}
              placeholder="User"
              onChange={(val) => updateConfig({ username: val.trim() || undefined })}
            />
          </div>
        </SettingsRow>

        <SettingsRow
          title={language.t("settings.display.layout.title")}
          description={language.t("settings.display.layout.description")}
        >
          <SegmentedControl
            options={LAYOUT_OPTIONS.map((o) => ({ value: o.value, label: language.t(o.labelKey) }))}
            value={config().layout ?? "auto"}
            onChange={(val) => updateConfig({ layout: val as "auto" | "stretch" })}
          />
        </SettingsRow>
      </div>
    </div>
  )
}

export default DisplayTab
