'use client';

import { use } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type Post = {
  id: string;
  title: string;
  userId: string;
};

type UserProfileProps = {
  userPromise: Promise<User>;
  postsPromise: Promise<Post[]>;
};

export function UserProfile({ userPromise, postsPromise }: UserProfileProps) {
  // ❌ これはできない（Client Componentはasyncにできない）
  // const user = await userPromise;

  // ✅ use()を使う（Client Componentで非同期データを扱える！）
  const user = use(userPromise);
  const posts = use(postsPromise);

  // ここからは普通のClient Component
  // useState, useEffect なども使える！

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-3">投稿一覧</h3>
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="p-3 bg-gray-50 rounded">
              <p className="font-medium">{post.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
        <p className="text-sm text-green-800">
          ✅ このコンポーネントはClient Componentですが、use()を使って非同期データを取得しています
        </p>
      </div>
    </div>
  );
}
