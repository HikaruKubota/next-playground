import { Suspense } from 'react';
import { UserProfile } from './UserProfile';

// ユーザーデータをフェッチする関数
async function fetchUser(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
  };
}

// ユーザーの投稿をフェッチする関数
async function fetchPosts(userId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return [
    { id: '1', title: 'First Post', userId },
    { id: '2', title: 'Second Post', userId },
  ];
}

export default function UseSamplePage() {
  // ⚠️ 重要: Promiseはここで作成＝即座に実行開始される
  // await していなくても、バックグラウンドで並列実行される
  const userPromise = fetchUser('123');    // 1秒かかる処理が開始
  const postsPromise = fetchPosts('123');  // 1.5秒かかる処理が開始（待たない）
  // → 合計1.5秒で両方完了（並列実行）

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">use() Hook サンプル</h1>

        <div className="grid gap-6">
          <Suspense fallback={<Skeleton />}>
            <UserProfile userPromise={userPromise} postsPromise={postsPromise} />
          </Suspense>
        </div>

        {/* ⚠️ 注意: このパターンは実用性が低い */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ 正直な話</h3>
          <p className="text-sm text-yellow-800 mb-3">
            <strong>このケースならServer Componentで await した方が良いです。</strong>
          </p>
          <div className="bg-yellow-100 p-3 rounded text-xs font-mono text-yellow-900 overflow-x-auto">
            {`// ✅ 99%のケースはこれで十分
async function Page() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  return <Client user={user} posts={posts} />;
}`}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 use()が本当に必要な場面</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              <strong>1. 条件分岐内でデータ取得</strong>
              <pre className="bg-blue-100 p-2 rounded mt-1 text-xs overflow-x-auto">{`if (shouldFetch) {
  const data = use(promise); // Hooksのルール違反でもOK
}`}</pre>
            </li>
            <li>
              <strong>2. Client Componentでインタラクション + 非同期</strong>
              <pre className="bg-blue-100 p-2 rounded mt-1 text-xs overflow-x-auto">{`const data = use(promise);
const [expanded, setExpanded] = useState(false);
// クリックイベントなど使える`}</pre>
            </li>
            <li>
              <strong>3. Third-partyライブラリがPromiseを返す</strong>
            </li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">✅ 推奨: Server Componentを使う</h3>
          <p className="text-sm text-green-800 mb-2">
            このプロジェクトの <code className="bg-green-100 px-1 rounded">/form-edit-sample</code> を参照してください。
          </p>
          <p className="text-xs text-green-700">
            Server Componentで await してClient Componentに渡す方が、パフォーマンスもコードの明確さも優れています。
          </p>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}
