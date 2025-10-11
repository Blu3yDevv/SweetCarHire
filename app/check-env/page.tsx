export default function CheckEnvPage() {
  // This is a server component, so we can access process.env directly
  const brevoApiKey = process.env.BREVO_API_KEY

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">BREVO_API_KEY</h2>
            {brevoApiKey ? (
              <div>
                <p className="text-green-600">✓ Environment variable is set</p>
                <p className="text-gray-600">Value starts with: {brevoApiKey.substring(0, 5)}...</p>
                <p className="text-gray-600">Length: {brevoApiKey.length} characters</p>
              </div>
            ) : (
              <p className="text-red-600">✗ Environment variable is not set</p>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-700">
              If the environment variable is not set or incorrect, please make sure to add it to your .env.local file
              and restart the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
