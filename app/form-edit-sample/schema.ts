import { z } from 'zod';

export const userSchema = z.object({
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

export type UserFormData = z.infer<typeof userSchema>;
