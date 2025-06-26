import Link from 'next/link';

import React from 'react';

export default function Logo() {
  return (
    <div>
      <Link className="text-2xl cursor-pointer " href="/">
        Delivary<span className="font-bold text-yellow-500">Express</span>
      </Link>
    </div>
  );
}
