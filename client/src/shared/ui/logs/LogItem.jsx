import { AlertTriangle, ArrowRight, Ban, Bug, Info } from "lucide-react";
import { formatTime } from "../../lib/date";

const levelIconMap = {
  error: <Ban />,
  warning: <AlertTriangle />,
  info: <Info />,
  trace: <ArrowRight />,
  debug: <Bug />
};

const levelToneMap = {
  error: "bg-error text-error-content",
  warning: "bg-warning text-warning-content",
  info: "bg-info text-info-content",
  trace: "bg-success text-success-content",
  debug: "bg-neutral text-neutral-content"
};

const LogItem = ({ id, level, message, timestamp, source: caller }) => {
  return (
    <li
      key={id}
      className="rounded-2xl bg-base-100 p-3"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4 text-primary-content">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${levelToneMap[level]}`}
          >
            {levelIconMap[level]}
          </span>
          <div>
            <p className="text-lg font-medium">{message}</p>

            <div className="flex gap-3">
              <p>{formatTime(timestamp)}</p>
              <span className="text-base-300">•</span>
              <p className="mt-1 text-sm">{caller}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default LogItem;