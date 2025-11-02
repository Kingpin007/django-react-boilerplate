import { useState } from 'react';
import { Copy, ExternalLink, Link2, Loader2 } from 'lucide-react';
import { useAuth } from '@/js/contexts/AuthContext';
import { Button } from '@/js/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/js/components/ui/card';
import { Input } from '@/js/components/ui/input';
import { Label } from '@/js/components/ui/label';
import { useToast } from '@/js/hooks/use-toast';
import { useCreateShortUrl } from '@/js/hooks/api';
import type { ShortURL } from '@/js/hooks/api';

export default function Home() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState<ShortURL | null>(null);
  const { toast } = useToast();

  const createShortUrl = useCreateShortUrl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createShortUrl.mutate(
      {
        original_url: url,
        custom_code: customCode || undefined,
      },
      {
        onSuccess: (data) => {
          setShortUrl(data);
          setUrl('');
          setCustomCode('');
          toast({
            title: 'Success!',
            description: 'URL shortened successfully',
          });
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to shorten URL',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Short URL copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">URL Shortener</h1>
        <p className="text-muted-foreground">
          Shorten your long URLs instantly. {user ? 'View your URLs in the dashboard.' : 'Sign up to save your URLs.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shorten a URL</CardTitle>
          <CardDescription>Enter a long URL to get a shortened version</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {createShortUrl.isError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {createShortUrl.error instanceof Error ? createShortUrl.error.message : 'Failed to shorten URL'}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="url">Long URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  disabled={createShortUrl.isPending}
                  className="flex-1"
                />
                <Button type="submit" disabled={createShortUrl.isPending || !url}>
                  {createShortUrl.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Link2 className="mr-2 h-4 w-4" />
                      Shorten
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customCode">Custom Code (Optional)</Label>
              <Input
                id="customCode"
                type="text"
                placeholder="my-custom-link"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                disabled={createShortUrl.isPending}
                pattern="[A-Za-z0-9]+"
                title="Only letters and numbers allowed"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for auto-generated code. Must be unique.
              </p>
            </div>
          </form>

          {shortUrl && (
            <div className="mt-6 space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Short URL Created!</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={shortUrl.short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-mono text-sm"
                    >
                      {shortUrl.short_url}
                    </a>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shortUrl.short_url)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Original: {shortUrl.original_url.substring(0, 50)}...</span>
                <span>•</span>
                <span>Clicks: {shortUrl.click_count}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
