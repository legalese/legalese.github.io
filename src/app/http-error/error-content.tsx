'use client';

import { useEffect, useState } from 'react';

const ERROR_INFO: Record<number, { title: string; description: string }> = {
  400: { title: "Bad Request", description: "The request could not be understood. Please check the URL and try again." },
  401: { title: "Unauthorized", description: "You need to be signed in to access this resource." },
  403: { title: "Forbidden", description: "You don't have permission to access this resource." },
  404: { title: "Not Found", description: "The page you're looking for doesn't exist or may have been moved." },
  405: { title: "Method Not Allowed", description: "The request method is not supported for this resource." },
  429: { title: "Too Many Requests", description: "You've made too many requests. Please wait a moment and try again." },
  500: { title: "Internal Server Error", description: "Something went wrong on our end. Please try again later." },
  502: { title: "Bad Gateway", description: "The server received an invalid response from an upstream service." },
  503: { title: "Service Unavailable", description: "The service is temporarily unavailable. Please try again shortly." },
  504: { title: "Gateway Timeout", description: "The server didn't respond in time. Please try again later." },
};

const DEFAULT_ERROR = {
  title: "Something Went Wrong",
  description: "An unexpected error occurred. Please try again later.",
};

export function ErrorContent() {
  const [code, setCode] = useState(500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam) {
      const parsed = parseInt(codeParam, 10);
      if (parsed >= 400 && parsed <= 599) setCode(parsed);
    }
  }, []);

  const { title, description } = ERROR_INFO[code] ?? DEFAULT_ERROR;

  return (
    <div className="text-center px-6 py-16">
      <h1 className="text-8xl font-bold text-gray-200 mb-4">{code}</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-merriweather">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      {code === 401 ? (
        <a
          href="https://legalese.cloud/auth/login"
          className="inline-block px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
        >
          Sign in to continue
        </a>
      ) : (
        <a
          href="/"
          className="inline-block px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
        >
          Go to Homepage
        </a>
      )}
    </div>
  );
}
