import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/js/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/js/components/ui/card';

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.statusText || error.data?.message || 'An error occurred';
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>
              {errorStatus ? `Error ${errorStatus}` : 'Oops! Something went wrong'}
            </CardTitle>
          </div>
          <CardDescription>
            {errorStatus === 404
              ? 'The page you are looking for does not exist.'
              : 'An unexpected error has occurred.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono text-muted-foreground break-words">
              {errorMessage}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild variant="default">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

