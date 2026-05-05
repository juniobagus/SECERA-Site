import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCrop: (croppedFile: File) => void;
  aspectRatio?: number;
}

export default function CropModal({ isOpen, onClose, imageSrc, onCrop, aspectRatio = 16 / 9 }: CropModalProps) {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
      width: 1200,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'cropped-image.webp', { type: 'image/webp' });
        onCrop(file);
      }
    }, 'image/webp', 0.9);
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cropperRef.current?.cropper.rotate(90);
  };

  const handleZoom = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    cropperRef.current?.cropper.zoom(delta);
  };

  if (!isOpen) return null;

  // Using Portal to move the modal to the body level
  // This completely prevents event bubbling to the Reorder component
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-white/20 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Crop Image</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Precision framing and adjustment</p>
          </div>
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        <div className="relative bg-[#1a1a1a] h-[400px] overflow-hidden flex items-center justify-center">
          <Cropper
            src={imageSrc}
            style={{ height: '100%', width: '100%' }}
            initialAspectRatio={aspectRatio}
            aspectRatio={aspectRatio}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            dragMode="move"
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            className="rounded-none"
          />
        </div>

        <div className="p-8 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="w-full sm:flex-1 space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Zoom Controls</span>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={(e) => handleZoom(e, -0.1)} 
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
                >
                  <ZoomOut className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden" />
                <button 
                  type="button" 
                  onClick={(e) => handleZoom(e, 0.1)} 
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="w-full sm:w-1/3 space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Orientation</span>
              <button 
                type="button"
                onClick={handleRotate}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-[#722F38] transition-all active:scale-95"
              >
                <RotateCw className="w-4 h-4" /> Rotate 90°
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="px-8 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all text-center"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-10 py-3 bg-[#722F38] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#5a252d] shadow-xl shadow-[#722F38]/20 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" /> Apply & Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
