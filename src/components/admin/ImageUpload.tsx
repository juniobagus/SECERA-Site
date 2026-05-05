import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2, Crop } from 'lucide-react';
import { uploadImage, type UploadImageSlot } from '../../utils/api';
import CropModal from './CropModal';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  aspectRatio?: number;
  slot?: UploadImageSlot;
}

export default function ImageUpload({ value, onChange, label, className = '', aspectRatio = 16 / 9, slot = 'generic' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropSave = async (croppedFile: File) => {
    setShowCropModal(false);
    setIsUploading(true);
    try {
      const url = await uploadImage(croppedFile, slot);
      if (url) onChange(url);
      else alert('Failed to upload image.');
    } catch (err: any) {
      alert(err?.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="relative group">
        {value ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-50">
            <img 
              src={value} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTempImageSrc(value);
                  setShowCropModal(true);
                }}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-[#722F38] transition-colors"
                title="Crop Image"
              >
                <Crop className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-[#722F38] transition-colors"
                title="Change Image"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                title="Remove Image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-[#722F38]/50 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 text-gray-500 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-[#722F38]" />
                <span className="text-sm font-medium">Uploading...</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-[#722F38]">Click to upload</span>
                  <p className="text-xs text-gray-400 mt-1">WebP, JPEG, or PNG up to 5MB</p>
                </div>
              </>
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <CropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={tempImageSrc}
        onCrop={handleCropSave}
        aspectRatio={aspectRatio}
      />
    </div>
  );
}
