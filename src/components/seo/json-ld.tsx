/**
 * Renders a JSON-LD block. Content is server-generated from our own typed
 * data (never user input), so dangerouslySetInnerHTML is safe here; the `<`
 * escape prevents any accidental early </script> break.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
