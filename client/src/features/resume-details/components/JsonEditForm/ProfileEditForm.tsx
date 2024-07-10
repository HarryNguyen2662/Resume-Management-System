import type { ResumeProfile } from '@/interface/resume';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  url: z.string(),
  summary: z.string(),
  location: z.string(),
});

interface formFieldType {
  field: 'name' | 'email' | 'phone' | 'url' | 'summary' | 'location';
  label: string;
}

const formFields: formFieldType[] = [
  { field: 'name', label: 'Name' },
  { field: 'email', label: 'Email' },
  { field: 'phone', label: 'Phone' },
  { field: 'url', label: 'Url' },
  { field: 'summary', label: 'Summary' },
  { field: 'location', label: 'Location' },
];

const ProfileEditForm = ({ profile }: { profile: ResumeProfile }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name ? profile.name : '',
      email: profile.email ? profile.email : '',
      phone: profile.phone ? profile.phone : '',
      url: profile.url ? profile.url : '',
      summary: profile.summary ? profile.summary : '',
      location: profile.location ? profile.location : '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
            <div className="flex flex-col gap-4">
              {formFields.map((item, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={item.field}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={item.label} {...field} className='w-[80%]' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit" className="w-[80px] ml-auto">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditForm;
