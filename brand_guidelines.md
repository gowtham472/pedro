# PEDRO - Brand & Design Guidelines

**Document:** `brand_guidelines.md`  
**Product:** Pedro  
**Purpose:** Visual identity, UI design system, interaction language, iconography, SVG rules, and brand usage guidelines.

---

## 1. Brand Direction

Pedro is a focused career-exploration platform. Its visual identity should communicate:

- clarity
- confidence
- curiosity
- progress
- intelligence without feeling corporate
- premium software quality
- calm experimentation

The visual language is inspired by the supplied reference image:

- deep charcoal application surfaces
- pale botanical green as the signature environment colour
- warm cream/yellow for emphasis
- soft cyan as a functional accent
- large rounded containers
- dense but organised dashboards
- strong geometric hierarchy
- restrained typography
- minimal visual noise

Pedro should feel like a modern product studio created for serious students, not a traditional education portal.

---

# 2. Core Visual Principle

## Dark Core + Soft Signal

The primary interface is built around a dark charcoal foundation.

Accent colours are used as signals rather than decoration.

The hierarchy should generally follow:

```text
Dark charcoal
    ↓
White / near-white text
    ↓
Pale green primary signal
    ↓
Cream secondary signal
    ↓
Cyan functional signal
    ↓
Yellow highlight
```

Do not use every accent colour simultaneously unless the information architecture requires it.

---

# 3. Brand Palette

## Primary Background

### Pedro Charcoal

```text
HEX: #1F1F1F
RGB: 31, 31, 31
```

Primary application background.

Use for:

- dashboard shell
- navigation
- major panels
- application chrome

---

## Elevated Surface

### Pedro Graphite

```text
HEX: #2B2B2B
RGB: 43, 43, 43
```

Use for:

- cards
- elevated panels
- secondary navigation
- input surfaces
- modal surfaces

---

## Deep Surface

```text
HEX: #242424
RGB: 36, 36, 36
```

Use for:

- nested cards
- secondary panels
- subtle separation

---

## Primary Brand Green

### Pedro Mint

```text
HEX: #DAE9D0
RGB: 218, 233, 208
```

This is the primary brand colour.

Use for:

- primary backgrounds
- active navigation states
- progress
- recommendation highlights
- positive states
- primary CTA surfaces where appropriate
- large visual modules

The colour should feel calm rather than neon.

---

## Warm Highlight

### Pedro Cream

```text
HEX: #FFF3B5
RGB: 255, 243, 181
```

Use for:

- secondary highlights
- discovery states
- important callouts
- selected exploration cards
- creative/design modules

---

## Functional Accent

### Pedro Cyan

```text
HEX: #BFEFFF
```

Use for:

- data visualisations
- active metrics
- interactive states
- analytical indicators
- selected charts

Keep cyan functional. Do not use it as the main brand colour.

---

## White

```text
HEX: #FFFFFF
```

Use for:

- primary text on dark surfaces
- icons on dark backgrounds
- high-emphasis content

---

## Soft White

```text
HEX: #F7F8F4
```

Use for:

- secondary text
- light surfaces
- readable content areas

---

## Muted Text

```text
HEX: #A9AAA5
```

Use for:

- descriptions
- timestamps
- secondary metadata
- inactive navigation

---

# 4. Colour Usage Rules

### Recommended ratio

```text
60%  Charcoal / Graphite
25%  Mint / light surfaces
8%   White / typography
4%   Cream / yellow
3%   Cyan / functional accents
```

These are visual guidelines, not strict mathematical requirements.

### Never

- use gradients as the primary brand identity
- use saturated rainbow palettes
- use neon green
- use excessive cyan
- use accent colours for decoration without meaning
- place low-contrast text on pale green

---

# 5. Typography

Pedro should use a modern geometric sans-serif.

Recommended primary font:

**Inter**

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", sans-serif
```

If a custom font is introduced later, it should preserve the same visual characteristics:

- geometric
- clean
- high x-height
- excellent numerals
- strong at large headings
- readable at compact dashboard sizes

---

# 6. Type Scale

## Display

```text
64px
Weight: 600
Line height: 1.0
Letter spacing: -0.04em
```

Use rarely.

---

## H1

```text
40px
Weight: 600
Line height: 1.05
Letter spacing: -0.035em
```

---

## H2

```text
32px
Weight: 600
Line height: 1.1
Letter spacing: -0.025em
```

---

## H3

```text
24px
Weight: 600
Line height: 1.2
```

---

## H4

```text
18px
Weight: 600
Line height: 1.25
```

---

## Body

```text
15–16px
Weight: 400
Line height: 1.5
```

---

## Caption

```text
12–13px
Weight: 400–500
Line height: 1.35
```

---

# 7. Typography Behaviour

Pedro uses typography to create hierarchy instead of heavy borders.

Prefer:

```text
large number
small label
secondary explanation
```

Example:

```text
87
Cloud & DevOps

Strong exploration signal
```

Avoid:

```text
CARD TITLE
----------------
87%
----------------
SCORE
```

The interface should feel editorial and spatial.

---

# 8. Layout Philosophy

The supplied reference uses a large dashboard surface surrounded by breathing room.

Pedro should follow the same principle.

### Desktop

Recommended:

```text
Page padding: 32–56px
Card gap: 16–24px
Section gap: 32–56px
```

### Maximum content width

```text
1440–1600px
```

Do not allow dashboards to stretch endlessly across very large screens.

---

# 9. Corner Radius

Rounded geometry is a defining Pedro characteristic.

## Large containers

```text
32px
```

## Standard cards

```text
24px
```

## Small cards

```text
18px
```

## Buttons

```text
999px
```

Pill controls should be used for:

- filters
- tabs
- status labels
- compact navigation
- segmented controls

Avoid using pill shapes for every component.

---

# 10. Borders

Borders should be subtle.

Dark surface:

```text
rgba(255,255,255,0.08)
```

Light surface:

```text
rgba(31,31,31,0.08)
```

Do not use thick borders to separate every card.

Use:

- spacing
- surface contrast
- typography
- subtle borders

as the primary hierarchy tools.

---

# 11. Shadows

Pedro uses soft depth rather than dramatic shadows.

Recommended:

```css
box-shadow:
  0 20px 60px rgba(0, 0, 0, 0.16);
```

For smaller surfaces:

```css
box-shadow:
  0 8px 24px rgba(0, 0, 0, 0.10);
```

Avoid:

- harsh black shadows
- glowing shadows
- excessive elevation
- neumorphism

---

# 12. Navigation

The main navigation should resemble the supplied reference:

- dark rounded container
- horizontal navigation
- generous spacing
- active item clearly visible
- minimal icon usage
- profile/control area on the right

Recommended structure:

```text
Pedro mark
    |
Dashboard
Explore
Journey
Results
    |
Settings
Profile
```

The active route should use:

- stronger text
- a subtle mint indicator
- optional rounded active background

Do not use large coloured blocks for every navigation item.

---

# 13. Dashboard Composition

Pedro's dashboard should use a modular editorial grid.

Example:

```text
┌─────────────────────────────────────────────────────────────┐
│ Navigation                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Welcome / Journey status                                    │
│                                                             │
├─────────────────────┬────────────────────┬──────────────────┤
│ Progress            │ Current task       │ Domain signal   │
│                     │                    │                  │
├─────────────────────┴────────────────────┼──────────────────┤
│ Exploration analytics                    │ Recent activity │
│                                          │                 │
├──────────────────────────────────────────┴─────────────────┤
│ Recommended next step                                      │
└─────────────────────────────────────────────────────────────┘
```

Cards should not all have the same size.

Use visual rhythm.

---

# 14. Hero Modules

Large feature cards may use:

- pale green background
- oversized number
- simple SVG illustration
- small supporting metadata
- rounded 32px corners

Example:

```text
DAY 04

DATA & ANALYTICS

Explore patterns.
Find the signal.

[ Continue ]
```

Avoid decorative stock illustrations.

Use custom SVG geometry.

---

# 15. Cards

Cards should have a clear internal hierarchy.

Recommended structure:

```text
eyebrow
title
description
metric / visual
action
```

Example:

```text
EXPLORATION SIGNAL

Cloud & DevOps

86
Strong

High persistence
Fast learning
```

Cards should communicate one idea.

Avoid cards containing five unrelated widgets.

---

# 16. Buttons

## Primary

Use dark text on mint.

```text
Background: #DAE9D0
Text: #1F1F1F
Radius: 999px
Height: 44–52px
```

## Secondary

Dark background with subtle border.

```text
Background: transparent
Border: rgba(255,255,255,0.15)
Text: #FFFFFF
```

## Tertiary

Text-only.

Use sparingly.

---

# 17. Iconography

Pedro must use **icons instead of emojis**.

Never use emoji characters in:

- navigation
- cards
- buttons
- notifications
- task labels
- reports
- empty states

Icons should come from a single coherent icon system.

Recommended approach:

1. Use Lucide-style geometric icons for generic interface actions.
2. Create custom SVG icons for Pedro-specific domains and brand concepts.
3. Keep stroke width and visual weight consistent.

---

# 18. Icon Rules

Default:

```text
Stroke: 1.8–2px
Line cap: round
Line join: round
Size: 18–24px
```

For large feature icons:

```text
32–48px
```

Icons should not visually dominate their labels.

Avoid mixing:

- filled cartoon icons
- 3D icons
- glossy icons
- random icon libraries

---

# 19. Custom SVG Icon Language

Pedro-specific icons should use a geometric construction.

Characteristics:

- rounded corners
- simple primitives
- minimal paths
- balanced negative space
- one visual idea per icon
- no gradients
- no text inside icons

Domain icon set:

```text
Software Development
Problem Solving
UI/UX
Data
Cloud / DevOps
Cybersecurity
Independent Build
```

Each icon should be recognizable at:

```text
24px
32px
48px
```

---

# 20. Pedro Brand Mark

The Pedro mark should be custom SVG.

Recommended concept:

A compact geometric symbol built from four rounded modular shapes that form a subtle path/portal.

Construction idea:

```text
┌────┐  ┌────┐
│    │  │    │
└────┘  └────┘

┌────┐  ┌────┐
│    │  │    │
└────┘  └────┘
```

The four modules should have controlled spacing and slightly rounded corners.

The mark should communicate:

```text
exploration
direction
modularity
progress
```

Do not copy an existing brand mark.

---

# 21. SVG Rules

All custom illustrations should be SVG.

Use:

```xml
<svg
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
</svg>
```

Guidelines:

- use `currentColor` for monochrome icons
- avoid raster images for interface icons
- keep paths minimal
- use consistent stroke width
- optimize SVG output
- do not embed base64 images
- do not use unnecessary filters
- avoid excessive path complexity

---

# 22. Custom Illustration Style

Pedro illustrations should look like interface-native diagrams.

Preferred:

- geometric
- abstract
- flat
- minimal
- slightly playful
- architectural
- modular

Avoid:

- stock illustrations
- cartoon characters
- generic AI-generated characters
- photorealism
- excessive gradients
- decorative 3D objects

---

# 23. Data Visualization

Charts should use the Pedro palette.

Primary:

```text
Mint
```

Secondary:

```text
Cyan
```

Highlight:

```text
Cream
```

Neutral:

```text
Graphite
```

Do not use red/green purely to communicate positive/negative values without accessible labels.

Charts should be:

- minimal
- readable
- lightly annotated
- rounded where appropriate
- free from unnecessary gridlines

---

# 24. Progress Visualization

The seven-day journey should have a strong visual progress system.

Example:

```text
01  02  03  04  05  06  07
●   ●   ●   ○   ○   ○   ○
```

Use mint for completed stages.

Use muted graphite for incomplete stages.

The active day may use a larger indicator.

---

# 25. Domain Visual Identity

Each domain may have a supporting accent while retaining the Pedro core palette.

| Domain | Primary Accent |
|---|---|
| Software | Mint |
| Problem Solving | Cream |
| UI/UX | Soft Lavender or Mint |
| Data | Cyan |
| Cloud / DevOps | Mint |
| Cybersecurity | Warm Yellow |
| Independent Build | White / Mint |

These accents should remain muted.

They should never overpower the core Pedro palette.

---

# 26. Task Interface

A task page should feel focused.

Recommended:

```text
┌─────────────────────────────────────────────────────┐
│ Day 03 · UI/UX                                      │
│                                                     │
│ Design a login experience                           │
│                                                     │
│ Short explanation                                   │
│                                                     │
│ ┌───────────────────────────────────────────────┐   │
│ │                                               │   │
│ │                 WORKSPACE                     │   │
│ │                                               │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ Hint                         Submit                 │
└─────────────────────────────────────────────────────┘
```

The task should dominate the screen.

---

# 27. Reflection UI

Reflection should be lightweight.

Use large selectable cards rather than traditional survey forms.

Example:

```text
How enjoyable was this?

1        2        3        4        5
○        ○        ○        ○        ○
```

Use the same visual system throughout the reflection experience.

Avoid excessive questionnaires.

---

# 28. Results Page

The final results should feel premium and conclusive.

Recommended hierarchy:

```text
YOUR EXPLORATION REPORT

You explored 7 days
across 6 technology domains.

Your strongest signals

01 Cloud / DevOps
02 Data & Analytics
03 UI/UX

Why these ranked highly

[ Evidence cards ]

Your working style

[ Visual profile ]

Your next 30 days

[ Recommended path ]
```

The results should be visual but evidence-driven.

---

# 29. Recommendation Cards

A recommendation card should include:

```text
DOMAIN

Cloud & DevOps

86 / 100

HIGH CONFIDENCE

Why:
Fast learning
Strong persistence
High curiosity

NEXT STEP

Explore Linux + Docker
```

Do not use stars, trophies, medals, or emoji-based ratings.

---

# 30. Empty States

Empty states should be minimal and useful.

Use a custom SVG illustration or geometric icon.

Example:

```text
[ custom SVG ]

No exploration data yet

Complete your first task to start
building your profile.

[ Start Day 1 ]
```

---

# 31. Loading States

Use subtle skeletons and motion.

Avoid spinning loaders everywhere.

Preferred:

- skeleton blocks
- progressive content
- subtle opacity transitions

---

# 32. Motion

Motion should communicate state.

Recommended:

```text
150–200ms: micro interactions
200–300ms: cards / buttons
300–500ms: page transitions
```

Use easing similar to:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Avoid:

- bouncing UI
- excessive parallax
- constant animations
- attention-grabbing motion

---

# 33. Interaction Philosophy

Every interaction should answer one of three questions:

1. What happened?
2. What should I do next?
3. How am I progressing?

The interface should never make the user guess whether an action worked.

---

# 34. Forms

Forms should be compact and calm.

Inputs:

```text
Height: 48–52px
Radius: 14–16px
```

Use labels above fields.

Do not rely on placeholder text as the only label.

Focus state:

- subtle mint outline
- slight surface elevation
- clear keyboard focus

---

# 35. Accessibility

The design must support:

- keyboard navigation
- visible focus states
- semantic HTML
- accessible labels
- readable contrast
- reduced motion
- screen readers
- non-colour-only status indicators

Icons must have accessible names when they communicate meaning.

Decorative SVGs should be hidden from assistive technology.

---

# 36. Responsive Design

Desktop is the primary experience.

Tablet should preserve the dashboard composition with fewer columns.

Mobile should collapse into:

```text
Header
Progress
Primary task
Supporting information
Actions
```

Do not attempt to preserve a dense desktop grid on mobile.

---

# 37. Brand Voice

Pedro's interface copy should be:

- concise
- direct
- encouraging
- intelligent
- calm
- practical

Use:

```text
Explore this domain
Try the challenge
See what you learned
Continue
Your strongest signal
```

Avoid:

```text
OMG!
Amazing!
You are a genius!
Let's crush it!
```

Do not use emojis in product copy.

---

# 38. Product Copy Rules

Prefer short sentences.

Bad:

> "Congratulations on successfully completing this extremely exciting and challenging learning experience."

Good:

> "Day 3 complete."

Bad:

> "You absolutely crushed this challenge!"

Good:

> "Strong result. Your second attempt improved significantly."

The product should feel confident without being loud.

---

# 39. Brand Do / Don't

## Do

- use charcoal as the visual anchor
- use mint as the signature brand colour
- use large rounded cards
- create visual breathing room
- use custom SVGs
- use restrained accent colours
- use strong typography
- use evidence-based visualizations
- use icons consistently

## Don't

- use emojis
- use random icon styles
- use stock illustrations
- use excessive gradients
- use neon colours
- use heavy borders
- use generic dashboard templates
- use decorative elements without purpose
- use excessive shadows
- use childish gamification

---

# 40. Design Tokens

Suggested CSS variables:

```css
:root {
  --pd-charcoal: #1F1F1F;
  --pd-graphite: #2B2B2B;
  --pd-deep: #242424;

  --pd-mint: #DAE9D0;
  --pd-cream: #FFF3B5;
  --pd-cyan: #BFEFFF;

  --pd-white: #FFFFFF;
  --pd-soft-white: #F7F8F4;
  --pd-muted: #A9AAA5;

  --pd-radius-sm: 14px;
  --pd-radius-md: 18px;
  --pd-radius-lg: 24px;
  --pd-radius-xl: 32px;
  --pd-radius-pill: 999px;
}
```

---

# 41. Component Naming

Use consistent component names.

Examples:

```text
PedroShell
PedroNav
PedroLogo
PedroCard
PedroButton
PedroPill
PedroIcon
PedroMetric
PedroProgress
PedroChart
PedroTask
PedroReflection
PedroDomainCard
PedroReport
PedroEvidence
PedroEmptyState
```

Domain-specific components should be named by purpose rather than visual appearance.

---

# 42. Illustration & SVG Repository

Keep custom SVG assets organized:

```text
/assets
  /brand
    pedro-mark.svg
    pedro-wordmark.svg

  /icons
    software.svg
    problem-solving.svg
    design.svg
    data.svg
    devops.svg
    security.svg
    build.svg

  /illustrations
    exploration.svg
    progress.svg
    report.svg
    empty-state.svg
```

All SVGs should follow the same construction language.

---

# 43. Logo Usage

The Pedro logo should exist in:

1. dark-background version
2. light-background version
3. mark-only version
4. wordmark version

Maintain clear space around the mark equal to approximately the width of one internal module.

Do not:

- stretch the logo
- rotate the logo
- add shadows
- add gradients
- change its geometry
- place it on visually noisy backgrounds

---

# 44. Reference Image Interpretation

The supplied reference image establishes the following visual direction for Pedro:

- dark dashboard shell
- oversized rounded application frame
- pale green environment
- modular card layout
- strong numerical typography
- pill-shaped controls
- minimal white navigation
- cream secondary cards
- cyan data visualisation
- circular action buttons
- compact avatar clusters
- large breathing space around the main application
- visual density balanced with generous spacing

Pedro should inherit the **design language**, not copy the reference interface.

Do not reproduce its exact layout, logo, text, branding, or proprietary visual elements.

---

# 45. Final Design Standard

Every new Pedro screen should pass this test:

### Brand

Does it look unmistakably like Pedro?

### Hierarchy

Can the user understand the most important information within a few seconds?

### Restraint

Is every colour, icon, illustration and animation serving a purpose?

### Consistency

Does it use the same typography, spacing, radii, surfaces and icon language?

### Accessibility

Can the interface be used without relying on colour, mouse movement or visual-only cues?

### Personality

Does it feel calm, modern, intelligent and exploratory?

If the answer is yes to all six, the screen is aligned with the Pedro brand.

---

# 46. One-Line Brand Definition

> **Pedro is a calm, dark, modular exploration interface where soft colour, geometric form and evidence-driven interaction help students discover what technology work fits them.**
