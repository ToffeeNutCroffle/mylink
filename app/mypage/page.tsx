"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";

type Link = {
  id: string;
  title: string;
  url: string;
  icon: string;
};

const LINKS_PATH = "users/anonymous/links";

export default function MyPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const snapshot = await getDocs(collection(db, LINKS_PATH));
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Link, "id">),
        }));
        setLinks(fetched);
      } catch (e) {
        console.error("링크 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  async function handleAdd() {
    if (!title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }
    if (!url.trim()) {
      setError("주소를 입력해주세요");
      return;
    }
    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("mailto:")
    ) {
      setError("올바른 주소를 입력해주세요 (http:// 또는 https://로 시작)");
      return;
    }

    const docRef = await addDoc(collection(db, LINKS_PATH), {
      title,
      url,
      icon: "🔗",
      createdAt: serverTimestamp(),
    });
    setLinks([...links, { id: docRef.id, title, url, icon: "🔗" }]);
    setTitle("");
    setUrl("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <main className="w-full max-w-[480px] mx-auto flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-black">내 링크 관리</h1>

        {/* 링크 추가 폼 */}
        <div className="bg-[#FEF08A] rounded-[12px] border-[3px] border-black shadow-[6px_6px_0px_black] p-6 flex flex-col gap-4">
          <p className="text-sm font-bold text-black">링크 추가</p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="링크 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-[2px] border-black rounded-[8px] px-3 py-2 text-sm font-medium bg-white focus:outline-none"
            />
            <input
              type="text"
              placeholder="링크 주소 (https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border-[2px] border-black rounded-[8px] px-3 py-2 text-sm font-medium bg-white focus:outline-none"
            />
          </div>
          {error && <p className="text-sm font-bold text-red-600">{error}</p>}
          <Button
            onClick={handleAdd}
            className="w-full h-11 bg-black text-white font-bold text-sm border-[2px] border-black shadow-[4px_4px_0px_#555] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-[8px]"
          >
            + 추가하기
          </Button>
        </div>

        {/* 링크 목록 */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-black">링크 목록 ({links.length})</p>
          {loading ? (
            <p className="text-sm text-zinc-500">불러오는 중...</p>
          ) : links.length === 0 ? (
            <p className="text-sm text-zinc-500">아직 링크가 없어요. 추가해보세요!</p>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-3 bg-white border-[2px] border-black rounded-[8px] px-4 py-3 shadow-[3px_3px_0px_black]"
              >
                <span>{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black truncate">{link.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
