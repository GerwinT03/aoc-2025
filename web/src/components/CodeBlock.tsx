"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block relative group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <span className="text-xs text-gray-500 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-800"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <Highlight theme={themes.nightOwl} code={code.trim()} language="tsx">
        {({ tokens, getLineProps, getTokenProps }) => (
          <div className="flex">
            <div className="flex-shrink-0 py-4 px-3 text-right text-gray-600 select-none border-r border-gray-800 bg-gray-900/30">
              {tokens.map((_, i) => (
                <div key={i} className="text-xs leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
            <pre className="flex-1 p-4 overflow-x-auto !bg-transparent !m-0">
              <code className="text-sm leading-6">
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  );
}
