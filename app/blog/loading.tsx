export default function Loading() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-20 md:py-24">
      <div className="skeleton h-3 w-32" />
      <div className="skeleton mt-4 h-11 w-3/4 max-w-2xl" />
      <div className="mt-10 flex gap-2">
        <div className="skeleton h-9 w-20" />
        <div className="skeleton h-9 w-32" />
        <div className="skeleton h-9 w-36" />
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border hairline">
            <div className="skeleton aspect-[16/9]" />
            <div className="space-y-3 p-8">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-6 w-full" />
              <div className="skeleton h-6 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
