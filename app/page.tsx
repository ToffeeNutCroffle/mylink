export default function Home() {
  const skills = ["Unity", "C#", "C++"];

  const projects = [
    { name: "좁아터진 랜덤디펜스" },
    { name: "4C" },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <main className="w-full md:w-4/5 md:max-w-[480px] lg:w-[400px] mx-auto">

        {/* 프로필 카드 - Neobrutalism 스타일 */}
        <div className="bg-[#FEF08A] rounded-[12px] border-[3px] border-black shadow-[6px_6px_0px_black] p-8 flex flex-col items-center gap-6">

          {/* 프로필 이미지 */}
          <div className="w-[120px] h-[120px] rounded-full bg-zinc-300 border-[3px] border-black flex items-center justify-center text-3xl font-bold text-zinc-600">
            T
          </div>

          {/* 이름 */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black">ToffeeNutCroffle</h1>
            <p className="text-sm text-zinc-700 mt-1">토피넛 크로플 · Game Developer</p>
          </div>

          {/* 기술 스택 */}
          <div className="w-full">
            <p className="text-sm font-bold text-black mb-2">Skills</p>
            <div className="flex gap-2 flex-wrap">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-white border-[2px] border-black rounded px-3 py-1 text-sm font-bold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 프로젝트 */}
          <div className="w-full">
            <p className="text-sm font-bold text-black mb-2">Projects</p>
            <ul className="flex flex-col gap-2">
              {projects.map((project, index) => (
                <li key={project.name} className="text-sm text-black">
                  <span className="text-zinc-500 mr-2">{String(index + 1).padStart(2, "0")}.</span>
                  {project.name}
                </li>
              ))}
            </ul>
          </div>

          {/* GitHub 링크 */}
          <a
            href="https://github.com/ToffeeNutCroffle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-black underline underline-offset-4 hover:opacity-70"
          >
            github.com/ToffeeNutCroffle
          </a>

        </div>
      </main>
    </div>
  );
}
