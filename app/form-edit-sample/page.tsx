import { Suspense } from 'react';
import { FormEditClient } from './FormEditClient';
import { fetchUserData } from './actions';

function FormSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function FormEditWrapper() {
  const userData = await fetchUserData();
  return <FormEditClient initialData={userData} />;
}

export default function FormEditSamplePage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <FormEditWrapper />
    </Suspense>
  );
}
