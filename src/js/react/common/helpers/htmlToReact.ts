import { createElement, type ReactNode } from 'react';

function nodeToReact(node: Node, key: number): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as Element;
  const props: Record<string, unknown> = { key };

  for (const { name, value } of Array.from(el.attributes)) {
    if (name === 'class') props.className = value;
    else if (name === 'for') props.htmlFor = value;
    else if (name === 'style') {
      props.style = Object.fromEntries(
        value
          .split(';')
          .filter(Boolean)
          .map((rule) => {
            const [prop, val] = rule.split(':');
            const camel = prop.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
            return [camel, val.trim()];
          }),
      );
    } else {
      props[name] = value;
    }
  }

  const children = Array.from(el.childNodes)
    .map((child, i) => nodeToReact(child, i))
    .filter((c) => c !== null);

  return createElement(el.tagName.toLowerCase(), props, ...children);
}

export function htmlToReact(html: string): ReactNode {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const nodes = Array.from(doc.body.childNodes)
    .map((node, i) => nodeToReact(node, i))
    .filter((node) => node !== null);
  return nodes.length === 1 ? nodes[0] : nodes;
}
