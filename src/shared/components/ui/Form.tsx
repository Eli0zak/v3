import { createContext, forwardRef, useContext, useId } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Controller, useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { Label } from './Label';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { RadioGroup } from './RadioGroup';
import { Switch } from './Switch';

const Form = createContext<{ id: string }>({ id: '' });

const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const id = useId();
  return <Form.Provider value={{ id }}>{children}</Form.Provider>;
};

const useFormField = () => {
  const fieldContext = useContext(Form);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormFieldContext = createContext<{ name: string }>({ name: '' });

const FormItemContext = createContext<{ id: string }>({ id: '' });

const FormField = ({ ...props }: { name: string; children: React.ReactNode }) => {
  const id = useId();

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <FormItemContext.Provider value={{ id }}>{props.children}</FormItemContext.Provider>
    </FormFieldContext.Provider>
  );
};

const FormItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    );
  }
);
FormItem.displayName = 'FormItem';

const FormLabel = forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

const FormInput = forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ ...props }, ref) => {
  const { name } = useFormField();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Input ref={ref} {...field} {...props} />}
    />
  );
});
FormInput.displayName = 'FormInput';

const FormTextarea = forwardRef<
  React.ElementRef<typeof Textarea>,
  React.ComponentPropsWithoutRef<typeof Textarea>
>(({ ...props }, ref) => {
  const { name } = useFormField();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Textarea ref={ref} {...field} {...props} />}
    />
  );
});
FormTextarea.displayName = 'FormTextarea';

const FormSelect = forwardRef<
  React.ElementRef<typeof Select>,
  React.ComponentPropsWithoutRef<typeof Select>
>(({ ...props }, ref) => {
  const { name } = useFormField();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Select ref={ref} {...field} {...props} />}
    />
  );
});
FormSelect.displayName = 'FormSelect';

const FormCheckbox = forwardRef<
  React.ElementRef<typeof Checkbox>,
  React.ComponentPropsWithoutRef<typeof Checkbox>
>(({ ...props }, ref) => {
  const { name } = useFormField();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Checkbox ref={ref} {...field} {...props} />}
    />
  );
});
FormCheckbox.displayName = 'FormCheckbox';

const FormRadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroup>,
  React.ComponentPropsWithoutRef<typeof RadioGroup>
>(({ ...props }, ref) => {
  const { name } = useFormField();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <RadioGroup ref={ref} {...field} {...props} />}
    />
  );
});
FormRadioGroup.displayName = 'FormRadioGroup';

const FormSwitch = forwardRef<
  React.ElementRef<typeof Switch>,
  React.ComponentPropsWithoutRef<typeof Switch>
>(({ ...props }, ref) => {
  const { name } = useFormField();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Switch ref={ref} {...field} {...props} />}
    />
  );
});
FormSwitch.displayName = 'FormSwitch';

export {
  Form,
  FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadioGroup,
  FormSwitch,
}; 