export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-16 md:pt-24">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton mt-4 h-12 w-full" />
      <div className="skeleton mt-2 h-12 w-3/4" />
      <div className="skeleton mt-6 h-5 w-2/3" />
      <div className="skeleton mt-10 aspect-[16/9] w-full" />
      <div className="mt-14 space-y-4">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
      </div>
    </div>
  );
}
