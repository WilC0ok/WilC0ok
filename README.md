# Ashes of the Cold War

A browser-based grand strategy prototype inspired by political crisis games and Cold War alternate history.

## Premise

World War III begins after a Soviet first strike against the United States. The U.S. survives but is badly wounded, NATO is shaken, and Moscow tries to turn the chaos into a decisive European realignment by drawing a weakened Germany into its orbit.

Germany is the first playable focus of the prototype. The player leads an emergency council trying to preserve stability, manage escalation, and choose between NATO loyalty, Soviet negotiations, or an independent European survival pact.

## Current MVP Features

- Static browser app with no build step.
- German emergency-council status dashboard.
- Political power, stability, war support, and nuclear escalation meters.
- National focus choices with immediate mechanical effects.
- Cabinet actions that spend political power.
- Simplified clickable Europe strategy map.
- Monthly turn advancement and event log.

## Run Locally

Open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Development Direction

Near-term additions could include:

1. Save/load support with `localStorage`.
2. A larger focus tree with mutually exclusive paths.
3. Faction influence for NATO loyalists, neutralists, pro-Soviet negotiators, and reunification hardliners.
4. Region-level resources, unrest, and fallout.
5. Additional playable countries after Germany feels fun.
