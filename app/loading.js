export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-4 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#737373]">Memuat...</p>
      </div>
    </div>
  );
}
