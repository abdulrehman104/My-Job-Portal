"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";

interface EditorProps {
  value: string;
}

export default function Preview({ value }: EditorProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [],
  );

  return <ReactQuill value={value} theme="bubble" readOnly />;
}
