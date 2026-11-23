/**
 * The two drawn layers of a corporate-stage leg, each in its own box of the character frame.
 * The compose step mounts the leg twice and wraps each mount in StageLayerContext.Provider
 * ('background' | 'foreground'); a standalone render has no provider and shows both.
 */
import { useContext, type ReactNode } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import {
  StageLayerContext, StageSlotContext, pairSlotRects, visibleLayers, type StageLayerName,
} from './stagePair.layout';

export { StageLayerContext, StageSlotContext, useStageSlot, pairSlotRects, visibleLayers } from './stagePair.layout';
export type { StageLayerName } from './stagePair.layout';

type PairProps = { background: ReactNode; foreground: ReactNode; layer?: StageLayerName };

/** Hook-free body (tests call this directly with an explicit size). */
export function renderStagePair(p: PairProps & { layer: StageLayerName; width: number; height: number }) {
  const rects = pairSlotRects({ w: p.width, h: p.height });
  return (
    <AbsoluteFill>
      {visibleLayers(p.layer).map((name) => {
        const r = rects[name];
        return (
          <div key={name} style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h }}>
            <StageSlotContext.Provider value={{ w: r.w, h: r.h }}>{p[name]}</StageSlotContext.Provider>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

export function StagePair(props: PairProps) {
  const { width, height } = useVideoConfig();
  const ctx = useContext(StageLayerContext);
  return renderStagePair({ ...props, layer: props.layer ?? ctx, width, height });
}
