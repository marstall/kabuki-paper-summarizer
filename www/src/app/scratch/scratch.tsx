import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Dna, ExternalLink, Layers, MapPin, MousePointer2, Network, Search, ShieldCheck, Sparkles } from "lucide-react";

const GC_BASE = "https://www.genecards.org/cgi-bin/carddisp.pl?gene=KMT2D";

const deepLinks = {
  top: GC_BASE,
  aliases: `${GC_BASE}#aliases_descriptions`,
  summaries: `${GC_BASE}#summaries`,
  genomics: `${GC_BASE}#genomic_views`,
  domains: `${GC_BASE}#protein_domains_families`,
  function: `${GC_BASE}#function`,
  expression: `${GC_BASE}#expression`,
  transcripts: `${GC_BASE}#transcripts`,
  variants: `${GC_BASE}#genomic_variants`,
  disorders: `${GC_BASE}#disorders`,
  pathways: `${GC_BASE}#pathways_interactions`,
  proteins: `${GC_BASE}#proteins`,
};

const palette = {
  ink: "#1f2933",
  muted: "#62717d",
  line: "#d8dee4",
  wash: "#f6f7f8",
  paper: "#ffffff",
  blue: "#7895a8",
  blueSoft: "#e8f0f4",
  sage: "#8ea38d",
  sageSoft: "#ecf2ec",
  ochre: "#b49a6b",
  ochreSoft: "#f3eee3",
};

function SourceLink({ href, children }) {
  return (
      <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        {children} <ExternalLink size={12} />
      </a>
  );
}

const essentials = [
  { label: "Gene symbol", value: "KMT2D", note: "Current approved symbol; older papers often say MLL2." },
  { label: "Full name", value: "Lysine methyltransferase 2D", note: "A gene encoding a histone-modifying enzyme." },
  { label: "Gene type", value: "Protein-coding", note: "It carries instructions for a large KMT2D protein." },
  { label: "Chromosome address", value: "12q13.12", note: "A cytogenetic neighborhood on chromosome 12." },
  { label: "GRCh38 position", value: "chr12:49,018,975–49,060,794", note: "About 41.8 kb in the current human genome assembly." },
  { label: "Strand", value: "Minus", note: "The gene is read from the reverse DNA strand." },
];

const concepts = [
  {
    id: "what",
    icon: Dna,
    title: "What KMT2D is",
    plain: "KMT2D is a gene that makes a large enzyme. The enzyme helps cells control which other genes are easy to turn on.",
    scientific: "GeneCards summarizes KMT2D as a protein-coding gene whose product is a histone methyltransferase. It methylates lysine 4 on histone H3, a mark usually associated with active or ready-to-use chromatin.",
    link: deepLinks.summaries,
    linkText: "GeneCards summaries",
  },
  {
    id: "how",
    icon: Layers,
    title: "What the protein does",
    plain: "Think of the KMT2D protein as part of the cell’s gene-access system, not as a gene that builds one body part directly.",
    scientific: "Its key biochemical job is to transfer a methyl group to H3K4. GeneCards/UniProt describes KMT2D as part of chromatin remodeling machinery, prominently forming H3K4me1 marks at active chromatin sites involved in transcription and DNA repair.",
    link: deepLinks.function,
    linkText: "GeneCards function",
  },
  {
    id: "kabuki",
    icon: ShieldCheck,
    title: "Why Kabuki parents care",
    plain: "Many cases of Kabuki syndrome type 1 involve changes in KMT2D. The effect is broad because KMT2D helps regulate many developmental programs.",
    scientific: "GeneCards states that diseases associated with KMT2D include Kabuki Syndrome 1, and its RefSeq summary states that mutations in the gene have been shown to cause Kabuki syndrome.",
    link: deepLinks.disorders,
    linkText: "GeneCards disorders",
  },
  {
    id: "where",
    icon: MapPin,
    title: "Where to look on the gene card",
    plain: "For a parent, the useful route is: summaries → genomics → domains → function → expression → variants/disorders.",
    scientific: "The GeneCards page is a compiled index. It integrates source databases rather than acting as a single experiment or single review article.",
    link: deepLinks.top,
    linkText: "Full KMT2D card",
  },
];

const domains = [
  {
    name: "PHD / zinc-finger regions",
    span: "Recognition / binding modules",
    tone: "blue",
    parentMeaning: "Parts that help chromatin proteins read local molecular context.",
    scientific: "GeneCards lists multiple PHD and zinc-finger related InterPro domains for KMT2D.",
  },
  {
    name: "FYRN / FYRC regions",
    span: "Stability / architecture modules",
    tone: "sage",
    parentMeaning: "Internal structural regions found in this protein family.",
    scientific: "These domains are characteristic regions in KMT2-family proteins and are listed among GeneCards protein-domain entries.",
  },
  {
    name: "SET domain",
    span: "Catalytic core",
    tone: "ochre",
    parentMeaning: "The enzyme region most directly tied to adding methyl marks to histones.",
    scientific: "GeneCards lists SET and post-SET domains; the function section identifies KMT2D as an H3K4 methyltransferase.",
  },
];

const pathwaySteps = [
  {
    title: "DNA is wrapped around histones",
    text: "A cell’s DNA is packaged with histone proteins. This packaging helps determine which genes are accessible.",
  },
  {
    title: "KMT2D adds H3K4 methyl marks",
    text: "KMT2D modifies histone H3 at lysine 4. This is not editing DNA letters; it is changing chromatin state.",
  },
  {
    title: "Chromatin becomes more permissive",
    text: "H3K4me1 is commonly associated with active enhancers and other active chromatin contexts.",
  },
  {
    title: "Developmental programs can run differently",
    text: "Because development depends on timing and dosage of many genes, KMT2D disruption can have broad effects.",
  },
];

const sections = [
  {
    id: "summary",
    title: "1. The minimum viable KMT2D model",
    label: "Core mental model",
    body: "KMT2D does not simply ‘make a Kabuki body part.’ It helps control gene activity by modifying chromatin. A damaging KMT2D variant can therefore change how many other genes are used during development, including in the brain, face, immune system, skeleton, heart, and other tissues.",
    verify: [
      ["Summary", deepLinks.summaries],
      ["Function", deepLinks.function],
      ["Expression", deepLinks.expression],
    ],
  },
  {
    id: "genomics",
    title: "2. The genomic address is only the starting point",
    label: "DNA location",
    body: "GeneCards places KMT2D on chromosome 12, band 12q13.12, at chr12:49,018,975–49,060,794 in GRCh38. The card also lists promoters and enhancers associated with the gene. For Kabuki families, that distinction matters: a problem can be in the protein-coding sequence, but regulatory regions can also affect how much, when, or where a gene is expressed.",
    verify: [
      ["Genomics", deepLinks.genomics],
      ["Transcripts", deepLinks.transcripts],
    ],
  },
  {
    id: "protein",
    title: "3. The protein is a machine with interpretable modules",
    label: "Protein domains",
    body: "KMT2D is a large protein. Its domains are not decorations; they help the protein recognize chromatin context, interact with other proteins, and carry out methyltransferase activity. The most parent-useful takeaway is that variants in different regions may plausibly disturb different parts of the protein’s job.",
    verify: [
      ["Domains", deepLinks.domains],
      ["Proteins", deepLinks.proteins],
    ],
  },
  {
    id: "kabuki",
    title: "4. Kabuki syndrome is a regulation problem, not a single-organ problem",
    label: "Disease relevance",
    body: "GeneCards connects KMT2D to Kabuki Syndrome 1. That connection is biologically sensible because KMT2D acts upstream of many gene-expression programs. The same regulatory logic helps explain why Kabuki can involve learning, growth, immune differences, heart findings, hearing, craniofacial development, and skeletal features rather than one isolated trait.",
    verify: [
      ["Disorders", deepLinks.disorders],
      ["Variants", deepLinks.variants],
      ["Expression", deepLinks.expression],
    ],
  },
  {
    id: "limits",
    title: "5. What the GeneCards page can and cannot tell you",
    label: "Trust boundary",
    body: "GeneCards is excellent for orientation: names, sources, domains, genome position, expression, variants, disorders, pathways. It is not a personalized medical interpretation tool. A family’s exact variant still needs clinical genetics interpretation, inheritance context, variant type, transcript choice, and phenotype correlation.",
    verify: [
      ["Sources", deepLinks.top],
      ["Variants", deepLinks.variants],
    ],
  },
];

function DomainStrip({ selected, setSelected }) {
  const colorFor = (tone) => ({
    blue: [palette.blue, palette.blueSoft],
    sage: [palette.sage, palette.sageSoft],
    ochre: [palette.ochre, palette.ochreSoft],
  }[tone]);

  return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">KMT2D protein: simplified domain map</h3>
            <p className="mt-1 text-sm text-slate-600">Click a module. Domain positions are conceptual, not a clinical variant map.</p>
          </div>
          <SourceLink href={deepLinks.domains}>verify domains</SourceLink>
        </div>
        <div className="relative h-20 rounded-xl border border-slate-300 bg-slate-50 p-3">
          <div className="absolute left-4 right-4 top-1/2 h-3 -translate-y-1/2 rounded-full bg-slate-300" />
          {domains.map((d, i) => {
            const [bg, soft] = colorFor(d.tone);
            const widths = [22, 20, 17];
            const lefts = [8, 41, 72];
            return (
                <button
                    key={d.name}
                    onClick={() => setSelected(i)}
                    className="absolute top-1/2 -translate-y-1/2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition hover:-translate-y-[55%]"
                    style={{ left: `${lefts[i]}%`, width: `${widths[i]}%`, background: selected === i ? bg : soft, borderColor: bg, color: selected === i ? "white" : palette.ink }}
                >
                  {d.name}
                </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">{domains[selected].span}</div>
            <div className="mt-1 font-semibold text-slate-900">{domains[selected].name}</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{domains[selected].parentMeaning}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{domains[selected].scientific}</p>
          </motion.div>
        </AnimatePresence>
      </div>
  );
}

function ChromatinDiagram() {
  return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">How KMT2D changes gene readiness</h3>
          <SourceLink href={deepLinks.function}>verify function</SourceLink>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {pathwaySteps.map((step, idx) => (
              <div key={step.title} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex h-12 items-center justify-center">
                  {idx === 0 && <div className="h-8 w-24 rounded-full border border-slate-500 bg-white"><div className="mx-auto mt-3 h-1 w-20 bg-slate-400" /></div>}
                  {idx === 1 && <div className="flex gap-2"><span className="rounded-full border bg-white px-2 py-1 text-xs">H3K4</span><span className="rounded-full border bg-white px-2 py-1 text-xs">CH₃</span></div>}
                  {idx === 2 && <div className="h-1 w-28 rounded bg-slate-400"><div className="h-1 w-12 rounded bg-slate-700" /></div>}
                  {idx === 3 && <div className="rounded-md border border-slate-500 bg-white px-4 py-2 text-xs font-semibold">gene easier to read</div>}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step {idx + 1}</div>
                <div className="mt-1 font-semibold text-slate-900">{step.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default function KMT2DGeneCard() {
  const [selectedDomain, setSelectedDomain] = useState(0);
  const [activeSection, setActiveSection] = useState("summary");
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter(s => `${s.title} ${s.label} ${s.body}`.toLowerCase().includes(q));
  }, [query]);

  const active = sections.find(s => s.id === activeSection) || sections[0];

  return (
      <div className="min-h-screen bg-[#f6f7f8] px-4 py-6 text-slate-900 md:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <Sparkles size={14} /> Kabuki parent learning card
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">KMT2D</h1>
                <p className="mt-3 text-xl text-slate-700">A dry, source-linked guide to the gene most often implicated in Kabuki syndrome type 1.</p>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">The goal is not to reproduce GeneCards. It is to convert the dense card into a parent-usable mental model: where the gene is, what the protein does, why chromatin matters, and where to verify each claim.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:w-80">
                <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><ShieldCheck size={18} /> Anti-hallucination design</div>
                <p className="leading-6">Every major section includes deep links back to GeneCards. Treat this page as an interpretive layer, not a substitute for the source card or genetic counseling.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SourceLink href={deepLinks.top}>GeneCards KMT2D</SourceLink>
                  <SourceLink href={deepLinks.summaries}>summaries</SourceLink>
                </div>
              </div>
            </div>
          </header>

          <main className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Essentials</h2>
                <div className="space-y-3">
                  {essentials.map((item) => (
                      <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">{item.label}</div>
                        <div className="mt-1 font-semibold text-slate-900">{item.value}</div>
                        <div className="mt-1 text-xs leading-5 text-slate-600">{item.note}</div>
                      </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SourceLink href={deepLinks.aliases}>aliases</SourceLink>
                  <SourceLink href={deepLinks.genomics}>genomics</SourceLink>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900"><Search size={16} /> Search this guide</label>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="try: enhancer, domain, variant, brain"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
                <div className="mt-4 space-y-2">
                  {filteredSections.map((s) => (
                      <button
                          key={s.id}
                          onClick={() => setActiveSection(s.id)}
                          className={`w-full rounded-xl border p-3 text-left text-sm transition ${activeSection === s.id ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                      >
                        <div className="text-xs opacity-75">{s.label}</div>
                        <div className="font-semibold">{s.title}</div>
                      </button>
                  ))}
                </div>
              </section>
            </aside>

            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {concepts.map((c) => {
                  const Icon = c.icon;
                  return (
                      <motion.article whileHover={{ y: -3 }} key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon size={20} /></div>
                        <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{c.plain}</p>
                        <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                          <summary className="cursor-pointer font-semibold text-slate-800">Scientific wording</summary>
                          <p className="mt-2 leading-6">{c.scientific}</p>
                        </details>
                        <div className="mt-4"><SourceLink href={c.link}>{c.linkText}</SourceLink></div>
                      </motion.article>
                  );
                })}
              </div>

              <motion.article layout className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><MousePointer2 size={14} /> Selected lesson</div>
                <AnimatePresence mode="wait">
                  <motion.div key={active.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className="text-sm font-semibold text-slate-500">{active.label}</div>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{active.title}</h2>
                    <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">{active.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {active.verify.map(([label, href]) => <SourceLink key={label} href={href}>verify: {label}</SourceLink>)}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.article>

              <div className="grid gap-6 xl:grid-cols-2">
                <DomainStrip selected={selectedDomain} setSelected={setSelectedDomain} />
                <ChromatinDiagram />
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Network size={14} /> Parent-oriented map</div>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-950">What to learn next from the GeneCards page</h2>
                  </div>
                  <SourceLink href={deepLinks.top}>open source card</SourceLink>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold">If your question is “what is this gene?”</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Start with summaries, aliases, and function. Learn that KMT2D is a chromatin-regulating enzyme before diving into variants.</p>
                    <div className="mt-3 flex flex-wrap gap-2"><SourceLink href={deepLinks.summaries}>summaries</SourceLink><SourceLink href={deepLinks.function}>function</SourceLink></div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold">If your question is “where is my child’s variant?”</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Use transcripts, proteins, domains, and variants, but avoid overinterpreting without a genetics team. Transcript choice can change numbering.</p>
                    <div className="mt-3 flex flex-wrap gap-2"><SourceLink href={deepLinks.transcripts}>transcripts</SourceLink><SourceLink href={deepLinks.variants}>variants</SourceLink></div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold">If your question is “why so many body systems?”</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Look at expression, pathways, and disorders. A regulatory gene can affect many tissues because many developmental programs depend on gene timing.</p>
                    <div className="mt-3 flex flex-wrap gap-2"><SourceLink href={deepLinks.expression}>expression</SourceLink><SourceLink href={deepLinks.pathways}>pathways</SourceLink></div>
                  </div>
                </div>
              </section>

              <footer className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
                <div className="flex items-start gap-3"><BookOpen className="mt-0.5" size={18} /><p><strong className="text-slate-900">Reading note:</strong> “histone methyltransferase” sounds like a narrow biochemical label, but for Kabuki it is the doorway into the larger idea: chromatin regulation. KMT2D helps set the accessibility landscape in which many other genes operate.</p></div>
              </footer>
            </section>
          </main>
        </div>
      </div>
  );
}
