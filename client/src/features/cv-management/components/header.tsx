import { Input } from '@/components/ui/input';

import { AdvancedFilter } from './advanced-filters';

export const Header = () => {
  return (
    <div className="flex w-full mx-auto">
      <div className="flex flex-col gap-2 grow">
        <h1 className="font-bold text-4xl">CoderPush</h1>
        <div className="flex justify-between items-center">
          <p className="text-slate-400">List of resumes on the platform</p>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input placeholder="Search..." />
            <AdvancedFilter />
          </div>
        </div>
      </div>
    </div>
  );
};
