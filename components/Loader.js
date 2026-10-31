import { FiAperture } from "react-icons/fi";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <FiAperture size={48} className="text-primary animate-spin" />
      <p className="font-semibold text-primary">StudioSpace</p>
    </div>
  );
}
