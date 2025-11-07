'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteSnippetDialogProps {
  open: boolean;
  snippetId: string | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteSnippetDialog({
  open,
  snippetId,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteSnippetDialogProps) {
  const handleConfirm = () => {
    if (snippetId) {
      onConfirm(snippetId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className='w-[calc(100%-2rem)] sm:max-w-[425px] bg-slate-900 border-slate-800 mx-4'>
        <DialogHeader>
          <DialogTitle className='text-lg sm:text-xl font-semibold text-slate-100'>
            Delete Snippet
          </DialogTitle>
          <DialogDescription className='text-sm sm:text-base text-slate-400'>
            Are you sure you want to delete this snippet? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-col sm:flex-row gap-2 sm:gap-0'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-100 w-full sm:w-auto'
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirm}
            isLoading={isDeleting}
            className='w-full sm:w-auto'
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

