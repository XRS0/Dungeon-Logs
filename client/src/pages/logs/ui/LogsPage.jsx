import { useEffect, useRef, useState } from "react";
import { useLogs } from "../../../entities/log/model/useLogs";
import { ArrowDownWideNarrow, MoveDown, MoveUp, Search } from "lucide-react";
import LogsList from "../../../shared/ui/logs/LogsList";
import LogsSkeleton from "./LogsSkeleton";

const sortInitialState = {
  time: {
    label: "По времени",
    isActive: false,
    direction: "desc",
  },
  name: {
    label: "По исполнителю",
    isActive: false,
    direction: "desc",
  },
  level: {
    label: "По уровню",
    isActive: false,
    direction: "desc",
  },
}

export const LogsPage = () => {
  const { data, isFetchingNextPage } = useLogs(page);

  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(sortInitialState);

  const observerRef = useRef(null);
  const lastElementRef = useRef(null);

  useEffect(() => {
    if (isFetchingNextPage) return;
    if (observerRef.current) observerRef.current.disconnect();

    const observerCallback = (entries) => {
      if (entries[0].isIntersecting && page < data.totalPages) {
        setPage(page + 1);
      }
    }

    observerRef.current = new IntersectionObserver(observerCallback);
    observerRef.current.observe(lastElementRef.current);
  }, [isFetchingNextPage]);

  const handleSortChanges = (key, val) => {
    setSort({
      ...sortInitialState,
      [key]: {
        ...val, 
        isReversed: sort[key].isActive 
        && sort[key].direction === "desc" ? "asc" : "desc",
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
                    {val.label} {val.direction === "asc"
                      ? <MoveUp size={16} /> 
                      : <MoveDown size={16} />
                    }
                  </a>
              </li>
            ))}

            {isFetchingNextPage && LogsSkeleton}
          </ul>

          <li ref={lastElementRef} />
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
        {isFetchingNextPage && (
          <div className="h-24 animate-pulse rounded-2xl" />
        )}
        {!isFetchingNextPage && logs.length > 0 && (
          <LogsList logs={logs} />
        )}
        {!isFetchingNextPage && logs.length === 0 && (
          <div className="rounded-2xl bg-base-100 p-12 text-[#767676] text-center">
            Логов не наблюдается
          </div>
        )}
      </div>
    </div>
  );
};
