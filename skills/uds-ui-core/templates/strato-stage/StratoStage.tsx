/**
 * The STRATO corporate stage — a fixed, Figma-measured template in three layers, bottom to top:
 * the BACKGROUND (the generated leg's abstract app frame), the CHARACTER (the cutout, entering with
 * the Figma pop-in of every character component) and the FOREGROUND (the leg's glass card). One leg
 * run draws both pair layers; it is mounted twice (`renderInterface`), each mount showing its own
 * layer. A legacy payload (`live-app` / `feature-highlight`, from an earlier moderator) is the
 * character plus one floating interface over it (`interfaceNode`), placed as before.
 *
 * GEOMETRY IS CLOSED. The fit into the canvas, where each layer lands, the paint order and the
 * motion are all internal (geometry.ts, motion.ts, layers.ts) and none of them is a prop. CONTENT
 * IS OPEN: the character path, the measured character (and `characterFramed`: whether its image is
 * the 971 x 736 character frame), and the interface — a React node, or for the pair a function of
 * the layer. PLACEMENT IS EXTERNAL: the caller supplies the canvas and `safeArea`; this decides
 * where things land in it.
 *
 * Only DOM and `<Img>` are rendered (no canvas, WebGL or video), so a later SVG capture of the
 * DOM sees every layer. The root is transparent. The character is never cut but by the canvas
 * (and, below the waist, by the content bottom, the 8 % margin line: `placeStage`,
 * `stageRootStyle`); each interface mount is cut by its own leg canvas (`interfaceLegStyle`), then
 * by the stage root and the canvas.
 *
 * Import specifiers carry NO file extension (see geometry.ts).
 */
import type { FC, ReactElement, ReactNode } from 'react';
import { AbsoluteFill, Freeze, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { fitStage } from './geometry';
import { buildStageLayers, type StageInput } from './layers';
import { FOREGROUND_ANIM_START_MS, INTERFACE_ANIM_START_MS, interfacePhase, msToFrame, type InterfaceMotion } from './motion';
import { interfaceLegStyle, layerStyle, stageRootStyle } from './styles';

/** Which of the pair leg's two layers a mount shows. */
export type StagePairLayer = 'background' | 'foreground';

/**
 * `StageInput` (canvas, `safeArea`, `metrics`, `iface`, `characterFramed`, `srcs`) plus the
 * interface content. `characterFramed` reaches `placeStage` as given: it only shapes a pair.
 */
export type StratoStageProps = StageInput & {
  /**
   * LEGACY (`iface.kind` `'live-app'` / `'feature-highlight'`): the interface content, mounted once
   * over the character at its leg's own size (`iface.legW` x `iface.legH` CSS px). Ignored by a pair.
   */
  interfaceNode?: ReactNode;
  /**
   * The pair (`iface.kind === 'pair'`): the leg for ONE of its mounts, called once per layer. The
   * same leg run is mounted twice, below the character (`'background'`) and above it
   * (`'foreground'`), each at its own size (`iface.legW` x `iface.legH` CSS px) in its mount box
   * (`placeStage(...).pair`). The caller makes each mount show only its layer (compose: the leg
   * inside `<StageLayerContext.Provider value={layer}>`). Never called for a legacy kind, nor for
   * a pair whose character frame is degenerate (then the stage is the character alone).
   */
  renderInterface?: (layer: StagePairLayer) => ReactNode;
  /**
   * The leg's own length, in frames (what its own composition had; 90 for its 3 s). Inside each
   * mount, `useVideoConfig().durationInFrames` is this in every phase. Must not exceed the stage
   * composition's length (remotion clamps the timeline to the composition).
   */
  interfaceDurationInFrames?: number;
  /**
   * How the leg was rendered. `'still'`: shown at its LAST frame (the one its own still gate
   * validated) for the whole stage. `'animated'` (default): frozen at its frame 0 until it is
   * released (frame 39 for both pair mounts, frame 27 for a legacy interface), played from there,
   * then held on its last frame.
   */
  interfaceMotion?: InterfaceMotion;
};

/**
 * An interface leg on its own timeline, in ONE element tree for every phase, so it never remounts.
 * `startFrame` is its release (`interfacePhase`): 39 for a pair mount, 27 for a legacy interface.
 *
 * The Sequence starts at 0 and the stage frame is mapped onto the leg's own frame by an
 * always-active `<Freeze>` (`interfacePhase`). Verified against remotion 4.0.467 (and 4.0.529):
 *  - `<Sequence width height>` stores them in its `SequenceContext` (Sequence.js) and
 *    `useVideoConfig()` inside returns them (use-unsafe-video-config.js), so the node sees the
 *    LEG's size, not the canvas's;
 *  - the Sequence's context duration is `max(0, min(videoConfig.durationInFrames - from,
 *    durationInFrames))` (Sequence.js); it reports the leg's own d whenever the composite is at
 *    least that long (120 / 150). The Sequence starts at 0 and never at the release: a Sequence
 *    `from` 27 (or 39) would unmount the node before it (frames 0..26, or 0..38). The always-on
 *    `<Freeze>` below keeps ONE stable tree through the entrance, play and hold;
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
  startFrame: number,
): ReactNode => {
  const own = interfacePhase(frame, startFrame, durationInFrames, motion);
  return (
    <Freeze frame={own.frame}>
      <Sequence durationInFrames={durationInFrames} width={leg.legW} height={leg.legH} layout="none">
        {node}
      </Sequence>
    </Freeze>
  );
};

/**
 * The stage at stage frame `frame` (at `fps`), without hooks: `StratoStage` is this at the current
 * frame. Exported so the tests can read the element tree without a renderer.
 */
export function renderStratoStage(
  { interfaceNode, renderInterface, interfaceDurationInFrames, interfaceMotion = 'animated', ...input }: StratoStageProps,
  frame: number,
  fps: number,
): ReactElement {
  const { content } = fitStage(input.canvas, input.safeArea);
  const layers = buildStageLayers(input, (frame * 1000) / fps);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <div style={stageRootStyle(input.canvas, content)}>
        {layers.map((l) => {
          if (l.id === 'character') {
            return <Img key={l.id} src={staticFile(l.src!)} style={layerStyle(l)} />;
          }
          if (!input.iface) return null;
          // The legacy interface is `interfaceNode`, released at 900 ms; each pair layer is the leg
          // from `renderInterface(layer)`, both mounts released at 1300 ms.
          const node = l.id === 'interface' ? interfaceNode : renderInterface?.(l.id);
          // An interface layer without content has nothing to paint (the caller dropped it).
          if (node === undefined) return null;
          const startFrame = msToFrame(l.id === 'interface' ? INTERFACE_ANIM_START_MS : FOREGROUND_ANIM_START_MS);
          const { legW, legH } = input.iface;
          return (
            <div key={l.id} style={layerStyle(l)}>
              {/* The leg is `legW` x `legH` CSS px, scaled onto the rect (interfaceLegStyle): half
                  scale for a legacy interface, the whole mount box for a pair layer. */}
              <div style={interfaceLegStyle(l.rect, { legW, legH })}>
                {mountInterface(node, { legW, legH }, frame, interfaceDurationInFrames, interfaceMotion, startFrame)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

export const StratoStage: FC<StratoStageProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return renderStratoStage(props, frame, fps);
};
