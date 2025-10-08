'use client';

import { useActionState, useOptimistic, useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { updateUserData } from './actions';
import { userSchema, type UserFormData } from './schema';

type FormEditClientProps = {
  initialData: UserFormData;
};

export function FormEditClient({ initialData }: FormEditClientProps) {
  // React 19のuseActionStateを使用
  const [state, formAction, isPending] = useActionState(updateUserData, null);

  // React 19のuseOptimisticを使用（楽観的UI更新）
  const [optimisticData, setOptimisticData] = useOptimistic(
    initialData,
    (_currentState, newData: UserFormData) => newData
  );

  const [, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: optimisticData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  // フォーム送信時にOptimistic UIを更新
  const onSubmit = async (data: UserFormData) => {
    startTransition(() => {
      // 楽観的に即座にUIを更新
      setOptimisticData(data);

      // FormDataを作成してServer Actionに渡す
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('displayName', data.displayName);
      formData.append('bio', data.bio || '');
      formData.append('age', String(data.age));
      formData.append('country', data.country);
      formData.append('skills', JSON.stringify(data.skills));
      formData.append('receiveNewsletter', String(data.receiveNewsletter));

      // Server Actionを実行
      formAction(formData);
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ユーザー情報編集
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            React 19の<code className="bg-gray-100 px-1 rounded">useActionState</code>と
            <code className="bg-gray-100 px-1 rounded">useOptimistic</code>を使用
          </p>

          {state?.message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm whitespace-pre-line">{state.message}</p>
            </div>
          )}

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
                disabled={isPending}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? '更新中...' : '変更を保存'}
              </button>
            </div>

            {isPending && (
              <p className="text-sm text-blue-600 text-center animate-pulse">
                楽観的UIで即座に反映されます...
              </p>
            )}
          </form>

          {/* 説明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              🆕 React 19の新機能を使用
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <code className="bg-blue-100 px-1 rounded">useActionState</code> - Server Actionの状態管理</li>
              <li>• <code className="bg-blue-100 px-1 rounded">useOptimistic</code> - 楽観的UI更新（送信前に即座に反映）</li>
              <li>• フォーム送信時、サーバーレスポンス前にUIが更新されます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
