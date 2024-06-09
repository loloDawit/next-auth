'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

interface BackButtonProps {
  label: string;
  href: string;
}

const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button variant="link" className="w-full font-normal" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
