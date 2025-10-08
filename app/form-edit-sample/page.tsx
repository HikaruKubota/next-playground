import { FormEditClient } from './FormEditClient';

type UserData = {
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  age: number;
  country: string;
  skills: { name: string }[];
  receiveNewsletter: boolean;
};

// Server Componentでデータ取得
async function fetchUserData(): Promise<UserData> {
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

export default async function FormEditSamplePage() {
  const userData = await fetchUserData();

  return <FormEditClient initialData={userData} />;
}
