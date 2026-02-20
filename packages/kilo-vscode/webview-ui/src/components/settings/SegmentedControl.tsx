import { Component, For } from "solid-js"

export interface SegmentedControlOption<T extends string> {
    value: T
    label: string
}

export interface SegmentedControlProps<T extends string> {
    options: readonly SegmentedControlOption<T>[]
    value: T
    onChange: (value: T) => void
    fullWidth?: boolean
}

// To support Generic types correctly in SolidJS components:
export const SegmentedControl = <T extends string>(props: SegmentedControlProps<T>) => {
    return (
        <div
            style={{
                display: "flex",
                "flex-wrap": "wrap",
                gap: "4px",
                width: props.fullWidth ? "100%" : "auto",
            }}
        >
            <For each={props.options}>
                {(option, index) => {
                    const isActive = () => props.value === option.value

                    return (
                        <button
                            onClick={() => props.onChange(option.value)}
                            style={{
                                padding: "4px 12px",
                                border: isActive()
                                    ? "1px solid transparent"
                                    : "1px solid var(--border-weak-base, rgba(255, 255, 255, 0.08))",
                                background: isActive()
                                    ? "var(--surface-interactive-base, var(--vscode-button-background))"
                                    : "transparent",
                                color: isActive()
                                    ? "var(--text-on-interactive-base, var(--vscode-button-foreground))"
                                    : "var(--vscode-descriptionForeground)",
                                "font-size": "12px",
                                "font-weight": "normal",
                                "font-family": "var(--vscode-font-family)",
                                cursor: "pointer",
                                "border-radius": isActive() ? "16px" : "4px",
                                "box-shadow": isActive() ? "0 2px 6px rgba(0, 0, 0, 0.1)" : "none",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                "text-align": "center",
                                "white-space": "nowrap",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive()) {
                                    e.currentTarget.style.color = "var(--vscode-foreground)"
                                    e.currentTarget.style.background = "var(--surface-interactive-hover, rgba(255,255,255,0.05))"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive()) {
                                    e.currentTarget.style.color = "var(--vscode-descriptionForeground)"
                                    e.currentTarget.style.background = "transparent"
                                }
                            }}
                        >
                            {option.label}
                        </button>
                    )
                }}
            </For>
        </div>
    )
}
