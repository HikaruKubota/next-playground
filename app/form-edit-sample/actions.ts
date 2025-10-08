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
// useActionStateで使用するため、第一引数にprevStateを受け取る
export async function updateUserData(
  _prevState: { message: string } | null,
  formData: FormData
) {
  // FormDataから値を取得
  const rawData = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    displayName: formData.get('displayName') as string,
    bio: formData.get('bio') as string || undefined,
    age: Number(formData.get('age')),
    country: formData.get('country') as string,
    skills: JSON.parse(formData.get('skills') as string || '[]'),
    receiveNewsletter: formData.get('receiveNewsletter') === 'true',
  };

  try {
    // バリデーション
    const validated = userSchema.parse(rawData);

    // API更新をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Updated user data:', validated);

    return {
      message: `ユーザー情報を更新しました！\n表示名: ${validated.displayName}`,
    };
  } catch (error) {
    return {
      message: 'エラーが発生しました',
    };
  }
}
