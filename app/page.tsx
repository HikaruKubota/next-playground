import Link from "next/link";

const samples = [
  {
    title: "React Hook Form",
    description: "フォームバリデーションとステート管理のサンプル",
    href: "/form-sample",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js Playground
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            各種サンプルとテストページ
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((sample) => (
            <Link
              key={sample.href}
              href={sample.href}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {sample.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {sample.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
