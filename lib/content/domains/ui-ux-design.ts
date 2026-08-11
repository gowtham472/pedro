import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";

export const uiUxDesignDomain: DomainDefinition = {
  id: "ui-ux-design",
  name: "UI/UX Design",
  tagline: "Creativity, visual hierarchy, iteration",
  description:
    "Arrange a screen so it's clear at a glance. Today looks at layout, hierarchy, and how much you iterate before calling something done.",
  day: 3,
  accentToken: "cream",
  primarySkills: ["Layout & spacing", "Visual hierarchy", "Iteration"],
  active: true,
  order: 3,
};

export const uiUxDesignLesson: LessonDefinition = {
  id: "lesson-ui-ux-design-day3",
  domainId: "ui-ux-design",
  day: 3,
  title: "UI/UX design",
  summary:
    "Layout, spacing, typography, color, hierarchy, and components - the vocabulary of arranging a screen so it reads clearly.",
  estimatedMinutes: 30,
  order: 1,
  sections: [
    {
      heading: "Layout & spacing",
      visualId: "spacing",
      body: "Consistent spacing is what makes a screen feel designed rather than assembled. Related elements sit close together; unrelated elements get more space between them. That's it - that single rule does most of the work.",
    },
    {
      heading: "Typography",
      visualId: "typography",
      body: "A screen usually needs 2-3 text sizes: a heading, body text, and a caption. Bigger and bolder means more important. Resist the urge to make everything the same size - that removes hierarchy entirely.",
    },
    {
      heading: "Color",
      visualId: "color",
      body: "Use one dominant color for structure (backgrounds, text) and reserve a single accent color for the action you want people to take. Color that's used everywhere signals nothing.",
    },
    {
      heading: "Hierarchy",
      visualId: "hierarchy",
      body: "Hierarchy is the order in which someone's eye should move across a screen. Size, weight, color, and position all create hierarchy. A screen with no hierarchy makes everything compete for attention at once.",
    },
    {
      heading: "Components",
      visualId: "components",
      body: "Buttons, inputs, and cards are the reusable pieces a screen is built from. Reusing the same component consistently (same button, same input style) is what makes an interface feel coherent rather than improvised.",
    },
  ],
};

export const uiUxDesignTasks: TaskDefinition[] = [
  {
    id: "design-00-profile-card",
    domainId: "ui-ux-design",
    lessonId: "lesson-ui-ux-design-day3",
    day: 3,
    title: "Compose a profile card",
    description: "Arrange a small student profile card - your first feel for the canvas.",
    instructions:
      "Use the canvas to compose a small profile card for a student: a photo placeholder, the student's name as a heading, and a short line of detail text underneath.\n\nThis is about getting a feel for placing and aligning elements. Keep the three pieces visually grouped - close together, edges lined up.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: ["Canvas basics", "Grouping related elements", "Alignment"],
    prerequisiteConcepts: ["layout"],
    passingScore: 60,
    order: 1,
    basePoints: 50,
    hints: [
      { order: 1, text: "Drag an image placeholder on first, then add the heading beside or below it." },
      { order: 2, text: "The canvas shows guide lines when edges line up - use them." },
    ],
    config: {
      type: "design",
      canvasSize: { width: 375, height: 400 },
      referenceDescription: "A compact student profile card: photo placeholder, name heading, one line of detail text.",
      minElements: 3,
      checklist: [
        { id: "has-illustration", label: "Includes a photo/image placeholder" },
        { id: "has-heading", label: "Includes a name heading" },
        { id: "has-subtext", label: "Includes a line of detail text" },
        { id: "aligned-layout", label: "Elements are aligned with each other" },
      ],
    },
  },
  {
    id: "design-01-login-screen",
    domainId: "ui-ux-design",
    lessonId: "lesson-ui-ux-design-day3",
    day: 3,
    title: "Design a login screen",
    description: "Design a login screen for a college application using the workspace canvas.",
    instructions:
      "Use the canvas to design a login screen for a college application. Drag elements onto the canvas, position and size them, and set their text or color.\n\nA strong login screen usually has: a heading, an email field, a password field, and a submit button - arranged with clear spacing and alignment. There's no single correct layout; aim for something you'd be comfortable handing to another student to use.",
    difficulty: "beginner",
    estimatedMinutes: 25,
    learningObjectives: ["Layout composition", "Form design", "Visual hierarchy"],
    prerequisiteConcepts: ["layout", "typography", "components"],
    passingScore: 60,
    order: 2,
    basePoints: 75,
    hints: [
      { order: 1, text: "Start with the heading at the top, then stack the fields below it in the order someone would fill them in." },
      { order: 2, text: "Keep left edges aligned - the canvas shows guide lines when elements line up with each other." },
      { order: 3, text: "Leave visible space around the submit button so it doesn't feel crowded against the fields." },
    ],
    config: {
      type: "design",
      canvasSize: { width: 375, height: 700 },
      referenceDescription:
        "A login screen for a college application: heading, email field, password field, submit button.",
      minElements: 5,
      checklist: [
        { id: "has-heading", label: "Includes a heading or title" },
        { id: "has-email-field", label: "Includes an email or username field" },
        { id: "has-password-field", label: "Includes a password field" },
        { id: "has-submit-button", label: "Includes a clearly labelled submit/login button" },
        { id: "uses-five-elements", label: "Uses at least 5 elements total" },
        { id: "aligned-layout", label: "Elements are aligned to a consistent grid" },
      ],
    },
  },
  {
    id: "design-02-dashboard",
    domainId: "ui-ux-design",
    lessonId: "lesson-ui-ux-design-day3",
    day: 3,
    title: "Design a simple dashboard",
    description: "Design the screen a student sees right after logging in.",
    instructions:
      "Design a simple dashboard screen for the same college application - the screen a student would see right after logging in.\n\nInclude a short navigation or header area, and at least two content cards showing information (for example: upcoming classes, a schedule, or a to-do list). You've placed all of these pieces before - now it's about arranging more of them so the screen still reads clearly.",
    difficulty: "challenge",
    estimatedMinutes: 30,
    learningObjectives: ["Information architecture", "Card-based layout", "Density vs. clarity"],
    prerequisiteConcepts: ["layout", "hierarchy", "components"],
    passingScore: 60,
    order: 3,
    basePoints: 100,
    hints: [
      { order: 1, text: "Group related information inside its own card rather than scattering it across the screen." },
      { order: 2, text: "A short header with a title is usually enough - the dashboard content is the main event." },
    ],
    config: {
      type: "design",
      canvasSize: { width: 600, height: 700 },
      referenceDescription:
        "A post-login dashboard: header/navigation area plus at least two content cards.",
      minElements: 6,
      checklist: [
        { id: "has-header", label: "Includes a header or navigation area" },
        { id: "has-two-cards", label: "Includes at least two distinct content cards" },
        { id: "has-heading", label: "Includes a page title or welcome heading" },
        { id: "consistent-spacing", label: "Uses consistent spacing between cards" },
      ],
    },
  },
];
