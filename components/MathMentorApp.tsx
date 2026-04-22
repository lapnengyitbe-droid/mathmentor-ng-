"use client";
import { useState, useRef } from "react";
import styles from "./MathMentorApp.module.css";
import LessonDisplay from "./LessonDisplay";

const SYSTEM_PROMPT = `You are MathMentor-NG, an expert AI mathematics education assistant developed by T-CEIPEC at the Federal University of Education, Pankshin, Nigeria. Your role is to generate complete, high-quality primary school mathematics lesson plans for Nigerian teachers.

PEDAGOGICAL TEMPLATE — Generate ALL 8 sections in this exact order:

## Section 1 — Lesson Information
Subject: Mathematics | Class Level | Topic | Duration | Term | Setting

## Section 2 — Prior Knowledge and Real-World Connections
- Prior Knowledge (2–3 sentences): What learners already know. Reference Nigerian everyday life.
- Real-World Connections: Minimum 3 examples tailored to setting.
  Urban: city markets, shops, transport, mobile money, electricity, pipe-borne water
  Rural: farming, livestock, village wells, crop harvests, firewood, local markets

## Section 3 — SMART Learning Objectives
Exactly 3 objectives. Each: Specific, Measurable, Achievable, Relevant, Time-bound. Start with action verb: identify, calculate, demonstrate, compare, solve.

## Section 4 — Materials Needed
4–6 items. ALL low-cost, locally available: bottle caps, pebbles, seeds, sticks, dried beans, naira coins, chalk, exercise books, cardboard.

## Section 5 — Lesson Plan Body
- Introduction (5–10 min): Hook (story, game, or Nigerian scenario) WITHOUT naming the topic.
- CRA Activities (main portion): STRICT sequence — present as a 3-column markdown table:
  | Concrete | Representational | Abstract |
  Concrete: pupils manipulate physical objects
  Representational: pupils draw/sketch diagrams
  Abstract: pupils work with numbers/symbols only
- Guided Discussion (1–2 sentences connecting the three CRA stages)
- Learners' Classroom Presentation (5 min): pupils present findings to the class

## Section 6 — Assessment (5–8 minutes)
3 applied, problem-based questions in real Nigerian contexts. No recall-only questions.

## Section 7 — Conclusion (5 minutes)
3–4 sentences: summarise takeaways, connect to real-world examples, transition to assignment.

## Section 8 — Home Assignment
ONE task: connects to home/community, no special materials needed, inquiry or project-based, suits class level, max 20 minutes.

CULTURAL RULES (mandatory):
- ALL examples must be Nigerian: markets (Bodija, Kurmi, Wuse, Terminus), foods (garri, yam, groundnut, moi-moi, egusi, suya), currency (naira, kobo), names (Emeka, Fatima, Bello, Ngozi, Danladi, Aisha, Chidi), places (Jos, Lagos, Kano, Enugu, Ibadan, Pankshin, Sokoto)
- Match examples to school setting (urban vs rural vs both)
- Write in clear, simple English for Nigerian primary school teachers
- CRA sequence: Concrete ALWAYS before Representational, Representational ALWAYS before Abstract

FORMAT: Use ## for section headings, ### for sub-headings, bullet points and numbered lists, a markdown table for CRA activities, **bold** for key terms. Keep language warm, practical, and teacher-friendly.

Generate the full lesson plan immediately and completely. Do not ask clarifying questions.`;

interface FormState {
  classLevel: string;
  topic: string;
  duration: string;
  term: string;
  setting: string;
}

const INITIAL_FORM: FormState = {
  classLevel: "", topic: "", duration: "", term: "", setting: "",
};

export default function MathMentorApp() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<FormState | null>(null);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const isValid = form.classLevel && form.topic.trim() && form.duration && form.term && form.setting;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    if (!isValid) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSubmitted({ ...form });

    const userMessage = `Please generate a complete MathMentor-NG lesson plan for:
- Class Level: ${form.classLevel}
- Mathematics Topic: ${form.topic}
- Lesson Duration: ${form.duration}
- School Term: ${form.term}
- School Setting: ${form.setting}

Generate the full lesson plan following all template instructions.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        }),
      });

      const data = await res.json();

      if (data.content?.[0]?.text) {
        setResult(data.content[0].text);
        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      } else if (data.error) {
        setError(`Error: ${data.error.message ?? "Something went wrong. Please try again."}`);
      } else {
        setError("No response received. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => window.print();

  const handleNew = () => {
    setResult(null);
    setError(null);
    setSubmitted(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.root}>
      <div className={styles.bgPattern} />
      <div className={styles.container}>

        {/* HEADER */}
        <header className={`${styles.header} no-print`}>
          <div className={styles.logoBadge}>
            <span className={styles.logoDot} />
            T-CEIPEC · FUE Pankshin
          </div>
          <h1 className={styles.title}>
            Math<span className={styles.titleAccent}>Mentor</span>-NG
          </h1>
          <p className={styles.subtitle}>
            AI-powered lesson plan generator for Nigerian primary school mathematics teachers.
            CRA-structured. Culturally responsive.
          </p>
          <p className={styles.meta}>
            Developed by Hemba · Gangtak · Gyitbe &nbsp;|&nbsp; Federal University of Education, Pankshin
          </p>
        </header>

        <div className={`${styles.divider} no-print`} />

        {/* FORM */}
        {!result && !loading && (
          <div className={`${styles.card} no-print`}>
            <div className={styles.cardTopLine} />
            <h2 className={styles.cardTitle}>Generate a Lesson Plan</h2>
            <p className={styles.cardDesc}>
              Fill in the five fields below. MathMentor-NG will generate a complete,
              culturally responsive lesson plan using the CRA method — ready to teach.
            </p>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="classLevel">Class Level</label>
                <select id="classLevel" name="classLevel" className={styles.select} value={form.classLevel} onChange={handleChange}>
                  <option value="">Select class…</option>
                  {["Primary 1","Primary 2","Primary 3","Primary 4","Primary 5","Primary 6"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="duration">Lesson Duration</label>
                <select id="duration" name="duration" className={styles.select} value={form.duration} onChange={handleChange}>
                  <option value="">Select duration…</option>
                  {["30 minutes","40 minutes","45 minutes","60 minutes"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="term">School Term</label>
                <select id="term" name="term" className={styles.select} value={form.term} onChange={handleChange}>
                  <option value="">Select term…</option>
                  {["First Term","Second Term","Third Term"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="setting">School Setting</label>
                <select id="setting" name="setting" className={styles.select} value={form.setting} onChange={handleChange}>
                  <option value="">Select setting…</option>
                  {["Urban","Rural","Both urban and rural"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label htmlFor="topic">Mathematics Topic</label>
                <input
                  id="topic"
                  name="topic"
                  className={styles.input}
                  placeholder="e.g. Fractions: introduction, Addition of two-digit numbers…"
                  value={form.topic}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className={styles.btn} onClick={handleGenerate} disabled={!isValid}>
              ✦ Generate Lesson Plan
            </button>

            {error && <div className={styles.error}>⚠ {error}</div>}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className={`${styles.card} no-print`}>
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Generating your lesson plan…</p>
              <p className={styles.loadingSub}>
                Applying CRA framework · Cultural responsiveness rules · Nigerian context
              </p>
            </div>
          </div>
        )}

        {/* OUTPUT */}
        {result && (
          <div className={`${styles.card} print-card`} ref={outputRef}>
            <div className={`${styles.outputHeader} no-print`}>
              <h2 className={styles.outputTitle}>Your Lesson Plan</h2>
              <span className={styles.badgeGreen}>
                <span className={styles.badgeDot} />
                Ready to teach
              </span>
            </div>

            {submitted && (
              <div className={`${styles.infoRow} no-print`}>
                {[submitted.classLevel, submitted.topic, submitted.duration, submitted.term, submitted.setting].map((v, i) => (
                  <span key={i} className={styles.pill}>{v}</span>
                ))}
              </div>
            )}

            <div className={styles.divider} />
            <LessonDisplay content={result} />

            <div className={`${styles.actions} no-print`}>
              <button className={styles.btnSecondary} onClick={handleCopy}>
                {copied ? "✓ Copied!" : "📋 Copy Text"}
              </button>
              <button className={styles.btnSecondary} onClick={handlePrint}>
                🖨 Print / Save PDF
              </button>
              <button className={styles.btnSecondary} onClick={handleNew}>
                ✦ New Lesson Plan
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className={`${styles.footer} no-print`}>
          MathMentor-NG is a research innovation of T-CEIPEC<br />
          Federal University of Education, Pankshin, Plateau State, Nigeria<br />
          Emmanuel Census Hemba · Nanpon Gangtak · Labnen Yoksina Gyitbe
        </footer>

      </div>
    </div>
  );
}
