export default function Loading() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
      <div className="skeleton h-3 w-40" />
      <div className="skeleton mt-6 h-12 w-3/4 max-w-2xl" />
      <div className="skeleton mt-3 h-12 w-2/3 max-w-xl" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="skeleton h-40" />
        <div className="skeleton h-40" />
        <div className="skeleton h-40" />
      </div>
    </div>
  );
}
