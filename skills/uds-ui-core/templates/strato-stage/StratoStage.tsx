/**
 * The STRATO corporate stage — a fixed, Figma-measured template: two boxes, two powders and the
 * character, entering with the option-B motion, plus an optional interface over the character.
 *
 * GEOMETRY IS CLOSED. Poses, the fit into the canvas, the paint order and the motion are all
 * internal (geometry.ts, motion.ts, layers.ts) and none of them is a prop. CONTENT IS OPEN: the
 * three image paths, the measured character, and the interface — a React node. PLACEMENT IS
 * EXTERNAL: the caller supplies the canvas and `safeArea`; this decides where things land in it.
 *
 * Only DOM and `<Img>` are rendered (no canvas, WebGL or video), so a later SVG capture of the
 * DOM sees every layer. The root is transparent; the layers are clipped to the content box.
 *
 * Import specifiers carry NO file extension (see geometry.ts).
 */
import type { CSSProperties, FC, ReactNode } from 'react';
import { AbsoluteFill, Freeze, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { fitStage } from './geometry';
import { buildStageLayers, type StageInput, type StageLayer } from './layers';
import { INTERFACE_ANIM_START_MS, msToFrame } from './motion';

export type StratoStageProps = StageInput & {
  /** The interface content, rendered at its leg's own size (`iface.legW` x `iface.legH` CSS px). */
  interfaceNode?: ReactNode;
  /**
   * The interface's own animation length, in frames. When set, `useVideoConfig().durationInFrames`
   * inside `interfaceNode` is this (what its own composition saw), and its last frame is held
   * once it ends. Leave unset for a still interface.
   */
  interfaceDurationInFrames?: number;
};

const placed = (l: StageLayer): CSSProperties => ({
  position: 'absolute',
  left: l.rect.x,
  top: l.rect.y,
  width: l.rect.w,
  height: l.rect.h,
  transform: l.transform,
  transformOrigin: '50% 50%',
  opacity: l.opacity,
});

/**
 * The interface's own timeline: frame 0 (held) until its animation starts, then running from 0.
 * `<Sequence width height>` makes `useVideoConfig()` inside report the LEG's size, not the
 * canvas's (remotion 4.0.467: Sequence.js stores `width`/`height` in SequenceContext and
 * use-unsafe-video-config.js returns them), so the node lays itself out exactly as in its leg.
 */
const mountInterface = (
  node: ReactNode,
  leg: { legW: number; legH: number },
  frame: number,
  durationInFrames: number | undefined,
): ReactNode => {
  const start = msToFrame(INTERFACE_ANIM_START_MS);
  if (frame < start) {
    return (
      <Sequence width={leg.legW} height={leg.legH} layout="none">
        <Freeze frame={0}>{node}</Freeze>
      </Sequence>
    );
  }
  const running = (
    <Sequence from={start} durationInFrames={durationInFrames} width={leg.legW} height={leg.legH} layout="none">
      {node}
    </Sequence>
  );
  // A bounded Sequence unmounts its children after its last frame; hold that frame instead.
  const last = durationInFrames === undefined ? undefined : start + durationInFrames - 1;
  return last !== undefined && frame > last ? <Freeze frame={last}>{running}</Freeze> : running;
};

export const StratoStage: FC<StratoStageProps> = ({ interfaceNode, interfaceDurationInFrames, ...input }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { content } = fitStage(input.canvas, input.safeArea);
  const layers = buildStageLayers(input, (frame * 1000) / fps);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <div style={{ position: 'absolute', left: content.x, top: content.y, width: content.w, height: content.h, overflow: 'hidden' }}>
        {layers.map((l) => {
          if (l.id !== 'interface') {
            return <Img key={l.id} src={staticFile(l.src!)} style={placed(l)} />;
          }
          // An interface layer without content has nothing to paint (the caller dropped it).
          if (!input.iface || interfaceNode === undefined) return null;
          const { legW, legH } = input.iface;
          return (
            <div key={l.id} style={placed(l)}>
              {/* The leg is `legW` x `legH` CSS px; the rect is that at half scale, so scale it down. */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: legW, height: legH, transform: `scale(${l.rect.w / legW})`, transformOrigin: '0 0' }}>
                {mountInterface(interfaceNode, input.iface, frame, interfaceDurationInFrames)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
