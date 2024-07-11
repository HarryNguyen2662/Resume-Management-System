import { CaretDownIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

interface AdvancedFilterProps {
  setFilterOptions: React.Dispatch<React.SetStateAction<string[]>>;
  filterOptions: string[];
}

export const AdvancedFilter = ({ filterOptions, setFilterOptions }: AdvancedFilterProps) => {
  const [keyword, setKeyword] = useState('');

  const handleAddClick = () => {
    setFilterOptions(filterOptions.concat(keyword));
    setKeyword('');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='w-fit'>
          Filter <CaretDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]" align="end">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg">Keyword</h2>
            <Separator className="my-4" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex w-full items-center space-x-2">
              <Input placeholder="Add a keyword" value={keyword} onChange={({ target }) => setKeyword(target.value)} />
              <Button onClick={handleAddClick}>Add</Button>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option, id) => {
                return (
                  <FilterTag
                    key={id}
                    filterOptions={filterOptions}
                    option={option}
                    setFilterOptions={setFilterOptions}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 ml-auto">
            <Button variant="ghost" onClick={() => setFilterOptions([])}>
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
