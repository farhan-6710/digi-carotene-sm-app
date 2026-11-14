import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";

import type { AssistantRichTextProps } from "../types/components";

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
const LIST_ITEM = /^\s*[-*]\s+/;
const WORD_CLASS = "inline-block animate-stream-word";
const CHAR_CLASS = "inline-block animate-stream-char";

function renderWords(text: string, keyPrefix: string): ReactNode[] {
  let offset = 0;
  return text.split(/(\s+)/).map((token) => {
    const start = offset;
    offset += token.length;
    if (!token || /^\s+$/.test(token)) return token;
    return (
      <span
        key={`${keyPrefix}-${start}`}
        className="inline-block whitespace-nowrap"
      >
        {Array.from(token, (char, index) => (
          <span key={index} className={CHAR_CLASS}>
            {char}
          </span>
        ))}
      </span>
    );
  });
}

function renderInline(
  text: string,
  keyPrefix: string,
  onNavigate: () => void,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) {
      nodes.push(...renderWords(text.slice(last, index), `${keyPrefix}-${last}`));
    }
    const [, label, href, bold] = match;
    const key = `${keyPrefix}-m${index}`;
    if (bold) {
      nodes.push(
        <strong key={key} className={`font-semibold ${WORD_CLASS}`}>
          {bold}
        </strong>,
      );
    } else if (href?.startsWith("/") && !href.startsWith("//")) {
      nodes.push(
        <Link
          key={key}
          to={href}
          onClick={onNavigate}
          className="animate-stream-word font-medium text-primary underline underline-offset-4 hover:text-foreground"
        >
          {label}
        </Link>,
      );
    } else {
      nodes.push(...renderWords(label, key));
    }
    last = index + match[0].length;
  }
  if (last < text.length) {
    nodes.push(...renderWords(text.slice(last), `${keyPrefix}-${last}`));
  }
  return nodes;
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1.05em] w-0.5 translate-y-[0.15em] animate-caret rounded-full bg-primary"
    />
  );
}

/** Small markdown subset: paragraphs, "- " lists, bold, in-app links. */
export function AssistantRichText({
  text,
  onNavigate,
  streaming = false,
}: AssistantRichTextProps) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((line) => line.trim());
        const caret =
          streaming && blockIndex === blocks.length - 1 ? <Caret /> : null;
        if (lines.length && lines.every((line) => LIST_ITEM.test(line))) {
          return (
            <ul
              key={blockIndex}
              className="list-disc space-y-1 pl-5 marker:text-muted-foreground"
            >
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  {renderInline(
                    line.replace(LIST_ITEM, ""),
                    `${blockIndex}-${lineIndex}`,
                    onNavigate,
                  )}
                  {lineIndex === lines.length - 1 ? caret : null}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {renderInline(line, `${blockIndex}-${lineIndex}`, onNavigate)}
              </Fragment>
            ))}
            {caret}
          </p>
        );
      })}
    </div>
  );
}
