function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-[#1E2530] border-t-[#00FF9C] rounded-full animate-spin"></div>
      <p className="mt-4 text-[#8892A0] text-sm font-mono-score">{message}</p>
    </div>
  );
}

export default LoadingSpinner;