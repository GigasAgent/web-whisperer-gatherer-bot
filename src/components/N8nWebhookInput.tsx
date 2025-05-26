
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface N8nWebhookInputProps {
  n8nWebhookUrl: string;
  onN8nWebhookUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  isValidHttpUrl: (url: string) => boolean;
}

export const N8nWebhookInput: React.FC<N8nWebhookInputProps> = ({
  n8nWebhookUrl,
  onN8nWebhookUrlChange,
  isSubmitting,
  isValidHttpUrl,
}) => {
  return (
    <div className="space-y-3 pt-4 border-t border-neon-green/20">
      <Alert variant="default" className="bg-blue-900/20 border-blue-500/50 text-blue-300">
        <Info className="h-5 w-5 text-blue-400" />
        <AlertTitle className="font-semibold text-blue-300">n8n Webhook (Optional)</AlertTitle>
        <AlertDescription>
          If you want to send this data to an n8n workflow, paste your n8n webhook URL below. This step is optional.
          The URL will be saved in your browser's local storage for future use.
        </AlertDescription>
      </Alert>
      <div className="space-y-1">
        <Label htmlFor="n8nWebhookUrl" className="text-neon-green-lighter">
          n8n Webhook URL
        </Label>
        <Input
          id="n8nWebhookUrl"
          type="url"
          value={n8nWebhookUrl}
          onChange={onN8nWebhookUrlChange}
          placeholder="https://your-n8n-instance.com/webhook/your-path"
          className="bg-input border-neon-green/50 focus:ring-neon-green focus:border-neon-green"
          disabled={isSubmitting}
        />
        {!n8nWebhookUrl.trim() && (
          <p className="text-xs text-muted-foreground">Leave empty if you don't want to use n8n integration.</p>
        )}
        {n8nWebhookUrl.trim() && !isValidHttpUrl(n8nWebhookUrl) && (
          <p className="text-xs text-red-400">Please enter a valid URL (e.g., http://... or https://...).</p>
        )}
      </div>
    </div>
  );
};
