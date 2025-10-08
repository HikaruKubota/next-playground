'use server';

import { userSchema, type UserFormData } from './schema';

// ユーザーデータ取得
export async function fetchUserData(): Promise<UserFormData> {
  // API呼び出しをシミュレート
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    username: 'johndoe',
    email: 'john.doe@example.com',
    displayName: 'John Doe',
    bio: 'フロントエンドエンジニアとして働いています。React、TypeScript、Next.jsが好きです。',
    age: 28,
    country: 'JP',
    skills: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Next.js' },
    ],
    receiveNewsletter: true,
  };
}

// ユーザーデータ更新（Server Action）
export async function updateUserData(data: UserFormData) {
  // バリデーション
  const validated = userSchema.parse(data);

  // API更新をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Updated user data:', validated);

  return {
    success: true,
    message: `ユーザー情報を更新しました！\n表示名: ${validated.displayName}`,
  };
}
