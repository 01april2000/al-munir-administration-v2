



export default function Home() {
  // Show loading state while middleware handles redirect
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <text className="text-lg font-semibold mb-4">Redirecting...</text>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </main>
  );
}
