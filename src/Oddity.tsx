import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
  gsap,
  ScrollTrigger,
  scrollToTarget,
  useBodyBg,
  useClock,
  useFontsRefresh,
  useLenis,
  usePointerFine,
  useReducedMotion,
  type Lenis,
} from "./shared/motion";
import { Magnetic } from "./shared/ui";
import Art from "./Art";
import { clients, principles, projects, recognition, services, type Project } from "./data";

const EMAIL = "hello@oddity.studio";

/* ================================================================
   CURSOR BLOB
   ================================================================ */

function Blob() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const big = !!t.closest?.("a, button, input, [data-hover]");
      if (inner.current) {
        const s = big ? 64 : 14;
        inner.current.style.width = `${s}px`;
        inner.current.style.height = `${s}px`;
      }
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (outer.current) outer.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div ref={outer} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[200] text-white mix-blend-difference" style={{ transform: "translate3d(-100px,-100px,0)" }}>
      <div
        ref={inner}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[width,height] duration-300 ease-out"
        style={{ width: 14, height: 14 }}
      />
    </div>
  );
}

/* ================================================================
   NAV
   ================================================================ */

const NAV: [string, string][] = [
  ["Work", "#o-work"],
  ["Services", "#o-services"],
  ["Studio", "#o-studio"],
  ["Contact", "#o-contact"],
];

function ONav({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const [open, setOpen] = useState(false);
  const time = useClock("Europe/Lisbon");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    lenis.current?.stop();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      lenis.current?.start();
      window.removeEventListener("keydown", k);
    };
  }, [open, lenis]);

  const go = (e: React.MouseEvent, sel: string) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(lenis.current, sel), open ? 60 : 0);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between px-5 md:px-10">
          <a href="#o-top" onClick={(e) => go(e, "#o-top")} className="font-brico text-2xl font-bold tracking-[-0.04em]">
            Oddity<sup className="text-xs">®</sup>
          </a>
          <p className="hidden font-mono text-[11px] tracking-[0.18em] uppercase lg:block tabular">Lisbon {time}</p>
          <nav className="hidden items-center gap-9 md:flex" aria-label="Oddity sections">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} onClick={(e) => go(e, h)} className="link-sweep font-mono text-[11px] tracking-[0.2em] uppercase">
                {l}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="font-mono text-[11px] tracking-[0.2em] uppercase md:hidden"
          >
            Menu +
          </button>
        </div>
      </header>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="backdrop-in fixed inset-0 z-[80] flex flex-col bg-carbon px-5 text-paper">
          <div className="flex h-20 items-center justify-between">
            <span className="font-brico text-2xl font-bold tracking-[-0.04em]">Oddity®</span>
            <button type="button" onClick={() => setOpen(false)} className="font-mono text-[11px] tracking-[0.2em] uppercase">
              Close ×
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center" aria-label="Mobile">
            {NAV.map(([l, h], i) => (
              <a
                key={h}
                href={h}
                onClick={(e) => go(e, h)}
                className="fade-swap border-b border-paper/15 py-5 font-brico text-6xl font-semibold tracking-[-0.045em]"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {l}
              </a>
            ))}
          </nav>
          <p className="pb-8 font-mono text-[11px] tracking-[0.2em] text-paper/50 uppercase">{EMAIL}</p>
        </div>
      )}
    </>
  );
}

/* ================================================================
   HERO — variable-font headline that reacts to the pointer
   ================================================================ */

type HeroLine = { t: string; accent?: [number, number] };
/* 4 lines on phones, 3 on landscape screens so the whole composition fits above the fold */
const LINES_NARROW: HeroLine[] = [{ t: "We build" }, { t: "brands that" }, { t: "refuse to", accent: [0, 6] }, { t: "blend in." }];
const LINES_WIDE: HeroLine[] = [{ t: "We build brands" }, { t: "that refuse to", accent: [5, 11] }, { t: "blend in." }];

function Sticker() {
  return (
    <div className="relative h-28 w-28 md:h-40 md:w-40" aria-hidden>
      <div className="spin-slow absolute inset-0 rounded-full bg-lime">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <defs>
            <path id="odd-circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text fontSize="9.5" fill="#0c0c0c" fontFamily="JetBrains Mono, monospace" style={{ textTransform: "uppercase" }}>
            <textPath href="#odd-circ" textLength="272" lengthAdjust="spacing">
              Available for projects — Q3 2026 ✺{" "}
            </textPath>
          </text>
        </svg>
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-3xl text-carbon md:text-4xl">✺</span>
    </div>
  );
}

function Hero({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const fn = () => setWide(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  const lines = wide ? LINES_WIDE : LINES_NARROW;

  // entrance
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-c]", { yPercent: 112, rotate: 5 });
      gsap.to("[data-c]", { yPercent: 0, rotate: 0, duration: 1.25, ease: "expo.out", stagger: 0.02, delay: 0.35 });
    }, head);
    return () => ctx.revert();
  }, [reduced, wide]);

  // pointer-reactive variable font (weight + width) with an idle "breathing" wave
  useEffect(() => {
    const h = head.current;
    if (!h) return;
    const chars = Array.from(h.querySelectorAll<HTMLElement>("[data-vc]"));
    if (reduced) {
      chars.forEach((el) => (el.style.fontVariationSettings = "'wght' 600, 'wdth' 100"));
      return;
    }
    const cur = chars.map(() => ({ w: 500, d: 100 }));
    const mouse = { x: 0, y: 0, on: false };
    let visible = true;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = e.pointerType !== "touch";
    };
    const onLeave = () => (mouse.on = false);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
    io.observe(h);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const t = now / 1000;
      const radius = Math.max(240, window.innerWidth * 0.17);
      // read pass
      const targets = chars.map((el, i) => {
        const r = el.getBoundingClientRect();
        const dist = mouse.on ? Math.hypot(mouse.x - (r.left + r.width / 2), mouse.y - (r.top + r.height / 2)) : 1e5;
        const near = Math.max(0, 1 - dist / radius);
        const idle = (0.5 + 0.5 * Math.sin(t * 1.25 - i * 0.42)) * 0.32;
        return Math.max(near * near * (3 - 2 * near), idle);
      });
      // write pass
      chars.forEach((el, i) => {
        const c = cur[i];
        const tw = 400 + targets[i] * 400;
        const td = 100 - targets[i] * 20;
        c.w += (tw - c.w) * 0.14;
        c.d += (td - c.d) * 0.14;
        el.style.fontVariationSettings = `'wght' ${c.w.toFixed(0)}, 'wdth' ${c.d.toFixed(0)}`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, wide]);

  return (
    <section ref={root} id="o-top" className="relative overflow-x-clip bg-paper px-5 pt-20 pb-8 text-carbon md:px-10">
      <div className="mx-auto flex min-h-[calc(100svh-6.5rem)] max-w-[1700px] flex-col justify-between">
        <div className="pt-4">
          <p className="max-w-[16rem] font-mono text-[11px] leading-relaxed tracking-[0.16em] uppercase">
            (Independent design studio)
            <br />
            Lisbon, Portugal — Est. 2014
          </p>
        </div>
        <div data-rise className="absolute top-24 right-5 md:right-10 md:top-28">
          <Sticker />
        </div>

        <h1
          ref={head}
          aria-label="We build brands that refuse to blend in."
          className="my-6 font-brico text-[clamp(3.1rem,min(11.6vw,15svh),15.5rem)] leading-[0.88] tracking-[-0.045em] md:text-[clamp(3.3rem,min(9.6vw,23svh),14rem)]"
        >
          {lines.map((line, li) => (
            <span key={li} aria-hidden className="block whitespace-nowrap">
              {Array.from(line.t).map((ch, ci) =>
                ch === " " ? (
                  <span key={ci} className="inline-block w-[0.22em]" />
                ) : (
                  <span
                    key={ci}
                    data-vc
                    className="inline-block overflow-hidden pt-[0.06em] pb-[0.1em] -mt-[0.06em] -mb-[0.1em] align-bottom"
                    style={{ fontVariationSettings: "'wght' 500, 'wdth' 100" }}
                  >
                    <span data-c className={`inline-block will-change-transform ${line.accent && ci >= line.accent[0] && ci < line.accent[1] ? "text-cobalt" : ""}`}>
                      {ch}
                    </span>
                  </span>
                )
              )}
            </span>
          ))}
        </h1>

        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <p data-rise className="col-span-12 max-w-md text-lg leading-snug md:col-span-5 md:text-xl">
            Oddity is an independent studio of fourteen designers, developers and motion nerds. We make identities,
            websites and products for teams who would rather be remembered than liked.
          </p>
          <div data-rise className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-7 md:justify-end">
            <a
              href="#o-work"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(lenis.current, "#o-work");
              }}
              className="link-sweep font-mono text-[11px] tracking-[0.2em] uppercase"
            >
              See the work ↓
            </a>
            <Magnetic>
              <a
                href="#o-contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(lenis.current, "#o-contact");
                }}
                className="inline-flex items-center gap-3 rounded-full bg-carbon px-8 py-5 font-mono text-[12px] tracking-[0.18em] text-paper uppercase transition-colors duration-300 hover:bg-cobalt"
              >
                Start a project <span aria-hidden>↗</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   MARQUEE
   ================================================================ */

function Strip() {
  const items = ["Brand identity", "Websites", "Motion", "Product", "3D", "Art direction"];
  const half = (k: string, hidden: boolean) => (
    <div key={k} aria-hidden={hidden} className="flex items-center gap-8 pr-8 md:gap-14 md:pr-14">
      {items.map((it) => (
        <span key={it} className="flex items-center gap-8 whitespace-nowrap md:gap-14">
          <span className="font-brico text-[clamp(2.4rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.04em] text-lime">{it}</span>
          <span className="text-[clamp(1.6rem,3.5vw,3rem)] text-paper" aria-hidden>
            ✺
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden bg-cobalt py-6 select-none md:py-8">
      <div className="marquee-track flex w-max" style={{ animationDuration: "30s" }}>
        {half("a", false)}
        {half("b", true)}
      </div>
    </div>
  );
}

/* ================================================================
   WORK
   ================================================================ */

function CaseView({ p, n, lenis, onClose }: { p: Project; n: number; lenis: RefObject<Lenis | null>; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const l = lenis.current;
    l?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => {
      l?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
  }, [lenis, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name} case study`}
      className="backdrop-in fixed inset-0 z-[120] grid overflow-y-auto bg-paper text-carbon md:grid-cols-2"
    >
      <div className="relative min-h-[40svh] md:min-h-0">
        <div className="absolute inset-0">
          <Art id={p.id} />
        </div>
      </div>
      <div className="fade-swap flex flex-col p-6 md:p-12">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase">Case study — 0{n}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-carbon px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 hover:bg-carbon hover:text-paper"
          >
            Close ×
          </button>
        </div>
        <h3 className="mt-14 font-brico text-[clamp(2.8rem,6vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">{p.name}</h3>
        <p className="mt-4 font-mono text-[11px] tracking-[0.18em] text-cobalt uppercase">{p.role}</p>
        <p className="mt-8 max-w-lg text-lg leading-snug">{p.blurb}</p>
        <div className="mt-10 border-t border-carbon/20 pt-6">
          <p className="font-brico text-[clamp(3.6rem,8vw,8rem)] leading-none font-semibold tracking-[-0.05em] text-cobalt">{p.result}</p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase">{p.resultLabel}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {p.tags.concat(p.year).map((t) => (
            <span key={t} className="rounded-full border border-carbon/30 px-4 py-1.5 font-mono text-[11px] tracking-[0.15em] uppercase">
              {t}
            </span>
          ))}
        </div>
        <a
          href="#o-contact"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            window.setTimeout(() => scrollToTarget(lenis.current, "#o-contact"), 80);
          }}
          className="mt-auto inline-flex items-center gap-3 pt-14 font-mono text-[12px] tracking-[0.18em] uppercase"
        >
          <span className="link-sweep">Start something like this</span> ↗
        </a>
      </div>
    </div>
  );
}

function Work({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState<number | null>(null);
  const prev = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!fine || reduced) return;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let rot = 0;
    let raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.13;
      cy += (y - cy) * 0.13;
      const target = Math.max(-14, Math.min(14, (x - cx) * 0.06));
      rot += (target - rot) * 0.15;
      if (prev.current) prev.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) rotate(${rot.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  return (
    <section id="o-work" className="relative bg-paper px-5 pt-24 pb-28 text-carbon md:px-10 md:pt-40 md:pb-40">
      <div className="mx-auto max-w-[1700px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-rise className="font-brico text-[clamp(3rem,9vw,10rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
            Selected
            <br />
            work<sup className="ml-2 align-top font-mono text-sm font-normal tracking-normal">(06)</sup>
          </h2>
          <p data-rise className="max-w-[18rem] font-mono text-[11px] leading-relaxed tracking-[0.16em] uppercase">
            2023 — 2026. Hover to preview, click to open a case study.
          </p>
        </div>

        <ul className="mt-16 border-b border-carbon/20 md:mt-24" onMouseLeave={() => setActive(-1)}>
          {projects.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(-1)}
                aria-label={`${p.name} — open case study`}
                className="group relative block w-full overflow-hidden border-t border-carbon/20 text-left"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-carbon transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <span className="relative grid grid-cols-12 items-center gap-x-4 px-1 py-6 transition-[color,padding] duration-500 group-hover:pl-5 group-hover:text-paper group-focus-visible:pl-5 group-focus-visible:text-paper md:py-9">
                  <span className="col-span-2 font-mono text-xs md:col-span-1">0{i + 1}</span>
                  <span className="col-span-10 font-brico text-[clamp(2rem,6.2vw,6.4rem)] leading-none font-semibold tracking-[-0.045em] md:col-span-6">
                    {p.name}
                  </span>
                  <span className="hidden flex-wrap gap-2 md:col-span-3 md:flex">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-current px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase opacity-70">
                        {t}
                      </span>
                    ))}
                  </span>
                  <span className="hidden text-right font-mono text-xs md:col-span-2 md:block">
                    {p.year} <span aria-hidden>↗</span>
                  </span>
                </span>
                <span aria-hidden className="block h-44 overflow-hidden md:hidden">
                  <Art id={p.id} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* floating preview */}
      {fine && !reduced && (
        <div
          ref={prev}
          aria-hidden
          className={`pointer-events-none fixed top-0 left-0 z-[60] hidden h-[26rem] w-80 overflow-hidden shadow-2xl transition-[opacity,scale] duration-300 ease-out md:block ${
            active >= 0 ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{ transform: "translate3d(-999px,-999px,0)" }}
        >
          {projects.map((p, i) => (
            <div key={p.id} className={`absolute inset-0 transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}>
              <Art id={p.id} />
            </div>
          ))}
        </div>
      )}

      {open !== null && <CaseView p={projects[open]} n={open + 1} lenis={lenis} onClose={close} />}
    </section>
  );
}

/* ================================================================
   SERVICES — sticky stacking cards
   ================================================================ */

function Glyph({ i }: { i: number }) {
  const common = { className: "h-full w-full", viewBox: "0 0 120 120", fill: "none", stroke: "currentColor", strokeWidth: 3 } as const;
  if (i === 0)
    return (
      <svg {...common} aria-hidden>
        {[0, 30, 60, 90, 120, 150].map((r) => (
          <line key={r} x1="60" y1="8" x2="60" y2="112" transform={`rotate(${r} 60 60)`} />
        ))}
      </svg>
    );
  if (i === 1)
    return (
      <svg {...common} aria-hidden>
        <rect x="10" y="20" width="100" height="80" rx="8" />
        <line x1="10" y1="40" x2="110" y2="40" />
        <circle cx="24" cy="30" r="2.5" fill="currentColor" />
        <circle cx="34" cy="30" r="2.5" fill="currentColor" />
        <rect x="24" y="54" width="42" height="34" />
        <line x1="78" y1="58" x2="98" y2="58" />
        <line x1="78" y1="72" x2="98" y2="72" />
      </svg>
    );
  if (i === 2)
    return (
      <svg {...common} aria-hidden>
        {[16, 30, 44, 58].map((r) => (
          <circle key={r} cx="60" cy="60" r={r} strokeOpacity={1 - r / 80} />
        ))}
        <circle cx="60" cy="60" r="6" fill="currentColor" />
      </svg>
    );
  return (
    <svg {...common} aria-hidden>
      <rect x="14" y="14" width="38" height="38" rx="10" />
      <rect x="68" y="14" width="38" height="38" rx="19" />
      <rect x="14" y="68" width="38" height="38" rx="19" />
      <rect x="68" y="68" width="38" height="38" rx="10" fill="currentColor" />
    </svg>
  );
}

function Services() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const wraps = gsap.utils.toArray<HTMLElement>("[data-card]");
      wraps.forEach((w, i) => {
        if (i === wraps.length - 1) return;
        // explicit from-values: tweening `filter` from "none" interpolates through black
        gsap.fromTo(
          w.querySelector("[data-inner]"),
          { scale: 1, filter: "brightness(1)" },
          {
            scale: 0.93,
            filter: "brightness(0.8)",
            ease: "none",
            scrollTrigger: { trigger: wraps[i + 1], start: "top 92%", end: "top 16%", scrub: true },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="o-services" className="relative bg-paper px-5 pb-28 text-carbon md:px-10 md:pb-40">
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-24">
          <h2 data-rise className="font-brico text-[clamp(3rem,9vw,10rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
            What we <span className="font-serifi font-normal italic tracking-[-0.03em] text-cobalt">do.</span>
          </h2>
          <p data-rise className="max-w-[18rem] font-mono text-[11px] leading-relaxed tracking-[0.16em] uppercase">
            Four disciplines. One studio. No handoffs.
          </p>
        </div>

        <div>
          {services.map((s, i) => (
            <div
              key={s.n}
              data-card
              className="sticky mb-[7svh] h-[74svh] min-h-[440px] last:mb-0"
              style={{ top: `calc(5.5rem + ${i} * 1.15rem)` }}
            >
              <div data-inner className={`flex h-full origin-top flex-col justify-between rounded-[1.75rem] p-6 md:p-12 ${s.bg}`}>
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-sm">{s.n} / 04</span>
                  <div className="h-16 w-16 md:h-28 md:w-28">
                    <Glyph i={i} />
                  </div>
                </div>
                <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
                  <h3 className="col-span-12 font-brico text-[clamp(3rem,10vw,11rem)] leading-[0.88] font-semibold tracking-[-0.055em] md:col-span-8">
                    {s.title}
                  </h3>
                  <div className="col-span-12 md:col-span-4">
                    <p className="text-base leading-snug md:text-lg">{s.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {s.items.map((it) => (
                        <li key={it} className={`rounded-full border px-3.5 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase ${s.chip}`}>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   STUDIO — cobalt statement with rotating word
   ================================================================ */

function Studio() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = ["brands", "websites", "films", "products"];
  const [w, setW] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setW((v) => (v + 1) % words.length), 2200);
    return () => window.clearInterval(id);
  }, [reduced, words.length]);

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-orb]", {
        yPercent: -35,
        rotate: 40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="o-studio" className="relative overflow-hidden bg-cobalt px-5 py-28 text-paper md:px-10 md:py-44">
      <div data-orb aria-hidden className="pointer-events-none absolute -right-[16vw] top-[6%] h-[46vw] w-[46vw] rounded-full border border-lime/50">
        <div className="absolute inset-[12%] rounded-full border border-lime/35" />
        <div className="absolute inset-[26%] rounded-full border border-lime/25" />
        <div className="absolute inset-[42%] rounded-full bg-lime/90" />
      </div>
      <div className="relative mx-auto max-w-[1700px]">
        <p data-rise className="font-mono text-[11px] tracking-[0.2em] uppercase">
          (The studio)
        </p>
        <h2 className="mt-8 max-w-[18ch] font-brico text-[clamp(2.8rem,8.4vw,9.6rem)] leading-[0.94] font-semibold tracking-[-0.05em]">
          We make{" "}
          <span className="inline-block overflow-hidden align-bottom">
            <span key={w} className={`inline-block text-lime ${reduced ? "" : "fade-swap"}`}>
              {words[w]}
            </span>
          </span>{" "}
          people can't stop{" "}
          <span className="font-serifi font-normal italic tracking-[-0.03em]">talking about.</span>
        </h2>

        <div className="mt-20 grid gap-x-8 gap-y-12 md:mt-32 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.n} data-rise className="border-t border-lime pt-5">
              <p className="font-mono text-xs text-lime">{p.n}</p>
              <h3 className="mt-6 font-brico text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{p.t}</h3>
              <p className="mt-4 max-w-sm text-base leading-snug text-paper/80 md:text-lg">{p.d}</p>
            </div>
          ))}
        </div>

        <div aria-hidden className="mt-24 flex flex-wrap gap-x-8 gap-y-2 md:mt-36">
          {clients.map((c) => (
            <span key={c} className="stroke-text font-brico text-[clamp(2rem,5vw,4.5rem)] leading-none font-semibold tracking-[-0.04em]" style={{ ["--stroke" as string]: "rgba(241,239,232,0.6)" }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   RECOGNITION
   ================================================================ */

function Recognition() {
  return (
    <section className="relative bg-paper px-5 py-24 text-carbon md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1700px] grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 md:col-span-4">
          <p data-rise className="font-mono text-[11px] tracking-[0.2em] uppercase">
            (Recognition)
          </p>
          <h2 data-rise className="mt-6 font-brico text-[clamp(2.6rem,6vw,6.4rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
            Nice things
            <br />
            people said.
          </h2>
        </div>
        <ul className="col-span-12 md:col-span-8">
          {recognition.map(([org, what, yr]) => (
            <li key={org} data-rise>
              <div className="group relative overflow-hidden border-t border-carbon/20 last:border-b">
                <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-lime transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-x-100" />
                <div className="relative grid grid-cols-12 items-baseline gap-x-4 px-1 py-6 transition-[padding] duration-500 group-hover:pl-5 md:py-8">
                  <span className="col-span-12 font-brico text-2xl font-semibold tracking-[-0.03em] md:col-span-5 md:text-4xl">{org}</span>
                  <span className="col-span-9 text-sm md:col-span-5 md:text-base">{what}</span>
                  <span className="col-span-3 text-right font-mono text-xs">{yr}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================================================================
   CONTACT + FOOTER
   ================================================================ */

function Contact({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const [copied, setCopied] = useState(false);
  const time = useClock("Europe/Lisbon");

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setCopied(true);
  };

  return (
    <section id="o-contact" className="relative overflow-hidden bg-lime px-5 pt-24 text-carbon md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1700px]">
        <p data-rise className="font-mono text-[11px] tracking-[0.2em] uppercase">
          (Contact)
        </p>
        <h2 data-rise className="mt-8 font-brico text-[clamp(3.2rem,11.5vw,14rem)] leading-[0.88] font-semibold tracking-[-0.055em]">
          Let's make
          <br />
          something{" "}
          <span className="font-serifi font-normal italic tracking-[-0.03em]">odd.</span>
        </h2>

        <div className="mt-14 grid grid-cols-12 items-end gap-x-6 gap-y-10 md:mt-20">
          <div data-rise className="col-span-12 md:col-span-8">
            <button
              type="button"
              onClick={copy}
              aria-label={`Copy email address ${EMAIL}`}
              className="group block text-left"
            >
              <span className="block font-mono text-[11px] tracking-[0.2em] uppercase">Click to copy</span>
              <span className="mt-2 block font-brico text-[clamp(1.8rem,5.4vw,5.6rem)] leading-none font-semibold tracking-[-0.04em] underline decoration-2 underline-offset-[0.14em] transition-colors duration-300 group-hover:text-cobalt">
                {EMAIL}
              </span>
            </button>
            <p role="status" className={`mt-4 font-mono text-[12px] tracking-[0.18em] uppercase transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}>
              ✓ Copied to clipboard
            </p>
          </div>
          <ul data-rise className="col-span-12 space-y-2 font-mono text-[12px] tracking-[0.16em] uppercase md:col-span-4 md:text-right">
            <li className="tabular">Lisbon — {time}</li>
            <li>Rua da Boavista 84, 1200-066</li>
            <li className="flex gap-6 pt-3 md:justify-end">
              <a href="#o-contact" className="link-sweep">Instagram</a>
              <a href="#o-contact" className="link-sweep">Are.na</a>
              <a href="#o-contact" className="link-sweep">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <p aria-hidden className="-mb-[0.13em] mt-16 select-none text-center font-brico text-[26vw] leading-[0.8] font-extrabold tracking-[-0.07em] md:mt-24">
        ODDITY<span className="align-top text-[0.28em]">®</span>
      </p>

      <div className="relative -mx-5 flex flex-wrap items-center justify-between gap-4 border-t border-carbon bg-carbon px-5 py-5 font-mono text-[11px] tracking-[0.18em] text-paper uppercase md:-mx-10 md:px-10">
        <span>© 2026 Oddity — a fictional concept for Folio/26</span>
        <button
          type="button"
          onClick={() => (lenis.current ? lenis.current.scrollTo(0, { duration: 2 }) : window.scrollTo(0, 0))}
          className="link-sweep text-lime"
        >
          Back to top ↑
        </button>
      </div>
    </section>
  );
}

/* ================================================================
   PAGE
   ================================================================ */

export default function Oddity() {
  useBodyBg("#f1efe8");
  const lenis = useLenis();
  useFontsRefresh();
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // generic scroll-in for [data-rise]
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        gsap.from(el, {
          y: 56,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 96%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div ref={root} className="relative min-h-screen bg-paper font-grot text-carbon selection:bg-cobalt selection:text-lime">
      <Blob />
      <ONav lenis={lenis} />
      <main>
        <Hero lenis={lenis} />
        <Strip />
        <Work lenis={lenis} />
        <Services />
        <Studio />
        <Recognition />
        <Contact lenis={lenis} />
      </main>
    </div>
  );
}
