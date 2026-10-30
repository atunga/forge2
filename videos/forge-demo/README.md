# Forge product demo

Approved production edit: 1920×1080, 30 fps, 67.5 seconds.

- `forge-demo.mp4`: H.264/AAC video with embedded visual captions.
- `forge-demo.srt`: standalone timed captions.
- `narration.mp3`: ElevenLabs Burt Reynolds™ narration (voice 4YYIPFl9wE5c4L2eu2Gb).
- `render.py`: editable local compositing source; requires Python, Pillow, and FFmpeg.
- `captures/`: genuine Forge browser screenshots used in the edit.
- `timings.json`: speech alignment used for captions and callout timing.

Real screens were captured from the local demo workspace. UI capture frames are cropped and animated with camera moves, focus outlines, click indicators, chapter labels, and captions. The video demonstrates customer search filtering, station inventory, order-summary preparation, demo calculations, and per-model fleet counts. It does not submit a supplier order.

The AI model graphic is editorial, explicitly labeled “Planned for live installations.” It depicts Forge proprietary calculations combined with the end user’s preferred ChatGPT, Claude, Grok, or local models. No live AI integration is implied in the demo.

ElevenLabs generated the approved narration and word timings. Higgsfield was reviewed during planning; no Higgsfield asset was needed. Local compositing preserves the actual UI.

Brand colors and the Forge mark match the app. DM Sans and Sansita are from the official Google Fonts repository, with their OFL licenses included in `assets/`.

Run `python3 render.py` from this directory to rebuild (FFmpeg path is configured at the top of the render command). Run `python3 render.py --preview` to produce review stills. The app source is unchanged by this production package.
