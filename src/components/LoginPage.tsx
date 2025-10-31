import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface LoginPageProps {
  onLogin: (provider: 'huawei' | 'google') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'huawei' | 'google' | null>(null);

  const handleLogin = async (provider: 'huawei' | 'google') => {
    setIsLoading(true);
    setSelectedProvider(provider);
    
    // Simulate login process
    setTimeout(() => {
      onLogin(provider);
      setIsLoading(false);
      setSelectedProvider(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* App Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl mb-2">Community Sharing</h1>
          <p className="text-gray-600">Share resources, build community</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue sharing and borrowing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Huawei ID Login */}
            <Button
              onClick={() => handleLogin('huawei')}
              disabled={isLoading}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              {isLoading && selectedProvider === 'huawei' ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                  </svg>
                  <span>Continue with Huawei ID</span>
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              onClick={() => handleLogin('google')}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border-gray-300"
              size="lg"
            >
              {isLoading && selectedProvider === 'google' ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700">Continue with Google</span>
                </div>
              )}
            </Button>

            {/* Terms and Privacy */}
            <p className="text-xs text-center text-gray-500 mt-6 px-4">
              By continuing, you agree to our{' '}
              <a href="#" className="text-emerald-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-emerald-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>New to Community Sharing?</p>
          <p className="mt-1">Sign in to create your account and start sharing!</p>
        </div>
      </div>
    </div>
  );
}
