import { LogoIcon } from "./Logo";

// Loading screen: the lens logo with a rotating iris
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-primary">
      <LogoIcon className="h-16 w-16" spin />
      <p className="text-xl font-extrabold tracking-tight">
        Studio<span className="font-semibold text-base-content">Space</span>
      </p>
      <p className="text-sm opacity-60">Loading...</p>
    </div>
  );
}