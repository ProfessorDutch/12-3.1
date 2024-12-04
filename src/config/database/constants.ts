export const DATABASE_CONFIG = {
  url: 'https://uuqnzcfzmwfwtoxuggey.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cW56Y2Z6bXdmd3RveHVnZ2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5OTc2MjMsImV4cCI6MjA0ODU3MzYyM30.qcLVQZtB0hJgvSz8N98f8z8uxY6rWmBOZIYOWzAZ6Js',
  pooler: {
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.uuqnzcfzmwfwtoxuggey'
  }
};

export const AUTH_CONFIG = {
  autoRefreshToken: true,
  persistSession: true
};