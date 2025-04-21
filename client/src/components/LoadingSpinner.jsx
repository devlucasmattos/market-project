export default function LoadingSpinner({ size = 'md' }) {
    const sizeClasses = {
      sm: 'spinner-size-sm',
      md: 'spinner-size-md',
      lg: 'spinner-size-lg'
    };
  
    return (
      <div className="flex flex-col items-center justify-center">
        <svg
          className={`spinner ${sizeClasses[size]} text-primary-600`}
          viewBox="0 0 50 50"
        >
          <circle
            className="opacity-25"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <circle
            className="opacity-75"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="80"
            strokeDashoffset="60"
          ></circle>
        </svg>
      </div>
    );
  }