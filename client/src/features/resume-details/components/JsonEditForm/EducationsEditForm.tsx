import type { ResumeEducation } from '@/interface/resume';

import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { ErrorMessage,Field, FieldArray, Formik } from 'formik';
import { deepClone } from 'lib/deep-clone';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';


type EduField = 'school' | 'degree' | 'date' | 'gpa' | 'descriptions';

interface formFieldType {
  field: EduField;
  label: string;
}

const formFields: formFieldType[] = [
  { field: 'school', label: 'School' },
  { field: 'degree', label: 'Degree' },
  { field: 'date', label: 'Date' },
  { field: 'gpa', label: 'Gpa' },
];

const EducationsEditForm = ({ educations }: { educations: ResumeEducation[] }) => {
  const [edu, setEdu] = useState<ResumeEducation[]>([]);

  useEffect(() => {
    if (educations) {
      setEdu(deepClone(educations));
    }
  }, [educations]);

  const addEdu = () => {
    setEdu([...edu, { school: '', degree: '', date: '', gpa: '', descriptions: [] }]);
  };

  const updateDescription = (index: number, descIndex: number, value: any) => {
    const newEdu = [...edu];

    newEdu[index].descriptions[descIndex] = value;
    setEdu(newEdu);
  };

  const updateEdu = (index: number, field: EduField, value: any) => {
    const newEdu = [...edu];

    newEdu[index][field] = value;
    setEdu(newEdu);
  };

  const removeDescription = (index: number, descIndex: number) => {
    const newEdu = [...edu];

    newEdu[index].descriptions = newEdu[index].descriptions.filter((_, i) => i !== descIndex);
    setEdu(newEdu);
  };

  const addDescription = (index: number) => {
    const newEdu = [...edu];

    newEdu[index].descriptions.push('');
    setEdu(newEdu);
  };

  const removeEdu = (index: number) => {
    const newEdu = edu.filter((_, i) => i !== index);

    setEdu(newEdu);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted edu:', edu);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[600px] max-h-[650px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Education</DialogTitle>
          <DialogDescription>Make changes to your education here. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2 flex flex-col">
          <div className="flex flex-col gap-4">
            {edu.map((each, index) => (
              <div key={index} className='flex flex-col'>
                <div className="flex gap-2 items-center mb-2">
                  <h3 className="font-bold">Education {index + 1}</h3>
                  <Button variant="ghost" size="icon" onClick={() => removeEdu(index)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  {formFields.map((item, key) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label>{item.label}</Label>
                      <Input
                        value={each[item.field]}
                        onChange={e => updateEdu(index, item.field, e.target.value)}
                        className="w-[85%]"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 my-4">
                  {each.descriptions.map((description, descIndex) => (
                    <div key={descIndex} className="flex flex-col gap-2">
                      <Label>Description {descIndex + 1}</Label>
                      <div className="flex gap-2">
                        <Input
                          value={description}
                          onChange={e => updateDescription(index, descIndex, e.target.value)}
                        />
                        <Button variant="outline" size="icon" onClick={() => removeDescription(index, descIndex)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type='button' variant="secondary" className='w-fit mx-auto' onClick={() => addDescription(index)}>
                  Add Description
                </Button>
                <Separator className="my-3" />
              </div>
            ))}
          </div>
          <Button type='button' onClick={addEdu} className='w-fit mx-auto' variant='secondary'>
            Add Education
          </Button>
          <Button type="submit" className="w-[80px] ml-auto">
            Save
          </Button>
        </form>
        
      </DialogContent>
    </Dialog>
  );
};

export default EducationsEditForm;
