'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const userSchema = z.object({
  username: z.string()
    .min(3, 'ユーザー名は3文字以上で入力してください'),
  email: z.string()
    .includes('@', { message: '有効なメールアドレスを入力してください' }),
  displayName: z.string()
    .min(1, '表示名は必須です'),
  bio: z.string()
    .max(200, '自己紹介は200文字以内で入力してください')
    .optional(),
  age: z.number()
    .min(18, '18歳以上である必要があります')
    .max(120, '有効な年齢を入力してください'),
  country: z.string()
    .min(1, '国を選択してください'),
  skills: z.array(
    z.object({
      name: z.string().min(1, 'スキル名は必須です'),
    })
  ).min(1, '最低1つのスキルを入力してください'),
  receiveNewsletter: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

// 既存ユーザーデータをシミュレート
const fetchUserData = async (): Promise<UserFormData> => {
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
};

export default function FormEditSamplePage() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  useEffect(() => {
    // ユーザーデータを取得してフォームに設定
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const userData = await fetchUserData();
        reset(userData);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [reset]);

  const onSubmit = async (data: UserFormData) => {
    // API更新をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Updated user data:', data);
    alert(`ユーザー情報を更新しました！\n表示名: ${data.displayName}`);
    reset(data); // 更新後のデータで再設定（isDirtyをリセット）
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← トップに戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            ユーザー情報編集
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                ユーザー名
              </label>
              <input
                id="username"
                type="text"
                {...register('username')}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">ユーザー名は変更できません</p>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                表示名
              </label>
              <input
                id="displayName"
                type="text"
                {...register('displayName')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                年齢
              </label>
              <input
                id="age"
                type="number"
                {...register('age', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                国
              </label>
              <select
                id="country"
                {...register('country')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="JP">日本</option>
                <option value="US">アメリカ</option>
                <option value="UK">イギリス</option>
                <option value="CN">中国</option>
                <option value="KR">韓国</option>
                <option value="OTHER">その他</option>
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                自己紹介
              </label>
              <textarea
                id="bio"
                rows={4}
                {...register('bio')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="あなたについて教えてください"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                スキル
              </label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      {...register(`skills.${index}.name` as const)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="例: React, TypeScript"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="px-3 py-2 border border-red-300 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      削除
                    </button>
                  </div>
                ))}
                {errors.skills && typeof errors.skills.message === 'string' && (
                  <p className="text-sm text-red-600">{errors.skills.message}</p>
                )}
                {errors.skills && Array.isArray(errors.skills) && errors.skills.map((error, index) => (
                  error?.name && (
                    <p key={index} className="text-sm text-red-600">{error.name.message}</p>
                  )
                ))}
              </div>
              <button
                type="button"
                onClick={() => append({ name: '' })}
                className="mt-3 px-4 py-2 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 text-sm font-medium"
              >
                + スキルを追加
              </button>
            </div>

            {/* Newsletter */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="receiveNewsletter"
                  type="checkbox"
                  {...register('receiveNewsletter')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="receiveNewsletter" className="font-medium text-gray-700">
                  ニュースレターを受け取る
                </label>
                <p className="text-gray-500">新機能やお知らせをメールで受け取ります</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '更新中...' : '変更を保存'}
              </button>
              <button
                type="button"
                onClick={() => {
                  fetchUserData().then(reset);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                リセット
              </button>
            </div>

            {!isDirty && (
              <p className="text-sm text-gray-500 text-center">
                変更がありません
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
