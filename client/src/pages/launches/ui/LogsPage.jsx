import { useState } from "react";
import { useLogs } from "../../../entities/log/model/useLogs";
import { ArrowDownWideNarrow, MoveDown, MoveUp, Search } from "lucide-react";
import LogsList from "../../../shared/ui/logs/LogsList";

const sortInitialState = {
  time: {
    label: "По времени",
    isActive: false,
    isReversed: false,
  },
  name: {
    label: "По исполнителю",
    isActive: false,
    isReversed: false,
  },
  level: {
    label: "По уровню",
    isActive: false,
    isReversed: false,
  },
}

export const LogsPage = () => {
  const { data, isLoading } = useLogs();

  const [value, setValue] = useState("");
  const [sort, setSort] = useState(sortInitialState);

  const handleSortChanges = (key, val) => {
    setSort({
      ...sortInitialState,
      [key]: {
        ...val, 
        isReversed: sort[key].isActive 
        && !sort[key].isReversed ? true : false,
        isActive: true
      }}
    );
  }

  const logs = data ?? [];

  return (
    <div className="flex flex-col gap-2 max-h-[99.9vh] overflow-hidden pt-8">
      <h1 className="text-[28px] font-semibold mb-3">Все логи</h1>

      <search className="flex items-center gap-3">
        <label className="input w-full max-w-3xl">
          <Search size={16} color="#767676" className="mb-0.5" />
          <input 
            type="search" 
            value={value}
            placeholder="Search"
            onChange={(e) => setValue(e.target.value)}
          />
        </label>

        <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-accent btn-square m-1">
            <ArrowDownWideNarrow />
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            {Object.entries(sort).map(([key, val]) => (
              <li 
                key={key}
                onClick={() => handleSortChanges(key, val)}>
                  <a className={`flex justify-between px-2 ${sort[key].isActive ? "text-accent bg-accent/10" : ""}`}>
                    {val.label} {val.isReversed 
                      ? <MoveUp size={16} /> 
                      : <MoveDown size={16} />
                    }
                  </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="filter">   
          <input className="btn btn-secondary rounded-xl btn-square" type="reset" value="✕"/>
          <input className="btn btn-info rounded-xl" type="radio" name="levels" aria-label="Info"/>
          <input className="btn btn-success rounded-xl" type="radio" name="levels" aria-label="Trace"/>
          <input className="btn btn-error rounded-xl" type="radio" name="levels" aria-label="Error"/>
          <input className="btn btn-warning rounded-xl" type="radio" name="levels" aria-label="Warning"/>
          <input className="btn btn-neutral rounded-xl" type="radio" name="levels" aria-label="Debuging"/>
        </form>
      </search>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="h-24 animate-pulse rounded-2xl" />
        )}
        {!isLoading && logs.length > 0 && (
          <LogsList logs={logs} />
        )}
        {!isLoading && logs.length === 0 && (
          <div className="rounded-2xl bg-base-100 p-12 text-[#767676] text-center">
            Логов не наблюдается
          </div>
        )}
      </div>
    </div>
  );
};
