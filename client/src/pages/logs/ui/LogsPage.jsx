import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal } from "lucide-react";
import { SectionCard } from "~shared/ui";

const SAMPLE_TERRAFORM_LINES = [
  "terraform init",
  "Initializing the backend...",
  "Terraform has been successfully initialized!",
  "terraform plan -out=tfplan",
  "Refreshing Terraform state in-memory prior to plan...",
  "No changes. Infrastructure is up-to-date.",
  "terraform apply tfplan",
  "Apply complete! Resources: 0 added, 0 changed, 0 destroyed.",
  "Outputs:",
  "api_endpoint = https://api.daysi.local",
  "cluster_id   = daysi-prod-eu-1"
];

export const LogsPage = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const sendTest = () => {
    // Simulate streaming log lines
    let idx = 0;
    const id = setInterval(() => {
      setLines((prev) => [...prev, `$ ${SAMPLE_TERRAFORM_LINES[idx]}`]);
      idx += 1;
      if (idx >= SAMPLE_TERRAFORM_LINES.length) clearInterval(id);
    }, 300);
  };

  const footer = useMemo(
    () => (
      <button
        onClick={sendTest}
        className="btn btn-sm rounded-full border border-accent/60 bg-accent/15 text-accent hover:bg-accent/25"
      >
        Отправить тест-логи
      </button>
    ),
    []
  );

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold">Логи</h2>
        <p className="text-white/60">Поток текстовых событий в формате терминала.</p>
      </div>
      <SectionCard icon={<Terminal className="h-6 w-6" />} title="Terraform Console" actions={footer}>
        <div
          ref={containerRef}
          className="font-mono text-sm leading-6 max-h-[60vh] overflow-auto rounded-xl border border-interactive/40 bg-black/60 p-4 text-white/80 shadow-inner"
        >
          {lines.length === 0 ? (
            <p className="text-white/40">Нажмите «Отправить тест-логи», чтобы сэмулировать поток...</p>
          ) : (
            <pre className="whitespace-pre-wrap">{lines.join("\n")}</pre>
          )}
        </div>
      </SectionCard>
    </div>
  );
};
