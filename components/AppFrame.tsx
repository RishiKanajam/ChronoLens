export default function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050607] text-[#f5f1e8]">
      {children}
    </div>
  );
}
