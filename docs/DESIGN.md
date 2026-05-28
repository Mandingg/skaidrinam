## Colors

The palette is anchored by a deep "Forest Green".

- **Primary (#457B3B):** Used for main buttons, active navigation states, and positive financial trends.
- **Secondary (#D1E2D3):** A muted tint of the primary green, used for background fills in chips, progress bars, and subtle highlights.
- **Error (#D64040):** A balanced red used for expenses, expired statuses, and destructive actions.
- **Neutral (#2D312E):** A very dark charcoal (rather than pure black) for all body text and headings.
- **Navigation (#F9F9F7):** A warm off-white for navigation bar.
- **Background (#FFFFFF):** White color for background for the main pages.

## Typography

The system utilizes **Hanken Grotesk**. 

- **Headlines:** Use Bold or SemiBold weights to create a strong vertical rhythm.
- **Body Text:** Use Regular weight for general content. In financial tables or receipt lists, use Medium weight for labels to distinguish them from data values.
- **Numerical Data:** Ensure numbers are clearly legible; for large currency displays (e.g., dashboard totals), use the `display` style to emphasize financial status.
- **Case:** Use sentence case for all labels and buttons to maintain an approachable tone.

## Layout & Spacing

The design uses a **Fixed Sidebar + Fluid Content** model for desktop and a standard bottom-navigation model for mobile.

- **Grid:** A 12-column grid is used for desktop content areas, with components typically spanning 3, 4, or 6 columns depending on the data density.
- **Spacing Rhythm:** Based on a 4px baseline. Standard padding for cards is 24px (`lg`), while tighter lists use 12px or 16px (`md`).
- **Breakpoints:**
  - **Mobile (<600px):** Single column, 16px side margins.
  - **Tablet (600px - 1024px):** 2-column card layouts, sidebar collapses into a hamburger menu or bottom bar.
  - **Desktop (>1024px):** Full sidebar (240px) with multi-column dashboard widgets.

## Elevation & Depth

This system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a flat, modern aesthetic.

- **Level 0 (Background):** The warm off-white surface (#F9F9F7).
- **Level 1 (Cards):** Pure white (#FFFFFF) surfaces with a subtle 1px border (#E5E7EB) to define boundaries. 
- **Level 2 (Modals/Overlays):** These use a soft, diffused shadow (0px 10px 25px rgba(0,0,0,0.05)) to indicate they are floating above the main interface.
- **Interactions:** Buttons and active cards do not lift; instead, they utilize subtle background color shifts (darkening by 10%: darker-green: #3d6e35 and darker-red: #bf3a3a;) to indicate hover or press states.

## Shapes

- **Standard Elements (8px):** Buttons, input fields, and small cards use the default 0.5rem radius.
- **Large Containers (16px):** Main dashboard widgets and modal windows use the larger 1rem radius to soften the overall layout.
- **Selection Indicators (999px;):** Navigation active states use a pill-shaped (fully rounded) background to clearly highlight the current section.

## Components

- **Buttons:** Primary buttons are solid green (#457B3B) with white text. Secondary buttons use a light green ghost style or a subtle grey outline.
- **Inputs:** Fields use a 1px light grey border that turns green on focus. Labels are placed above the field in `label-lg` typography.
- **Status Chips:** Small, rounded badges used to indicate "Galioja" (Valid) or "Pasibaigusi" (Expired). These should use a background tint of the status color (e.g., light red background for red text).
- **Cards:** White background, 8px radius, 1px border. Card headers should use `label-lg` for metadata and `headline-md` for primary values.
- **Navigation:** The sidebar uses icons paired with text. The active state is indicated by a primary green background with a pill-shaped radius.
- **Charts:** Use a coordinated palette of green, red, and amber to signify different spending categories, maintaining a cohesive look with the primary brand colors.