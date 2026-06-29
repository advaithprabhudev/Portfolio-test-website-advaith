import FlowArt, { FlowSection } from './components/ui/story-scroll';
import { LiquidCursor } from './components/ui/liquid-cursor';

export default function App() {
  return (
    <>
    <LiquidCursor />
    <FlowArt aria-label="Advaith Prabhu Portfolio">
      {/* 01 — Hero */}
      <FlowSection
        aria-label="Introduction"
        style={{ backgroundColor: '#F5F2EC', color: '#1A1A1A' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">
          01 — Advaith Prabhu
        </p>
        <hr className="border-t border-black/10" />
        <div>
          <h1 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            Software
            <br />
            Engineer
          </h1>
        </div>
        <hr className="border-t border-black/10" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,1.75rem)] font-normal leading-relaxed opacity-70">
          I build fast, accessible, and delightful products — from design systems
          to full-stack applications.
        </p>
      </FlowSection>

      {/* 02 — About */}
      <FlowSection
        aria-label="About"
        style={{ backgroundColor: '#1A1A1A', color: '#F5F2EC' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">
          02 — About
        </p>
        <hr className="border-t border-white/10" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            Craft
            <br />
            Over
            <br />
            Noise
          </h2>
        </div>
        <hr className="border-t border-white/10" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,1.75rem)] font-normal leading-relaxed opacity-70">
          I care deeply about the intersection of engineering and design —
          writing code that is readable, performant, and built to last.
        </p>
        <hr className="border-t border-white/10" />
        <div className="flex flex-wrap gap-[3vw]">
          {[
            { label: 'Frontend', desc: 'React, TypeScript, Tailwind — with a focus on motion and accessibility.' },
            { label: 'Backend', desc: 'Node.js, Python, SQL. Clean APIs and reliable data pipelines.' },
            { label: 'Systems', desc: 'Performance profiling, build tooling, and developer experience.' },
          ].map(({ label, desc }) => (
            <div key={label} className="min-w-[180px] flex-1">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider">{label}</p>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-60">{desc}</p>
            </div>
          ))}
        </div>
      </FlowSection>

      {/* 03 — Work */}
      <FlowSection
        aria-label="Selected Work"
        style={{ backgroundColor: '#fd5200', color: '#fff' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
          03 — Selected Work
        </p>
        <hr className="border-t border-white/20" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            Things
            <br />
            I&apos;ve
            <br />
            Built
          </h2>
        </div>
        <hr className="border-t border-white/20" />
        <div className="flex flex-wrap gap-[3vw]">
          {[
            { label: 'Portfolio', desc: 'This site — React, Vite, Tailwind v4, GSAP ScrollTrigger.' },
            { label: 'Project 02', desc: 'Coming soon. Stay tuned.' },
            { label: 'Project 03', desc: 'Coming soon. Stay tuned.' },
          ].map(({ label, desc }) => (
            <div key={label} className="min-w-[180px] flex-1">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider">{label}</p>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-80">{desc}</p>
            </div>
          ))}
        </div>
        <hr className="border-t border-white/20" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,1.75rem)] font-normal leading-relaxed opacity-80">
          Each project is an opportunity to push craft further.
        </p>
      </FlowSection>

      {/* 04 — Skills */}
      <FlowSection
        aria-label="Skills"
        style={{ backgroundColor: '#1A3DE8', color: '#fff' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
          04 — Skills & Tools
        </p>
        <hr className="border-t border-white/20" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            The
            <br />
            Stack
          </h2>
        </div>
        <hr className="border-t border-white/20" />
        <div className="flex flex-wrap gap-[3vw]">
          {[
            { label: 'Languages', desc: 'TypeScript · Python · SQL · Bash' },
            { label: 'Frameworks', desc: 'React · Next.js · Node.js · FastAPI' },
            { label: 'Tooling', desc: 'Vite · Tailwind · GSAP · Figma · Git' },
          ].map(({ label, desc }) => (
            <div key={label} className="min-w-[180px] flex-1">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider">{label}</p>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-70">{desc}</p>
            </div>
          ))}
        </div>
      </FlowSection>

      {/* 05 — Contact */}
      <FlowSection
        aria-label="Contact"
        style={{ backgroundColor: '#F5F2EC', color: '#1A1A1A' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">
          05 — Get in Touch
        </p>
        <hr className="border-t border-black/10" />
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            Let&apos;s
            <br />
            Talk.
          </h2>
        </div>
        <hr className="border-t border-black/10" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,1.75rem)] font-normal leading-relaxed opacity-70">
          Open to new opportunities, collaborations, and interesting problems.
          Reach out at{' '}
          <a
            href="mailto:darsanaarun.sg@gmail.com"
            className="underline underline-offset-4 hover:opacity-100 opacity-70 transition-opacity"
          >
            darsanaarun.sg@gmail.com
          </a>
        </p>
      </FlowSection>
    </FlowArt>
    </>
  );
}
