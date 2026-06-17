import React from "react";

function isBlockStart(line: string): boolean {
  return (
    /^#{1,3}\s+/.test(line) ||
    /^[-*]\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^>\s?/.test(line) ||
    /^---+$/.test(line)
  );
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.filter(Boolean).map((part, index) => {
    const strongMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (strongMatch) {
      return <strong key={index}>{strongMatch[1]}</strong>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={index} href={linkMatch[2]} rel="noreferrer" target="_blank">
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

export function renderSimpleMarkdown(markdown: string): React.ReactNode[] {
  const source = markdown.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!source) {
    return [
      <p key="empty" className="one-pager-empty">
        One-pager content has not been added yet.
      </p>,
    ];
  }

  const lines = source.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const content = renderInline(heading[2]);
      if (level === 1) {
        nodes.push(<h1 key={nodes.length}>{content}</h1>);
      } else if (level === 2) {
        nodes.push(<h2 key={nodes.length}>{content}</h2>);
      } else {
        nodes.push(<h3 key={nodes.length}>{content}</h3>);
      }
      index += 1;
      continue;
    }

    if (/^---+$/.test(line)) {
      nodes.push(<hr key={nodes.length} />);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      nodes.push(
        <ul key={nodes.length}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      nodes.push(
        <ol key={nodes.length}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      nodes.push(
        <blockquote key={nodes.length}>
          <p>{renderInline(quoteLines.join(" "))}</p>
        </blockquote>,
      );
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length) {
      const nextLine = lines[index].trim();
      if (!nextLine || isBlockStart(nextLine)) {
        break;
      }
      paragraphLines.push(nextLine);
      index += 1;
    }
    nodes.push(<p key={nodes.length}>{renderInline(paragraphLines.join(" "))}</p>);
  }

  return nodes;
}
