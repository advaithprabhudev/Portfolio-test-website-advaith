# Design System Document



## 1. Overview & Creative North Star

### Creative North Star: "The Digital Archivist"

This design system is a sophisticated reimagining of the 1990s desktop paradigm. Rather than a mere "retro" skin, it is an intentional editorial exploration of the early web’s architectural rigidity, transformed into a premium, high-end experience. We move beyond the "flat" modern web by embracing the physicality of the window-pane—treating the screen as a canvas of depth, beveled surfaces, and tactile interactions.



To break the "standard template" look, this system utilizes **intentional asymmetry**. Windows are rarely centered; they are "cascaded." The layout relies on the tension between the precision of pixel-perfect typography and the expansive, breathable "Desktop" workspace. We are not just building an interface; we are curating a digital environment that feels both nostalgic and authoritative.



---



## 2. Colors

Our palette is rooted in the classic "System Standard," but refined for high-end digital clarity.



* **Primary (#474EB7):** Used for active title bars and critical focus states.

* **Secondary (#5D5E5F):** Defines the "Deep Shade" of our bevels and secondary UI elements.

* **Tertiary (#008080):** The "Desktop Teal." Used as the foundational background to anchor all floating window elements.

* **Neutral/Surface Scale:**

* `surface-container-lowest`: #FFFFFF (The "Paper" inside document windows)

* `surface-container-low`: #F4F3F3 (Subtle offsets)

* `surface`: #FAF9F9 (General background)

* `surface-dim`: #DADADA (The classic "Silver" foundation)



**The "No-Line" Rule:**

Standard 1px solid borders are strictly prohibited for sectioning. Structural separation must be achieved through:

1. **Background Shifts:** Use `surface-container-low` to define a sidebar against a `surface` main body.

2. **Beveled Tonal Transitions:** Use high-contrast light and dark edges to imply depth (e.g., a top-left highlight and a bottom-right shadow) rather than a uniform stroke.



**Signature Textures:**

Incorporate subtle 45-degree linear gradients (Primary to Primary-Container) within title bars. This adds "visual soul" and mimics the slight color banding of vintage CRT monitors without sacrificing modern resolution.



---



## 3. Typography

The typographic hierarchy is a juxtaposition of brutalist space-age geometry and classic workstation readability.



* **Display (Space Grotesk):** High-contrast, wide-aperture sans-serif. Use for hero headers to provide a modern, "Editorial" look that offsets the retro UI.

* **Headline & Title (Space Grotesk):** Tight tracking and bold weights. This provides the "authoritative" voice of the system.

* **Body & Labels (Work Sans):** Our modern alternative to MS Sans Serif. It retains the utilitarian legibility of early system fonts but offers the polished kerning of a high-end typeface.



**Pixel-Alignment Rule:** While the fonts are modern, all typography should be treated as "Objects." Align text to a strict 4px grid to maintain the feel of early software where every character occupied a specific coordinate.



---



## 4. Elevation & Depth

In this system, depth is a physical attribute, not a visual flourish.



* **The Layering Principle:** We do not use traditional Z-indexes in a flat way. Instead, we use "Nesting." A `surface-container-lowest` card sits inside a `surface-dim` window. The hierarchy is defined by the "recessed" or "raised" state of the container.

* **Beveled Elevation:**

* **Raised (Buttons/Active Windows):** Top/Left edge = `outline-variant` (Light); Bottom/Right edge = `secondary` (Dark).

* **Recessed (Inputs/Taskbar Buttons):** Top/Left edge = `secondary` (Dark); Bottom/Right edge = `outline-variant` (Light).

* **Glassmorphism & Depth:** For tooltips or floating context menus, use semi-transparent `surface` colors (80% opacity) with a 10px backdrop-blur. This softens the "rigid" retro aesthetic and creates a "frosted glass" look that feels premium.

* **Ambient Shadows:** Avoid dark drop shadows. If a window must "float," use a wide-spread, 4% opacity shadow tinted with the `tertiary` (Teal) color to simulate light reflecting off the desktop background.



---



## 5. Components



### The Window Container

The core of the system. Every window must feature a `primary` (Navy Blue) title bar with a `on-primary` (White) title. The border is a 2px silver bevel.

* *Forbid:* Divider lines inside windows. Use white space or a shift to `surface-container-low` to separate the sidebar from the content area.



### Buttons (Taskbar & UI)

* **Primary:** A "Raised" bevel style. On click, the bevel inverts to "Recessed" and the text shifts 1px down and to the right.

* **Taskbar Tabs:** Use the "Recessed" state for the active tab and "Raised" for inactive tabs, mimicking the classic Windows taskbar interaction.



### Input Fields

Inputs must be "Recessed" into the window surface. Use `surface-container-lowest` (#FFFFFF) for the background to contrast against the silver `surface-dim` of the window pane. Use `error` (#BA1A1A) for a 1px inner-shadow during error states.



### Low-Res Iconography

Icons must be pixel-aligned and use a restricted palette. Do not use modern thin-line icons. Icons should feel "chunky" and illustrative, utilizing the primary and secondary colors to maintain brand cohesion.



---



## 6. Do's and Don'ts



### Do:

* **Do** use "Taskbar" navigation anchored to the bottom of the viewport.

* **Do** use "Start" button patterns for primary site navigation.

* **Do** leverage high-contrast typography scales (e.g., a massive `display-lg` headline next to a tiny `label-sm` technical spec).

* **Do** allow windows to overlap and cascade to create a sense of a "living" workspace.



### Don't:

* **Don't** use border-radius. Every corner in the system must be a hard 0px edge.

* **Don't** use standard "Material" floating action buttons. All actions must be contained within a window or the taskbar.

* **Don't** use smooth, eased transitions for window appearances. Use "Instant" or "Step" animations to mimic the performance of legacy hardware.

* **Don't** use 100% black for shadows; always tint with the background color (Teal) for a more sophisticated,