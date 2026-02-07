export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-sand-50 flex items-center justify-center z-50">
      <div className="text-center">
        <img
          src="/687d2a415508bb1c6f510e12_serra-soul_(1).svg"
          alt="Serra & Soul"
          className="h-6 mx-auto animate-breathe"
        />
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-charcoal-300 animate-pulse" />
          <div className="w-1 h-1 bg-charcoal-300 animate-pulse animate-delay-200" />
          <div className="w-1 h-1 bg-charcoal-300 animate-pulse animate-delay-400" />
        </div>
      </div>
    </div>
  );
}
