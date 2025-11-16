import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface TestResult {
  provider: string;
  status: 'success' | 'error';
  message: string;
  details?: {
    error?: string;
    solution?: string;
    response?: string;
  };
}

interface APITestResponse {
  success: boolean;
  workingCount: number;
  totalCount: number;
  results: TestResult[];
  summary: string;
}

export default function APISetupPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: testResults, isLoading, refetch, isRefetching } = useQuery<APITestResponse>({
    queryKey: ['/api/test-api-keys'],
    refetchOnWindowFocus: false,
  });

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            🔑 API Keys Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure your AI provider API keys to enable all WildGuard features
          </p>
        </div>

        {/* Status Overview Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Keys Status</CardTitle>
                <CardDescription>
                  Check the status of your configured API keys
                </CardDescription>
              </div>
              <Button
                onClick={() => refetch()}
                disabled={isLoading || isRefetching}
                variant="outline"
                data-testid="button-test-api-keys"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                Test All Keys
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">Testing API keys...</p>
              </div>
            ) : testResults ? (
              <>
                {/* Summary */}
                <Alert className={testResults.success ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20'}>
                  <AlertDescription className="flex items-center justify-between">
                    <span className="font-semibold">
                      {testResults.summary}
                    </span>
                    <Badge variant={testResults.success ? 'default' : 'destructive'}>
                      {testResults.workingCount} / {testResults.totalCount} Working
                    </Badge>
                  </AlertDescription>
                </Alert>

                {/* Individual Results */}
                <div className="grid gap-4">
                  {testResults.results.map((result) => (
                    <div
                      key={result.provider}
                      className="flex items-start gap-3 p-4 rounded-lg border bg-card"
                      data-testid={`status-${result.provider.toLowerCase()}`}
                    >
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {result.provider}
                          </h4>
                          <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {result.message}
                        </p>
                        {result.details?.solution && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                            💡 {result.details.solution}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Alert>
                <AlertDescription>
                  Click "Test All Keys" to check the status of your API keys
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to get fresh API keys for all providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="gemini" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="gemini">
                  Gemini (FREE) ✨
                </TabsTrigger>
                <TabsTrigger value="openai">OpenAI</TabsTrigger>
                <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
              </TabsList>

              {/* Gemini Setup */}
              <TabsContent value="gemini" className="space-y-4">
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20">
                  <AlertDescription>
                    <strong>✅ RECOMMENDED:</strong> Gemini offers the best free tier with generous limits!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Step 1: Get Your Free API Key</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      Visit{' '}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => window.open('https://aistudio.google.com/apikey', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Google AI Studio
                      </Button>
                    </li>
                    <li>Sign in with your Google account (any Gmail account works)</li>
                    <li>Accept the Terms of Service</li>
                    <li>Click "Create API Key" or "Get API key" button</li>
                    <li>Copy your new API key</li>
                  </ol>

                  <h3 className="font-semibold text-lg pt-4">Step 2: Add to Replit Secrets</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                    <li>In Replit, click the "Tools" tab (left sidebar)</li>
                    <li>Click "Secrets" (lock icon)</li>
                    <li>Find the secret named <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GEMINI_API_KEY</code></li>
                    <li>Click "Edit" and paste your new API key</li>
                    <li>Click "Save"</li>
                    <li>Restart your application (click Stop → Run button)</li>
                  </ol>

                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20">
                    <AlertDescription>
                      <strong>Free Tier Limits:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Gemini 2.0 Flash: 10 requests/minute, 250 requests/day</li>
                        <li>No credit card required!</li>
                        <li>Perfect for WildGuard's conservation tools</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              {/* OpenAI Setup */}
              <TabsContent value="openai" className="space-y-4">
                <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20">
                  <AlertDescription>
                    <strong>⚠️ Note:</strong> OpenAI requires billing setup. $5 free trial credits for new users.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Step 1: Get Your API Key</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      Visit{' '}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        OpenAI Platform
                      </Button>
                    </li>
                    <li>Sign in or create an account</li>
                    <li>Go to "API keys" section</li>
                    <li>Click "Create new secret key"</li>
                    <li>Name it (e.g., "WildGuard") and copy the key</li>
                  </ol>

                  <h3 className="font-semibold text-lg pt-4">Step 2: Add Billing (Optional)</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                    <li>Go to "Billing" → "Payment methods"</li>
                    <li>Add a credit card</li>
                    <li>Set usage limits to control costs (recommended: $10/month)</li>
                  </ol>

                  <h3 className="font-semibold text-lg pt-4">Step 3: Add to Replit Secrets</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Update the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">OPENAI_API_KEY</code> secret in Replit (same process as Gemini above).
                  </p>
                </div>
              </TabsContent>

              {/* Anthropic Setup */}
              <TabsContent value="anthropic" className="space-y-4">
                <Alert className="bg-purple-50 border-purple-200 dark:bg-purple-900/20">
                  <AlertDescription>
                    <strong>💜 Note:</strong> Anthropic (Claude) requires account credits.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Step 1: Get Your API Key</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      Visit{' '}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => window.open('https://console.anthropic.com/settings/keys', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Anthropic Console
                      </Button>
                    </li>
                    <li>Sign in or create an account</li>
                    <li>Go to "API Keys" in settings</li>
                    <li>Click "Create Key"</li>
                    <li>Copy your new API key</li>
                  </ol>

                  <h3 className="font-semibold text-lg pt-4">Step 2: Add Credits</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      Go to{' '}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => window.open('https://console.anthropic.com/settings/billing', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Billing Settings
                      </Button>
                    </li>
                    <li>Add credits to your account ($10+ recommended)</li>
                  </ol>

                  <h3 className="font-semibold text-lg pt-4">Step 3: Add to Replit Secrets</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Update the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">ANTHROPIC_API_KEY</code> secret in Replit.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Reference Card */}
        <Card className="border-2 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
          <CardHeader>
            <CardTitle>🚀 Quick Start Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>For the best WildGuard experience, we recommend:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li className="font-semibold text-emerald-700 dark:text-emerald-400">
                  ⭐ Gemini API (FREE) - Get this first! Covers 90% of features
                </li>
                <li>OpenAI (Optional) - Provides backup and enhanced accuracy</li>
                <li>Anthropic (Optional) - Additional fallback for complex analysis</li>
              </ol>
              <Alert className="bg-white/50 dark:bg-gray-800/50">
                <AlertDescription>
                  <strong>💡 Pro Tip:</strong> With just the free Gemini API key, you'll have access to:
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Animal identification with hybrid AI features</li>
                    <li>Health assessment with wound detection</li>
                    <li>Flora identification (PlantNet is already free!)</li>
                    <li>All 9 conservation tools</li>
                    <li>AI chatbot</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
