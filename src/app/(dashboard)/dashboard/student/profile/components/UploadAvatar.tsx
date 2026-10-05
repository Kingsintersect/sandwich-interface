"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { UploadPassport } from "@/app/actions/student";
import { notify } from "@/contexts/ToastProvider";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface UploadAvatarProps {
   imageUrl: string;
   name?: string;
   onUploaded?: (url: string) => void;
}

/**
 * Previously this rendered a hard-coded image and only ever created a local
 * object URL, so a "saved" photo vanished on reload. It now posts through the
 * same UploadPassport action the application form uses.
 */
const UploadAvatar = ({ imageUrl, name, onUploaded }: UploadAvatarProps) => {
   const [avatar, setAvatar] = useState(imageUrl);
   const [uploading, setUploading] = useState(false);

   const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const preview = URL.createObjectURL(file);
      setAvatar(preview);
      setUploading(true);

      try {
         const { success, error } = await UploadPassport({ passport: file });
         if (success?.image_url) {
            setAvatar(success.image_url);
            onUploaded?.(success.image_url);
            notify({ message: "Photo updated", variant: "success", timeout: 4000 });
         } else {
            throw error ?? new Error("Upload failed");
         }
      } catch {
         setAvatar(imageUrl); // roll back to what the server still has
         notify({
            message: "Could not upload your photo. Please try again.",
            variant: "error",
            timeout: 5000,
         });
      } finally {
         setUploading(false);
         URL.revokeObjectURL(preview);
      }
   };

   return (
      <div className="flex flex-col items-center">
         <div className="group relative size-28">
            <div className="relative size-full overflow-hidden rounded-2xl border border-border">
               <Image
                  src={avatar}
                  alt={name ? `${name}'s photo` : "Profile photo"}
                  fill
                  sizes="112px"
                  className="object-cover"
               />
            </div>

            <label
               className={cn(
                  "absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-ocean-950/70 text-white opacity-0 backdrop-blur-sm transition-opacity",
                  "group-hover:opacity-100 focus-within:opacity-100",
                  uploading && "opacity-100"
               )}
            >
               <Icon
                  icon={uploading ? Loading03Icon : Camera01Icon}
                  className={cn("size-5", uploading && "animate-spin")}
               />
               <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">
                  {uploading ? "Saving" : "Change"}
               </span>
               <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  disabled={uploading}
                  onChange={handleUpload}
               />
            </label>
         </div>
      </div>
   );
};

export default UploadAvatar;
