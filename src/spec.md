# Specification

## Summary
**Goal:** Add a “Number & Conversion Tools” entry point on the hub and a dedicated single-page tools hub containing calculators and converters.

**Planned changes:**
- Add a new Hub card labeled “Number & Conversion Tools” on the main hub page that navigates to a dedicated tools page.
- Extend app navigation/state to include a new “Number & Conversion Tools” page rendered within the existing AppLayout with back navigation returning to the hub.
- Create a new “Number & Conversion Tools” page using a responsive tabbed interface that contains all requested tools on one page and provides consistent Clear/Copy actions (using the existing clipboard helper) where applicable.
- Implement the following tools within that page:
  - Percentage calculator (X% of Y, what percent is X of Y, percentage change from A to B)
  - Tip / gratuity calculator (bill, tip %, optional split)
  - Split bill calculator (total, people, optional tax/fee %)
  - Age calculator (DOB, optional “as of” date)
  - Date difference calculator (two dates, difference in days)
  - Time duration calculator (duration between times and/or summing durations)
  - Unit converters (reuse existing unit conversion logic and provide an embedded converter UI)
  - Binary / decimal / hex converter (bases 2/10/16 with validation)
  - Currency converter (no external APIs; user-provided rate(s) or editable rates table vs base currency)
  - Random number picker (inclusive range, quantity, optional uniqueness)
- Add shared reusable frontend utility functions under `frontend/src/lib` to support calculations/conversions with consistent validation/formatting.

**User-visible outcome:** Users see a new “Number & Conversion Tools” card on the hub; opening it shows a single page with tabs for 10 calculators/converters, each providing clear results plus Clear and Copy actions (where applicable) with English labels and validation messages.
