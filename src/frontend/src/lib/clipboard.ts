import { toast } from 'sonner';

export async function copyToClipboard(text: string, successMessage: string = 'Copied to clipboard!'): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch (error) {
    toast.error('Failed to copy to clipboard');
    console.error('Clipboard error:', error);
    return false;
  }
}
