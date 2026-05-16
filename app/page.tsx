import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이링크 - 나만의 링크 페이지",
  description: "모든 링크를 한 곳에 모아 공유하세요",
  openGraph: {
    title: "마이링크 - 나만의 링크 페이지",
    description: "모든 링크를 한 곳에 모아 공유하세요",
    url: "https://mylink.vercel.app",
    images: [{ url: "https://mylink.vercel.app/opengraph-image", width: 1200, height: 630 }],
  },
};

const features = [
  {
    icon: "🔗",
    title: "링크 한 곳에 모으기",
    description: "소셜 미디어, 포트폴리오, 연락처 등 모든 링크를 하나의 페이지로",
  },
  {
    icon: "📊",
    title: "방문 통계 확인",
    description: "내 페이지 방문자 수와 링크별 클릭 수를 한눈에 파악",
  },
  {
    icon: "🌐",
    title: "나만의 고유 URL",
    description: "mylink.vercel.app/username 형식의 개인 링크 페이지 생성",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      <main className="w-full max-w-[480px] mx-auto flex flex-col gap-12">

        {/* 히어로 섹션 */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-[#FEF08A] border-[3px] border-black rounded-[16px] shadow-[6px_6px_0px_black] px-6 py-3">
            <h1 className="text-4xl font-black text-black">마이링크</h1>
          </div>
          <p className="text-lg font-bold text-zinc-600">
            모든 링크를 한 곳에 모아 공유하세요
          </p>
          <Link
            href="/login"
            className="inline-block bg-black text-white font-bold text-sm px-8 py-3 border-[3px] border-black rounded-[8px] shadow-[4px_4px_0px_#555] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            시작하기 →
          </Link>
        </div>

        {/* 피처 카드 */}
        <div className="flex flex-col gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_black] p-5 flex items-start gap-4"
            >
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <p className="font-bold text-black">{feature.title}</p>
                <p className="text-sm text-zinc-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <p className="text-xs text-center text-zinc-400">
          Google 계정으로 무료로 시작하세요
        </p>
      </main>
    </div>
  );
}
