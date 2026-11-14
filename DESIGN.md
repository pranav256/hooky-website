# Hooky website

Product: An open-source video clipper with a local Studio and optional Gemini moment selection.
Character: A focused editing desk: useful, warm, direct.
World: Interviews, transcript lines, selected cuts, and finished portrait clips.
Moments: Understand the tool, try a sample cut, then install and continue a saved project.
Signature: Warm yellow marks the chosen moment against Lumen Dark surfaces.

## System and scope

Keep the existing Lumen Dark tokens in `public/brand.css`, system sans/mono, 8px radius, Next 15, React 19 and Tailwind 3. Reuse native buttons and installed Lucide icons. Open Design's catalog kit was consulted; introducing another component framework is unnecessary for this existing system.

The homepage, sample tour, documentation, metadata and browser assertions must describe the same supported features. The sample tour has no connection to the local engine and saves samples only for the current page visit. Preserve header/footer destinations and the full CLI/configuration reference.

## Baseline findings

The previous hero's animated collage and tracking corners imply automatic speaker tracking that the engine does not provide. The mobile tour shrinks labels below readable sizes. Repeated slogans obscure setup and the newest features. Replace these with an accurate sample cut, readable controls, explicit setup steps and feature explanations.

## Review

Open Design UI/UX/sales guidance informs source and copy checks. Review rendered rectangles and screenshots at 390, 768, 1440 and 1728px, including sample filtering, caption edits, project reopening, navigation, documentation search and reduced motion. No hosted dashboard receipt or accessibility certification is claimed.

The final homepage and documentation geometry checks have no critical or serious findings at 390, 1440 and 1728px. Remaining spacing advisories include the existing brand's spacing scale and inline creator link. Copy checks pass for the hero, editor, project saves and named-project guide. The source scanner's remaining native-control migration suggestions refer to absent `components/ui` modules; the product's existing native controls are retained and exercised by browser checks. The scanner does not account for this constraint even when it is supplied as context.

Production build, lint, typecheck and all five isolated browser suites passed. Coverage includes four widths, doubled documentation text, keyboard saves and menu dismissal, topic empty states, correction search focus, empty-caption recovery, sample project reopening, and real Studio project persistence/concurrent saves. No live Gemini selection, YouTube download or real media export was performed for this website change.

Design method adapted from Unslop by Damir Sokolovsky (https://x.com/heydamir), CC BY 4.0.
