# Forge demo video — approved production plan

Status: Production approved by the user. Production complete: 67.5-second 1080p MP4 with Burt Reynolds™ narration, zooms, callouts, embedded captions, and a standalone SRT. No app source changes were needed.

Format: 16:9, 1920×1080, approximately 68 seconds. Real Forge UI captures, restrained zooms, orange focus outlines, red stock-out callouts, and short synchronized captions. Use the existing brand colors, typography, and logo. Keep a small “Demo data” label visible. Voice: ElevenLabs Burt Reynolds™ (verified available, voice ID 4YYIPFl9wE5c4L2eu2Gb), confident, conversational, professional with dry humor. Quiet instrumental backing optional, ducked beneath narration.

| Time | Picture and interaction | Voiceover |
| --- | --- | --- |
| 0–4s | Forge mark resolves into the dashboard. | Meet Forge. Your vending and inventory systems, finally working together. |
| 4–16s | Highlight AutoCrib and CribMaster fleet panels. Move across Customers, Vending stations, Stock placements, Pending actions. Zoom into stock-out alert and station selector. | The dashboard brings AutoCrib and CribMaster into one view: customers, stations, stocked items, and pending actions. Red stock-out alerts point straight to the station needing attention. No treasure hunt required. |
| 16–27s | Open Customers. Type a customer name or code; results narrow. Clear search and briefly show grid/list switch. Zoom into a card’s station count, item count, brand, location, pending recommendations and stock-out badge. | Find customers by name or account code. Results narrow as you type. Each card shows stations, items, machine brand, location, pending recommendations, and stock-outs. |
| 27–33s | Open customer. Highlight each summary card in narration order. | Open an account for its station count, total items, low stock, and pending actions. |
| 33–45s | Open Vending Stations; scroll from one station to the next. Zoom into item and stock columns. Cut to Reorder; select an item, adjust quantity, open Create Order summary. | Scroll through stations to inspect quantities, min/max settings, pack sizes, warehouse availability, and incoming orders. Select replenishment items, adjust quantities, and create an order summary. |
| 45–59s | Click Run Analysis, then show Min/Max Recommendations. Compare current and recommended values. Overlay a simple diagram: Real usage data + Forge proprietary calculations + Your choice of AI → Recommended min/max. Highlight ChatGPT, Claude, Grok, and Local models as narration names them. Label this overlay “Planned for live installations”; model choices are an explanatory video graphic, not a working selector in the demo UI. | For live installations, Forge is designed to combine its proprietary inventory calculations with your choice of frontier AI—ChatGPT, Claude, Grok, or local models—to optimize min/max levels using real usage data. |
| 59–68s | Open Machine library. Switch AutoCrib / CribMaster. Zoom into “in your fleet” counts beneath machine icons. End on logo. | The Machine Library counts each machine type across your fleet. Forge. Keep inventory moving—and guesswork parked. |

## Approved accuracy decisions

- Customer search filters results by name/code today. The separate Filters button has no handler. This draft demonstrates search filtering; dedicated brand/status filtering would require an app change first.
- The user confirmed that live installations are intended to combine Forge’s proprietary calculations with frontier AI or local models, selected according to the end user’s preference. This integration is not connected in the demo. Narration describes the intended live-installation design; the explanatory overlay is labeled “Planned for live installations.” Do not present sample recommendations as outputs of an actual AI call.
- Demo analysis uses sample usage rates; database mode calculates averages from recorded transactions. Keep Demo data visible while filming sample data.
- The order flow prepares a summary and a print/save-PDF action. The video will show preparation and review, without implying a supplier purchase has completed.

## Production workflow

1. Capture genuine UI states in a fixed desktop viewport, including order review and generated recommendations. Use one customer consistently.
2. Generate the approved narration through the ElevenLabs connector using the verified Burt Reynolds voice. Adjust shot timings to the actual read; target 60–70 seconds.
3. Edit captures with cursor emphasis, restrained 1.2–1.6× zooms, focus outlines and captions. Keep text legible and narration synchronized with the highlighted element.
4. Use Higgsfield if a suitable creative asset is needed. The connected Higgsfield tools currently do not expose timeline editing; use local compositing for exact UI footage and assembly, subject to this plan’s approval.
5. Review navigation continuity, claims, readable text, audio balance and duration. Deliver a 1080p MP4 and caption file.
