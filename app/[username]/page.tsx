"use client";

import { use, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

type Link = {
  id: string;
  title: string;
  url: string;
  icon: string;
};

type Profile = {
  username: string;
  displayName: string;
  bio: string;
};

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // username으로 users 컬렉션에서 uid 검색
        const usersQuery = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const usersSnap = await getDocs(usersQuery);

        if (usersSnap.empty) {
          setNotFound(true);
          return;
        }

        const userDoc = usersSnap.docs[0];
        const uid = userDoc.id;
        setProfile(userDoc.data() as Profile);

        // 해당 uid의 링크 불러오기
        const linksSnap = await getDocs(collection(db, `users/${uid}/links`));
        const fetched = linksSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Link, "id">),
        }));
        setLinks(fetched);
      } catch (e) {
        console.error("데이터 불러오기 실패:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-zinc-500">불러오는 중...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🔍</span>
        <p className="text-xl font-bold text-black">존재하지 않는 페이지입니다</p>
        <p className="text-sm text-zinc-500">@{username} 사용자를 찾을 수 없어요</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <main className="w-full max-w-[480px] mx-auto flex flex-col gap-8">
        {/* 프로필 헤더 */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
            <span className="text-3xl text-white font-bold">
              {profile.displayName.slice(0, 1).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-black">{profile.displayName}</h1>
            <p className="text-sm text-zinc-500">@{profile.username}</p>
          </div>
          {profile.bio && (
            <p className="text-sm text-zinc-600 max-w-[320px]">{profile.bio}</p>
          )}
        </div>

        {/* 링크 목록 */}
        <div className="flex flex-col gap-3">
          {links.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center">아직 링크가 없어요</p>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white border-[2px] border-black rounded-[12px] px-5 py-4 shadow-[4px_4px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm font-bold text-black">{link.title}</span>
              </a>
            ))
          )}
        </div>

        {/* 푸터 */}
        <p className="text-xs text-center text-zinc-400">
          마이링크로 만들었어요 ✨
        </p>
      </main>
    </div>
  );
}
