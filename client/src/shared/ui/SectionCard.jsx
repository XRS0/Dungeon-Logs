export const SectionCard = ({
  title,
  children
}) => {
  return (
    <section>
      <h1 className="text-[28px] font-semibold mb-3">{title}</h1>
      {children}
    </section>
  );
};
