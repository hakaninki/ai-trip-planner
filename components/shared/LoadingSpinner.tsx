import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
            {message && (
                <p className="text-white/60 text-sm animate-pulse">{message}</p>
            )}
        </div>
    );
}
