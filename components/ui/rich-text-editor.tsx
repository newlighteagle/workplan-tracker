"use client"

import React, { useEffect, useRef } from "react"
import { Button } from "./button"
import { Bold, Italic, Underline, List, ListOrdered, Undo, Redo } from "lucide-react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
            editorRef.current.innerHTML = value || ""
        }
    }, [value])

    const exec = (command: string) => {
        document.execCommand(command)
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    return (
        <div className="border rounded-md">
            <div className="flex items-center gap-1 p-1 border-b">
                <Button type="button" variant="ghost" size="icon" onClick={() => exec("undo")} title="Undo">
                    <Undo className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => exec("redo")} title="Redo">
                    <Redo className="h-4 w-4" />
                </Button>
                <div className="mx-1 h-5 w-px bg-border" />
                <Button type="button" variant="ghost" size="icon" onClick={() => exec("bold")} title="Bold">
                    <Bold className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => exec("italic")} title="Italic">
                    <Italic className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => exec("underline")} title="Underline">
                    <Underline className="h-4 w-4" />
                </Button>
                <div className="mx-1 h-5 w-px bg-border" />
                <Button type="button" variant="ghost" size="icon" onClick={() => exec("insertUnorderedList")} title="Bulleted list">
                    <List className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => exec("insertOrderedList")} title="Numbered list">
                    <ListOrdered className="h-4 w-4" />
                </Button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
                className="min-h-[140px] max-h-[320px] overflow-auto p-3 focus:outline-none"
                data-placeholder={placeholder || "Type your note..."}
            />
            <style jsx>{`
                [contenteditable="true"][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: hsl(var(--muted-foreground));
                    pointer-events: none;
                }
            `}</style>
        </div>
    )
}
