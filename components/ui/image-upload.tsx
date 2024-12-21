'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";

import { Button } from "./button";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onSuccess = (result: CloudinaryUploadWidgetResults) => {
        if (typeof result.info !== 'string' && result.info?.secure_url) {
            onChange(result.info.secure_url);
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => {
                    return (
                        <div
                            key={url}
                            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
                        >
                            <div className="z-10 absolute top-2 right-2">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => onRemove(url)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                            <Image
                                fill
                                className="object-cover"
                                alt="Image"
                                src={url}
                            />
                        </div>
                    );
                })}
            </div>
            <CldUploadWidget onSuccess={onSuccess} uploadPreset="eutylaae">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };
                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="mr-2 w-4 h-4" />
                            Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;
