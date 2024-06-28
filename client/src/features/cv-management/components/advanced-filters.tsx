import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface FilterTagProps {
  option: string;
  setFilterOptions: React.Dispatch<React.SetStateAction<string[]>>;
  filterOptions: string[];
}

const FilterTag = ({ option, setFilterOptions, filterOptions }: FilterTagProps) => {
  const handleDeleteOption = (option: string) => {
    setFilterOptions(filterOptions.filter(cur => cur !== option));
  };

  return (
    <Button
      onClick={() => handleDeleteOption(option)}
      className="rounded-3xl bg-gray-400 border-solid border-2 border-slate-300 hover:bg-gray-600"
    >
      {option} <Cross2Icon className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const AdvancedFilter = () => {
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');

  const handleAddClick = () => {
    setFilterOptions(filterOptions.concat(keyword));
    setKeyword('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Filter</Button>
      </DialogTrigger>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>Keyword</DialogTitle>
          <Separator className="my-4" />
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex w-full items-center space-x-2">
            <Input placeholder="Add a keyword" value={keyword} onChange={({ target }) => setKeyword(target.value)} />
            <Button onClick={handleAddClick}>Add</Button>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option, id) => {
              return (
                <FilterTag key={id} filterOptions={filterOptions} option={option} setFilterOptions={setFilterOptions} />
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setFilterOptions([])}>
              Clear
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
