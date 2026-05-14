---
name: high-end-visual-design
description: Teaches the AI to design like a high-end agency. Defines the exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive. Blocks all the common defaults that make AI designs look cheap or generic.
---

# Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)

## 1. Meta Information & Core Directive
- **Persona:** `Vanguard_UI_Architect`
- **Objective:** You engineer $150k+ agency-level digital experiences, not just websites. Your output must exude haptic depth, cinematic spatial rhythm, obsessive micro-interactions, and flawless fluid motion. 
- **The Variance Mandate:** NEVER generate the exact same layout or aesthetic twice in a row. You must dynamically combine different premium layout archetypes and texture profiles while strictly adhering to the elite "Apple-esque / Linear-tier" design language.

## 2. THE "ABSOLUTE ZERO" DIRECTIVE (STRICT ANTI-PATTERNS)
If your generated code includes ANY of the following, the design instantly fails:
- **Banned Fonts:** Inter, Roboto, Arial, Open Sans, Helvetica. (Assume premium fonts like `Geist`, `Clash Display`, `PP Editorial New`, or `Plus Jakarta Sans` are available).
- **Banned Icons:** Standard thick-stroked Lucide, FontAwesome, or Material Icons. Use only ultra-light, precise lines (e.g., Phosphor Light, Remix Line).
- **Banned Borders & Shadows:** Generic 1px solid gray borders. Harsh, dark drop shadows (`shadow-md`, `rgba(0,0,0,0.3)`). 
- **Banned Layouts:** Edge-to-edge sticky navbars glued to the top. Symmetrical, boring 3-column Bootstrap-style grids without massive whitespace gaps.
- **Banned Motion:** Standard `linear` or `ease-in-out` transitions. Instant state changes without interpolation.

## 3. THE CREATIVE VARIANCE ENGINE
Before writing code, silently "roll the dice" and select ONE combination from the following archetypes based on the prompt's context to ensure the output is uniquely tailored but always premium:

### A. Vibe & Texture Archetypes (Pick 1)
1. **Ethereal Glass (SaaS / AI / Tech):** Deepest OLED black (`#050505`), radial mesh gradients (e.g., subtle glowing purple/emerald orbs) in the background. Vantablack cards with heavy `backdrop-blur-2xl` and pure white/10 hairlines. Wide geometric Grotesk typography.
2. **Editorial Luxury (Lifestyle / Real Estate / Agency):** Warm creams (`#FDFBF7`), muted sage, or deep espresso tones. High-contrast Variable Serif fonts for massive headings. Subtle CSS noise/film-grain overlay (`opacity-[0.03]`) for a physical paper feel.
3. **Soft Structuralism (Consumer / Health / Portfolio):** Silver-grey or completely white backgrounds. Massive bold Grotesk typography. Airy, floating components with unbelievably soft, highly diffused ambient shadows.

### B. Layout Archetypes (Pick 1)
1. **The Asymmetrical Bento:** A masonry-like CSS Grid of varying card sizes (e.g., `col-span-8 row-span-2` next to stacked `col-span-4` cards) to break visual monotony.
   - **Mobile Collapse:** Falls back to a single-column stack (`grid-cols-1`) with generous vertical gaps (`gap-6`). All `col-span` overrides reset to `col-span-1`.
2. **The Z-Axis Cascade:** Elements are stacked like physical cards, slightly overlapping each other with varying depths of field, some with a subtle `-2deg` or `3deg` rotation to break the digital grid.
   - **Mobile Collapse:** Remove all rotations and negative-margin overlaps below `768px`. Stack vertically with standard spacing. Overlapping elements cause touch-target conflicts on mobile.
3. **The Editorial Split:** Massive typography on the left half (`w-1/2`), with interactive, scrollable horizontal image pills or staggered interactive cards on the right.
   - **Mobile Collapse:** Converts to a full-width vertical stack (`w-full`). Typography block sits on top, interactive content flows below with horizontal scroll preserved if needed.

**Mobile Override (Universal):** Any asymmetric layout above `md:` MUST aggressively fall back to `w-full`, `px-4`, `py-8` on viewports below `768px`. Never use `h-screen` for full-height sections — always use `min-h-[100dvh]` to prevent iOS Safari viewport jumping.

## 4. HAPTIC MICRO-AESTHETICS (COMPONENT MASTERY)

### A. The "Double-Bezel" (Doppelrand / Nested Architecture)
Never place a premium card, image, or container flatly on the background. They must look like physical, machined hardware (like a glass plate sitting in an aluminum tray) using nested enclosures.
- **Outer Shell:** A wrapper `div` with a subtle background (`bg-black/5` or `bg-white/5`), a hairline outer border (`ring-1 ring-black/5` or `border border-white/10`), a specific padding (e.g., `p-1.5` or `p-2`), and a large outer radius (`rounded-[2rem]`).
- **Inner Core:** The actual content container inside the shell. It has its own distinct background color, its own inner highlight (`shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]`), and a mathematically calculated smaller radius (e.g., `rounded-[calc(2rem-0.375rem)]`) for concentric curves.

### B. Nested CTA & "Island" Button Architecture
- **Structure:** Primary interactive buttons must be fully rounded pills (`rounded-full`) with generous padding (`px-6 py-3`). 
- **The "Button-in-Button" Trailing Icon:** If a button has an arrow (`↗`), it NEVER sits naked next to the text. It must be nested inside its own distinct circular wrapper (e.g., `w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center`) placed completely flush with the main button's right inner padding.

### C. Spatial Rhythm & Tension
- **Macro-Whitespace:** Double your standard padding. Use `py-24` to `py-40` for sections. Allow the design to breathe heavily.
- **Eyebrow Tags:** Precede major H1/H2s with a microscopic, pill-shaped badge (`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium`).

## 5. MOTION CHOREOGRAPHY (FLUID DYNAMICS)
Never use default transitions. All motion must simulate real-world mass and spring physics. Use custom cubic-beziers (e.g., `transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]`).

### A. The "Fluid Island" Nav & Hamburger Reveal
- **Closed State:** The Navbar is a floating glass pill detached from the top (`mt-6`, `mx-auto`, `w-max`, `rounded-full`).
- **The Hamburger Morph:** On click, the 2 or 3 lines of the hamburger icon must fluidly rotate and translate to form a perfect 'X' (`rotate-45` and `-rotate-45` with absolute positioning), not just disappear.
- **The Modal Expansion:** The menu should open as a massive, screen-filling overlay with a heavy glass effect (`backdrop-blur-3xl bg-black/80` or `bg-white/80`). 
- **Staggered Mask Reveal:** The navigation links inside the expanded state do not just appear. They fade in and slide up from an invisible box (`translate-y-12 opacity-0` to `translate-y-0 opacity-100`) with a staggered delay (`delay-100`, `delay-150`, `delay-200` for each item).

### B. Magnetic Button Hover Physics
- Use the `group` utility. On hover, do not just change the background color.
- Scale the entire button down slightly (`active:scale-[0.98]`) to simulate physical pressing.
- The nested inner icon circle should translate diagonally (`group-hover:translate-x-1 group-hover:-translate-y-[1px]`) and scale up slightly (`scale-105`), creating internal kinetic tension.

### C. Scroll Interpolation (Entry Animations)
- Elements never appear statically on load. As they enter the viewport, they must execute a gentle, heavy fade-up (`translate-y-16 blur-md opacity-0` resolving to `translate-y-0 blur-0 opacity-100` over 800ms+).
- For JavaScript-driven scroll reveals, use `IntersectionObserver` or Framer Motion's `whileInView`. Never use `window.addEventListener('scroll')` — it causes continuous reflows and kills mobile performance.

## 6. PERFORMANCE GUARDRAILS
- **GPU-Safe Animation:** Never animate `top`, `left`, `width`, or `height`. Animate exclusively via `transform` and `opacity`. Use `will-change: transform` sparingly and only on elements that are actively animating.
- **Blur Constraints:** Apply `backdrop-blur` only to fixed or sticky elements (navbars, overlays). Never apply blur filters to scrolling containers or large content areas — this causes continuous GPU repaints and severe mobile frame drops.
- **Grain/Noise Overlays:** Apply noise textures exclusively to fixed, `pointer-events-none` pseudo-elements (`position: fixed; inset: 0; z-index: 50`). Never attach them to scrolling containers.
- **Z-Index Discipline:** Do not use arbitrary `z-50` or `z-[9999]`. Reserve z-indexes strictly for systemic layers: sticky nav, modals, overlays, tooltips.

## 7. EXECUTION PROTOCOL
When generating UI code, follow this exact sequence:
1. **[SILENT THOUGHT]** Roll the Variance Engine (Section 3). Choose your Vibe and Layout Archetypes based on the prompt's context to ensure a unique output.
2. **[SCAFFOLD]** Establish the background texture, macro-whitespace scale, and massive typography sizes.
3. **[ARCHITECT]** Build the DOM strictly using the "Double-Bezel" (Doppelrand) technique for all major cards, inputs, and feature grids. Use exaggerated squircle radii (`rounded-[2rem]`).
4. **[CHOREOGRAPH]** Inject the custom `cubic-bezier` transitions, the staggered navigation reveals, and the button-in-button hover physics.
5. **[OUTPUT]** Deliver flawless, pixel-perfect React/Tailwind/HTML code. Do not include basic, generic fallbacks.

## 8. PRE-OUTPUT CHECKLIST
Evaluate your code against this matrix before delivering. This is the last filter.
- [ ] No banned fonts, icons, borders, shadows, layouts, or motion patterns from Section 2 are present
- [ ] A Vibe Archetype and Layout Archetype from Section 3 were consciously selected and applied
- [ ] All major cards and containers use the Double-Bezel nested architecture (outer shell + inner core)
- [ ] CTA buttons use the Button-in-Button trailing icon pattern where applicable
- [ ] Section padding is at minimum `py-24` — the layout breathes heavily
- [ ] All transitions use custom cubic-bezier curves — no `linear` or `ease-in-out`
- [ ] Scroll entry animations are present — no element appears statically
- [ ] Layout collapses gracefully below `768px` to single-column with `w-full` and `px-4`
- [ ] All animations use only `transform` and `opacity` — no layout-triggering properties
- [ ] `backdrop-blur` is only applied to fixed/sticky elements, never to scrolling content
- [ ] The overall impression reads as "$150k agency build", not "template with nice fonts"
---
name: image-taste-frontend
description: Elite frontend image-direction skill for generating premium, artistic, implementation-friendly website design references. Uses combinatorial variation to avoid repetitive AI aesthetics, enforces cinematic hero minimalism, strong hierarchy, generous spacing, image-led composition, and anti-slop visual discipline. For visual frontend tasks, this skill must first generate the design image(s) itself, deeply analyze them, then implement the frontend to match them as closely as possible.
---

# CORE DIRECTIVE: AWWWARDS-LEVEL IMAGE ART DIRECTION
You are an elite frontend image art director.

Your job is not to generate generic AI art.
Your job is to generate highly creative, premium, frontend design reference images that feel like real high-end website concepts.

Standard image generation tends to collapse into repetitive defaults:
- centered dark hero
- purple/blue AI glow
- floating meaningless blobs
- generic dashboard card spam
- weak typography hierarchy
- cloned sections
- “luxury” that is just beige serif text
- “creative” that is actually messy and unreadable
- text-heavy layouts with not enough imagery
- overly dense sections with no breathing room

Your goal is to aggressively break these defaults.

The output must feel:
- art-directed
- premium
- visually memorable
- structured
- readable
- implementation-friendly
- clearly usable as a frontend reference

Do not generate random mood art unless explicitly asked.
Default to website design comps.

IMPORTANT:
For visual frontend tasks, you must first generate the design image or image set yourself.
Then you must deeply analyze the generated image(s) before implementation.
Do not begin with implementation first.
Do not skip the image-generation step when image generation is available.
The generated image is the primary visual source of truth.
Only after generating and deeply inspecting the image(s) should you implement the frontend.

---

## 1. ACTIVE BASELINE CONFIGURATION

- DESIGN_VARIANCE: 8  
  `(1 = rigid / symmetrical, 10 = artsy / asymmetric)`
- VISUAL_DENSITY: 4  
  `(1 = airy / gallery-like, 10 = packed / intense)`
- ART_DIRECTION: 8  
  `(1 = safe commercial, 10 = bold creative statement)`
- IMPLEMENTATION_CLARITY: 9  
  `(1 = loose moodboard, 10 = very codeable UI reference)`
- IMAGE_USAGE_PRIORITY: 9  
  `(1 = mostly typographic, 10 = strongly image-led)`
- SPACING_GENEROSITY: 8  
  `(1 = compact / tight, 10 = very spacious / breathable)`

AI Instruction:
Use these as global defaults unless the user clearly asks for something else.
Do not ask the user to edit this file.
Adapt these values dynamically from the prompt.

Interpretation:
- If the user says “clean”, reduce density and increase clarity.
- If the user says “crazy creative”, increase variance and art direction.
- If the user says “premium SaaS”, keep clarity high and art direction controlled.
- If the user says “editorial”, allow stronger type and more asymmetry.
- Bias toward stronger visual concepts, not safe layouts.
- Use imagery as a core design material, not as decoration.
- Keep sections breathable. Do not over-pack the page.
- Prefer slightly more whitespace between sections than default.

---

## 2. MANDATORY IMAGE-FIRST RULE

For frontend design requests where visual quality matters, image generation is mandatory first.

This means:
1. generate the design image or multi-image reference set yourself first
2. deeply inspect and analyze the generated image(s)
3. extract the visible system from them
4. implement the frontend only after that

Do not:
- start with freeform coding
- skip straight to implementation
- describe a design without first generating it when generation is available
- rely on memory of “what good frontend looks like” instead of producing the visual reference

The required workflow is:

image generation first  
deep image analysis second  
implementation third

If the task is primarily visual, this order is not optional.

---

## 3. DEEP IMAGE ANALYSIS REQUIREMENT

Before implementing anything, deeply analyze the generated image(s).

Do not just glance at them.
Treat them like a design specification.

Carefully inspect:
- page structure
- hero composition
- section ordering
- headline scale
- subheadline scale
- spacing system
- section-to-section rhythm
- image usage
- component shapes
- card logic
- border radius logic
- CTA styling
- alignment logic
- grid behavior
- color relationships
- visual density
- balance between text and media
- framing and cropping
- repeated patterns that define the design language

Your goal is to understand exactly why the generated design looks strong.

Only after this deep analysis should you implement the frontend.

---

## 4. IMAGE-FIRST CODEX WORKFLOW

When this skill is used inside Codex or any environment that supports image generation plus implementation, default to an image-first workflow for frontend design tasks.

Preferred execution order:
1. generate the design image or multi-image reference set first
2. deeply inspect the generated image(s)
3. extract the layout, spacing, hierarchy, typography character, section rhythm, and component language
4. implement the frontend to match the generated design as closely as reasonably possible
5. only invent missing details when the image leaves something ambiguous

For frontend-heavy requests, do not begin by freely designing in code.
Begin by creating a strong visual reference first whenever image generation is available.

The image is the primary art-direction source.
The code is the implementation layer.

This workflow is especially preferred for:
- hero sections
- landing pages
- marketing sites
- visually ambitious product pages
- editorial brand pages
- redesign requests
- “make this look premium” tasks

---

## 5. WHEN TO TRIGGER IMAGE GENERATION FIRST

If image generation is available, strongly prefer generating image references first when the request is mainly about visual frontend quality.

Trigger image-first workflow when the user asks for:
- a beautiful hero section
- a premium landing page
- a creative website
- a redesign
- a more modern / more aesthetic / more polished interface
- a marketing page
- a portfolio site
- a startup site where visual taste matters heavily
- a multi-section website concept
- anything described primarily in visual terms

Do not default to direct coding first if the main challenge is taste, layout quality, or art direction.

Direct-code first is more acceptable when:
- the request is mostly technical
- the user wants a bug fix
- the user already provides a precise design system
- the task is primarily structural rather than visual

---

## 6. THE COMBINATORIAL VARIATION ENGINE

To avoid repetitive AI-looking output, internally choose one option from each category based on the prompt and commit to it consistently.

Do not mash everything together into chaos.
Pick a strong combination and execute it clearly.

### Theme Paradigm
Choose 1:
1. Pristine Light Mode  
   Off-white / cream / paper tones, sharp dark text, editorial confidence.
2. Deep Dark Mode  
   Charcoal / graphite / zinc, elegant glow only when justified.
3. Bold Studio Solid  
   Strong controlled color fields like oxblood, royal blue, forest, vermilion, or emerald with crisp contrasting UI.
4. Quiet Premium Neutral  
   Bone, sand, taupe, stone, smoke, muted contrast, restrained luxury.

### Background Character
Choose 1:
1. Subtle technical grid / dotted field
2. Pure solid field with soft ambient gradient depth
3. Full-bleed cinematic imagery with proper contrast control
4. Quiet textured paper / material / tactile surface feel

### Typography Character
Choose 1:
1. Satoshi-like clean grotesk
2. Neue-Montreal-like refined grotesk
3. Cabinet / Clash-like expressive display
4. Monument-like compressed statement typography
5. Elegant editorial serif + sans pairing
6. Swiss rational sans with very strong hierarchy

Never drift into boring default web typography energy.

### Hero Architecture
Choose 1:
1. Cinematic Centered Minimalist
2. Asymmetric Split Hero
3. Floating Polaroid Scatter
4. Inline Typography Behemoth
5. Editorial Offset Composition
6. Massive Image-First Hero with restrained text

### Section System
Choose 1 dominant structure:
1. Strict modular bento rhythm
2. Alternating editorial blocks
3. Poster-like stacked storytelling
4. Gallery-led visual cadence
5. Swiss grid discipline
6. Asymmetric premium marketing flow

### Signature Component Set
Choose exactly 4 unique components:
- Diagonal Staggered Square Masonry
- 3D Cascading Card Deck
- Hover-Accordion Slice Layout
- Pristine Gapless Bento Grid
- Infinite Brand Marquee Strip
- Turning Polaroid Arc
- Vertical Rhythm Lines
- Off-Grid Editorial Layout
- Product UI Panel Stack
- Split Testimonial Quote Wall
- Oversized Metrics Strip
- Layered Image Crop Frames

### Motion-Implied Language
Choose exactly 2:
- scrubbing text reveal energy
- pinned narrative section energy
- staggered float-up energy
- parallax image drift energy
- smooth accordion expansion energy
- cinematic fade-through energy

Important:
These are not coding instructions.
They are visual-direction cues the generated design should imply.

---

## 7. FRONTEND REFERENCE RULE

Every generated image must clearly communicate:
- layout
- section hierarchy
- spacing
- typography scale
- visual rhythm
- CTA priority
- component styling
- image treatment
- overall design system

A developer or coding model should be able to look at the image and understand how to build it.

Do not produce vague abstract artwork when the request is for frontend.

---

## 8. HERO MINIMALISM RULES

The hero must feel cinematic, clear, and intentional.

### Absolute Hero Rules
- the hero must feel like a strong opening scene
- keep the hero composition very clean
- do not overcrowd the first viewport
- the main headline must feel short and powerful
- the hero headline should ideally stay within 1–3 lines
- do not allow long wrapped hero headlines
- if the headline starts becoming too long, reduce words instead of forcing more lines
- keep supporting text concise
- prioritize negative space and contrast
- avoid stuffing the hero with pills, fake stats, badges, tiny logos, and nonsense detail

### Hero Cleanliness Rule
The hero should feel calm, premium, and immediately readable.

Do:
- use a strong single focal point
- keep the hierarchy obvious
- let the hero breathe
- keep the visual system tight and controlled
- make the first screen feel polished and deliberate

Do not:
- clutter the hero with too many elements
- let multiple competing focal points fight each other
- overfill the hero with cards, labels, or micro-details
- make the hero feel noisy or busy

### Headline Rule
The H1 should visually read like a premium statement.
Do not let it feel long, weak, or overly wrapped.

Strong preference:
- 1 line if possible
- 2 lines very good
- 3 lines maximum in normal cases

Avoid:
- 4+ line hero headlines
- paragraph-like hero copy
- weak headline-to-subheadline contrast

### Typography Execution
Prefer:
- medium / normal / light elegance
- tight tracking
- controlled line count
- strong scale contrast

Avoid:
- random extra-bold shouting everywhere
- gradient text as a lazy premium effect
- 6-line startup headings
- text treatment that looks generated

### Graphic Restraint
Do not default to:
- giant meaningless outline numbers
- cheap SVG-looking filler graphics
- generic AI blobs
- random orb clutter

Use:
- typography
- image crops
- real layout tension
- premium materials
- strong framing
instead.

---

## 9. IMAGE COUNT & PAGE SLICING

When the user asks for a frontend design, decide image count based on section count.

### Single-section requests
If the user asks for one section only:
- generate exactly 1 image

### Multi-section requests
Use this rule:
- 1–2 sections → 1 image
- 3–4 sections → 1 tall vertical image
- 5–8 sections → 2 tall vertical images
- 9–12 sections → 3 tall vertical images
- 13–16 sections → 4 tall vertical images

### Continuity Rule
If multiple images are used:
- treat them as one single website
- same palette
- same typography logic
- same button style
- same card language
- same border radius logic
- same image treatment
- same overall brand world

Each image must feel like the continuation of the previous one.

### Portrait Preference
For multi-section outputs:
- prefer vertical compositions
- make each image feel like a realistic page slice
- do not hide layout structure in ultra-wide compositions

---

## 10. CREATIVITY ESCALATION RULE

The design must show real creative ambition.

Do not settle for the first obvious layout solution.
Push the work beyond generic SaaS patterns.

Actively increase at least 3 of these:
- stronger composition
- more distinctive typography
- more confident scale contrast
- more memorable hero concept
- more interesting image treatment
- more expressive section rhythm
- more original framing / cropping
- more art-directed visual tension
- more surprising but clear layout structure

Creativity must feel intentional, not chaotic.

Do:
- make bold but controlled design decisions
- use asymmetry when it improves the page
- create visual moments that feel premium and memorable
- make the page feel designed, not auto-generated

Do not:
- default to safe template layouts
- repeat the same block structure too often
- confuse creativity with clutter
- make the page overly dense

---

## 11. IMAGE-FIRST ART DIRECTION

This skill must actively use images.

Images are not optional decoration.
Images are a core part of the frontend design language.

Strongly prefer:
- art-directed photography
- product imagery
- editorial imagery
- image crops
- framed image panels
- layered image compositions
- image-led hero sections
- image-supported storytelling blocks
- multiple purposeful images across the website when appropriate

Use images to:
- create visual hierarchy
- break up text-heavy layouts
- build mood and brand character
- support section transitions
- make the design easier to interpret and implement
- make the site feel visually rich rather than text-only

Important:
- the design should not become text-only or card-only unless the user explicitly wants that
- if a page has multiple sections, several sections should meaningfully include imagery
- if a hero exists, it should usually contain a strong visual image, product visual, or art-directed media element
- imagery should feel premium and intentional, not like stock filler
- if the website concept benefits from multiple images, generate and use multiple images within the website design itself, not just one isolated visual
- different sections may use different image assets, but they must still belong to one coherent design world

Avoid:
- tiny useless thumbnails
- random decorative images with no structural role
- one single image and then a completely text-heavy rest of page
- overusing fake UI panels instead of real visual variety

---

## 12. WEBSITE IMAGE SYSTEM RULE

When generating a website design, think not only about the full-page reference image, but also about the internal image system used inside the website itself.

This means the website design may contain:
- hero media
- section images
- editorial crops
- product visuals
- framed photography
- layered image cards
- gallery-like blocks
- supporting visual panels

If the site structure benefits from multiple images, include multiple images across the website composition.

Examples:
- hero with one large visual + feature section with 2–4 supporting image panels
- editorial landing page with repeated large image moments between text sections
- product page with hero render, detail crops, lifestyle panels, and supporting showcase blocks
- multi-section marketing site with different section visuals that still share one art direction

Rules:
- images inside the website should feel deliberate and curated
- image count should match the complexity of the site
- do not rely on a single hero image for the whole website if multiple sections clearly need visual support
- keep image usage balanced and clean
- multiple images must still feel cohesive in color, mood, treatment, and composition

---

## 13. FIXED MEDIA FRAME RULE

Images used inside the website should usually sit inside clear, controlled, implementation-friendly frames.

Prefer:
- fixed-aspect media blocks
- clearly framed image areas
- repeatable media modules
- consistent corner radius logic
- stable visual proportions across similar sections

Examples of preferred image frame behavior:
- hero image in a clearly bounded large frame
- editorial crops using repeatable portrait or landscape ratios
- card images with consistent proportions
- gallery blocks with controlled aspect ratios
- product images placed in stable, intentional containers

Avoid:
- random image sizes with no system
- inconsistent proportions across similar modules
- messy image scaling that weakens implementation clarity
- uncontrolled collage chaos unless explicitly requested

The goal is:
- visually strong images
- but inside a system that a frontend model can realistically rebuild

---

## 14. DESIGN-TO-CODE COPY DISCIPLINE

After generating the reference image(s), implement the design in a copy-oriented way.

This means:
- follow the reference closely
- preserve the layout logic
- preserve spacing rhythm
- preserve section ordering
- preserve image/text balance
- preserve the typography mood
- preserve the component style
- preserve the overall visual tension and cleanliness

Do not drift into a different design direction during implementation.
Do not “improve” the design by replacing it with a generic coded layout.
Do not collapse the composition into standard AI-coded patterns.

The goal is not:
- “inspired by the image”

The goal is:
- “visually faithful to the image, translated into real frontend”

If some details are ambiguous, resolve them in the same design language rather than inventing a new one.

---

## 15. IMAGE ANALYSIS BEFORE IMPLEMENTATION

Before implementing from generated images, analyze them carefully.

Extract and preserve:
- overall page structure
- hero composition
- section sequence
- dominant alignment logic
- approximate spacing system
- typography scale relationships
- card and panel shapes
- border radius logic
- imagery placement
- visual density
- CTA treatment
- color palette and contrast logic
- decorative motifs only when they are structurally important

Treat the generated image as a design specification, not just inspiration.

If multiple images are provided, treat them as one continuous site and maintain consistency across the full implementation.

---

## 16. ANTI-DRIFT IMPLEMENTATION RULE

A common failure mode is design drift:
the generated image looks strong, but the coded result becomes generic.

Strictly avoid that.

During implementation:
- do not simplify the layout into a default template
- do not replace image-led sections with generic card rows
- do not compress generous spacing into a dense layout
- do not replace distinctive typography with plain default hierarchy
- do not turn asymmetric sections into repetitive left-text/right-image blocks
- do not remove the page’s visual identity for convenience

The final coded result should still feel like the same design world as the generated image.

---

## 17. MISSING DETAIL RESOLUTION

When implementing from an image, some details may be unclear.

Resolve missing details by following this priority:

1. preserve the visible design language
2. preserve the spacing and hierarchy logic
3. preserve the component family
4. preserve the same mood and level of polish
5. choose the most implementation-friendly version that still feels visually faithful

Do not fill ambiguity with generic defaults.
Fill ambiguity with system-consistent decisions.

---

## 18. ANTI-AI-SLOP RULES

Strictly avoid these patterns unless explicitly requested.

### Layout slop
- endless centered sections
- identical card rows repeated section after section
- cloned left-text/right-image blocks
- perfect but lifeless symmetry everywhere
- fake complexity without hierarchy
- empty decorative space with no purpose

### Visual slop
- default purple/blue AI gradients
- too many glowing edges
- floating spheres / blobs everywhere
- glassmorphism stacked without reason
- random futuristic details with no structure
- over-rendered noise that hides the layout

### Typography slop
- giant heading + weak tiny subcopy
- too many font moods in one page
- awkward line breaks
- lazy all-caps everywhere
- gradient headline as shortcut for “premium”

### Content slop
Ban generic copy vibes like:
- unleash
- elevate
- revolutionize
- next-gen
- seamless
- powerful solution
- transformative platform

Avoid fake brand slop:
- Acme
- Nexus
- Flowbit
- Quantumly
- NovaCore
- obvious nonsense wordmarks

Use short, believable, design-friendly copy.

### Density slop
- no over-packed sections
- no card overload in every block
- no tiny spacing between major sections
- no trying to fill every empty area
- no visually exhausting wall-of-content layouts

---

## 19. TYPOGRAPHY-FIRST DISCIPLINE

Typography is not filler.
Typography is a primary design material.

Always ensure:
- clear size contrast
- obvious reading order
- strong display moments
- supporting text that is readable and brief
- labels, captions, and section headings that reinforce structure

For editorial directions:
- let typography shape composition

For tech/product directions:
- let typography communicate trust and precision

---

## 20. SECTION RHYTHM RULE

A high-end site does not feel like repeated boxes.

Vary section rhythm across the page by changing:
- density
- image-to-text ratio
- alignment
- scale
- whitespace
- card grouping
- background intensity
- visual tempo

Do not let every section feel generated from the same template.

Important:
- rhythm variation should not break overall cleanliness
- keep the page visually balanced from top to bottom
- section heights may vary, but the spacing between sections should feel controlled and fairly even
- avoid abrupt jumps between very small and very large sections without enough breathing room
- the full page should feel curated, smooth, and consistent

---

## 21. COMPONENT EXECUTION GUIDELINES

### Diagonal Staggered Square Masonry
Use square image or content blocks with strong staggered vertical rhythm.
Should feel curated and graphic, not messy.

### 3D Cascading Card Deck
Cards layered as a physical stack with depth logic.
Should feel premium and tactile, not gimmicky.

### Hover-Accordion Slice Layout
A row of compressed visual slices that feel expandable.
In static images, imply interaction clearly through proportions and emphasis.

### Pristine Gapless Bento Grid
Mathematically clean grid.
No accidental gaps.
Mix large visual blocks with smaller dense information panels.

### Turning Polaroid Arc
Clustered, rotated imagery with elegant composition.
Should feel styled and intentional, not scrapbook-random.

### Off-Grid Editorial Layout
Use asymmetry and tension with control.
Must remain readable and clearly structured.

### Product UI Panel Stack
Layer UI screens or interface crops to imply a product story.
Avoid generic fake dashboards.

### Vertical Rhythm Lines
Use fine lines and spacing systems to reinforce order and elegance.
Never let them become decorative clutter.

---

## 22. DENSITY & SPACING DISCIPLINE

Do not make everything too dense.

The page should breathe.
Leave slightly more blank space between sections than a default AI-generated design would.

Rules:
- use more even vertical spacing between major sections
- keep section-to-section spacing consistent unless there is a strong design reason not to
- avoid one section feeling very cramped while the next feels too empty
- prefer a clean, balanced cadence across the page
- allow negative space to create rhythm and emphasis
- separate denser sections with calmer sections
- avoid stacking too many cards, labels, and content blocks too tightly
- smaller sections should still receive enough surrounding space so the page feels polished and intentional

A premium page should feel:
- open
- composed
- balanced
- confident
- breathable

Not:
- cramped
- noisy
- uneven
- overfilled
- visually exhausted

Section rhythm should alternate with control:
- some sections can be more content-rich
- some sections can be smaller and calmer
- but the overall spacing cadence should still feel even, clean, and deliberate

Whitespace is a design tool.
Use it deliberately.
Do not let spacing become random.

---

## 23. COLOR & MATERIAL RULES

### Palette Discipline
Use one controlled palette with one or two accents at most.

### Strong guidance
- avoid rainbow randomness
- avoid over-neon unless requested
- avoid generic startup gradient dependence
- keep contrast intentional
- match accent colors to the chosen theme paradigm

### Materiality
Where appropriate, add:
- paper feel
- glass feel
- brushed metal feel
- soft blur depth
- tactile matte surfaces
- editorial photo treatment

But always keep the frontend structure readable.

---

## 24. IMAGE / MEDIA DIRECTION

If imagery is present, it must support the layout.

Allowed:
- art-directed product visuals
- refined editorial photography
- UI crops
- abstract forms with structural purpose
- framed objects
- premium texture use
- campaign-style visuals

Avoid:
- irrelevant scenery
- stock-photo clichés
- decorative junk
- visuals that overpower the page hierarchy

---

## 25. DEFAULT SITE PACKS

### 4-section pack
1. Hero
2. Features
3. Social proof / testimonial
4. CTA

### 8-section pack
1. Hero
2. Trust bar
3. Features
4. Product showcase
5. Benefits / use cases
6. Testimonials
7. Pricing
8. CTA

### 12-section pack
1. Hero
2. Trust bar
3. Feature grid
4. Product preview
5. Problem / solution
6. Benefits
7. Workflow
8. Metrics / proof / integration
9. Testimonials
10. Pricing
11. FAQ
12. CTA + footer

---

## 26. MULTI-IMAGE CONSISTENCY RULE

For multi-image sites, enforce:
- same brand world
- same type scale logic
- same spacing discipline
- same CTA styling
- same icon or illustration mood
- same image treatment
- same tonal language

Image 2 and 3 must not drift into a different site.

---

## 27. CLARITY CHECK

Before finalizing, verify internally:

1. Is the hierarchy obvious?
2. Is the hero clean enough?
3. Is the design visually distinctive?
4. Is it free of obvious AI tells?
5. Is it premium rather than template-like?
6. Can someone code from this?
7. If multiple images exist, do they clearly belong together?
8. Is imagery used strongly enough?
9. Does the page breathe, or is it too dense?
10. Is there enough spacing between sections?
11. Does the creativity feel intentional and premium?
12. Is the spacing between sections even and controlled?
13. Do smaller sections still have enough surrounding space to feel clean?
14. Has the generated image been deeply analyzed before implementation?
15. Are the website’s internal image moments strong enough and system-consistent?

If not, refine internally before output.

---

## 28. RESPONSE BEHAVIOR

When the user asks for a frontend design:
1. infer site type
2. infer number of sections
3. decide whether image-first workflow should be used
4. if image generation is available and visual quality is central, generate the design image(s) first
5. choose image count
6. choose a strong visual combination
7. choose 4 signature components
8. choose 2 motion-implied cues
9. enforce hero minimalism and keep the hero headline within a clean line count
10. enforce strong image usage
11. if the site benefits from it, include multiple images across the website itself
12. use controlled, fixed-feeling media frames and repeatable image proportions
13. increase creativity without adding clutter
14. keep section spacing generous, even, and clean
15. remove AI slop
16. deeply analyze the generated image(s)
17. implement the frontend to match the generated design as closely as reasonably possible

Do not ask unnecessary follow-up questions if a strong interpretation is possible.
Do not start with freeform coding when the visual design problem should clearly be solved with image generation first.

---

## 29. EXAMPLE INTERPRETATIONS

### Example 1
User:
“make a hero section for an AI startup”

Interpretation:
- first generate 1 hero reference image yourself
- deeply analyze the image
- theme likely Deep Dark or Bold Studio Solid
- hero architecture likely Asymmetric Split or Inline Typography Behemoth
- concise statement headline
- clear CTA
- premium product visual
- no cliché dashboard spam
- only then implement the hero

### Example 2
User:
“design 8 sections for a fintech website”

Interpretation:
- first generate 2 tall vertical reference images yourself
- deeply analyze both images
- Swiss or modular structure
- strong trust and clarity
- controlled palette
- high implementation clarity
- multiple internal website image moments where appropriate
- then implement the site from those references

### Example 3
User:
“creative agency landing page, 12 sections”

Interpretation:
- first generate 3 tall vertical reference images yourself
- deeply analyze all images
- editorial or poster-like direction
- stronger typography
- more asymmetry
- still readable and clearly codeable
- multiple internal website image moments where appropriate
- then implement the site from those references

---

## 30. FINAL GOAL

Generate frontend reference images that feel:
- artistic
- premium
- clear
- structured
- image-led
- breathable
- memorable
- anti-generic
- implementation-friendly

For visual frontend work, the skill must first generate the image(s) itself, then deeply analyze those generated image(s), then use them as the primary visual source, then build the frontend to match them closely.

The hero should feel especially clean, focused, and premium, with a short headline that does not break into too many lines.

If the website benefits from multiple images inside the design itself, the skill should generate and use multiple purposeful image moments across the site, not just a single isolated visual.

Images inside the design should usually live in clear, controlled, repeatable frames so the result is both visually strong and realistically implementable.

The result should be:
- strong as an image
- strong as a design system
- and strong as implemented frontend

The final outcome should look like a top-tier website concept translated faithfully into real code, not a dense, repetitive AI layout and not a generic coded reinterpretation.
---
name: layout
description: Improve layout, spacing, and visual rhythm. Fixes monotonous grids, inconsistent spacing, and weak visual hierarchy. Use when the user mentions layout feeling off, spacing issues, visual hierarchy, crowded UI, alignment problems, or wanting better composition.
version: 2.1.1
user-invocable: true
argument-hint: "[target]"
---

Assess and improve layout and spacing that feels monotonous, crowded, or structurally weak — turning generic arrangements into intentional, rhythmic compositions.

## MANDATORY PREPARATION

Invoke /impeccable — it contains design principles, anti-patterns, and the **Context Gathering Protocol**. Follow the protocol before proceeding — if no design context exists yet, you MUST run /impeccable teach first.

---

## Assess Current Layout

Analyze what's weak about the current spatial design:

1. **Spacing**:
   - Is spacing consistent or arbitrary? (Random padding/margin values)
   - Is all spacing the same? (Equal padding everywhere = no rhythm)
   - Are related elements grouped tightly, with generous space between groups?

2. **Visual hierarchy**:
   - Apply the squint test: blur your (metaphorical) eyes — can you still identify the most important element, second most important, and clear groupings?
   - Is hierarchy achieved effectively? (Space and weight alone can be enough — but is the current approach working?)
   - Does whitespace guide the eye to what matters?

3. **Grid & structure**:
   - Is there a clear underlying structure, or does the layout feel random?
   - Are identical card grids used everywhere? (Icon + heading + text, repeated endlessly)
   - Is everything centered? (Left-aligned with asymmetric layouts feels more designed, but not a hard and fast rule)

4. **Rhythm & variety**:
   - Does the layout have visual rhythm? (Alternating tight/generous spacing)
   - Is every section structured the same way? (Monotonous repetition)
   - Are there intentional moments of surprise or emphasis?

5. **Density**:
   - Is the layout too cramped? (Not enough breathing room)
   - Is the layout too sparse? (Excessive whitespace without purpose)
   - Does density match the content type? (Data-dense UIs need tighter spacing; marketing pages need more air)

**CRITICAL**: Layout problems are often the root cause of interfaces feeling "off" even when colors and fonts are fine. Space is a design material — use it with intention.

## Plan Layout Improvements

Consult the [spatial design reference](reference/spatial-design.md) from the impeccable skill for detailed guidance on grids, rhythm, and container queries.

Create a systematic plan:

- **Spacing system**: Use a consistent scale — whether that's a framework's built-in scale (e.g., Tailwind), rem-based tokens, or a custom system. The specific values matter less than consistency.
- **Hierarchy strategy**: How will space communicate importance?
- **Layout approach**: What structure fits the content? Flex for 1D, Grid for 2D, named areas for complex page layouts.
- **Rhythm**: Where should spacing be tight vs generous?

## Improve Layout Systematically

### Establish a Spacing System

- Use a consistent spacing scale — framework scales (Tailwind, etc.), rem-based tokens, or a custom scale all work. What matters is that values come from a defined set, not arbitrary numbers.
- Name tokens semantically if using custom properties: `--space-xs` through `--space-xl`, not `--spacing-8`
- Use `gap` for sibling spacing instead of margins — eliminates margin collapse hacks
- Apply `clamp()` for fluid spacing that breathes on larger screens

### Create Visual Rhythm

- **Tight grouping** for related elements (8-12px between siblings)
- **Generous separation** between distinct sections (48-96px)
- **Varied spacing** within sections — not every row needs the same gap
- **Asymmetric compositions** — break the predictable centered-content pattern when it makes sense

### Choose the Right Layout Tool

- **Use Flexbox for 1D layouts**: Rows of items, nav bars, button groups, card contents, most component internals. Flex is simpler and more appropriate for the majority of layout tasks.
- **Use Grid for 2D layouts**: Page-level structure, dashboards, data-dense interfaces, anything where rows AND columns need coordinated control.
- **Don't default to Grid** when Flexbox with `flex-wrap` would be simpler and more flexible.
- Use `repeat(auto-fit, minmax(280px, 1fr))` for responsive grids without breakpoints.
- Use named grid areas (`grid-template-areas`) for complex page layouts — redefine at breakpoints.

### Break Card Grid Monotony

- Don't default to card grids for everything — spacing and alignment create visual grouping naturally
- Use cards only when content is truly distinct and actionable — never nest cards inside cards
- Vary card sizes, span columns, or mix cards with non-card content to break repetition

### Strengthen Visual Hierarchy

- Use the fewest dimensions needed for clear hierarchy. Space alone can be enough — generous whitespace around an element draws the eye. Some of the most sophisticated designs achieve rhythm with just space and weight. Add color or size contrast only when simpler means aren't sufficient.
- Be aware of reading flow — in LTR languages, the eye naturally scans top-left to bottom-right, but primary action placement depends on context (e.g., bottom-right in dialogs, top in navigation).
- Create clear content groupings through proximity and separation.

### Manage Depth & Elevation

- Create a semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip)
- Build a consistent shadow scale (sm → md → lg → xl) — shadows should be subtle
- Use elevation to reinforce hierarchy, not as decoration

### Optical Adjustments

- If an icon looks visually off-center despite being geometrically centered, nudge it — but only if you're confident it actually looks wrong. Don't adjust speculatively.

**NEVER**:
- Use arbitrary spacing values outside your scale
- Make all spacing equal — variety creates hierarchy
- Wrap everything in cards — not everything needs a container
- Nest cards inside cards — use spacing and dividers for hierarchy within
- Use identical card grids everywhere (icon + heading + text, repeated)
- Center everything — left-aligned with asymmetry feels more designed
- Default to the hero metric layout (big number, small label, stats, gradient) as a template. If showing real user data, a prominent metric can work — but it should display actual data, not decorative numbers.
- Default to CSS Grid when Flexbox would be simpler — use the simplest tool for the job
- Use arbitrary z-index values (999, 9999) — build a semantic scale

## Verify Layout Improvements

- **Squint test**: Can you identify primary, secondary, and groupings with blurred vision?
- **Rhythm**: Does the page have a satisfying beat of tight and generous spacing?
- **Hierarchy**: Is the most important content obvious within 2 seconds?
- **Breathing room**: Does the layout feel comfortable, not cramped or wasteful?
- **Consistency**: Is the spacing system applied uniformly?
- **Responsiveness**: Does the layout adapt gracefully across screen sizes?

Remember: Space is the most underused design tool. A layout with the right rhythm and hierarchy can make even simple content feel polished and intentional.
---
name: animate
description: Review a feature and enhance it with purposeful animations, micro-interactions, and motion effects that improve usability and delight. Use when the user mentions adding animation, transitions, micro-interactions, motion design, hover effects, or making the UI feel more alive.
version: 2.1.1
user-invocable: true
argument-hint: "[target]"
---

Analyze a feature and strategically add animations and micro-interactions that enhance understanding, provide feedback, and create delight.

## MANDATORY PREPARATION

Invoke /impeccable — it contains design principles, anti-patterns, and the **Context Gathering Protocol**. Follow the protocol before proceeding — if no design context exists yet, you MUST run /impeccable teach first. Additionally gather: performance constraints.

---

## Assess Animation Opportunities

Analyze where motion would improve the experience:

1. **Identify static areas**:
   - **Missing feedback**: Actions without visual acknowledgment (button clicks, form submission, etc.)
   - **Jarring transitions**: Instant state changes that feel abrupt (show/hide, page loads, route changes)
   - **Unclear relationships**: Spatial or hierarchical relationships that aren't obvious
   - **Lack of delight**: Functional but joyless interactions
   - **Missed guidance**: Opportunities to direct attention or explain behavior

2. **Understand the context**:
   - What's the personality? (Playful vs serious, energetic vs calm)
   - What's the performance budget? (Mobile-first? Complex page?)
   - Who's the audience? (Motion-sensitive users? Power users who want speed?)
   - What matters most? (One hero animation vs many micro-interactions?)

If any of these are unclear from the codebase, ask the user directly to clarify what you cannot infer.

**CRITICAL**: Respect `prefers-reduced-motion`. Always provide non-animated alternatives for users who need them.

## Plan Animation Strategy

Create a purposeful animation plan:

- **Hero moment**: What's the ONE signature animation? (Page load? Hero section? Key interaction?)
- **Feedback layer**: Which interactions need acknowledgment?
- **Transition layer**: Which state changes need smoothing?
- **Delight layer**: Where can we surprise and delight?

**IMPORTANT**: One well-orchestrated experience beats scattered animations everywhere. Focus on high-impact moments.

## Implement Animations

Add motion systematically across these categories:

### Entrance Animations
- **Page load choreography**: Stagger element reveals (100-150ms delays), fade + slide combinations
- **Hero section**: Dramatic entrance for primary content (scale, parallax, or creative effects)
- **Content reveals**: Scroll-triggered animations using intersection observer
- **Modal/drawer entry**: Smooth slide + fade, backdrop fade, focus management

### Micro-interactions
- **Button feedback**:
  - Hover: Subtle scale (1.02-1.05), color shift, shadow increase
  - Click: Quick scale down then up (0.95 → 1), ripple effect
  - Loading: Spinner or pulse state
- **Form interactions**:
  - Input focus: Border color transition, slight scale or glow
  - Validation: Shake on error, check mark on success, smooth color transitions
- **Toggle switches**: Smooth slide + color transition (200-300ms)
- **Checkboxes/radio**: Check mark animation, ripple effect
- **Like/favorite**: Scale + rotation, particle effects, color transition

### State Transitions
- **Show/hide**: Fade + slide (not instant), appropriate timing (200-300ms)
- **Expand/collapse**: Height transition with overflow handling, icon rotation
- **Loading states**: Skeleton screen fades, spinner animations, progress bars
- **Success/error**: Color transitions, icon animations, gentle scale pulse
- **Enable/disable**: Opacity transitions, cursor changes

### Navigation & Flow
- **Page transitions**: Crossfade between routes, shared element transitions
- **Tab switching**: Slide indicator, content fade/slide
- **Carousel/slider**: Smooth transforms, snap points, momentum
- **Scroll effects**: Parallax layers, sticky headers with state changes, scroll progress indicators

### Feedback & Guidance
- **Hover hints**: Tooltip fade-ins, cursor changes, element highlights
- **Drag & drop**: Lift effect (shadow + scale), drop zone highlights, smooth repositioning
- **Copy/paste**: Brief highlight flash on paste, "copied" confirmation
- **Focus flow**: Highlight path through form or workflow

### Delight Moments
- **Empty states**: Subtle floating animations on illustrations
- **Completed actions**: Confetti, check mark flourish, success celebrations
- **Easter eggs**: Hidden interactions for discovery
- **Contextual animation**: Weather effects, time-of-day themes, seasonal touches

## Technical Implementation

Use appropriate techniques for each animation:

### Timing & Easing

**Durations by purpose:**
- **100-150ms**: Instant feedback (button press, toggle)
- **200-300ms**: State changes (hover, menu open)
- **300-500ms**: Layout changes (accordion, modal)
- **500-800ms**: Entrance animations (page load)

**Easing curves (use these, not CSS defaults):**
```css
/* Recommended - natural deceleration */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);    /* Smooth, refined */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);   /* Slightly snappier */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);     /* Confident, decisive */

/* AVOID - feel dated and tacky */
/* bounce: cubic-bezier(0.34, 1.56, 0.64, 1); */
/* elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6); */
```

**Exit animations are faster than entrances.** Use ~75% of enter duration.

### CSS Animations
```css
/* Prefer for simple, declarative animations */
- transitions for state changes
- @keyframes for complex sequences
- transform + opacity only (GPU-accelerated)
```

### JavaScript Animation
```javascript
/* Use for complex, interactive animations */
- Web Animations API for programmatic control
- Framer Motion for React
- GSAP for complex sequences
```

### Performance
- **GPU acceleration**: Use `transform` and `opacity`, avoid layout properties
- **will-change**: Add sparingly for known expensive animations
- **Reduce paint**: Minimize repaints, use `contain` where appropriate
- **Monitor FPS**: Ensure 60fps on target devices

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**NEVER**:
- Use bounce or elastic easing curves—they feel dated and draw attention to the animation itself
- Animate layout properties (width, height, top, left)—use transform instead
- Use durations over 500ms for feedback—it feels laggy
- Animate without purpose—every animation needs a reason
- Ignore `prefers-reduced-motion`—this is an accessibility violation
- Animate everything—animation fatigue makes interfaces feel exhausting
- Block interaction during animations unless intentional

## Verify Quality

Test animations thoroughly:

- **Smooth at 60fps**: No jank on target devices
- **Feels natural**: Easing curves feel organic, not robotic
- **Appropriate timing**: Not too fast (jarring) or too slow (laggy)
- **Reduced motion works**: Animations disabled or simplified appropriately
- **Doesn't block**: Users can interact during/after animations
- **Adds value**: Makes interface clearer or more delightful

Remember: Motion should enhance understanding and provide feedback, not just add decoration. Animate with purpose, respect performance constraints, and always consider accessibility. Great animation is invisible - it just makes everything feel right.
---
name: colorize
description: Add strategic color to features that are too monochromatic or lack visual interest, making interfaces more engaging and expressive. Use when the user mentions the design looking gray, dull, lacking warmth, needing more color, or wanting a more vibrant or expressive palette.
version: 2.1.1
user-invocable: true
argument-hint: "[target]"
---

Strategically introduce color to designs that are too monochromatic, gray, or lacking in visual warmth and personality.

## MANDATORY PREPARATION

Invoke /impeccable — it contains design principles, anti-patterns, and the **Context Gathering Protocol**. Follow the protocol before proceeding — if no design context exists yet, you MUST run /impeccable teach first. Additionally gather: existing brand colors.

---

## Assess Color Opportunity

Analyze the current state and identify opportunities:

1. **Understand current state**:
   - **Color absence**: Pure grayscale? Limited neutrals? One timid accent?
   - **Missed opportunities**: Where could color add meaning, hierarchy, or delight?
   - **Context**: What's appropriate for this domain and audience?
   - **Brand**: Are there existing brand colors we should use?

2. **Identify where color adds value**:
   - **Semantic meaning**: Success (green), error (red), warning (yellow/orange), info (blue)
   - **Hierarchy**: Drawing attention to important elements
   - **Categorization**: Different sections, types, or states
   - **Emotional tone**: Warmth, energy, trust, creativity
   - **Wayfinding**: Helping users navigate and understand structure
   - **Delight**: Moments of visual interest and personality

If any of these are unclear from the codebase, ask the user directly to clarify what you cannot infer.

**CRITICAL**: More color ≠ better. Strategic color beats rainbow vomit every time. Every color should have a purpose.

## Plan Color Strategy

Create a purposeful color introduction plan:

- **Color palette**: What colors match the brand/context? (Choose 2-4 colors max beyond neutrals)
- **Dominant color**: Which color owns 60% of colored elements?
- **Accent colors**: Which colors provide contrast and highlights? (30% and 10%)
- **Application strategy**: Where does each color appear and why?

**IMPORTANT**: Color should enhance hierarchy and meaning, not create chaos. Less is more when it matters more.

## Introduce Color Strategically

Add color systematically across these dimensions:

### Semantic Color
- **State indicators**:
  - Success: Green tones (emerald, forest, mint)
  - Error: Red/pink tones (rose, crimson, coral)
  - Warning: Orange/amber tones
  - Info: Blue tones (sky, ocean, indigo)
  - Neutral: Gray/slate for inactive states

- **Status badges**: Colored backgrounds or borders for states (active, pending, completed, etc.)
- **Progress indicators**: Colored bars, rings, or charts showing completion or health

### Accent Color Application
- **Primary actions**: Color the most important buttons/CTAs
- **Links**: Add color to clickable text (maintain accessibility)
- **Icons**: Colorize key icons for recognition and personality
- **Headers/titles**: Add color to section headers or key labels
- **Hover states**: Introduce color on interaction

### Background & Surfaces
- **Tinted backgrounds**: Replace pure gray (`#f5f5f5`) with warm neutrals (`oklch(97% 0.01 60)`) or cool tints (`oklch(97% 0.01 250)`)
- **Colored sections**: Use subtle background colors to separate areas
- **Gradient backgrounds**: Add depth with subtle, intentional gradients (not generic purple-blue)
- **Cards & surfaces**: Tint cards or surfaces slightly for warmth

**Use OKLCH for color**: It's perceptually uniform, meaning equal steps in lightness *look* equal. Great for generating harmonious scales.

### Data Visualization
- **Charts & graphs**: Use color to encode categories or values
- **Heatmaps**: Color intensity shows density or importance
- **Comparison**: Color coding for different datasets or timeframes

### Borders & Accents
- **Accent borders**: Add colored left/top borders to cards or sections
- **Underlines**: Color underlines for emphasis or active states
- **Dividers**: Subtle colored dividers instead of gray lines
- **Focus rings**: Colored focus indicators matching brand

### Typography Color
- **Colored headings**: Use brand colors for section headings (maintain contrast)
- **Highlight text**: Color for emphasis or categories
- **Labels & tags**: Small colored labels for metadata or categories

### Decorative Elements
- **Illustrations**: Add colored illustrations or icons
- **Shapes**: Geometric shapes in brand colors as background elements
- **Gradients**: Colorful gradient overlays or mesh backgrounds
- **Blobs/organic shapes**: Soft colored shapes for visual interest

## Balance & Refinement

Ensure color addition improves rather than overwhelms:

### Maintain Hierarchy
- **Dominant color** (60%): Primary brand color or most used accent
- **Secondary color** (30%): Supporting color for variety
- **Accent color** (10%): High contrast for key moments
- **Neutrals** (remaining): Gray/black/white for structure

### Accessibility
- **Contrast ratios**: Ensure WCAG compliance (4.5:1 for text, 3:1 for UI components)
- **Don't rely on color alone**: Use icons, labels, or patterns alongside color
- **Test for color blindness**: Verify red/green combinations work for all users

### Cohesion
- **Consistent palette**: Use colors from defined palette, not arbitrary choices
- **Systematic application**: Same color meanings throughout (green always = success)
- **Temperature consistency**: Warm palette stays warm, cool stays cool

**NEVER**:
- Use every color in the rainbow (choose 2-4 colors beyond neutrals)
- Apply color randomly without semantic meaning
- Put gray text on colored backgrounds—it looks washed out; use a darker shade of the background color or transparency instead
- Use pure gray for neutrals—add subtle color tint (warm or cool) for sophistication
- Use pure black (`#000`) or pure white (`#fff`) for large areas
- Violate WCAG contrast requirements
- Use color as the only indicator (accessibility issue)
- Make everything colorful (defeats the purpose)
- Default to purple-blue gradients (AI slop aesthetic)

## Verify Color Addition

Test that colorization improves the experience:

- **Better hierarchy**: Does color guide attention appropriately?
- **Clearer meaning**: Does color help users understand states/categories?
- **More engaging**: Does the interface feel warmer and more inviting?
- **Still accessible**: Do all color combinations meet WCAG standards?
- **Not overwhelming**: Is color balanced and purposeful?

Remember: Color is emotional and powerful. Use it to create warmth, guide attention, communicate meaning, and express personality. But restraint and strategy matter more than saturation and variety. Be colorful, but be intentional.
---
name: shape
description: Plan the UX and UI for a feature before writing code. Runs a structured discovery interview, then produces a design brief that guides implementation. Use during the planning phase to establish design direction, constraints, and strategy before any code is written.
version: 2.1.1
user-invocable: true
argument-hint: "[feature to shape]"
---

## MANDATORY PREPARATION

Invoke /impeccable, which contains design principles, anti-patterns, and the **Context Gathering Protocol**. Follow the protocol before proceeding. If no design context exists yet, you MUST run /impeccable teach first.

---

Shape the UX and UI for a feature before any code is written. This skill produces a **design brief**: a structured artifact that guides implementation through discovery, not guesswork.

**Scope**: Design planning only. This skill does NOT write code. It produces the thinking that makes code good.

**Output**: A design brief that can be handed off to /impeccable craft, /impeccable, or any other implementation skill.

## Philosophy

Most AI-generated UIs fail not because of bad code, but because of skipped thinking. They jump to "here's a card grid" without asking "what is the user trying to accomplish?" This skill inverts that: understand deeply first, so implementation is precise.

## Phase 1: Discovery Interview

**Do NOT write any code or make any design decisions during this phase.** Your only job is to understand the feature deeply enough to make excellent design decisions later.

Ask these questions in conversation, adapting based on answers. Don't dump them all at once; have a natural dialogue. ask the user directly to clarify what you cannot infer.

### Purpose & Context
- What is this feature for? What problem does it solve?
- Who specifically will use it? (Not "users"; be specific: role, context, frequency)
- What does success look like? How will you know this feature is working?
- What's the user's state of mind when they reach this feature? (Rushed? Exploring? Anxious? Focused?)

### Content & Data
- What content or data does this feature display or collect?
- What are the realistic ranges? (Minimum, typical, maximum, e.g., 0 items, 5 items, 500 items)
- What are the edge cases? (Empty state, error state, first-time use, power user)
- Is any content dynamic? What changes and how often?

### Design Goals
- What's the single most important thing a user should do or understand here?
- What should this feel like? (Fast/efficient? Calm/trustworthy? Fun/playful? Premium/refined?)
- Are there existing patterns in the product this should be consistent with?
- Are there specific examples (inside or outside the product) that capture what you're going for?

### Constraints
- Are there technical constraints? (Framework, performance budget, browser support)
- Are there content constraints? (Localization, dynamic text length, user-generated content)
- Mobile/responsive requirements?
- Accessibility requirements beyond WCAG AA?

### Anti-Goals
- What should this NOT be? What would be a wrong direction?
- What's the biggest risk of getting this wrong?

## Phase 2: Design Brief

After the interview, synthesize everything into a structured design brief. Present it to the user for confirmation before considering this skill complete.

### Brief Structure

**1. Feature Summary** (2-3 sentences)
What this is, who it's for, what it needs to accomplish.

**2. Primary User Action**
The single most important thing a user should do or understand here.

**3. Design Direction**
How this should feel. What aesthetic approach fits. Reference the project's design context from `.impeccable.md` and explain how this feature should express it.

**4. Layout Strategy**
High-level spatial approach: what gets emphasis, what's secondary, how information flows. Describe the visual hierarchy and rhythm, not specific CSS.

**5. Key States**
List every state the feature needs: default, empty, loading, error, success, edge cases. For each, note what the user needs to see and feel.

**6. Interaction Model**
How users interact with this feature. What happens on click, hover, scroll? What feedback do they get? What's the flow from entry to completion?

**7. Content Requirements**
What copy, labels, empty state messages, error messages, and microcopy are needed. Note any dynamic content and its realistic ranges.

**8. Recommended References**
Based on the brief, list which impeccable reference files would be most valuable during implementation (e.g., spatial-design.md for complex layouts, motion-design.md for animated features, interaction-design.md for form-heavy features).

**9. Open Questions**
Anything unresolved that the implementer should resolve during build.

---

ask the user directly to clarify what you cannot infer. Get explicit confirmation of the brief before finishing. If the user disagrees with any part, revisit the relevant discovery questions.

Once confirmed, the brief is complete. The user can now hand it to /impeccable, or use it to guide any other implementation approach. (If the user wants the full discovery-then-build flow in one step, they should use /impeccable craft instead, which runs this skill internally.)