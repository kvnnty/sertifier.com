'use client';

import { Suspense } from 'react';
import CertificateEditor from './CertificateEditor';


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CertificateEditor />
    </Suspense>
  );
}