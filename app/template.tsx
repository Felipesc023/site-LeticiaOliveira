/** Re-mounts on every navigation (unlike layout.tsx), so this wrapper's
    entrance animation plays on each tab change. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
