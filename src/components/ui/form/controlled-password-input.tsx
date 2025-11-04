'use client';

import { Eye, EyeOff, Info } from 'lucide-react';
import { useState } from 'react';
import {
  type FieldPath,
  type FieldValues,
  useFormContext,
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

type ControlledPasswordInputProps<TFormValues extends FieldValues> = {
  name: FieldPath<TFormValues>;
  containerClassName?: string;
  label?: string;
  className?: string;
  placeholder?: string;
  hideInstructions?: boolean;
};

export const ControlledPasswordInput = <TFormValues extends FieldValues>({
  className,
  name,
  containerClassName,
  label,
  placeholder,
  hideInstructions,
}: ControlledPasswordInputProps<TFormValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext<TFormValues>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex h-fit w-full flex-col space-y-2',
            containerClassName,
          )}
        >
          {label && (
            <div className='flex items-start gap-1.5'>
              <FormLabel className='text-sm font-medium text-slate-300'>
                {label}
              </FormLabel>

              {!hideInstructions && (
                <Tooltip>
                  <TooltipTrigger type='button'>
                    <Info className='shrink-0 text-muted-foreground/70 hover:text-muted-foreground transition-colors' size={16} />
                  </TooltipTrigger>
                  <TooltipContent align='start' alignOffset={10}>
                    <div className='max-w-xs text-xs font-light'>
                      <span className=''>Your password:</span>
                      <ul className='list-disc pl-4'>
                        <li>must be at least 8 characters long.</li>
                        <li>must contain one lowercase letter.</li>
                        <li>must contain one uppercase letter.</li>
                        <li>must contain one number.</li>
                        <li>must contain one special character.</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
          <FormControl>
            <div className='relative'>
              <Input
                {...field}
                type={showPassword ? 'text' : 'password'}
                className={cn('h-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50', className)}
                placeholder={placeholder}
                value={field.value as string}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-1 top-0.5 w-8 text-slate-400 hover:text-slate-300'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={15} className='text-slate-400' /> : <Eye size={15} className='text-slate-400' />}
                <span className='sr-only'>
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
