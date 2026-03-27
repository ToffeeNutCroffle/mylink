export default function Home() {
  const skills = ["Unity", "C#", "C++"];

  const projects = [
    { name: "좁아터진 랜덤디펜스" },
    { name: "4C" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6 font-mono">
      <main className="w-full max-w-2xl py-16 flex flex-col gap-8">

        {/* 터미널 헤더 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-xs text-zinc-500">~/profile</span>
        </div>

        {/* 이름 */}
        <section>
          <p className="text-green-400 text-sm mb-1">$ whoami</p>
          <h1 className="text-2xl font-bold text-zinc-100">ToffeeNutCroffle</h1>
          <p className="text-zinc-500 text-sm mt-1"># 토피넛 크로플 · Game Developer</p>
        </section>

        {/* 기술 스택 */}
        <section>
          <p className="text-green-400 text-sm mb-3">$ cat skills.txt</p>
          <div className="flex gap-2 flex-wrap">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-zinc-800 text-green-300 border border-zinc-700 rounded px-3 py-1 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* 프로젝트 */}
        <section>
          <p className="text-green-400 text-sm mb-3">$ ls ./projects</p>
          <ul className="flex flex-col gap-2">
            {projects.map((project, index) => (
              <li key={project.name} className="text-sm text-zinc-300">
                <span className="text-zinc-600 mr-2">{String(index + 1).padStart(2, "0")}.</span>
                {project.name}
              </li>
            ))}
          </ul>
        </section>

        {/* GitHub 링크 */}
        <section>
          <p className="text-green-400 text-sm mb-3">$ open links</p>
          <a
            href="https://github.com/ToffeeNutCroffle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
          >
            github.com/ToffeeNutCroffle
          </a>
        </section>

        {/* 커서 */}
        <p className="text-green-400 text-sm">
          $ <span className="animate-pulse">▌</span>
        </p>

      </main>
    </div>
  );
}
