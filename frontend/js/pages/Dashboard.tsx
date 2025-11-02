import { useEffect, useState } from 'react';
import { Copy, ExternalLink, Link2, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/js/contexts/AuthContext';
import { Button } from '@/js/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/js/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/js/components/ui/table';
import { useToast } from '@/js/hooks/use-toast';
import { format } from 'date-fns';

interface ShortURL {
  id: number;
  original_url: string;
  short_code: string;
  short_url: string;
  click_count: number;
  created: string;
  modified: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [urls, setUrls] = useState<ShortURL[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/short-urls/', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      const data = await response.json();
      setUrls(data.results || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load URLs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUrls();
    }
  }, [user]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'URL copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy',
        variant: 'destructive',
      });
    }
  };

  const deleteUrl = async (id: number) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      const response = await fetch(`/api/short-urls/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCookie('csrftoken') || '',
        },
      });

      if (response.ok) {
        setUrls(urls.filter((url) => url.id !== id));
        toast({
          title: 'Deleted',
          description: 'URL deleted successfully',
        });
      } else {
        throw new Error('Failed to delete URL');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete URL',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Please log in</CardTitle>
            <CardDescription>You need to be logged in to view your URLs</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My URLs</h1>
          <p className="text-muted-foreground">Manage all your shortened URLs</p>
        </div>
        <Button onClick={fetchUrls} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Shortened URLs</CardTitle>
          <CardDescription>
            {urls.length} {urls.length === 1 ? 'URL' : 'URLs'} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="py-8 text-center text-destructive">{error}</div>
          ) : urls.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Link2 className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No URLs yet. Start shortening URLs from the home page!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <a
                          href={url.short_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm text-primary hover:underline"
                        >
                          {url.short_code}
                        </a>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md truncate" title={url.original_url}>
                        {url.original_url}
                      </div>
                    </TableCell>
                    <TableCell>{url.click_count}</TableCell>
                    <TableCell>{format(new Date(url.created), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(url.short_url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUrl(url.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

