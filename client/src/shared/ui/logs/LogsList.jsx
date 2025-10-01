import LogItem from "./LogItem";

const LogsList = ({ logs }) => {
  return (
    <ul className="space-y-4">
      {logs.map((log, idx) => <LogItem key={idx} {...log} />)}
    </ul>
  );
}

export default LogsList;