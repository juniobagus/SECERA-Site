import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCrop: (croppedFile: File) => void;
  aspectRatio?: number;
}

export default function CropModal({ isOpen, onClose, imageSrc, onCrop, aspectRatio = 16 / 9 }: CropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;
    
    // 1. Setup output canvas
    const outputWidth = 1200;
    const outputHeight = outputWidth / aspectRatio;
    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 2. Clear with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Calculate scales
    const guideWidth = container.clientWidth * (aspectRatio > 1 ? 0.8 : 0.8 * aspectRatio);
    const outputScale = outputWidth / guideWidth;
    const displayedWidth = img.clientWidth;
    const displayedHeight = img.clientHeight;

    // 4. Apply transformations to match the UI state
    ctx.save();
    // Move to the center of the output canvas (which is the center of the guide)
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Scale everything to match output resolution
    ctx.scale(outputScale, outputScale);
    
    // Apply the drag position (in displayed pixels)
    ctx.translate(position.x, position.y);
    
    // Apply rotation around the image's center
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply zoom
    ctx.scale(zoom, zoom);
    
    // Draw the image centered at its own center
    ctx.drawImage(
      img,
      -displayedWidth / 2,
      -displayedHeight / 2,
      displayedWidth,
      displayedHeight
    );
    
    ctx.restore();

    // 5. Export as WebP
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'cropped-image.webp', { type: 'image/webp' });
        onCrop(file);
      }
    }, 'image/webp', 0.9);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-white/20">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Crop Image</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Adjust placement and zoom</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="relative bg-gray-900 h-[450px] overflow-hidden cursor-move select-none"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Darkened Overlay around crop area */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute inset-0 bg-black/60" style={{
              clipPath: `polygon(
                0% 0%, 0% 100%, 
                calc(50% - ${aspectRatio > 1 ? '40%' : `${40 * aspectRatio}%`}) 100%, 
                calc(50% - ${aspectRatio > 1 ? '40%' : `${40 * aspectRatio}%`}) calc(50% - ${aspectRatio > 1 ? `${40 / aspectRatio}%` : '40%'}), 
                calc(50% + ${aspectRatio > 1 ? '40%' : `${40 * aspectRatio}%`}) calc(50% - ${aspectRatio > 1 ? `${40 / aspectRatio}%` : '40%'}), 
                calc(50% + ${aspectRatio > 1 ? '40%' : `${40 * aspectRatio}%`}) calc(50% + ${aspectRatio > 1 ? `${40 / aspectRatio}%` : '40%'}), 
                calc(50% - ${aspectRatio > 1 ? '40%' : `${40 * aspectRatio}%`}) calc(50% + ${aspectRatio > 1 ? `${40 / aspectRatio}%` : '40%'}), 
                calc(50% - ${aspectRatio > 1 ? '40%' : `${40 * aspectRatio}%`}) 100%, 
                100% 100%, 100% 0%
              )`
            }} />
            
            {/* White border frame */}
            <div 
              className="absolute border-2 border-white/90 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: aspectRatio > 1 ? '80%' : `${80 * aspectRatio}%`,
                height: aspectRatio > 1 ? `${80 / aspectRatio}%` : '80%',
              }}
            >
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>
              
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white" />
            </div>
          </div>

          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop me"
            draggable={false}
            onLoad={() => {
              // Center the image on load
              setPosition({ x: 0, y: 0 });
            }}
            className="absolute transition-none max-w-none origin-center"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              left: '50%',
              top: '50%',
              marginLeft: imageRef.current ? -imageRef.current.width / 2 : 0,
              marginTop: imageRef.current ? -imageRef.current.height / 2 : 0,
            }}
          />
        </div>

        <div className="p-8 bg-gray-50 space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="p-1.5 hover:bg-white rounded-lg transition-colors"><ZoomOut className="w-4 h-4 text-gray-400" /></button>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#722F38]"
                />
                <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-1.5 hover:bg-white rounded-lg transition-colors"><ZoomIn className="w-4 h-4 text-gray-400" /></button>
              </div>
            </div>
            <div className="w-1/3 space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Rotation</span>
                <span>{rotation}°</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:border-[#722F38] hover:text-[#722F38] transition-all"
                >
                  <RotateCw className="w-3 h-3" /> Rotate
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-10 py-3 bg-[#722F38] text-white rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-[#5a252d] shadow-xl shadow-[#722F38]/20 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" /> Apply & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
