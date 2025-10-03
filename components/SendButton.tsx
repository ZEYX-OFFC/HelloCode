import { Send } from "lucide-react";

export default function SendButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-60"
      aria-label="Send"
    >
      <Send size={20} />
    </button>
  );
}
