import { Component, createSignal, onCleanup } from "solid-js"
import { Switch } from "@kilocode/kilo-ui/switch"
import { Card } from "@kilocode/kilo-ui/card"
import { useVSCode } from "../../context/vscode"
import { useLanguage } from "../../context/language"
import type { ExtensionMessage } from "../../types/messages"
import SettingsRow from "./SettingsRow"
import { SegmentedControl } from "./SegmentedControl"

interface SoundOption {
  value: string
  labelKey: string
}

const SOUND_OPTIONS: SoundOption[] = [
  { value: "default", labelKey: "settings.notifications.sound.default" },
  { value: "none", labelKey: "settings.notifications.sound.none" },
]

const NotificationsTab: Component = () => {
  const vscode = useVSCode()
  const language = useLanguage()

  const [agentNotify, setAgentNotify] = createSignal(true)
  const [permNotify, setPermNotify] = createSignal(true)
  const [errorNotify, setErrorNotify] = createSignal(true)
  const [agentSound, setAgentSound] = createSignal("default")
  const [permSound, setPermSound] = createSignal("default")
  const [errorSound, setErrorSound] = createSignal("default")

  const unsubscribe = vscode.onMessage((message: ExtensionMessage) => {
    if (message.type !== "notificationSettingsLoaded") {
      return
    }
    const s = message.settings
    setAgentNotify(s.notifyAgent)
    setPermNotify(s.notifyPermissions)
    setErrorNotify(s.notifyErrors)
    setAgentSound(s.soundAgent)
    setPermSound(s.soundPermissions)
    setErrorSound(s.soundErrors)
  })

  onCleanup(unsubscribe)
  vscode.postMessage({ type: "requestNotificationSettings" })

  const save = (key: string, value: unknown) => {
    vscode.postMessage({ type: "updateSetting", key, value })
  }

  return (
    <div>
      <div class="settings-group">
        <SettingsRow
          title={language.t("settings.notifications.agent.title")}
          description={language.t("settings.notifications.agent.description")}
        >
          <Switch
            checked={agentNotify()}
            onChange={(checked) => {
              setAgentNotify(checked)
              save("notifications.agent", checked)
            }}
            hideLabel
          >
            {language.t("settings.notifications.agent.title")}
          </Switch>
        </SettingsRow>
        <SettingsRow
          title={language.t("settings.notifications.permissions.title")}
          description={language.t("settings.notifications.permissions.description")}
        >
          <Switch
            checked={permNotify()}
            onChange={(checked) => {
              setPermNotify(checked)
              save("notifications.permissions", checked)
            }}
            hideLabel
          >
            {language.t("settings.notifications.permissions.title")}
          </Switch>
        </SettingsRow>
        <SettingsRow
          title={language.t("settings.notifications.errors.title")}
          description={language.t("settings.notifications.errors.description")}
        >
          <Switch
            checked={errorNotify()}
            onChange={(checked) => {
              setErrorNotify(checked)
              save("notifications.errors", checked)
            }}
            hideLabel
          >
            {language.t("settings.notifications.errors.title")}
          </Switch>
        </SettingsRow>
      </div>

      <h4 style={{ "margin-top": "16px", "margin-bottom": "8px" }}>{language.t("settings.notifications.sounds")}</h4>
      <div class="settings-group">
        <SettingsRow
          title={language.t("settings.notifications.agentSound.title")}
          description={language.t("settings.notifications.agentSound.description")}
        >
          <SegmentedControl
            options={SOUND_OPTIONS.map((o) => ({ value: o.value, label: language.t(o.labelKey) }))}
            value={agentSound()}
            onChange={(val) => {
              setAgentSound(val)
              save("sounds.agent", val)
            }}
          />
        </SettingsRow>
        <SettingsRow
          title={language.t("settings.notifications.permSound.title")}
          description={language.t("settings.notifications.permSound.description")}
        >
          <SegmentedControl
            options={SOUND_OPTIONS.map((o) => ({ value: o.value, label: language.t(o.labelKey) }))}
            value={permSound()}
            onChange={(val) => {
              setPermSound(val)
              save("sounds.permissions", val)
            }}
          />
        </SettingsRow>
        <SettingsRow
          title={language.t("settings.notifications.errorSound.title")}
          description={language.t("settings.notifications.errorSound.description")}
        >
          <SegmentedControl
            options={SOUND_OPTIONS.map((o) => ({ value: o.value, label: language.t(o.labelKey) }))}
            value={errorSound()}
            onChange={(val) => {
              setErrorSound(val)
              save("sounds.errors", val)
            }}
          />
        </SettingsRow>
      </div>
    </div>
  )
}

export default NotificationsTab
