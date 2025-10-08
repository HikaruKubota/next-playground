# React 19 新フック・機能一覧

## 覚えておくべき新フック

### 1. `useActionState`
**用途**: Server Actionの状態管理

**従来の方法**:
```tsx
const [state, setState] = useState(null);
const [isPending, startTransition] = useTransition();

const handleSubmit = async (formData) => {
  startTransition(async () => {
    const result = await serverAction(formData);
    setState(result);
  });
};
```

**React 19**:
```tsx
const [state, formAction, isPending] = useActionState(serverAction, null);

// フォームから直接呼び出せる
<form action={formAction}>
```

**メリット**:
- フォーム送信の状態（pending/success/error）を一元管理
- ボイラープレートコードを削減
- Progressive Enhancement対応が簡単

---

### 2. `useOptimistic`
**用途**: 楽観的UI更新

**従来の方法**:
```tsx
const [data, setData] = useState(initialData);
const [isPending, startTransition] = useTransition();

const onSubmit = (newData) => {
  setData(newData); // 即座に更新

  startTransition(async () => {
    const result = await updateData(newData);
    if (!result.success) {
      setData(initialData); // 失敗時にロールバック
    }
  });
};
```

**React 19**:
```tsx
const [optimisticData, setOptimisticData] = useOptimistic(
  initialData,
  (currentState, newData) => newData
);

const onSubmit = (newData) => {
  startTransition(() => {
    setOptimisticData(newData);
    formAction(newData);
  });
};
// 自動的にロールバック/コミット処理
```

**メリット**:
- ロールバック処理が自動
- サーバーレスポンス前にUIを即座に更新
- ユーザー体験が向上

---

### 3. `use()`
**用途**: PromiseやContextを読み取る

**従来の方法**:
```tsx
// Promiseの場合
const [data, setData] = useState(null);
useEffect(() => {
  promise.then(setData);
}, []);

// Contextの場合
const value = useContext(MyContext);
```

**React 19**:
```tsx
// Promiseを直接読み取る
const data = use(promise);

// Contextも読み取れる（条件分岐内でも使える！）
if (condition) {
  const value = use(MyContext);
}
```

**メリット**:
- 条件分岐内やループ内でも使用可能（Hooksのルールの例外）
- Suspenseと自然に統合
- よりシンプルな非同期処理

**注意点**:
- `use()`はHooksのルールに従わない特別な関数
- Promiseは毎回同じインスタンスを渡す必要がある

---

### 4. `ref` as prop
**用途**: refをpropsとして直接渡せる

**従来の方法**:
```tsx
import { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

**React 19**:
```tsx
// forwardRef不要！
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

**メリット**:
- `forwardRef`が不要
- コードがシンプルに
- TypeScript型定義も簡単

---

## Server Actions（Next.js統合）

### `'use server'`ディレクティブ

**ファイル全体をServer Actionsに**:
```tsx
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name');
  // サーバーサイド処理
  await db.users.create({ name });
}
```

**関数単位でServer Actionsに**:
```tsx
export async function updateUser(id: string, data: UserData) {
  'use server';
  await db.users.update(id, data);
}
```

---

## その他の改善

### 1. Document Metadata
**従来**: `next/head`や`layout.tsx`でのみ設定可能

**React 19**:
```tsx
function Page() {
  return (
    <>
      <title>ページタイトル</title>
      <meta name="description" content="説明" />
      <link rel="canonical" href="https://example.com" />
      <h1>コンテンツ</h1>
    </>
  );
}
```

### 2. Context.Provider → Context
**従来**:
```tsx
<MyContext.Provider value={value}>
  {children}
</MyContext.Provider>
```

**React 19**:
```tsx
<MyContext value={value}>
  {children}
</MyContext>
```

### 3. `useDeferredValue` 初期値サポート
```tsx
// 初回レンダリング時の値を指定できる
const deferredValue = useDeferredValue(value, initialValue);
```

---

## 削除された機能

- ~~`useFormState`~~ → `useActionState`に改名
- ~~`useFormStatus`~~ → Server Actionsで代替

---

## まとめ: いつ使うか

| フック | 使うべき場面 |
|--------|-------------|
| `useActionState` | フォーム送信、Server Actions使用時 |
| `useOptimistic` | いいね、投稿、リアルタイム更新など即座の反応が必要な時 |
| `use()` | 非同期データの読み取り、条件付きContextの使用 |
| `ref` as prop | カスタムコンポーネントでrefを受け取る時 |

---

## サンプル実装箇所

- **`useActionState` + `useOptimistic`**: `/app/form-edit-sample/FormEditClient.tsx`
- **Server Actions**: `/app/form-edit-sample/actions.ts`
- **Server Components**: `/app/form-edit-sample/page.tsx`
