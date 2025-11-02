import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { cn } from '@/js/utils';
import { Button } from '@/js/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/js/components/ui/card';
import { Input } from '@/js/components/ui/input';
import { Label } from '@/js/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/js/components/ui/dialog';
import { useToast } from '@/js/hooks/use-toast';
import { client } from '@/js/api/client.gen';

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password1 !== formData.password2) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      // Use custom signup API endpoint
      const response = await fetch('/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken='))
            ?.split('=')[1] || '',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password1: formData.password1,
          password2: formData.password2,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Your account has been created. You can now login.',
        });
        navigate('/login');
      } else {
        // Handle validation errors from Django REST Framework
        const errorMessages: string[] = [];
        Object.entries(data).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errorMessages.push(...errors);
          } else if (typeof errors === 'string') {
            errorMessages.push(errors);
          }
        });
        const errorMessage = errorMessages.join(' ') || 'Failed to create account.';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className={cn('flex flex-col gap-6 w-full max-w-sm')}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Create your account to start shortening URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password1">Password</Label>
                  <Input
                    id="password1"
                    type="password"
                    value={formData.password1}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password2">Confirm Password</Label>
                  <Input
                    id="password2"
                    type="password"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowComingSoon(true)}
                >
                  Sign up with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon!</DialogTitle>
            <DialogDescription>
              Google Sign-in is currently under development and will be available soon.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowComingSoon(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
