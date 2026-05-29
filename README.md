# Ashes of the Cold War

A browser-based grand strategy prototype inspired by political crisis games and Cold War alternate history.

## Premise

World War III begins after a Soviet first strike against the United States. The U.S. survives but is badly wounded, NATO is shaken, and Moscow tries to turn the chaos into a decisive European realignment by drawing a weakened Germany into its orbit.

Germany is the first playable focus of the prototype. The player leads an emergency council trying to preserve stability, manage escalation, and choose between NATO loyalty, Soviet negotiations, or an independent European survival pact.

## Current MVP Features

- Self-contained browser app with no build step.
- Cleaner briefing-to-situation-room play flow.
- Custom SVG artwork for the command room, European theater map, and emergency council seal, with the artwork embedded into the playable HTML and kept in `assets/` as editable source files.
- German emergency-council status dashboard.
- Political power, stability, war support, and nuclear escalation meters.
- National focus choices with immediate mechanical and faction effects.
- Cabinet actions that spend political power.
- Internal faction pressure display.
- Clickable Europe theater intelligence controls.
- Monthly turn advancement, objectives, toast feedback, and event log.

## Run Locally

Open `index.html` directly in a browser. The playable prototype is bundled into that one file so it still looks correct if you download or share only the HTML file.

You can also serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Development Direction

Near-term additions could include:

1. Save/load support with `localStorage`.
2. A larger focus tree with mutually exclusive paths and unlock requirements.
3. Region-level resources, unrest, and fallout.
4. More scenario art for leaders, events, and ideology paths.
5. Additional playable countries after Germany feels fun.
