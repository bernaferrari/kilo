import { Component, createSignal, createMemo, For, JSX } from "solid-js"
import { Popover } from "@kilocode/kilo-ui/popover"
import { Button } from "@kilocode/kilo-ui/button"
import { useLanguage } from "../../context/language"

export interface ProviderOption {
    value: string
    label: string
}

export interface ProviderSelectorProps {
    options: ProviderOption[]
    value?: ProviderOption
    onSelect: (option: ProviderOption | undefined) => void
    placeholder?: string
}

export const ProviderSelector: Component<ProviderSelectorProps> = (props) => {
    const language = useLanguage()
    const [open, setOpen] = createSignal(false)
    const [search, setSearch] = createSignal("")
    const [activeIndex, setActiveIndex] = createSignal(0)

    let searchRef: HTMLInputElement | undefined

    const filtered = createMemo(() => {
        const q = search().toLowerCase()
        if (!q) return props.options
        return props.options.filter(
            (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
        )
    })

    // Highlight search characters
    function highlightText(text: string, query: string): JSX.Element {
        if (!query) return <>{text}</>

        const lowerText = text.toLowerCase()
        const lowerQuery = query.toLowerCase()

        let result: JSX.Element[] = []
        let lastIndex = 0
        let matchIndex = lowerText.indexOf(lowerQuery)

        if (matchIndex === -1) return <>{text}</>

        while (matchIndex !== -1) {
            if (matchIndex > lastIndex) {
                result.push(<>{text.slice(lastIndex, matchIndex)}</>)
            }
            result.push(<span style={{ color: "var(--vscode-textLink-foreground)" }}>{text.slice(matchIndex, matchIndex + query.length)}</span>)
            lastIndex = matchIndex + query.length
            matchIndex = lowerText.indexOf(lowerQuery, lastIndex)
        }

        if (lastIndex < text.length) {
            result.push(<>{text.slice(lastIndex)}</>)
        }

        return result
    }

    const pick = (opt: ProviderOption) => {
        props.onSelect(opt)
        setOpen(false)
    }

    const clear = (e: MouseEvent) => {
        e.stopPropagation()
        props.onSelect(undefined)
    }

    const onKeyDown = (e: KeyboardEvent) => {
        const list = filtered()
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setActiveIndex((i) => Math.min(i + 1, list.length - 1))
                break
            case "ArrowUp":
                e.preventDefault()
                setActiveIndex((i) => Math.max(i - 1, 0))
                break
            case "Enter":
                e.preventDefault()
                const selected = list[activeIndex()]
                if (selected) {
                    pick(selected)
                }
                break
            case "Escape":
                e.preventDefault()
                setOpen(false)
                break
        }
    }

    return (
        <Popover
            open={open()}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (isOpen) {
                    setSearch("")
                    setActiveIndex(0)
                    setTimeout(() => searchRef?.focus(), 0)
                }
            }}
            placement="bottom-start"
            triggerAs="div"
            triggerProps={{
                style: {
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "space-between",
                    width: "auto",
                    "min-width": "100px",
                    "max-width": "100%",
                    "min-height": "28px",
                    "border-radius": "6px",
                    "font-size": "12px",
                    "line-height": "normal",
                    padding: "4px 12px",
                    cursor: "pointer",
                    background: "var(--input-base, var(--vscode-input-background))",
                    border: "1px solid var(--border-weak-base, rgba(255, 255, 255, 0.08))",
                    "box-shadow": "0 1px 2px rgba(0, 0, 0, 0.05)",
                    color: "var(--text-base, var(--vscode-foreground))",
                },
                onClick: () => setOpen(!open())
            }}
            trigger={
                <>
                    <div style={{ overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" }}>
                        {props.value ? props.value.label : props.placeholder || "Select..."}
                    </div>
                    <div style={{ display: "flex", "align-items": "center", gap: "4px" }}>
                        {props.value && (
                            <div
                                onClick={clear}
                                style={{
                                    display: "flex",
                                    "align-items": "center",
                                    "justify-content": "center",
                                    width: "16px",
                                    height: "16px",
                                    "border-radius": "50%",
                                    background: "var(--surface-interactive-weak)",
                                    color: "var(--text-weak)",
                                    "font-size": "10px",
                                    cursor: "pointer"
                                }}
                            >
                                ✕
                            </div>
                        )}
                        <svg style={{ width: "12px", height: "12px", opacity: 0.8 }} viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4.646 6.646L8 9.999l3.354-3.353.707.707-4 4-.707.707-4-4 .707-.707z" />
                        </svg>
                    </div>
                </>
            }
        >
            <div class="model-selector-popover" onKeyDown={onKeyDown}>
                <div class="model-selector-search">
                    <input
                        ref={searchRef}
                        type="text"
                        class="model-selector-search-input"
                        placeholder={language.t("common.search")}
                        value={search()}
                        onInput={(e) => {
                            setSearch(e.currentTarget.value)
                            setActiveIndex(0)
                        }}
                    />
                </div>
                <div class="model-selector-list" role="listbox">
                    <For each={filtered()}>
                        {(opt, index) => (
                            <div
                                class={`model-selector-item${index() === activeIndex() ? " active" : ""}`}
                                role="option"
                                aria-selected={props.value?.value === opt.value}
                                onClick={() => pick(opt)}
                                onMouseEnter={() => setActiveIndex(index())}
                            >
                                <span class="model-selector-item-name">{highlightText(opt.label, search())}</span>
                                {props.value?.value === opt.value && <div class="model-selector-check">✓</div>}
                            </div>
                        )}
                    </For>
                    {filtered().length === 0 && (
                        <div class="model-selector-empty">{language.t("common.noResults")}</div>
                    )}
                </div>
            </div>
        </Popover>
    )
}
