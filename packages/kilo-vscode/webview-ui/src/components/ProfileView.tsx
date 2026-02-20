import { Component, Show, createSignal, createMemo, createEffect, onMount } from "solid-js"
import { Button } from "@kilocode/kilo-ui/button"
import { Card } from "@kilocode/kilo-ui/card"
import { Select } from "@kilocode/kilo-ui/select"
import { Tooltip } from "@kilocode/kilo-ui/tooltip"
import { useVSCode } from "../context/vscode"
import { useLanguage } from "../context/language"
import DeviceAuthCard from "./DeviceAuthCard"
import type { ProfileData, DeviceAuthState } from "../types/messages"

export type { ProfileData }

export interface ProfileViewProps {
  profileData: ProfileData | null | undefined
  deviceAuth: DeviceAuthState
  onLogin: () => void
}

const formatBalance = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

const PERSONAL = "personal"

interface OrgOption {
  value: string
  label: string
  description?: string
}

const ProfileView: Component<ProfileViewProps> = (props) => {
  const vscode = useVSCode()
  const language = useLanguage()
  const [target, setTarget] = createSignal<string | null>(null)

  // Always fetch fresh profile+balance when navigating to this view
  onMount(() => {
    vscode.postMessage({ type: "refreshProfile" })
  })

  // Reset pending target whenever profileData changes (success or failure both send a fresh profile)
  createEffect(() => {
    props.profileData // track
    setTarget(null)
  })

  const switching = createMemo(() => {
    const t = target()
    if (t === null) return false
    const current = props.profileData?.currentOrgId ?? PERSONAL
    return current !== t
  })

  const orgOptions = createMemo<OrgOption[]>(() => {
    const orgs = props.profileData?.profile.organizations ?? []
    if (orgs.length === 0) return []
    return [
      { value: PERSONAL, label: language.t("profile.personalAccount") },
      ...orgs.map((org) => ({ value: org.id, label: org.name, description: org.role })),
    ]
  })

  const currentOrg = createMemo(() => {
    const id = props.profileData?.currentOrgId ?? PERSONAL
    return orgOptions().find((o) => o.value === id)
  })

  const selectOrg = (option: OrgOption | undefined) => {
    if (!option) return
    const current = props.profileData?.currentOrgId ?? PERSONAL
    if (option.value === current) return
    setTarget(option.value)
    vscode.postMessage({
      type: "setOrganization",
      organizationId: option.value === PERSONAL ? null : option.value,
    })
  }

  const handleLogin = () => {
    props.onLogin()
  }

  const handleLogout = () => {
    vscode.postMessage({ type: "logout" })
  }

  const handleRefresh = () => {
    vscode.postMessage({ type: "refreshProfile" })
  }

  const handleDashboard = () => {
    vscode.postMessage({ type: "openExternal", url: "https://app.kilo.ai/profile" })
  }

  const handleCancelLogin = () => {
    vscode.postMessage({ type: "cancelLogin" })
  }

  return (
    <div style={{ padding: "16px", "max-width": "600px", margin: "0 auto" }}>
      <h2
        style={{
          "font-size": "20px",
          "font-weight": "600",
          "margin-top": "0",
          "margin-bottom": "24px",
          color: "var(--vscode-foreground)",
        }}
      >
        {language.t("profile.title")}
      </h2>

      <Show
        when={props.profileData}
        fallback={
          <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
            <Show
              when={props.deviceAuth.status !== "idle"}
              fallback={
                <>
                  <p
                    style={{
                      "font-size": "13px",
                      color: "var(--vscode-descriptionForeground)",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {language.t("profile.notLoggedIn")}
                  </p>
                  <Button variant="primary" onClick={handleLogin}>
                    {language.t("profile.action.login")}
                  </Button>
                </>
              }
            >
              <DeviceAuthCard
                status={props.deviceAuth.status}
                code={props.deviceAuth.code}
                verificationUrl={props.deviceAuth.verificationUrl}
                expiresIn={props.deviceAuth.expiresIn}
                error={props.deviceAuth.error}
                onCancel={handleCancelLogin}
                onRetry={handleLogin}
              />
            </Show>
          </div>
        }
      >
        {(data) => (
          <div style={{ display: "flex", "flex-direction": "column", gap: "24px" }}>
            {/* User Header Section with Avatar */}
            <div style={{ display: "flex", "align-items": "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  "border-radius": "50%",
                  background: "var(--vscode-textLink-foreground, #3794ff)",
                  color: "wait",
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "center",
                  "font-size": "24px",
                  "font-weight": "600",
                  "flex-shrink": 0,
                  "text-transform": "uppercase",
                }}
              >
                <span style={{ color: "white" }}>
                  {(data().profile.name || data().profile.email || "?")[0]}
                </span>
              </div>
              <div style={{ flex: 1, "min-width": 0 }}>
                <p
                  style={{
                    "font-size": "18px",
                    "font-weight": "600",
                    color: "var(--vscode-foreground)",
                    margin: "0 0 4px 0",
                    "white-space": "nowrap",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                  }}
                >
                  {data().profile.name || data().profile.email}
                </p>
                <p
                  style={{
                    "font-size": "13px",
                    color: "var(--vscode-descriptionForeground)",
                    margin: 0,
                    "white-space": "nowrap",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                  }}
                >
                  {data().profile.email}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
              {/* Organization selector standalone section */}
              <Show when={orgOptions().length > 0}>
                <div>
                  <p
                    style={{
                      "font-size": "12px",
                      "font-weight": "600",
                      "text-transform": "uppercase",
                      "letter-spacing": "0.5px",
                      color: "var(--vscode-descriptionForeground)",
                      margin: "0 0 12px 0",
                    }}
                  >
                    Account
                  </p>
                  <Select
                    options={orgOptions()}
                    current={currentOrg()}
                    value={(o) => o.value}
                    label={(o) => o.label}
                    onSelect={selectOrg}
                    variant="secondary"
                    size="large"
                    triggerVariant="settings"
                    disabled={switching()}
                    searchable
                  />
                </div>
              </Show>

              {/* Balance Card */}
              <Show when={data().balance}>
                {(balance) => (
                  <Card
                    style={{
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "space-between",
                      padding: "16px",
                      "border-radius": "16px",
                      background: "var(--surface-base, var(--vscode-editorWidget-background))",
                      border: "1px solid var(--border-weak-base, transparent)",
                      "box-shadow": "0 2px 6px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          "font-size": "12px",
                          "font-weight": "500",
                          color: "var(--vscode-descriptionForeground)",
                          margin: "0 0 6px 0",
                        }}
                      >
                        {language.t("profile.balance.title")}
                      </p>
                      <p
                        style={{
                          "font-size": "28px",
                          "font-weight": "700",
                          color: "var(--vscode-foreground)",
                          margin: 0,
                        }}
                      >
                        {formatBalance(balance().balance)}
                      </p>
                    </div>
                    <Tooltip value={language.t("profile.balance.refresh")} placement="left">
                      <Button variant="ghost" size="normal" onClick={handleRefresh} style={{ height: "40px", width: "40px", padding: 0, "border-radius": "50%" }}>
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2a6 6 0 1 0 5.292 3H11v1h4V2h-1v1.745A7.001 7.001 0 1 0 15 8h-1a6 6 0 1 0-6 6V2z" />
                        </svg>
                      </Button>
                    </Tooltip>
                  </Card>
                )}
              </Show>
            </div>

            <div
              style={{
                height: "1px",
                background: "var(--vscode-panel-border)",
                margin: "8px 0",
              }}
            />

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", "flex-direction": "column" }}>
              <Button variant="secondary" onClick={handleDashboard} size="large" style={{ "border-radius": "9999px" }}>
                {language.t("profile.action.dashboard")}
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                size="large"
                style={{ color: "var(--vscode-errorForeground)", "border-radius": "9999px" }}
              >
                {language.t("profile.action.logout")}
              </Button>
            </div>
          </div>
        )}
      </Show>
    </div>
  )
}

export default ProfileView
