import React from "react";

export default function ErrorMessage({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-red-500">
      {message || "An error occurred."}
      {onRetry && (
        <button onClick={onRetry} className="ml-2 text-blue-500 underline">
          Retry
        </button>
      )}
    </div>
  );
}
