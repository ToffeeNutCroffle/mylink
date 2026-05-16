"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

type Link = {
  id: string;
  title: string;
  url: string;
  icon: string;
  clickCount?: number;
};

type Profile = {
  username: string;
  displayName: string;
  bio: string;
  photoURL?: string;
  pageViews?: number;
};

export default function MyPage() {
  const { user, loading: authLoading, signOutUser } = useAuth();
  const router = useRouter();

  const [links, setLinks] = useState<Link[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 수정 관련 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editError, setEditError] = useState("");

  // 삭제 모달 관련 상태
  const [deletingLink, setDeletingLink] = useState<Link | null>(null);

  // 프로필 관련 상태
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const [linksSnap, profileSnap] = await Promise.all([
          getDocs(collection(db, `users/${user!.uid}/links`)),
          getDoc(doc(db, "users", user!.uid)),
        ]);

        const fetched = linksSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Link, "id">),
          clickCount: (d.data().clickCount as number | undefined) ?? 0,
        }));
        setLinks(fetched);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as Profile);
        }
      } catch (e) {
        console.error("데이터 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

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

    const docRef = await addDoc(collection(db, `users/${user!.uid}/links`), {
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

  function startEdit(link: Link) {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditError("");
  }

  async function handleUpdate(link: Link) {
    if (!editTitle.trim()) {
      setEditError("제목을 입력해주세요");
      return;
    }
    if (!editUrl.trim()) {
      setEditError("주소를 입력해주세요");
      return;
    }
    if (
      !editUrl.startsWith("http://") &&
      !editUrl.startsWith("https://") &&
      !editUrl.startsWith("mailto:")
    ) {
      setEditError("올바른 주소를 입력해주세요 (http:// 또는 https://로 시작)");
      return;
    }

    await updateDoc(doc(db, `users/${user!.uid}/links`, link.id), {
      title: editTitle,
      url: editUrl,
      updatedAt: serverTimestamp(),
    });
    setLinks(
      links.map((l) =>
        l.id === link.id ? { ...l, title: editTitle, url: editUrl } : l
      )
    );
    cancelEdit();
  }

  async function handleDelete(link: Link) {
    await deleteDoc(doc(db, `users/${user!.uid}/links`, link.id));
    setLinks(links.filter((l) => l.id !== link.id));
    setDeletingLink(null);
  }

  function startEditProfile() {
    if (!profile) return;
    setEditUsername(profile.username);
    setEditDisplayName(profile.displayName);
    setEditBio(profile.bio);
    setProfileError("");
    setEditingProfile(true);
  }

  function cancelEditProfile() {
    setEditingProfile(false);
    setProfileError("");
  }

  async function handleSaveProfile() {
    if (!editUsername.trim()) {
      setProfileError("사용자명을 입력해주세요");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(editUsername)) {
      setProfileError("사용자명은 영문 소문자, 숫자, 밑줄(_)만 사용 가능합니다");
      return;
    }
    if (!editDisplayName.trim()) {
      setProfileError("이름을 입력해주세요");
      return;
    }

    setProfileSaving(true);
    try {
      // username 중복 체크 (본인 제외)
      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", editUsername)
      );
      const usernameSnap = await getDocs(usernameQuery);
      const isDuplicate = usernameSnap.docs.some((d) => d.id !== user!.uid);
      if (isDuplicate) {
        setProfileError("이미 사용 중인 사용자명입니다");
        setProfileSaving(false);
        return;
      }

      await setDoc(doc(db, "users", user!.uid), {
        username: editUsername,
        displayName: editDisplayName,
        bio: editBio,
        photoURL: profile!.photoURL ?? "",
      });
      setProfile({ username: editUsername, displayName: editDisplayName, bio: editBio, photoURL: profile!.photoURL ?? "" });
      setEditingProfile(false);
    } catch (e) {
      console.error("프로필 저장 실패:", e);
      setProfileError("저장 중 오류가 발생했습니다");
    } finally {
      setProfileSaving(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-zinc-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <main className="w-full max-w-[480px] mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">내 링크 관리</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 truncate max-w-[120px]">
              {user.displayName ?? user.email}
            </span>
            <button
              onClick={signOutUser}
              className="text-xs font-bold px-3 py-1.5 border-[2px] border-black rounded-[6px] bg-white shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 프로필 섹션 */}
        <div className="bg-[#D1FAE5] rounded-[12px] border-[3px] border-black shadow-[6px_6px_0px_black] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-black">내 프로필</p>
            {!editingProfile && profile && (
              <button
                onClick={startEditProfile}
                className="text-xs font-bold px-2 py-1 border-[2px] border-black rounded-[6px] bg-white shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                수정
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-600">사용자명 (URL에 사용)</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-zinc-500 font-medium">mylink.app/</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase())}
                    placeholder="username"
                    className="flex-1 border-[2px] border-black rounded-[8px] px-3 py-2 text-sm font-medium bg-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-600">이름</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full border-[2px] border-black rounded-[8px] px-3 py-2 text-sm font-medium bg-white focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-600">소개글</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="간단한 소개를 입력해주세요"
                  rows={2}
                  className="w-full border-[2px] border-black rounded-[8px] px-3 py-2 text-sm font-medium bg-white focus:outline-none resize-none"
                />
              </div>
              {profileError && (
                <p className="text-xs font-bold text-red-600">{profileError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                  className="flex-1 h-9 bg-black text-white font-bold text-xs border-[2px] border-black shadow-[3px_3px_0px_#555] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-[6px] disabled:opacity-50"
                >
                  {profileSaving ? "저장 중..." : "저장"}
                </Button>
                <Button
                  onClick={cancelEditProfile}
                  className="flex-1 h-9 bg-white text-black font-bold text-xs border-[2px] border-black shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-[6px]"
                >
                  취소
                </Button>
              </div>
            </div>
          ) : profile ? (
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-lg font-bold text-black">{profile.displayName}</p>
                <p className="text-xs text-zinc-500">@{profile.username}</p>
              </div>
              {profile.bio && (
                <p className="text-sm text-zinc-600">{profile.bio}</p>
              )}
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 underline"
              >
                내 공개 페이지 보기 →
              </a>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">프로필을 불러오는 중...</p>
          )}
        </div>

        {/* 통계 섹션 */}
        {profile && (
          <div className="bg-[#E0E7FF] rounded-[12px] border-[3px] border-black shadow-[6px_6px_0px_black] p-6 flex flex-col gap-3">
            <p className="text-sm font-bold text-black">방문 통계</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👁</span>
              <p className="text-sm text-zinc-700">
                총 방문자{" "}
                <span className="font-bold text-black text-base">
                  {(profile.pageViews ?? 0).toLocaleString()}
                </span>
                명
              </p>
            </div>
            {links.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-xs font-bold text-zinc-500">링크별 클릭 수</p>
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between">
                    <p className="text-xs text-zinc-700 truncate max-w-[280px]">
                      {link.icon} {link.title}
                    </p>
                    <span className="text-xs font-bold text-black shrink-0 ml-2">
                      {(link.clickCount ?? 0).toLocaleString()}회
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            links.map((link) =>
              editingId === link.id ? (
                /* 편집 모드 */
                <div
                  key={link.id}
                  className="bg-[#DBEAFE] border-[2px] border-black rounded-[8px] px-4 py-3 shadow-[3px_3px_0px_black] flex flex-col gap-2"
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border-[2px] border-black rounded-[6px] px-3 py-1.5 text-sm font-medium bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full border-[2px] border-black rounded-[6px] px-3 py-1.5 text-sm font-medium bg-white focus:outline-none"
                  />
                  {editError && (
                    <p className="text-xs font-bold text-red-600">{editError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdate(link)}
                      className="flex-1 h-9 bg-black text-white font-bold text-xs border-[2px] border-black shadow-[3px_3px_0px_#555] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-[6px]"
                    >
                      저장
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      className="flex-1 h-9 bg-white text-black font-bold text-xs border-[2px] border-black shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-[6px]"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                /* 일반 모드 */
                <div
                  key={link.id}
                  className="flex items-center gap-3 bg-white border-[2px] border-black rounded-[8px] px-4 py-3 shadow-[3px_3px_0px_black]"
                >
                  <span>{link.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black truncate">{link.title}</p>
                    <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(link)}
                      className="text-xs font-bold px-2 py-1 border-[2px] border-black rounded-[6px] bg-[#FEF08A] hover:bg-yellow-300 shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setDeletingLink(link)}
                      className="text-xs font-bold px-2 py-1 border-[2px] border-black rounded-[6px] bg-[#FCA5A5] hover:bg-red-400 shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </main>

      {/* 삭제 확인 모달 */}
      {deletingLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white border-[3px] border-black rounded-[12px] shadow-[8px_8px_0px_black] p-6 w-full max-w-[320px] flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-4xl">🗑️</span>
              <p className="text-base font-bold text-black">정말 삭제하시겠습니까?</p>
              <p className="text-sm text-zinc-600">
                <span className="font-bold">"{deletingLink.title}"</span> 링크가 삭제됩니다
              </p>
              <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-[6px] px-3 py-1.5 w-full">
                ⚠️ 이 작업은 되돌릴 수 없습니다
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingLink(null)}
                className="flex-1 h-10 font-bold text-sm border-[2px] border-black rounded-[8px] bg-white shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deletingLink)}
                className="flex-1 h-10 font-bold text-sm border-[2px] border-black rounded-[8px] bg-red-500 text-white shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
