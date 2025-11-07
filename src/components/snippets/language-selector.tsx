'use client';

import { useFormContext } from 'react-hook-form';
import { Check } from 'lucide-react';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROGRAMMING_LANGUAGES } from '@/constants/languages';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  name: string;
  label?: string;
}

export function LanguageSelector({ name, label = 'Language' }: LanguageSelectorProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-2'>
          <FormLabel className='text-sm font-medium text-slate-300'>
            {label}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              // Convert "__none__" to empty string for form storage
              field.onChange(value === '__none__' ? '' : value);
            }}
            value={field.value || '__none__'}
          >
            <FormControl>
              <SelectTrigger className='h-11 bg-slate-800/50 border-slate-700 text-slate-100 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'>
                <SelectValue placeholder='Select a language'>
                  {field.value && field.value !== '' ? (
                    (() => {
                      const selectedLang = PROGRAMMING_LANGUAGES.find(
                        (lang) => lang.value === field.value,
                      );
                      if (selectedLang) {
                        const Icon = selectedLang.icon;
                        return (
                          <div className='flex items-center gap-2'>
                            <Icon className='h-4 w-4' />
                            <span>{selectedLang.label}</span>
                          </div>
                        );
                      }
                      return field.value;
                    })()
                  ) : (
                    <span className='text-slate-500'>Select a language</span>
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent className='bg-slate-900 border-slate-800'>
              <SelectItem value='__none__' className='text-slate-400'>
                <div className='flex items-center gap-2'>
                  <span>None</span>
                </div>
              </SelectItem>
              {PROGRAMMING_LANGUAGES.map((language) => {
                const Icon = language.icon;
                const isSelected = field.value === language.value;
                return (
                  <SelectItem
                    key={language.value}
                    value={language.value}
                    className={cn(
                      'text-slate-100 focus:bg-slate-800 focus:text-slate-100',
                      isSelected && 'bg-slate-800/50',
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <Icon className='h-4 w-4 flex-shrink-0' />
                      <span className='flex-1'>{language.label}</span>
                      {isSelected && (
                        <Check className='h-4 w-4 text-emerald-400' />
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

