"use client";
import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

// minHeight 600px (30 line), maxHeight 800px (40 line)
const editorTheme = EditorView.theme({
  "&": {
    minHeight: "600px",
  },
});

export default function SimpleCodeEditor({
  initialValue = "",
  onChange,
  language = "javascript", // "json" yoki "javascript"
}) {
  const containerRef = useRef(null);
  const editorViewRef = useRef(null);
  const lastValueRef = useRef(initialValue);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorViewRef.current) {
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const value = update.state.doc.toString();
          lastValueRef.current = value;
          onChange?.(value);
        }
      });

      const langExtension = language === "json" ? json() : javascript();

      editorViewRef.current = new EditorView({
        doc: initialValue,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          langExtension,
          oneDark,
          editorTheme,
          updateListener,
        ],
        parent: containerRef.current,
      });
    }

    return () => {
      editorViewRef.current?.destroy();
      editorViewRef.current = null;
    };
  }, [language]); // language o‘zgarsa editor yangilanadi

  useEffect(() => {
    const view = editorViewRef.current;
    if (view && initialValue !== lastValueRef.current) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: initialValue,
        },
      });
      lastValueRef.current = initialValue;
    }
  }, [initialValue]);

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight: "800px",
        overflow: "auto",
        borderRadius: "0.375rem",
        border: "1px solid #374151",
      }}
    />
  );
}
