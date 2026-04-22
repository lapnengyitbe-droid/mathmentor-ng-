"use client";
import styles from "./LessonDisplay.module.css";
import { ReactNode } from "react";

interface Props {
  content: string;
}

function processInline(text: string): ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function LessonDisplay({ content }: Props) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table
    if (line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const [headerLine, , ...bodyLines] = tableLines;
      const headers = headerLine.split("|").filter((h) => h.trim()).map((h) => h.trim());
      const rows = bodyLines.filter((r) => !r.match(/^\|[\s-|]+\|$/)).map((r) =>
        r.split("|").filter((c) => c.trim()).map((c) => c.trim())
      );
      elements.push(
        <div key={key++} className={styles.tableWrap}>
          <table className={styles.craTable}>
            <thead>
              <tr>{headers.map((h, hi) => <th key={hi}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{processInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(<h1 key={key++} className={styles.h1}>{line.slice(2)}</h1>);
      i++; continue;
    }
    // H2
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className={styles.h2}>{line.slice(3)}</h2>);
      i++; continue;
    }
    // H3
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className={styles.h3}>{line.slice(4)}</h3>);
      i++; continue;
    }

    // Bullet list
    if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className={styles.ul}>
          {items.map((item, ii) => <li key={ii} className={styles.li}>{processInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className={styles.ol}>
          {items.map((item, ii) => <li key={ii} className={styles.li}>{processInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    // Blank line
    if (line.trim() === "") { i++; continue; }

    // Paragraph
    elements.push(<p key={key++} className={styles.p}>{processInline(line)}</p>);
    i++;
  }

  return <div className={styles.root}>{elements}</div>;
}
