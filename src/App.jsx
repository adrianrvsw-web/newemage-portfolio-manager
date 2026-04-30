import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Star,
  Trash2,
  Pencil,
  FolderKanban,
  Archive,
  ChevronDown,
  Check,
  X,
  Briefcase,
  Eye,
  Clipboard,
  Copy,
  ArrowUpDown,
} from "lucide-react";
import { supabase } from "./supabase";

const logoUrl = "/logo-newemage.svg";

const categoryConfig = {
  corporativo: { label: "Corporativo" },
  educacion: { label: "Educación" },
  ongs: { label: "ONGs" },
  plataformas: { label: "Plataformas Digitales" },
  ecommerce: { label: "E-commerce" },
  apps: { label: "Apps" },
  salud: { label: "Salud & Bienestar" },
  realestate: { label: "Real Estate" },
  financiero: { label: "Financiero & Legal" },
  saas: { label: "SaaS" },
  industria: { label: "Industria & Manufactura" },
};

const SERVICE_OPTIONS = [
  "Diseño Web",
  "Desarrollo Web",
  "UI-UX",
  "SEO",
  "Ecommerce",
  "WordPress",
  "Landing Page",
  "Desarrollo a la medida",
  "Data Visualization",
  "Branding",
  "Migración",
  "Mantenimiento",
  "Plataforma Web",
  "Catálogo",
  "Portal de Noticias",
  "Institucional",
  "Automatización",
  "Inteligencia Artificial",
];

const TECHNOLOGY_OPTIONS = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "React",
  "Next.js",
  "Angular",
  "Laravel",
  "PHP",
  "Python",
  "Django",
  "Node.js",
  "WordPress",
  "WooCommerce",
  "Elementor",
  "MySQL",
  "Bootstrap",
  "Tailwind",
  "Figma",
  "AWS",
  "DigitalOcean",
  "Supabase",
  "n8n",
];

const STATUS_OPTIONS = ["Publicado", "Pendiente", "Actualizar", "Archivado"];

const emptyProject = {
  name: "",
  category: "corporativo",
  status: "Pendiente",
  successCase: false,
  inPortfolio: true,
  client: "",
  link: "",
  services: [],
  technologies: [],
  description: "",
  detailed_description: "",
  year: "2026",
  lastReview: new Date().toISOString().slice(0, 10),
};

function cls(...parts) {
  return parts.filter(Boolean).join(" ");
}

function shellCard(extra = "") {
  return cls("rounded-2xl border border-[#20304e] bg-[#0c1730]", extra);
}

function buttonClass(variant = "secondary") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition border";
  const variants = {
    primary:
      "border-[#c56f2c] bg-[#c56f2c] text-white hover:bg-[#d17c39] hover:border-[#d17c39]",
    secondary:
      "border-[#2a3a59] bg-[#101d38] text-[#d8e3f7] hover:bg-[#142444]",
    danger:
      "border-[#3b2730] bg-[#1a1220] text-[#ff9fb0] hover:bg-[#25182b]",
    ghost:
      "border-transparent bg-transparent text-[#d8e3f7] hover:bg-[#142444]",
  };
  return `${base} ${variants[variant]}`;
}

function inputClass() {
  return "w-full rounded-xl border border-[#2a3a59] bg-[#101d38] px-3 py-2 text-sm text-[#eef4ff] outline-none placeholder:text-[#60708d] focus:border-[#3a4f75]";
}

function normalizeStatus(status) {
  if (status === "Revisar") return "Pendiente";
  if (status === "Oculto") return "Archivado";
  return status || "Pendiente";
}

function statusPillClass(status) {
  const normalizedStatus = normalizeStatus(status);
  const map = {
    Publicado: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    Pendiente: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    Actualizar: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    Archivado: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  };
  return map[normalizedStatus] || "border-[#29395a] bg-[#101d38] text-[#c7d3ea]";
}

function badgeClass(type = "default") {
  const map = {
    default: "border border-[#29395a] bg-[#101d38] text-[#c7d3ea]",
    successCase: "border-0 bg-[#3d2b13] text-[#ffca8a]",
  };
  return `inline-flex items-center rounded-full px-3 py-1 text-xs ${map[type]}`;
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cls(
        "relative h-6 w-11 rounded-full transition",
        checked ? "bg-[#c56f2c]" : "bg-[#243454]"
      )}
    >
      <span
        className={cls(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
          checked ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#243454] bg-[#071227] p-6 text-[#eef4ff]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className={buttonClass("ghost")} onClick={onClose}>
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MultiSelectChips({ label, options, values, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  const toggleValue = (item) => {
    onChange(values.includes(item) ? values.filter((v) => v !== item) : [...values, item]);
  };

  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f90ad]">
        {label}
      </label>

      {!!values.length && (
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleValue(item)}
              className="inline-flex items-center gap-2 rounded-full border border-[#243454] bg-[#101d38] px-3 py-1 text-xs text-[#d8e3f7]"
            >
              {item}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          className={`${inputClass()} flex items-center justify-between text-left`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={values.length ? "text-[#eef4ff]" : "text-[#60708d]"}>
            {values.length
              ? `${values.length} seleccionado${values.length === 1 ? "" : "s"}`
              : `Seleccionar ${label.toLowerCase()}`}
          </span>
          <ChevronDown size={16} className="text-[#8ea0bf]" />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-[#243454] bg-[#071227] p-3 shadow-2xl">
            <div className="mb-3 flex gap-2">
              <input
                className={inputClass()}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Buscar ${label.toLowerCase()}...`}
              />

              {!!values.length && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="rounded-xl border border-[#3b2730] bg-[#1a1220] px-3 text-xs font-medium text-[#ff9fb0] hover:bg-[#25182b]"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="max-h-52 overflow-auto pr-1">
              {filteredOptions.map((item) => {
                const active = values.includes(item);

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleValue(item)}
                    className={cls(
                      "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition last:mb-0",
                      active ? "bg-[#142444] text-white" : "text-[#c7d3ea] hover:bg-[#101d38]"
                    )}
                  >
                    <span>{item}</span>
                    {active ? (
                      <Check size={14} className="text-[#8fd3ff]" />
                    ) : (
                      <span className="h-4 w-4 rounded border border-[#2a3a59]" />
                    )}
                  </button>
                );
              })}

              {!filteredOptions.length && (
                <p className="px-3 py-4 text-center text-sm text-[#7f90ad]">
                  No hay resultados.
                </p>
              )}
            </div>

            <div className="mt-3 flex justify-end border-t border-[#20304e] pt-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={buttonClass("secondary")}
              >
                Listo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function downloadFile(filename, content, mime = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows) {
  const headers = [
    "name",
    "category",
    "status",
    "successCase",
    "inPortfolio",
    "client",
    "link",
    "services",
    "technologies",
    "description",
    "detailed_description",
    "year",
    "lastReview",
  ];

  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const newline = String.fromCharCode(10);

  const body = rows
    .map((row) =>
      headers
        .map((h) => escape(Array.isArray(row[h]) ? row[h].join(" | ") : row[h]))
        .join(",")
    )
    .join(newline);

  return headers.join(",") + newline + body;
}

function normalizeProject(project) {
  return {
    id: project.id,
    name: project.name ?? "",
    category: project.category ?? "corporativo",
    status: normalizeStatus(project.status),
    successCase: project.success_case ?? project.successCase ?? project.featured ?? false,
    inPortfolio: project.in_portfolio ?? project.inPortfolio ?? false,
    client: project.client ?? "",
    link: project.link ?? "",
    services: Array.isArray(project.services) ? project.services : [],
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    description: project.description ?? "",
    detailed_description: project.detailed_description ?? "",
    year: project.year ? String(project.year) : "",
    lastReview:
      project.last_review ?? project.lastReview ?? new Date().toISOString().slice(0, 10),
    createdAt: project.created_at ?? project.createdAt ?? "",
  };
}

function projectToDbPayload(project) {
  return {
    name: project.name,
    client: project.client,
    link: project.link || "",
    category: project.category,
    status: normalizeStatus(project.status),
    success_case: !!project.successCase,
    in_portfolio: !!project.inPortfolio,
    services: project.services || [],
    technologies: project.technologies || [],
    description: project.description || "",
    detailed_description: project.detailed_description || "",
    year: project.year ? Number(project.year) : null,
    last_review: project.lastReview || null,
  };
}

function projectPlainText(project) {
  const categoryLabel = categoryConfig[project.category]?.label || "Sin categoría";

  return [
    `Proyecto: ${project.name || ""}`,
    `Cliente: ${project.client || ""}`,
    `Categoría: ${categoryLabel}`,
    `Estado: ${project.status || ""}`,
    `En portafolio: ${project.inPortfolio ? "Sí" : "No"}`,
    `Caso de éxito: ${project.successCase ? "Sí" : "No"}`,
    `Año: ${project.year || ""}`,
    `Link: ${project.link || ""}`,
    `Servicios: ${(project.services || []).join(", ")}`,
    `Tecnologías: ${(project.technologies || []).join(", ")}`,
    "",
    "Descripción general:",
    project.description || "",
    "",
    "Descripción detallada:",
    project.detailed_description || "",
  ].join("\n");
}

function StatCard({ label, value }) {
  return (
    <div className={shellCard("flex min-h-[78px] items-center justify-center px-3 py-3 text-center")}>
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#7f90ad]">{label}</p>
        <p className="mt-2 text-[24px] font-semibold leading-none">{value}</p>
      </div>
    </div>
  );
}

function CopyButton({ value, label = "Copiar", onCopy }) {
  const hasValue = String(value ?? "").trim().length > 0;

  return (
    <button
      type="button"
      onClick={() => onCopy(value, label)}
      disabled={!hasValue}
      className={cls(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition",
        hasValue
          ? "border-[#2a3a59] bg-[#101d38] text-[#d8e3f7] hover:bg-[#142444]"
          : "cursor-not-allowed border-[#1c2a46] bg-[#0a1428] text-[#51617e]"
      )}
    >
      <Copy size={13} />
      {label}
    </button>
  );
}

function CopyField({ title, value, onCopy, multiline = false }) {
  const displayValue = Array.isArray(value) ? value.join(", ") : value || "—";
  const copyValue = displayValue === "—" ? "" : displayValue;

  return (
    <div className="rounded-2xl border border-[#20304e] bg-[#0c1730] p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f90ad]">
          {title}
        </p>
        <CopyButton value={copyValue} label="Copiar" onCopy={onCopy} />
      </div>

      <p
        className={cls(
          "text-sm leading-6 text-[#eef4ff]",
          multiline ? "whitespace-pre-wrap" : "break-words"
        )}
      >
        {displayValue}
      </p>
    </div>
  );
}

function ProjectDetailModal({ project, onClose }) {
  const [copied, setCopied] = useState("");

  if (!project) return null;

  const categoryLabel = categoryConfig[project.category]?.label || "Sin categoría";

  const copyText = async (value, label) => {
    const text = String(value ?? "");

    if (!text.trim()) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("No se pudo copiar con navigator.clipboard:", error);
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#243454] bg-[#071227] p-6 text-[#eef4ff] shadow-2xl">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-[#20304e] pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f90ad]">
              Vista completa
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{project.name}</h2>
            <p className="mt-1 text-sm text-[#8ea0bf]">
              {project.client || "Sin cliente"} · {categoryLabel} · {project.year || "Sin año"}
            </p>

            {copied && (
              <p className="mt-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                Copiado: {copied}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyText(projectPlainText(project), "todo el proyecto")}
              className={buttonClass("primary")}
            >
              <Clipboard size={16} />
              Copiar todo
            </button>

            <button type="button" className={buttonClass("ghost")} onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CopyField title="Nombre del proyecto" value={project.name} onCopy={copyText} />
          <CopyField title="Cliente" value={project.client} onCopy={copyText} />
          <CopyField title="Categoría" value={categoryLabel} onCopy={copyText} />
          <CopyField title="Estado" value={project.status} onCopy={copyText} />
          <CopyField title="En portafolio" value={project.inPortfolio ? "Sí" : "No"} onCopy={copyText} />
          <CopyField title="Caso de éxito" value={project.successCase ? "Sí" : "No"} onCopy={copyText} />
          <CopyField title="Año" value={project.year} onCopy={copyText} />
          <CopyField title="Link" value={project.link} onCopy={copyText} />
          <CopyField title="Servicios" value={project.services || []} onCopy={copyText} />
          <CopyField title="Tecnologías" value={project.technologies || []} onCopy={copyText} />
          <div className="md:col-span-2">
            <CopyField
              title="Descripción general"
              value={project.description}
              onCopy={copyText}
              multiline
            />
          </div>
          <div className="md:col-span-2">
            <CopyField
              title="Descripción detallada"
              value={project.detailed_description}
              onCopy={copyText}
              multiline
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleForm({ draft, setDraft, onSave, editing }) {
  const labelClass =
    "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f90ad]";

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Nombre del proyecto</label>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className={inputClass()}
          />
        </div>

        <div>
          <label className={labelClass}>Cliente</label>
          <input
            value={draft.client}
            onChange={(e) => setDraft({ ...draft, client: e.target.value })}
            className={inputClass()}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className={labelClass}>Categoría</label>
          <select
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className={inputClass()}
          >
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Estado</label>
          <select
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value })}
            className={inputClass()}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Año</label>
          <input
            value={draft.year}
            onChange={(e) => setDraft({ ...draft, year: e.target.value })}
            className={inputClass()}
          />
        </div>

        <div>
          <label className={labelClass}>Link</label>
          <input
            value={draft.link}
            onChange={(e) => setDraft({ ...draft, link: e.target.value })}
            className={inputClass()}
            placeholder="https://..."
          />
        </div>
      </div>

      <MultiSelectChips
        label="Servicios"
        options={SERVICE_OPTIONS}
        values={draft.services || []}
        onChange={(values) => setDraft({ ...draft, services: values })}
      />

      <MultiSelectChips
        label="Tecnologías"
        options={TECHNOLOGY_OPTIONS}
        values={draft.technologies || []}
        onChange={(values) => setDraft({ ...draft, technologies: values })}
      />

      <div>
        <label className={labelClass}>Descripción general</label>
        <textarea
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          className={`${inputClass()} min-h-[80px] resize-y`}
          placeholder="Resumen corto para cards/listados."
        />
      </div>

      <div>
        <label className={labelClass}>Descripción detallada</label>
        <textarea
          value={draft.detailed_description || ""}
          onChange={(e) => setDraft({ ...draft, detailed_description: e.target.value })}
          className={`${inputClass()} min-h-[140px] resize-y`}
          placeholder="Texto más amplio para página de proyecto, SEO o WordPress."
        />
      </div>

      <div className="grid gap-3 md:grid-cols-1">
        <div className={shellCard("flex items-center justify-between p-4")}>
          <span className="text-sm">Caso de éxito</span>
          <Toggle
            checked={draft.successCase}
            onChange={(v) => setDraft({ ...draft, successCase: v })}
          />
        </div>
      </div>

      <button onClick={onSave} className={`${buttonClass("primary")} h-11`}>
        {editing ? "Guardar cambios" : "Crear proyecto"}
      </button>
    </div>
  );
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyProject);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando proyectos:", error);
        setProjects([]);
      } else {
        setProjects((data || []).map(normalizeProject));
      }

      setLoading(false);
    }

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const term = search.toLowerCase();

      const matchesSearch =
        project.name.toLowerCase().includes(term) ||
        project.client.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.detailed_description.toLowerCase().includes(term) ||
        project.services.join(" ").toLowerCase().includes(term) ||
        project.technologies.join(" ").toLowerCase().includes(term);

      const matchesCategory =
        categoryFilter === "all" ||
        project.category === categoryFilter ||
        (categoryFilter === "success_cases" && project.successCase);

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortOrder === "year_desc") {
        return Number(b.year || 0) - Number(a.year || 0);
      }

      if (sortOrder === "year_asc") {
        return Number(a.year || 0) - Number(b.year || 0);
      }

      if (sortOrder === "az") {
        return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
      }

      if (sortOrder === "za") {
        return b.name.localeCompare(a.name, "es", { sensitivity: "base" });
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [projects, search, categoryFilter, sortOrder]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      published: projects.filter((p) => p.inPortfolio).length,
      successCases: projects.filter((p) => p.successCase).length,
    }),
    [projects]
  );

  const openCreate = () => {
    setEditingId(null);
    setDraft({
      ...emptyProject,
      services: [],
      technologies: [],
      description: "",
      detailed_description: "",
      lastReview: new Date().toISOString().slice(0, 10),
    });
    setDialogOpen(true);
  };

  const openEdit = (project) => {
    setEditingId(project.id);
    setDraft({
      ...project,
      successCase: project.successCase ?? false,
      status: normalizeStatus(project.status),
      client: project.client ?? "",
      link: project.link ?? "",
      services: Array.isArray(project.services) ? project.services : [],
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      description: project.description ?? "",
      detailed_description: project.detailed_description ?? "",
    });
    setDialogOpen(true);
  };

  const saveProject = async () => {
    if (!draft.name.trim()) return;

    setSaving(true);
    const payload = projectToDbPayload(draft);

    if (editingId) {
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        console.error("Error actualizando proyecto:", error);
        setSaving(false);
        return;
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? normalizeProject(data) : p))
      );
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error("Error creando proyecto:", error);
        setSaving(false);
        return;
      }

      setProjects((prev) => [normalizeProject(data), ...prev]);
    }

    setSaving(false);
    setDialogOpen(false);
    setDraft(emptyProject);
    setEditingId(null);
  };

  const updateProjectField = async (id, partial) => {
    const dbPartial = {};

    if ("status" in partial) dbPartial.status = partial.status;
    if ("successCase" in partial) dbPartial.success_case = partial.successCase;
    if ("inPortfolio" in partial) dbPartial.in_portfolio = partial.inPortfolio;

    const { data, error } = await supabase
      .from("projects")
      .update(dbPartial)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error actualizando campo:", error);
      return;
    }

    const normalized = normalizeProject(data);

    setProjects((prev) => prev.map((p) => (p.id === id ? normalized : p)));
    setSelectedProject((current) => (current && current.id === id ? normalized : current));
  };

  const togglePortfolio = async (project) => {
    const nextInPortfolio = !project.inPortfolio;
    const currentStatus = normalizeStatus(project.status);
    const nextStatus = nextInPortfolio
      ? currentStatus === "Archivado"
        ? "Publicado"
        : currentStatus
      : "Archivado";

    await updateProjectField(project.id, {
      inPortfolio: nextInPortfolio,
      status: nextStatus,
    });
  };

  const toggleSuccessCase = async (project) => {
    await updateProjectField(project.id, {
      successCase: !project.successCase,
    });
  };

  const changeStatus = async (project, nextStatus) => {
    const normalizedStatus = normalizeStatus(nextStatus);
    const nextInPortfolio = normalizedStatus === "Archivado" ? false : project.inPortfolio;

    await updateProjectField(project.id, {
      status: normalizedStatus,
      inPortfolio: nextInPortfolio,
    });
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Error eliminando proyecto:", error);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedProject((current) => (current && current.id === id ? null : current));
  };

  const exportCsv = () => downloadFile("newemage-portfolio.csv", toCsv(projects));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030a1a] text-white flex items-center justify-center">
        Cargando proyectos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030a1a] text-[#eef4ff]">
      <div className="h-[3px] w-full bg-[#f38b2a]" />

      <div className="grid min-h-[calc(100vh-3px)] grid-cols-1 xl:grid-cols-[246px_minmax(0,1fr)]">
        <aside className="border-r border-[#1c2a46] bg-[#040c1f]">
          <div className="border-b border-[#1c2a46] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#f39a2f] text-[#081224]">
                <img
                  src={logoUrl}
                  alt="Newemage"
                  className="h-7 w-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">newemage</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#667898]">
                  ERP Portafolio
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="rounded-xl border border-[#2c1f1b] bg-[rgba(73,29,22,0.45)] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a776f]">
                Resumen
              </p>
              <p className="mt-2 text-lg font-semibold text-[#f7b26e]">
                {stats.published} publicados
              </p>
            </div>
          </div>
        </aside>

        <main className="bg-[radial-gradient(circle_at_top,_rgba(14,30,68,0.8),_transparent_35%),linear-gradient(180deg,_#030a1a_0%,_#020816_100%)] p-5 md:p-8">
          <div className="mx-auto max-w-[1300px]">
            <div className="mb-6">
              <h1 className="text-[22px] font-semibold tracking-tight text-[#f5f8ff]">
                Portfolio Control
              </h1>
            </div>

            <section className={shellCard("p-5")}>
              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.75fr_0.75fr_0.8fr_auto]">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f90ad]">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#60708d]"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={`${inputClass()} pl-9`}
                      placeholder="Proyecto, cliente, descripción..."
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f90ad]">
                    Categoría / filtro
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={inputClass()}
                  >
                    <option value="all">Todas</option>
                    <option value="success_cases">Casos de éxito</option>
                    {Object.entries(categoryConfig).map(([key, cfg]) => (
                      <option key={key} value={key}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f90ad]">
                    Ordenar
                  </label>
                  <div className="relative">
                    <ArrowUpDown
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#60708d]"
                    />
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className={`${inputClass()} pl-9`}
                    >
                      <option value="newest">Más recientes</option>
                      <option value="oldest">Más antiguos</option>
                      <option value="year_desc">Año: más reciente</option>
                      <option value="year_asc">Año: más antiguo</option>
                      <option value="az">Nombre A-Z</option>
                      <option value="za">Nombre Z-A</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <StatCard label="Total" value={stats.total} />
                  <StatCard label="Portafolio" value={stats.published} />
                  <StatCard label="Casos de éxito" value={stats.successCases} />
                </div>

                <div className="flex items-end justify-end gap-2">
                  <button onClick={exportCsv} className={buttonClass("secondary")}>
                    <Archive size={16} /> CSV
                  </button>
                  <button onClick={openCreate} className={buttonClass("primary")}>
                    <Plus size={16} /> Agregar
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-6 space-y-4">
              {filteredProjects.map((project) => {
                const categoryLabel = categoryConfig[project.category]?.label || "Sin categoría";

                return (
                  <div key={project.id} className={shellCard("p-4")}>
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <FolderKanban size={15} className="text-orange-300" />
                          <h3 className="text-base font-semibold">{project.name}</h3>

                          {project.successCase && (
                            <span className={badgeClass("successCase")}>Caso de éxito</span>
                          )}

                          <div className="relative inline-flex">
                            <select
                              value={project.status}
                              onChange={(e) => changeStatus(project, e.target.value)}
                              className={`appearance-none rounded-full border px-3 py-1 pr-8 text-xs outline-none ${statusPillClass(project.status)}`}
                            >
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={12}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-80"
                            />
                          </div>
                        </div>

                        <p className="mt-1 text-sm text-[#8ea0bf]">
                          {project.client} · {categoryLabel} · {project.year}
                        </p>

                        {project.description && (
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c7d3ea]">
                            {project.description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap gap-2">
                          {(project.services || []).map((service) => (
                            <span
                              key={service}
                              className="rounded-full border border-[#243454] bg-[#101d38] px-3 py-1 text-xs text-[#c7d3ea]"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {(project.technologies || []).map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full border border-[#243454] bg-[#101d38] px-3 py-1 text-xs text-[#8fd3ff]"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>

                        {project.link && (
                          <div className="mt-3">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-[#8fd3ff] hover:underline"
                            >
                              Ver sitio
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <button
                          className={buttonClass("secondary")}
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye size={16} /> Ver completo
                        </button>

                        <button
                          className={cls(
                            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition border",
                            project.inPortfolio
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                              : "border-[#2a3a59] bg-[#101d38] text-[#d8e3f7] hover:bg-[#142444]"
                          )}
                          onClick={() => togglePortfolio(project)}
                        >
                          <Briefcase size={16} />
                          {project.inPortfolio ? "En portafolio" : "Agregar a portafolio"}
                        </button>

                        <button
                          className={cls(
                            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition border",
                            project.successCase
                              ? "border-[#c56f2c]/40 bg-[#c56f2c]/10 text-[#ffca8a] hover:bg-[#c56f2c]/15"
                              : "border-[#2a3a59] bg-[#101d38] text-[#d8e3f7] hover:bg-[#142444]"
                          )}
                          onClick={() => toggleSuccessCase(project)}
                        >
                          <Star size={16} />
                          {project.successCase ? "Caso de éxito" : "Poner en caso de éxito"}
                        </button>

                        <button
                          className={buttonClass("secondary")}
                          onClick={() => openEdit(project)}
                        >
                          <Pencil size={16} /> Editar
                        </button>

                        <button
                          className={buttonClass("danger")}
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredProjects.length === 0 && (
                <div className={shellCard("p-10 text-center text-[#7f90ad]")}>
                  No hay proyectos con esos filtros.
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingId ? "Editar proyecto" : "Nuevo proyecto"}
      >
        <SimpleForm
          draft={draft}
          setDraft={setDraft}
          onSave={saveProject}
          editing={Boolean(editingId)}
        />
        {saving && <p className="mt-4 text-sm text-[#8ea0bf]">Guardando...</p>}
      </Modal>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
