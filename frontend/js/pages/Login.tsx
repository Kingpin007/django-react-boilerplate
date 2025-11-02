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
import { useAuth } from '@/js/contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      toast({
        title: 'Success!',
        description: 'You have been logged in successfully.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login. Please check your credentials.',
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
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials below to login to your account
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowComingSoon(true);
                      }}
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowComingSoon(true)}
                >
                  Login with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign up
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
              This feature is currently under development and will be available soon.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowComingSoon(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
