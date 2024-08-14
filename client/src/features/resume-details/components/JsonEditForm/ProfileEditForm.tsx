import type { ResumeProfile } from '@/interface/resume';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil2Icon, ReloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateProfileByIdMutation } from '@/services/apiSlice';

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  url: z.string(),
  summary: z.string(),
  location: z.string(),
  role: z.string(),
  languages: z.string(),
});

interface formFieldType {
  field: 'name' | 'email' | 'phone' | 'url' | 'summary' | 'location' | 'role' | 'languages';
  label: string;
}

const formFields: formFieldType[] = [
  { field: 'name', label: 'Name' },
  { field: 'email', label: 'Email' },
  { field: 'phone', label: 'Phone' },
  { field: 'url', label: 'Url' },
  { field: 'summary', label: 'Summary' },
  { field: 'location', label: 'Location' },
  { field: 'role', label: 'Role' },
  { field: 'languages', label: 'Languages' },
];

const ProfileEditForm = ({ profile }: { profile: ResumeProfile }) => {
  const [updateProfile, { isLoading }] = useUpdateProfileByIdMutation();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name ? profile.name : '',
      email: profile.email ? profile.email : '',
      phone: profile.phone ? profile.phone : '',
      url: profile.url ? profile.url : '',
      summary: profile.summary ? profile.summary : '',
      location: profile.location ? profile.location : '',
      role: profile.role ? profile.role : '',
      languages: profile.languages ? profile.languages : '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoading && id) {
      try {
        await updateProfile({ profile: values, id }).unwrap();
        toast({
          title: 'Successful!',
          description: 'The profile have been updated.',
          className: 'bg-green-200',
        });
      } catch (err) {
        toast({
          title: 'Failed!',
          description: 'Failed to update profile.',
          className: 'bg-red-200',
        });
      }
    }

    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
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
                          <Input placeholder={item.label} {...field} className="w-[80%]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              {isLoading ? (
                <Button disabled className="w-fit ml-auto">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" className="w-fit ml-auto">
                  Save
                </Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default ProfileEditForm;
