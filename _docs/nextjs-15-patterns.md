# Next.js 15 + React 19 ベストプラクティス

## アーキテクチャパターン

### Server Components vs Client Components

#### Server Components（デフォルト）
```tsx
// app/page.tsx
async function Page() {
  const data = await fetchData(); // サーバーで実行
  return <Client data={data} />;
}
```

**メリット**:
- データベース直接アクセス
- 環境変数にアクセス可能
- バンドルサイズ削減
- SEO最適化

**使うべき場面**:
- データフェッチ
- 静的コンテンツ
- サーバーサイド処理

#### Client Components（`'use client'`）
```tsx
'use client';

function Interactive() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**使うべき場面**:
- インタラクティブ性が必要
- ブラウザAPIを使用（localStorage、など）
- React Hooksを使用

---

## データフェッチパターン

### パターン1: Server Componentで取得 → Client Componentに渡す

```tsx
// app/users/page.tsx (Server Component)
async function UsersPage() {
  const users = await fetchUsers(); // サーバーで実行
  return <UserList initialUsers={users} />; // Clientに渡す
}

// components/UserList.tsx (Client Component)
'use client';

function UserList({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  // クライアントサイドで状態管理
}
```

**メリット**:
- 初回レンダリングが速い
- useEffect不要
- SEO対応

---

### パターン2: Server Actions + useActionState

```tsx
// actions.ts
'use server';

export async function createPost(prevState, formData) {
  const title = formData.get('title');
  const post = await db.posts.create({ title });
  return { success: true, post };
}

// CreatePost.tsx
'use client';

function CreatePost() {
  const [state, formAction, isPending] = useActionState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={isPending}>作成</button>
      {state?.success && <p>投稿完了！</p>}
    </form>
  );
}
```

**メリット**:
- Progressive Enhancement
- 型安全
- エラーハンドリングが簡単

---

### パターン3: Suspenseでストリーミング

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>ダッシュボード</h1>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
      <FastComponent />
    </div>
  );
}

async function SlowComponent() {
  const data = await slowFetch(); // 時間がかかる処理
  return <div>{data}</div>;
}
```

**メリット**:
- 部分的なストリーミング
- UX向上（ページ全体の読み込みを待たない）
- ローディング状態の管理が簡単

---

## フォーム処理パターン

### パターンA: React Hook Form + Zod + Server Actions

```tsx
// schema.ts
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// actions.ts
'use server';

export async function updateUser(prevState, formData) {
  const data = userSchema.parse(Object.fromEntries(formData));
  await db.users.update(data);
  return { success: true };
}

// Form.tsx
'use client';

function Form() {
  const [state, formAction] = useActionState(updateUser, null);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formAction(formData);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

---

### パターンB: 楽観的UI更新

```tsx
'use client';

function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useOptimistic(
    initialLikes,
    (current, increment) => current + increment
  );

  const handleLike = async () => {
    startTransition(() => {
      setLikes(1); // 即座にUI更新
      likePost(postId); // Server Action
    });
  };

  return <button onClick={handleLike}>♥ {likes}</button>;
}
```

---

## ファイル構成パターン

### 推奨構成

```
app/
├── (routes)/
│   ├── page.tsx              # Server Component
│   ├── ClientComponent.tsx   # Client Component
│   ├── actions.ts            # Server Actions
│   └── schema.ts             # Validation Schema
├── components/               # 共有コンポーネント
│   ├── ui/                   # UIコンポーネント
│   └── forms/                # フォームコンポーネント
└── lib/                      # ユーティリティ
    ├── db.ts
    └── utils.ts
```

### ルール
- Server Actions: `actions.ts`に集約
- Validation: `schema.ts`でZodスキーマ定義
- Client Component: ファイル名を明示的に（例: `FormClient.tsx`）

---

## パフォーマンス最適化

### 1. Dynamic Import
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

### 2. Image最適化
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="説明"
  width={500}
  height={300}
  priority // LCP用
/>
```

### 3. Metadata
```tsx
// app/page.tsx
export const metadata = {
  title: 'タイトル',
  description: '説明',
  openGraph: {
    title: 'OGタイトル',
    description: 'OG説明',
  },
};
```

---

## アンチパターン（避けるべき）

### ❌ Client ComponentでuseEffectでデータフェッチ
```tsx
// 悪い例
'use client';

function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  if (!data) return <Loading />;
  return <div>{data}</div>;
}
```

### ✅ Server Componentでデータフェッチ
```tsx
// 良い例
async function Page() {
  const data = await fetchData();
  return <Client initialData={data} />;
}
```

---

### ❌ 全てをClient Componentにする
```tsx
// 悪い例
'use client';

function Page() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
```

### ✅ Server/Client を適切に分離
```tsx
// 良い例（Server Component）
function Page() {
  return (
    <div>
      <Header />
      <InteractiveContent /> {/* これだけClient */}
      <Footer />
    </div>
  );
}
```

---

## チェックリスト

- [ ] Server Componentをデフォルトに
- [ ] useEffectでのデータフェッチを避ける
- [ ] Server Actionsでフォーム処理
- [ ] Suspenseでローディング管理
- [ ] 動的インポートで大きなコンポーネントを遅延読み込み
- [ ] Metadataを適切に設定
- [ ] useOptimisticで即座のフィードバック
