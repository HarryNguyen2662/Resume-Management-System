import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const AdvancedFilter = () => {
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
        <div className="flex w-full items-center space-x-2">
          <Input placeholder="Add a keyword" />
          <Button>Add</Button>
        </div>
        <Separator />
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
