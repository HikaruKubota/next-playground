# Next.js Playground

Next.js 15 + React 19の機能を試すためのプレイグラウンドプロジェクト

## Tech Stack

- **Next.js** 15.5.4 (App Router)
- **React** 19.1.0
- **TypeScript** 5.x (Strict mode)
- **Tailwind CSS** v4
- **React Hook Form** 7.x + Zod
- **Turbopack** (dev & build)

## Getting Started

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# Lint
pnpm lint
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## サンプル一覧

### 1. React Hook Form サンプル
`/form-sample`

- React Hook Form + Zodによるバリデーション
- 基本的なフォーム実装（新規登録フォーム）
- エラーハンドリング、送信状態管理

### 2. ユーザー情報編集フォーム
`/form-edit-sample`

- **Server Components** + **Server Actions**を使用したモダンな実装
- 既存データの編集（defaultValues使用例）
- `useFieldArray`による動的フィールド（スキル追加/削除）
- `useTransition`による楽観的UI更新
- Suspenseによるローディング境界
- `useEffect`を使わないデータ取得パターン

## プロジェクト構成

```
app/
├── page.tsx                    # トップページ（サンプル一覧）
├── form-sample/                # 基本的なフォームサンプル
│   └── page.tsx
└── form-edit-sample/           # モダンなフォーム実装
    ├── page.tsx                # Server Component (データ取得)
    ├── FormEditClient.tsx      # Client Component (フォームロジック)
    ├── actions.ts              # Server Actions
    └── schema.ts               # Zodスキーマ定義
```

## 特徴

- **useEffect不要**: Server Componentsでデータ取得
- **型安全**: TypeScript + Zod
- **Server Actions**: Next.js 15の最新パターン
- **Optimistic UI**: useTransitionによる即座のフィードバック
- **動的フィールド**: useFieldArrayによる配列フィールド管理
