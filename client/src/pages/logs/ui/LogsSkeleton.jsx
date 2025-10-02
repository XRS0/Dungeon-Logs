const LogsSkeleton = () => {
  return (
    <>
      {[...Array(8)].map((_, idx) => (
        <li key={idx} className="skeleton h-32 w-full"></li>
      ))}
    </>

  );
}

export default LogsSkeleton;