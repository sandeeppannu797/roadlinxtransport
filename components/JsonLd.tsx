/** Renders raw JSON-LD strings exactly as extracted from the legacy site. */
export function JsonLd({ blocks }: { blocks: string[] }) {
  return (
    <>
      {blocks.map((json, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      ))}
    </>
  );
}
