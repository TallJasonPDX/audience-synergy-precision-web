import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlogImageUrl } from "@/lib/storage";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface FrameSequencePlayerProps {
  totalFrames: number;
  frameBaseName: string;
  bucketName:string;
  className?: string;
}

const FrameSequencePlayer = ({ 
  totalFrames = 120, 
  frameBaseName = "frame_",
  bucketName = "frames",
  className = "" 
}: FrameSequencePlayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  // Get frame URL with proper formatting (no changes needed)
  const getFrameUrl = useCallback((frameNumber: number) => {
    const paddedNumber = frameNumber.toString().padStart(3, '0');
    const framePath = `${frameBaseName}${paddedNumber}.png`;
    return getBlogImageUrl(framePath, bucketName);
  }, [frameBaseName, bucketName]);
  
  // Progressive frame loading (no changes needed)
  const loadFrames = useCallback(async () => {
    const frames: HTMLImageElement[] = [];
    let loadedCount = 0;
    const initialBatch = 30;

    const loadBatch = async (start: number, end: number) => {
      const promises = [];
      for (let i = start; i < Math.min(end, totalFrames); i++) {
        const promise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            frames[i] = img;
            loadedCount++;
            setLoadedFrames(loadedCount);
            if (loadedCount === initialBatch) {
              setIsLoading(false);
            }
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load frame ${i + 1}`);
            reject();
          };
          img.src = getFrameUrl(i + 1);
        });
        promises.push(promise);
      }
      await Promise.allSettled(promises);
    };

    try {
      await loadBatch(0, initialBatch);
      if (initialBatch < totalFrames) {
        const remainingBatchSize = 10;
        for (let i = initialBatch; i < totalFrames; i += remainingBatchSize) {
           setTimeout(() => loadBatch(i, i + remainingBatchSize), (i - initialBatch) * 20);
        }
      }
    } catch (error) {
      console.error("Error loading frames:", error);
    }
    framesRef.current = frames;
  }, [totalFrames, getFrameUrl]);

  // FIXED: This logic now correctly "contains" the image within the canvas bounds.
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const frame = framesRef.current[frameIndex];
    if (!ctx || !frame || !frame.naturalWidth) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const frameWidth = frame.naturalWidth;
    const frameHeight = frame.naturalHeight;
    
    const canvasRatio = canvasWidth / canvasHeight;
    const frameRatio = frameWidth / frameHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let x = 0;
    let y = 0;

    if (frameRatio > canvasRatio) {
      drawHeight = canvasWidth / frameRatio;
      y = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * frameRatio;
      x = (canvasWidth - drawWidth) / 2;
    }
    
    ctx.drawImage(frame, x, y, drawWidth, drawHeight);
  }, []);

  // FIXED: The resize handler now properly scales the canvas and redraws the frame.
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    if (framesRef.current.length > 0 && framesRef.current[currentFrameRef.current]) {
      drawFrame(currentFrameRef.current);
    }
  }, [drawFrame]);

  // Initialize and clean up the resize listener.
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  // FIXED: The GSAP ScrollTrigger now uses a more reliable tween on a proxy object.
  // It pins the correctly-sized container for a smoother effect.
  useEffect(() => {
    if (isLoading || !containerRef.current) return;

    const animation = { frame: 0 };
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=2000", // Pin for a 2000px scroll duration
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
        }
    });
    
    tl.to(animation, {
        frame: totalFrames - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => {
            const frameIndex = Math.round(animation.frame);
            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex;
                requestAnimationFrame(() => drawFrame(frameIndex));
            }
        },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isLoading, totalFrames, drawFrame]);

  useEffect(() => {
    loadFrames();
  }, [loadFrames]);

  // FIXED: The root element no longer has a minimum height, allowing the parent
  // to control its size, which prevents the layout from breaking.
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-sm">
              Loading frames... {loadedFrames}/{Math.min(30, totalFrames)}
            </div>
            <div className="w-48 h-1 bg-white/20 rounded-full mt-2 mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-300 ease-out"
                style={{ width: `${(loadedFrames / Math.min(30, totalFrames)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameSequencePlayer;
