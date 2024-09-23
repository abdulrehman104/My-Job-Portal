"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onchange: (value: string) => void;
  value: string;
}

export default function Editor({ onchange, value }: EditorProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [],
  );

  return (
    <div className="bg-white">
      <ReactQuill value={value} onChange={onchange} theme="snow" />
    </div>
  );
}
