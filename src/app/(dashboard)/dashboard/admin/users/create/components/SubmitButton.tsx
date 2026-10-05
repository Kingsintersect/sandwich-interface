"use client";

import { Loading03Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
    className: string;
    disabled: boolean;
    isUploading: boolean;
    recordCount: number;
    onClick: () => void;
};

export default function SubmitButton({
    className,
    disabled,
    isUploading,
    recordCount,
    onClick
}: SubmitButtonProps) {
    return (
        <Button
            type="button"
            onClick={onClick}
            className={cn("w-full py-6 text-lg font-medium flex items-center justify-center gap-2", className)}
            disabled={disabled}
            variant={"default"}
        >
            {isUploading ? (
                <>
                    <Icon icon={Loading03Icon} size={20} className="animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <Icon icon={Upload01Icon} size={20} />
                    <span>Upload {recordCount > 0 ? `${recordCount} ` : ''}Users</span>
                </>
            )}
        </Button>
    );
}