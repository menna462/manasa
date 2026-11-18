import Link from "next/link";

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0F1117] text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-[#161922] border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h1 className="text-6xl font-black text-[#FF6A00] mb-3">404</h1>
        <h2 className="text-xl font-bold mb-2">الصفحة غير موجودة</h2>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          عذراً، الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
