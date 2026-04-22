"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/mypage");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-zinc-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] flex flex-col gap-8 items-center">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-black">내 링크 관리</h1>
          <p className="text-sm text-zinc-500">로그인하여 링크를 관리하세요</p>
        </div>
        <div className="w-full bg-[#FEF08A] rounded-[12px] border-[3px] border-black shadow-[6px_6px_0px_black] p-6">
          <Button
            onClick={signInWithGoogle}
            className="w-full h-12 bg-white text-black font-bold text-sm border-[2px] border-black shadow-[4px_4px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-[8px]"
          >
            Google로 로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
