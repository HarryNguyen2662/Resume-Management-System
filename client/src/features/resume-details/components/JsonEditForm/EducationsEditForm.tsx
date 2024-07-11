import type { ResumeEducation } from '@/interface/resume';

import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { deepClone } from 'lib/deep-clone';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// import * as Yup from 'yup';
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
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateEducationByIdMutation } from '@/services/apiSlice';

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

// const validationSchema = Yup.object({
//   educations: Yup.array().of(
//     Yup.object({
//       school: Yup.string().required('School is required'),
//       degree: Yup.string().required('Degree is required'),
//       date: Yup.string().required('Date is required'),
//       gpa: Yup.string().required('GPA is required'),
//       descriptions: Yup.array().of(Yup.string()),
//     }),
//   ),
// });

const EducationsEditForm = ({ educations }: { educations: ResumeEducation[] }) => {
  const [updateEducation, { isLoading }] = useUpdateEducationByIdMutation();
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<{ educations: ResumeEducation[] }>({
    educations: [],
  });

  const { toast } = useToast();

  useEffect(() => {
    if (educations) {
      setInitialValues({ educations: deepClone(educations) });
    }
  }, [educations]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
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

          <Formik
            initialValues={initialValues}
            enableReinitialize
            // validationSchema={validationSchema}
            onSubmit={async values => {
              if (!isLoading && id) {
                try {
                  await updateEducation({ educations: values.educations, id }).unwrap();
                  toast({
                    title: 'Successful!',
                    description: 'Education have been updated.',
                    className: 'bg-green-200',
                  });
                } catch (err) {
                  console.error('Failed to update education: ', err);
                  toast({
                    title: 'Failed!',
                    description: 'Failed to update education.',
                    className: 'bg-red-200',
                  });
                }
              }

              setOpen(false);
            }}
          >
            {({ values, handleChange, handleBlur }) => (
              <Form className="space-y-2 flex flex-col">
                <FieldArray name="educations">
                  {({ remove, push }) => (
                    <div className="flex flex-col gap-4">
                      {values.educations.map((_each, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex gap-2 items-center mb-2">
                            <h3 className="font-bold">Education {index + 1}</h3>
                            <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-col gap-2">
                            {formFields.map((item, key) => (
                              <div key={key} className="flex items-center justify-between">
                                <Label>{item.label}</Label>
                                <div className="flex flex-col w-[85%]">
                                  <Field
                                    name={`educations.${index}.${item.field}`}
                                    as={Input}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name={`educations.${index}.${item.field}`}
                                    component="span"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <FieldArray name={`educations.${index}.descriptions`}>
                            {({ remove, push }) => (
                              <div className="flex flex-col gap-4 my-4">
                                {values.educations[index].descriptions.map((_, descIndex) => (
                                  <div key={descIndex} className="flex flex-col gap-2">
                                    <Label>Description {descIndex + 1}</Label>
                                    <div className="flex gap-2">
                                      <Field
                                        name={`educations.${index}.descriptions.${descIndex}`}
                                        as={Input}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        type="button"
                                        onClick={() => remove(descIndex)}
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="w-fit mx-auto"
                                  onClick={() => push('')}
                                >
                                  Add Description
                                </Button>
                              </div>
                            )}
                          </FieldArray>
                          <Separator className="my-3" />
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => push({ school: '', degree: '', date: '', gpa: '', descriptions: [] })}
                        className="w-fit mx-auto"
                        variant="secondary"
                      >
                        Add Education
                      </Button>
                    </div>
                  )}
                </FieldArray>
                <Button type="submit" className="w-[80px] ml-auto">
                  Save
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default EducationsEditForm;
