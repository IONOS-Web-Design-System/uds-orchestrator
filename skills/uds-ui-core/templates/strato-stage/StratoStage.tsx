/**
 * The STRATO corporate stage — a fixed, Figma-measured template: the character, entering with the
 * option-B slide-up, plus an optional floating interface over it.
 *
 * GEOMETRY IS CLOSED. The fit into the canvas, the paint order and the motion are all
 * internal (geometry.ts, motion.ts, layers.ts) and none of them is a prop. CONTENT IS OPEN: the
 * character path, the measured character, and the interface — a React node. PLACEMENT IS
 * EXTERNAL: the caller supplies the canvas and `safeArea`; this decides where things land in it.
 *
 * Only DOM and `<Img>` are rendered (no canvas, WebGL or video), so a later SVG capture of the
 * DOM sees every layer. The root is transparent; the layers are clipped to the content box.
 *
 * Import specifiers carry NO file extension (see geometry.ts).
 */
import type { FC, ReactNode } from 'react';
import { AbsoluteFill, Freeze, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { fitStage } from './geometry';
import { buildStageLayers, type StageInput } from './layers';
import { INTERFACE_ANIM_START_MS, interfacePhase, msToFrame, type InterfaceMotion } from './motion';
import { interfaceLegStyle, layerStyle } from './styles';

export type StratoStageProps = StageInput & {
  /** The interface content, rendered at its leg's own size (`iface.legW` x `iface.legH` CSS px). */
  interfaceNode?: ReactNode;
  /**
   * The interface's own length, in frames (what its own composition had; 90 for its 3 s). Inside
   * `interfaceNode`, `useVideoConfig().durationInFrames` is this in every phase. Must not exceed
   * the stage composition's length (remotion clamps the timeline to the composition).
   */
  interfaceDurationInFrames?: number;
  /**
   * How the interface leg was rendered. `'still'`: shown at its LAST frame (the one its own still
   * gate validated) for the whole stage. `'animated'` (default): frozen at its frame 0 while it
   * pops in, played from frame 27, then held on its last frame.
   */
  interfaceMotion?: InterfaceMotion;
};

/**
 * The interface on its own timeline, in ONE element tree for every phase, so it never remounts.
 *
 * The Sequence starts at 0 and the stage frame is mapped onto the interface's own frame by an
 * always-active `<Freeze>` (`interfacePhase`). Verified against remotion 4.0.467 (and 4.0.529):
 *  - `<Sequence width height>` stores them in its `SequenceContext` (Sequence.js) and
 *    `useVideoConfig()` inside returns them (use-unsafe-video-config.js), so the node sees the
 *    LEG's size, not the canvas's;
 *  - the Sequence's context duration is `max(0, min(videoConfig.durationInFrames - from,
 *    durationInFrames))` (Sequence.js). With `from={27}` a 90-frame interface in the 120-frame
 *    (4 s) composite would see 93; with `from` 0 it sees its own 90 whenever the composite is at
 *    least that long (120 / 150);
 *  - `<Freeze frame>` sets the timeline to `frame` (+ the enclosing sequence's offset) and zeroes
 *    `cumulatedFrom` (freeze.js), so `useCurrentFrame()` inside is exactly `frame`, and the
 *    Sequence's own bounds check (frame 0 .. duration - 1) always keeps the node mounted.
 */
const mountInterface = (
  node: ReactNode,
  leg: { legW: number; legH: number },
  frame: number,
  durationInFrames: number | undefined,
  motion: InterfaceMotion,
): ReactNode => {
  const own = interfacePhase(frame, msToFrame(INTERFACE_ANIM_START_MS), durationInFrames, motion);
  return (
    <Freeze frame={own.frame}>
      <Sequence durationInFrames={durationInFrames} width={leg.legW} height={leg.legH} layout="none">
        {node}
      </Sequence>
    </Freeze>
  );
};

export const StratoStage: FC<StratoStageProps> = ({
  interfaceNode,
  interfaceDurationInFrames,
  interfaceMotion = 'animated',
  ...input
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { content } = fitStage(input.canvas, input.safeArea);
  const layers = buildStageLayers(input, (frame * 1000) / fps);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <div style={{ position: 'absolute', left: content.x, top: content.y, width: content.w, height: content.h, overflow: 'hidden' }}>
        {layers.map((l) => {
          if (l.id !== 'interface') {
            return <Img key={l.id} src={staticFile(l.src!)} style={layerStyle(l)} />;
          }
          // An interface layer without content has nothing to paint (the caller dropped it).
          if (!input.iface || interfaceNode === undefined) return null;
          const { legW, legH } = input.iface;
          return (
            <div key={l.id} style={layerStyle(l)}>
              {/* The leg is `legW` x `legH` CSS px; the rect is that at half scale (interfaceLegStyle). */}
              <div style={interfaceLegStyle(l.rect, { legW, legH })}>
                {mountInterface(interfaceNode, { legW, legH }, frame, interfaceDurationInFrames, interfaceMotion)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
