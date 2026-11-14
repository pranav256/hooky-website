"use client";
import { useState } from "react";
import {
  ArrowDownToLine,
  Check,
  Crop,
  Film,
  Folder,
  FolderOpen,
  Radio,
  Save,
  Search,
  Settings2,
  Subtitles,
  X,
} from "lucide-react";
import Link from "next/link";
import { HookyMark } from "./brand";

const moments = [
  {
    title: "Make something worth watching",
    quote: "The best work starts when you stop waiting for permission.",
    time: "04:12",
    duration: "34s",
  },
  {
    title: "Get out of your own way",
    quote: "You don’t have to have it all figured out to begin.",
    time: "12:38",
    duration: "42s",
  },
  {
    title: "A different kind of perspective",
    quote: "Sometimes the next step is simply looking up.",
    time: "21:05",
    duration: "28s",
  },
];
type SampleProject = {
  id: number;
  name: string;
  selected: number;
  style: string;
  frame: string;
  topic: string;
  edits: Record<string, string>;
};
const starter: SampleProject = {
  id: 0,
  name: "Creative Mind · first cut",
  selected: 0,
  style: "bold",
  frame: "center",
  topic: "",
  edits: {},
};
const topicMatches = (topic: string) =>
  moments
    .map((m, i) => ({ m, i }))
    .filter(({ m }) =>
      topic
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => `${m.title} ${m.quote}`.toLowerCase().includes(word)),
    );

export function StudioDemo() {
  const [selected, setSelected] = useState(0),
    [style, setStyle] = useState("bold"),
    [frame, setFrame] = useState("center");
  const [active, setActive] = useState("studio"),
    [notice, setNotice] = useState(false);
  const [topicInput, setTopicInput] = useState(""),
    [topic, setTopic] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({}),
    [captionQuery, setCaptionQuery] = useState(""),
    [previewPhrase, setPreviewPhrase] = useState(0),
    [focusedPhrase, setFocusedPhrase] = useState<number | null>(null);
  const [projects, setProjects] = useState<SampleProject[]>([starter]),
    [projectId, setProjectId] = useState(0),
    [name, setName] = useState(starter.name),
    [projectMessage, setProjectMessage] = useState("");
  const matches = topicMatches(topic),
    moment = moments[selected];
  const phrases = [moment.title, moment.quote].map((original, i) => ({
    original,
    key: `${selected}-${i}`,
    text: edits[`${selected}-${i}`] ?? original,
    i,
  }));
  const visiblePhrases = phrases.filter(
    (phrase) =>
      phrase.i === focusedPhrase ||
      captionQuery
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => phrase.text.toLowerCase().includes(word)),
  );
  const invalidCaption = Object.values(edits).some((text) => !text.trim());
  const current = projects.find((p) => p.id === projectId);
  const changed =
    !current ||
    current.name !== name.trim() ||
    current.selected !== selected ||
    current.style !== style ||
    current.frame !== frame ||
    current.topic !== topic ||
    JSON.stringify(current.edits) !== JSON.stringify(edits);
  const saveProject = (asNew: boolean) => {
    if (!name.trim()) {
      setProjectMessage("Enter a project name before saving.");
      return;
    }
    if (invalidCaption) {
      setProjectMessage("Correct empty caption phrases before saving.");
      return;
    }
    const id = asNew ? projects.length : projectId;
    const project = {
      id,
      name: name.trim(),
      selected,
      style,
      frame,
      topic,
      edits: { ...edits },
    };
    setProjects(
      asNew
        ? [...projects, project]
        : projects.map((p) => (p.id === id ? project : p)),
    );
    setProjectId(id);
    setName(project.name);
    setProjectMessage(`Saved “${project.name}” for this page visit.`);
  };
  const openProject = (project: SampleProject) => {
    setProjectId(project.id);
    setName(project.name);
    setSelected(project.selected);
    setStyle(project.style);
    setFrame(project.frame);
    setTopic(project.topic);
    setTopicInput(project.topic);
    setEdits({ ...project.edits });
    setCaptionQuery("");
    setPreviewPhrase(0);
    setActive("studio");
    setNotice(false);
    setProjectMessage(`Opened “${project.name}”.`);
  };
  return (
    <div className="studio-demo">
      <div className="demo-titlebar">
        <div className="demo-brand">
          <HookyMark /> hooky <span>Studio</span>
        </div>
        <span className="demo-version">Interactive sample tour</span>
      </div>
      <div className="demo-shell">
        <aside className="demo-sidebar" aria-label="Sample Studio navigation">
          {[
            { id: "studio", label: "Clip editor", icon: Film },
            { id: "projects", label: "Projects", icon: FolderOpen },
            { id: "radar", label: "Channel radar", icon: Radio },
            { id: "gallery", label: "Your clips", icon: Folder },
            { id: "settings", label: "Settings", icon: Settings2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              aria-pressed={active === id}
              onClick={() => {
                setActive(id);
                setNotice(false);
              }}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
          <p className="demo-sidebar-note">
            Sample data.
            <br />
            No engine connected.
          </p>
        </aside>
        <div className="demo-main">
          {active === "studio" ? (
            <>
              <div className="demo-heading">
                <div>
                  <span className="eyebrow">Creative Mind / Episode 024</span>
                  <h3>Choose your cut.</h3>
                </div>
                <button
                  className="button button-accent button-small"
                  disabled={!matches.length || invalidCaption}
                  onClick={() => setNotice(true)}
                >
                  <ArrowDownToLine size={15} />
                  Export clip
                </button>
              </div>
              <div className="demo-source">
                <Film size={15} />
                <span>Sample YouTube interview</span>
                <span>32:18</span>
              </div>
              <form
                className="demo-topic"
                onSubmit={(event) => {
                  event.preventDefault();
                  const next = topicInput.trim();
                  setTopic(next);
                  const found = topicMatches(next);
                  if (found.length && !found.some(({ i }) => i === selected))
                    setSelected(found[0].i);
                  setCaptionQuery("");
                  setPreviewPhrase(0);
                  setNotice(false);
                }}
              >
                <div>
                  <label htmlFor="demo-topic">
                    Clip topic <span>(optional)</span>
                  </label>
                  <input
                    id="demo-topic"
                    value={topicInput}
                    maxLength={120}
                    onChange={(event) => setTopicInput(event.target.value)}
                    placeholder="Try “permission” or “perspective”"
                  />
                </div>
                <button
                  className="button button-outline button-small"
                  type="submit"
                >
                  <Search size={15} />
                  Detect sample hooks
                </button>
                <p>
                  Tour uses word matching. The installed engine uses Gemini with
                  a labeled word-match fallback.
                </p>
              </form>
              <div className="demo-workbench">
                <div className="demo-moments">
                  <div className="demo-panel-title">
                    Suggested moments <span>{matches.length}</span>
                  </div>
                  {matches.map(({ m, i }) => (
                    <button
                      key={m.title}
                      className={`moment-card ${selected === i ? "selected" : ""}`}
                      aria-pressed={selected === i}
                      onClick={() => {
                        setSelected(i);
                        setCaptionQuery("");
                        setPreviewPhrase(0);
                        setNotice(false);
                      }}
                    >
                      <span className="moment-info">
                        <strong>{m.title}</strong>
                        <span>
                          {m.time} · {m.duration}
                        </span>
                      </span>
                      {selected === i && <Check size={15} />}
                    </button>
                  ))}
                  {!matches.length && (
                    <div className="demo-empty" role="status">
                      <strong>No sample moments match.</strong>
                      <p>Try a broader topic or clear it.</p>
                      <button
                        className="text-action"
                        onClick={() => {
                          setTopic("");
                          setTopicInput("");
                        }}
                      >
                        Clear topic
                      </button>
                    </div>
                  )}
                  <p className="score-note">
                    Illustrative suggestions. AI scores in the real Studio do
                    not predict views.
                  </p>
                </div>
                <div className="demo-preview-area">
                  <div className="demo-panel-title">
                    Caption canvas <span>Sample 9:16</span>
                  </div>
                  {matches.length ? (
                    <div className={`demo-preview frame-${frame}`}>
                      <img
                        src="/images/portrait.jpg"
                        alt="Illustrative interview portrait"
                        width="1000"
                        height="1000"
                        loading="lazy"
                      />
                      <span className="demo-preview-tag">
                        <Crop size={12} />
                        {frame === "center" ? "Center crop" : "Canvas fit"}
                      </span>
                      <div className={`demo-caption caption-${style}`}>
                        {phrases[previewPhrase].text}
                      </div>
                    </div>
                  ) : (
                    <div className="demo-preview-empty">
                      Choose a matching moment to preview.
                    </div>
                  )}
                  <p className="demo-preview-note">
                    Illustration of styling. Inspect the real MP4 for final
                    timing and framing.
                  </p>
                </div>
                <div className="demo-inspector">
                  <div className="demo-panel-title">Framing &amp; captions</div>
                  <div className="demo-field-label">Framing</div>
                  <div
                    className="demo-segmented"
                    role="group"
                    aria-label="Sample framing"
                  >
                    {["center", "fit"].map((f) => (
                      <button
                        key={f}
                        aria-pressed={frame === f}
                        className={frame === f ? "active" : ""}
                        onClick={() => setFrame(f)}
                      >
                        {f === "center" ? "Center" : "Canvas fit"}
                      </button>
                    ))}
                  </div>
                  <div className="demo-field-label">
                    <Subtitles size={14} />
                    Caption style
                  </div>
                  {["bold", "clean", "yellow"].map((s) => (
                    <button
                      key={s}
                      className={`demo-style ${style === s ? "active" : ""}`}
                      aria-pressed={style === s}
                      onClick={() => setStyle(s)}
                    >
                      <span className={`style-sample sample-${s}`}>Aa</span>
                      <span>
                        {s === "bold"
                          ? "Bold pop"
                          : s === "clean"
                            ? "Clean line"
                            : "Yellow"}
                      </span>
                      {style === s && <Check size={14} />}
                    </button>
                  ))}
                  <div className="demo-output-spec">
                    <strong>Vertical MP4</strong>
                    <span>9:16 · No watermark</span>
                  </div>
                </div>
              </div>
              {matches.length > 0 && (
                <div className="demo-caption-editor">
                  <div className="demo-panel-title">
                    Correct the captions{" "}
                    <span>
                      {moment.time} · {moment.duration}
                    </span>
                  </div>
                  <label htmlFor="demo-caption-search">
                    Search caption phrases
                  </label>
                  <input
                    id="demo-caption-search"
                    type="search"
                    value={captionQuery}
                    onChange={(event) => setCaptionQuery(event.target.value)}
                    placeholder="Search this moment’s words"
                  />
                  {visiblePhrases.map(({ key, text, original, i }) => (
                    <div className="demo-phrase" key={key}>
                      <label htmlFor={`demo-phrase-${i}`}>
                        Caption phrase {i + 1}
                      </label>
                      <textarea
                        id={`demo-phrase-${i}`}
                        rows={2}
                        value={text}
                        maxLength={180}
                        onFocus={() => {
                          setPreviewPhrase(i);
                          setFocusedPhrase(i);
                        }}
                        onBlur={() => setFocusedPhrase(null)}
                        onChange={(event) =>
                          setEdits({ ...edits, [key]: event.target.value })
                        }
                      />
                      {!text.trim() && (
                        <p role="status">
                          Enter caption text or reset this phrase.
                        </p>
                      )}
                      {text !== original && (
                        <button
                          className="text-action"
                          onClick={() => {
                            const next = { ...edits };
                            delete next[key];
                            setEdits(next);
                          }}
                        >
                          Reset phrase {i + 1}
                        </button>
                      )}
                    </div>
                  ))}
                  {!visiblePhrases.length && (
                    <p role="status">
                      No caption phrases match.{" "}
                      <button
                        className="text-action"
                        onClick={() => setCaptionQuery("")}
                      >
                        Clear search
                      </button>
                    </p>
                  )}
                </div>
              )}
              <details className="demo-project">
                <summary>Save or open a sample project</summary>
                <div className="demo-project-body">
                  <div>
                    <label htmlFor="demo-project-name">Project name</label>
                    <input
                      id="demo-project-name"
                      value={name}
                      maxLength={120}
                      aria-describedby="demo-project-help"
                      onChange={(event) => {
                        setName(event.target.value);
                        setProjectMessage("");
                      }}
                    />
                  </div>
                  <div className="demo-project-actions">
                    <button
                      className="button button-outline button-small"
                      onClick={() => saveProject(false)}
                    >
                      <Save size={15} />
                      Save sample
                    </button>
                    <button
                      className="button button-outline button-small"
                      onClick={() => saveProject(true)}
                    >
                      Save as new
                    </button>
                    <button
                      className="button button-quiet button-small"
                      onClick={() => setActive("projects")}
                    >
                      <FolderOpen size={15} />
                      Open project
                    </button>
                  </div>
                  <p id="demo-project-help">
                    Sample saves last for this page visit. Installed Hooky saves
                    projects to your disk.
                  </p>
                  <p className="demo-project-status" role="status">
                    {changed
                      ? "Unsaved sample changes."
                      : "Sample matches saved project."}{" "}
                    {projectMessage}
                  </p>
                </div>
              </details>
            </>
          ) : active === "projects" ? (
            <div className="demo-project-list">
              <p className="eyebrow">Sample projects</p>
              <h3>Continue a cut.</h3>
              <p>
                Open a saved sample to restore its topic, moment, caption edits
                and style. Saves reset when this page reloads.
              </p>
              {projects.map((project) => (
                <div className="demo-project-card" key={project.id}>
                  <FolderOpen size={22} />
                  <div>
                    <strong>{project.name}</strong>
                    <span>
                      {moments[project.selected].time} · {project.style}{" "}
                      captions
                    </span>
                  </div>
                  <button
                    className="button button-outline button-small"
                    onClick={() => openProject(project)}
                    aria-label={`Open sample ${project.name}`}
                  >
                    Open sample
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="demo-alt">
              <p className="eyebrow">Inside the installed app</p>
              <h3>
                {active === "radar"
                  ? "Keep your sources close."
                  : active === "gallery"
                    ? "Your clips, ready to review."
                    : "Set your creative defaults."}
              </h3>
              <p>
                {active === "radar"
                  ? "Save a YouTube channel list and discover source videos to run through the local pipeline."
                  : active === "gallery"
                    ? "Preview rendered MP4 files, download a clip and find your output on disk."
                    : "Choose your AI model, subtitle presets, framing and render settings in the local app."}
              </p>
              <Link href="/docs#web-studio" className="text-action">
                Read the Studio guide →
              </Link>
              <button
                className="button button-outline"
                onClick={() => setActive("studio")}
              >
                Back to clip editor
              </button>
            </div>
          )}
          {notice && (
            <div className="demo-notice" role="status">
              <div>
                <strong>This is a sample tour.</strong>
                <p>
                  Install Hooky to analyze your footage and export a real clip.
                </p>
                <Link href="#install" className="text-action">
                  Get Hooky →
                </Link>
              </div>
              <button
                aria-label="Dismiss export message"
                onClick={() => setNotice(false)}
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="demo-statusbar">
        <span>Sample tour</span>
        <span>Install Hooky to work with your footage.</span>
      </div>
    </div>
  );
}
