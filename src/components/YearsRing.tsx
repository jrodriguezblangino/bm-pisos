import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { yearsPlates, type YearsPlate } from "../content/site";

const plates = yearsPlates;
const count = plates.length;

type Motion = {
  offset: number;
  target: number;
  velocity: number;
  dragging: boolean;
  stride: number;
};

type Pose = {
  x: number;
  y: number;
  z: number;
  rot: number;
  scale: number;
  opacity: number;
};

function wrapDelta(index: number, offset: number) {
  let delta = index - offset;
  delta %= count;
  if (delta > count / 2) delta -= count;
  if (delta < -count / 2) delta += count;
  return delta;
}

function nearest(offset: number, index: number) {
  const turns = Math.round((offset - index) / count);
  return index + turns * count;
}

function mod(value: number) {
  return ((value % count) + count) % count;
}

function lerpPose(from: Pose, to: Pose, amount: number): Pose {
  const t = Math.min(1, Math.max(0, amount));
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    z: from.z + (to.z - from.z) * t,
    rot: from.rot + (to.rot - from.rot) * t,
    scale: from.scale + (to.scale - from.scale) * t,
    opacity: from.opacity + (to.opacity - from.opacity) * t,
  };
}

export function YearsRing() {
  const viewRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const motionRef = useRef<Motion>({ offset: 0, target: 0, velocity: 0, dragging: false, stride: 220 });
  const focusRef = useRef<(index: number) => void>(() => {});
  const detailApi = useRef({
    open: (_index: number) => {},
    close: () => {},
    move: (_index: number) => {},
  });
  const applyRef = useRef<() => void>(() => {});
  const draggedRef = useRef(false);
  const detailRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState<number | null>(null);
  const activeRef = useRef(0);

  useLayoutEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const motion = motionRef.current;
    let frame = 0;
    let running = false;
    let last = 0;
    let snapTimer = 0;
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastTime = 0;
    let locked = false;
    let detailIndex = -1;
    let ringHeight = 0;
    let stripShift = 0;
    let mode: "ring" | "detail" = "ring";
    let liftIndex = 0;
    let blend = 1;
    let blendV = 0;
    let staggerOn = false;
    let arcFollow = false;
    let heightFrom = 0;
    let stageHeight = 0;
    let origins: Pose[] = [];

    const measure = () => {
      const width = view.clientWidth || window.innerWidth;
      const compact = width < 768;
      const card = compact ? Math.min(232, width * 0.62) : Math.min(292, Math.max(210, width * 0.19));
      const radius = compact ? card * 1.72 : Math.min(1460, width * 1.01);
      const step = ((compact ? 24 : 9.2) * Math.PI) / 180;
      const visible = compact ? 1.35 : 3.85;
      const cardHeight = card * 1.5;
      const rise = radius * (1 - Math.cos(step * (compact ? 1 : 3.7)));
      const corner = card * 0.18;
      const anchor = cardHeight * 0.5 + rise + corner;
      ringHeight = anchor + cardHeight * 0.5 + (compact ? 18 : 28);
      view.style.setProperty("--ring-card", `${card}px`);
      view.style.setProperty("--ring-anchor", `${anchor}px`);
      motion.stride = Math.max(88, Math.abs(radius * Math.sin(step)));
      return { width, compact, card, cardHeight, radius, step, visible, anchor, ringHeight };
    };

    const ringPose = (index: number, metrics: ReturnType<typeof measure>): Pose => {
      const delta = wrapDelta(index, motion.offset);
      const theta = delta * metrics.step;
      const dist = Math.abs(delta);
      const opacity = dist <= metrics.visible ? 1 : Math.max(0, 1 - (dist - metrics.visible) / 0.5);
      return {
        x: Math.sin(theta) * metrics.radius,
        y: -(1 - Math.cos(theta)) * metrics.radius,
        z: -dist * (metrics.compact ? 42 : 26),
        rot: -(theta * 180) / Math.PI,
        scale: 1,
        opacity,
      };
    };

    const detailLayout = (metrics: ReturnType<typeof measure>, openIndex: number) => {
      const others: number[] = [];
      for (let index = 0; index < count; index += 1) if (index !== openIndex) others.push(index);
      const margin = metrics.compact ? 12 : 20;
      const imageScale = metrics.compact
        ? Math.min((metrics.width - margin * 2) / metrics.card, 1.55)
        : 1.62;
      const slot = (metrics.width - margin * 2) / others.length;
      const stripScale = metrics.compact
        ? Math.min(0.34, 72 / metrics.card)
        : Math.min(0.42, (slot * 0.82) / metrics.card);
      const thumbH = metrics.cardHeight * stripScale;
      const stepX = metrics.compact ? metrics.card * stripScale * 1.12 : slot;
      const imageH = metrics.cardHeight * imageScale;
      const detailHeight = Math.max(metrics.ringHeight, imageH + thumbH + margin * 3);
      return {
        others,
        imageScale,
        stripScale,
        stepX,
        detailHeight,
        imageCx: metrics.compact ? metrics.width / 2 : margin + (metrics.card * imageScale) / 2,
        imageCy: margin + imageH / 2,
        stripCy: detailHeight - margin - thumbH / 2,
      };
    };

    const detailPose = (index: number, metrics: ReturnType<typeof measure>, openIndex: number): Pose => {
      const layout = detailLayout(metrics, openIndex);
      if (index === openIndex) {
        return {
          x: layout.imageCx - metrics.width / 2,
          y: layout.imageCy - metrics.anchor,
          z: 12,
          rot: 0,
          scale: layout.imageScale,
          opacity: 1,
        };
      }
      const slot = layout.others.indexOf(index);
      const span = (layout.others.length - 1) * layout.stepX;
      return {
        x: -span / 2 + slot * layout.stepX + (metrics.compact ? stripShift : 0),
        y: layout.stripCy - metrics.anchor,
        z: 0,
        rot: 0,
        scale: layout.stripScale,
        opacity: 1,
      };
    };

    const idle = () => mode === "ring" && blend >= 1;

    // The selected card leaves at once and unwinds its ring tilt. The rest hold the arc, then drop into the strip.
    const progressFor = (index: number) => {
      const t = Math.min(1, Math.max(0, blend));
      if (!staggerOn) return t;
      if (mode === "detail") {
        if (index === liftIndex) return t;
        return Math.min(1, Math.max(0, (t - 0.62) / 0.38));
      }
      if (index === liftIndex) return Math.min(1, Math.max(0, (t - 0.28) / 0.72));
      return Math.min(1, t / 0.62);
    };

    const sample = (index: number, metrics: ReturnType<typeof measure>): Pose => {
      const finalPose = mode === "detail" ? detailPose(index, metrics, liftIndex) : ringPose(index, metrics);
      if (origins.length !== count || blend >= 1) return finalPose;
      const local = progressFor(index);
      if (arcFollow && index !== liftIndex) return lerpPose(ringPose(index, metrics), finalPose, local);
      return lerpPose(origins[index], finalPose, local);
    };

    const writePose = (index: number, pose: Pose) => {
      const node = itemsRef.current[index];
      if (!node) return;
      const engaged = !idle();
      node.style.transform = `translate(-50%, -50%) translate3d(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px, ${pose.z.toFixed(2)}px) rotateZ(${pose.rot.toFixed(2)}deg) scale(${pose.scale.toFixed(4)})`;
      node.style.opacity = pose.opacity.toFixed(3);
      node.style.zIndex = String(
        engaged && index === liftIndex ? 80 : engaged ? 20 + Math.round(pose.scale * 24) : 40 - Math.round(Math.abs(wrapDelta(index, motion.offset)) * 6),
      );
      node.style.pointerEvents = (engaged && index === liftIndex) || pose.opacity >= 0.45 ? "auto" : "none";
      node.toggleAttribute("data-far", !engaged && pose.opacity < 0.2);
    };

    const syncRing = () => {
      const metrics = measure();
      for (let index = 0; index < count; index += 1) writePose(index, ringPose(index, metrics));
      const next = mod(Math.round(motion.offset));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
      stageHeight = ringHeight;
      heightFrom = ringHeight;
      view.style.setProperty("--ring-height", `${ringHeight.toFixed(2)}px`);
      view.classList.remove("is-open");
    };

    const paint = () => {
      const metrics = measure();
      const destHeight = mode === "detail" ? detailLayout(metrics, liftIndex).detailHeight : metrics.ringHeight;
      const fromHeight = heightFrom || metrics.ringHeight;
      stageHeight = fromHeight + (destHeight - fromHeight) * progressFor(liftIndex);
      view.style.setProperty("--ring-height", `${stageHeight.toFixed(2)}px`);
      view.classList.toggle("is-open", !idle());
      for (let index = 0; index < count; index += 1) writePose(index, sample(index, metrics));
    };

    const retarget = (next: "ring" | "detail", nextLift: number) => {
      const metrics = measure();
      const captured = Array.from({ length: count }, (_, index) => sample(index, metrics));
      const followArc = next === "detail" && mode === "ring" && blend >= 1;
      heightFrom = stageHeight || metrics.ringHeight;
      staggerOn = mode !== next;
      origins = captured;
      arcFollow = followArc;
      mode = next;
      liftIndex = nextLift;
      blend = 0;
      blendV = 0;
      paint();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
      last = now;
      const ringLocked = mode === "detail" && blend >= 1;
      if (!ringLocked && !motion.dragging) {
        const omega = 15;
        const zeta = 0.9;
        const accel = omega * omega * (motion.target - motion.offset) - 2 * zeta * omega * motion.velocity;
        motion.velocity += accel * dt;
        motion.offset += motion.velocity * dt;
        if (Math.abs(motion.target - motion.offset) < 0.0008 && Math.abs(motion.velocity) < 0.012) {
          motion.offset = motion.target;
          motion.velocity = 0;
        }
      }
      if (!idle()) {
        const omega = 8;
        const accel = omega * omega * (1 - blend) - 2 * omega * blendV;
        blendV += accel * dt;
        blend += blendV * dt;
        if (1 - blend < 0.0015 && Math.abs(blendV) < 0.012) {
          blend = 1;
          blendV = 0;
        }
      }
      if (mode === "detail" && blend >= 1) {
        motion.target = motion.offset;
        motion.velocity = 0;
        paint();
        running = false;
        view.classList.remove("is-dragging");
        return;
      }
      if (idle()) {
        syncRing();
        if (!motion.dragging && motion.offset === motion.target && motion.velocity === 0) {
          running = false;
          view.classList.remove("is-dragging");
          return;
        }
      } else {
        paint();
      }
      frame = window.requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    };

    const focusPlate = (index: number) => {
      if (mode === "detail" && detailIndex >= 0) return;
      motion.target = nearest(motion.offset, index);
      wake();
    };

    const clampStrip = () => {
      const metrics = measure();
      if (!metrics.compact) {
        stripShift = 0;
        return;
      }
      const layout = detailLayout(metrics, Math.max(0, detailIndex));
      const span = Math.max(0, (layout.others.length - 1) * layout.stepX);
      const limit = Math.max(0, (span + metrics.card * layout.stripScale - (metrics.width - 24)) / 2);
      stripShift = Math.max(-limit, Math.min(limit, stripShift));
    };

    const openDetail = (index: number) => {
      if (mode === "detail" && liftIndex === index && detailIndex === index) return;
      motion.dragging = false;
      view.classList.remove("is-dragging");
      stripShift = 0;
      retarget("detail", index);
      detailIndex = index;
      detailRef.current = index;
      activeRef.current = index;
      setDetail(index);
      setActive(index);
      wake();
    };

    const moveDetail = (index: number) => {
      if (detailIndex < 0) {
        focusPlate(index);
        return;
      }
      if (mode === "detail" && liftIndex === index) return;
      retarget("detail", index);
      detailIndex = index;
      detailRef.current = index;
      activeRef.current = index;
      setDetail(index);
      setActive(index);
      wake();
    };

    const closeDetail = () => {
      if (detailIndex < 0) return;
      const centered = mod(Math.round(motion.offset));
      retarget("ring", liftIndex);
      stripShift = 0;
      detailIndex = -1;
      detailRef.current = null;
      activeRef.current = centered;
      setDetail(null);
      setActive(centered);
      wake();
    };

    focusRef.current = focusPlate;
    detailApi.current = { open: openDetail, close: closeDetail, move: moveDetail };
    applyRef.current = () => {
      if (idle()) syncRing();
      else paint();
    };

    syncRing();
    const observer = new ResizeObserver(() => {
      if (idle()) syncRing();
      else paint();
    });
    observer.observe(view);
    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      if (locked) {
        draggedRef.current = true;
        window.setTimeout(() => {
          draggedRef.current = false;
        }, 0);
        if (detailIndex < 0) {
          const flick = Math.max(-1.65, Math.min(1.65, motion.velocity * 0.11));
          motion.target = Math.round(motion.offset + flick);
          wake();
        }
      }
      motion.dragging = false;
      locked = false;
      pointerId = -1;
      if (view.hasPointerCapture(event.pointerId)) view.releasePointerCapture(event.pointerId);
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || pointerId !== -1) return;
      if (detailIndex >= 0 && !measure().compact) return;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startY = event.clientY;
      lastTime = performance.now();
      locked = false;
      draggedRef.current = false;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!locked) {
        if (Math.hypot(dx, dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          pointerId = -1;
          return;
        }
        locked = true;
        if (detailIndex < 0) {
          motion.dragging = true;
          motion.velocity = 0;
          view.classList.add("is-dragging");
        }
        try {
          view.setPointerCapture(event.pointerId);
        } catch {
          /* Safari can reject capture during the same turn. */
        }
      }
      const now = performance.now();
      const stepX = event.clientX - lastX;
      const dt = Math.max(8, now - lastTime);
      lastX = event.clientX;
      lastTime = now;
      if (detailIndex >= 0) {
        if (mode !== "detail" || blend < 0.92) return;
        stripShift += stepX;
        clampStrip();
        paint();
        return;
      }
      motion.offset -= stepX / motion.stride;
      motion.velocity = -stepX / motion.stride / (dt / 1000);
      wake();
    };

    const onWheel = (event: WheelEvent) => {
      if (mode === "detail" && blend >= 1) return;
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
      if (!horizontal) return;
      event.preventDefault();
      const delta = event.shiftKey && Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      motion.target += delta / motion.stride;
      wake();
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        motion.target = Math.round(motion.target);
        wake();
      }, 140);
    };

    const onKey = (event: KeyboardEvent) => {
      if (detailIndex >= 0) {
        if (event.key === "Escape") closeDetail();
        else if (event.key === "ArrowRight") moveDetail(mod(detailIndex + 1));
        else if (event.key === "ArrowLeft") moveDetail(mod(detailIndex - 1));
        else if (event.key === "Home") moveDetail(0);
        else if (event.key === "End") moveDetail(count - 1);
        else return;
        event.preventDefault();
        return;
      }
      if (event.key === "ArrowRight") motion.target = Math.round(motion.offset) + 1;
      else if (event.key === "ArrowLeft") motion.target = Math.round(motion.offset) - 1;
      else if (event.key === "Home") motion.target = nearest(motion.offset, 0);
      else if (event.key === "End") motion.target = nearest(motion.offset, count - 1);
      else if (event.key === "Enter") openDetail(mod(Math.round(motion.offset)));
      else return;
      event.preventDefault();
      motion.velocity = 0;
      wake();
    };

    view.addEventListener("pointerdown", onDown);
    view.addEventListener("pointermove", onMove);
    view.addEventListener("pointerup", endDrag);
    view.addEventListener("pointercancel", endDrag);
    view.addEventListener("wheel", onWheel, { passive: false });
    view.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(snapTimer);
      observer.disconnect();
      view.removeEventListener("pointerdown", onDown);
      view.removeEventListener("pointermove", onMove);
      view.removeEventListener("pointerup", endDrag);
      view.removeEventListener("pointercancel", endDrag);
      view.removeEventListener("wheel", onWheel);
      view.removeEventListener("keydown", onKey);
    };
  }, []);

  useLayoutEffect(() => {
    applyRef.current();
  }, [active, detail]);

  useEffect(() => {
    const sheet = sheetRef.current;
    const button = sheet?.querySelector<HTMLButtonElement>(`[data-index="${detail ?? active}"]`);
    if (!sheet || !button || sheet.scrollWidth <= sheet.clientWidth + 8) return;
    sheet.scrollTo({ left: button.offsetLeft - (sheet.clientWidth - button.offsetWidth) / 2, behavior: "smooth" });
  }, [active, detail]);

  const plate = plates[detail ?? active] ?? plates[0];

  const choosePlate = (index: number) => {
    if (draggedRef.current) return;
    if (detailRef.current === null) detailApi.current.open(index);
    else if (detailRef.current === index) detailApi.current.close();
    else detailApi.current.move(index);
  };

  const chooseFromSheet = (index: number) => {
    if (detailRef.current === null) focusRef.current(index);
    else detailApi.current.move(index);
  };

  return (
    <div className="years-ring-layout">
      <div className="years-ring-copy">
        <h2 id="standard-heading" className="years-ring-title scroll-fade">
          Treinta años en
          <br /> el hormigón.
        </h2>
        <p className="years-ring-lead scroll-fade scroll-fade-late">
          Tercera generación en el oficio. El piso se hace para el uso real: camiones, máquinas, mercadería o público.
        </p>
      </div>

      <div
        ref={viewRef}
        className="years-ring-view"
        role={detail === null ? "region" : "dialog"}
        aria-modal={detail === null ? undefined : true}
        aria-roledescription="galería"
        aria-label={detail === null ? "Anillo de obra" : plates[detail].label}
        tabIndex={0}
      >
        <ul className="years-ring-stage" role="listbox" aria-label="Fotos del oficio" aria-orientation="horizontal">
          {plates.map((item, index) => (
            <Plate
              key={item.src}
              item={item}
              index={index}
              selected={index === (detail ?? active)}
              nodeRef={(node) => {
                itemsRef.current[index] = node;
              }}
              onChoose={() => choosePlate(index)}
            />
          ))}
        </ul>
      </div>

      <div className="years-ring-caption" aria-live="polite">
        <span className="years-ring-caption-label">{plate.label}</span>
        {detail !== null ? (
          <button type="button" className="years-ring-close" onClick={() => detailApi.current.close()}>
            Cerrar
          </button>
        ) : null}
      </div>

      <nav ref={sheetRef} className="years-sheet" aria-label="Piezas">
        {plates.map((item, index) => (
          <button
            key={item.src}
            type="button"
            data-index={index}
            aria-current={index === (detail ?? active) ? "true" : undefined}
            onClick={() => chooseFromSheet(index)}
          >
            <span className="years-sheet-index">{String(index).padStart(2, "0")}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Plate({
  item,
  index,
  selected,
  nodeRef,
  onChoose,
}: {
  item: YearsPlate;
  index: number;
  selected: boolean;
  nodeRef: (node: HTMLLIElement | null) => void;
  onChoose: () => void;
}) {
  return (
    <li
      ref={nodeRef}
      className="years-ring-item"
      role="option"
      aria-selected={selected}
      aria-posinset={index + 1}
      aria-setsize={count}
      onClick={onChoose}
    >
      <img
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        draggable={false}
        decoding="async"
        loading={index < 3 ? "eager" : "lazy"}
      />
    </li>
  );
}
