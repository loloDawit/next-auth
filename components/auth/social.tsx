'use client';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';
const Social = () => {
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button className="w-full" variant="outline" size="lg" onClick={() => {}}>
        <FcGoogle className="w-f h-5" />
      </Button>
      <Button className="w-full" variant="outline" size="lg" onClick={() => {}}>
        <FaGithub className="w-f h-5" />
      </Button>
    </div>
  );
};

export default Social;
