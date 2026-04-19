import { Fragment } from "react";

import { cn } from "@/lib/utils";

function isBulletLine(line: string): boolean {
  const t = line.trim();
  return /^[-•*]\s/.test(t) || /^\d+[.)]\s/.test(t);
}

function stripBullet(line: string): string {
  return line.replace(/^[-•*]\s|^\d+[.)]\s/, "").trim();
}

function chunkIsBulletList(chunk: string): boolean {
  const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length > 0 && lines.every(isBulletLine);
}

/** Строка вида «Название:» без значения в той же строке. */
function isLabelOnlyLine(line: string): boolean {
  return /^[^:\n]+:\s*$/.test(line.trim());
}

/**
 * Парсит блок, где каждая характеристика — либо «Ключ: значение» в одной строке,
 * либо «Ключ:» и значение на следующей строке. Все непустые строки должны войти в пары.
 */
function tryParseSpecRows(lines: string[]): { label: string; value: string }[] | null {
  if (lines.length === 0) return null;
  const rows: { label: string; value: string }[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const inline = line.match(/^([^:\n]+):\s*(.+)$/);
    if (inline && inline[2].trim() !== "") {
      rows.push({ label: inline[1].trim(), value: inline[2].trim() });
      i += 1;
      continue;
    }
    if (isLabelOnlyLine(line)) {
      if (i + 1 >= lines.length) return null;
      const valueLine = lines[i + 1];
      if (isLabelOnlyLine(valueLine)) return null;
      rows.push({ label: line.replace(/:\s*$/, "").trim(), value: valueLine });
      i += 2;
      continue;
    }
    return null;
  }
  return rows;
}

type ParagraphSegment =
  | { type: "prose"; lines: string[] }
  | { type: "specs"; rows: { label: string; value: string }[] };

/** Разбивает текст абзацев на куски по \\n\\n; куски только из пар «Ключ:»/значение — в specs. */
function segmentParagraphBody(body: string): ParagraphSegment[] {
  const chunks = body.split(/\n\n+/).map((c) => c.trim()).filter(Boolean);
  if (chunks.length === 0) return [{ type: "prose", lines: [] }];
  const out: ParagraphSegment[] = [];
  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    const specs = tryParseSpecRows(lines);
    if (specs && specs.length > 0) {
      out.push({ type: "specs", rows: specs });
    } else {
      out.push({
        type: "prose",
        lines: chunk.split("\n").filter((l) => l.trim().length > 0).map((l) => l.trim()),
      });
    }
  }
  return out;
}

export type AboutSection = {
  title: string;
  kind: "paragraph" | "list";
  body: string | string[];
};

/**
 * Блоки по \\n\\n: первый текстовый кусок — «Описание», куски только из маркеров — «Преимущества»,
 * весь остальной текст — один блок «Дополнительно».
 */
export function parseProductAboutText(raw: string): AboutSection[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const chunks = trimmed.split(/\n\n+/).filter(Boolean);
  const sections: AboutSection[] = [];

  const first = chunks[0];
  if (chunkIsBulletList(first)) {
    sections.push({
      title: "Преимущества",
      kind: "list",
      body: first
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map(stripBullet),
    });
  } else {
    sections.push({ title: "Описание", kind: "paragraph", body: first });
  }

  const moreBullets: string[] = [];
  const extraParts: string[] = [];

  for (const chunk of chunks.slice(1)) {
    if (chunkIsBulletList(chunk)) {
      moreBullets.push(
        ...chunk
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map(stripBullet),
      );
    } else {
      extraParts.push(chunk);
    }
  }

  if (moreBullets.length > 0) {
    const adv = sections.find((s) => s.title === "Преимущества");
    if (adv && adv.kind === "list") {
      adv.body = [...(adv.body as string[]), ...moreBullets];
    } else {
      sections.push({ title: "Преимущества", kind: "list", body: moreBullets });
    }
  }

  if (extraParts.length > 0) {
    sections.push({
      title: "Дополнительно",
      kind: "paragraph",
      body: extraParts.join("\n\n"),
    });
  }

  return sections;
}

type ProductDescriptionProps = {
  text: string;
  className?: string;
};

export function ProductDescription({ text, className }: ProductDescriptionProps) {
  const sections = parseProductAboutText(text);
  if (sections.length === 0) return null;

  return (
    <section
      className={cn(
        "mt-10 w-full min-w-0 max-w-none border-t border-[#403A34]/10 pt-10 md:mt-12 md:pt-11",
        className,
      )}
      aria-labelledby="product-about-heading"
    >
      <h2
        id="product-about-heading"
        className="font-serif text-xl tracking-tight text-[#403A34] md:text-2xl"
      >
        О товаре
      </h2>

      <div className="mt-6 space-y-7">
        {sections.map((section, idx) => (
          <div
            key={`${section.title}-${idx}`}
            className={cn(
              "w-full min-w-0 rounded-xl border border-[#403A34]/8 bg-[#fbf8f4]/50 px-4 py-4 md:px-5 md:py-5",
              idx > 0 && "mt-1",
            )}
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#403A34]/45">
              {section.title}
            </h3>
            {section.kind === "paragraph" ? (
              <div className="mt-3 w-full min-w-0 max-w-none space-y-6 break-words text-[15px] leading-[1.72] text-[#403A34]/90 [overflow-wrap:anywhere]">
                {segmentParagraphBody(String(section.body)).map((seg, si) =>
                  seg.type === "specs" ? (
                    <dl
                      key={si}
                      className="grid w-full min-w-0 max-w-full grid-cols-1 gap-x-8 gap-y-0 border-t border-[#403A34]/10 text-[15px] leading-relaxed md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]"
                    >
                      {seg.rows.map((row, ri) => {
                        const isLast = ri === seg.rows.length - 1;
                        return (
                          <Fragment key={`${row.label}-${ri}`}>
                            <dt className="min-w-0 border-b border-[#403A34]/10 py-2.5 font-medium break-words text-[#403A34]/55 md:py-3 md:pr-2 [overflow-wrap:anywhere]">
                              {row.label}
                            </dt>
                            <dd
                              className={cn(
                                "min-w-0 max-w-full border-b border-[#403A34]/10 py-2.5 font-medium break-words text-[#403A34] md:py-3 [overflow-wrap:anywhere]",
                                isLast && "border-b-0",
                              )}
                            >
                              {row.value}
                            </dd>
                          </Fragment>
                        );
                      })}
                    </dl>
                  ) : (
                    <div key={si} className="w-full min-w-0 max-w-full">
                      {seg.lines.map((line, li) => (
                        <p
                          key={li}
                          className={cn(
                            "min-w-0 max-w-full break-words [overflow-wrap:anywhere]",
                            li > 0 && "mt-2.5",
                          )}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <ul className="mt-3 w-full min-w-0 max-w-none list-none space-y-2.5 break-words text-[15px] leading-relaxed text-[#403A34]/90 [overflow-wrap:anywhere]">
                {(section.body as string[]).map((item, ii) => (
                  <li key={ii} className="flex min-w-0 gap-2.5">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-[#403A34]/30" aria-hidden />
                    <span className="min-w-0 max-w-full flex-1 break-words [overflow-wrap:anywhere]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
