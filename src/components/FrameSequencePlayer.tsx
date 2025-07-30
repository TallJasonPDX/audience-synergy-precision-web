import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlogImageUrl } from "@/lib/storage";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface FrameSequencePlayerProps {
  totalFrames: number;
  frameBaseName: string;
  bucketName: string;
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

  // Get frame URL with proper formatting
  const getFrameUrl = useCallback((frameNumber: number) => {
    const paddedNumber = frameNumber.toString().padStart(3, '0');
    const framePath = `${frameBaseName}${paddedNumber}.png`;
    return getBlogImageUrl(framePath, 'frames');
  }, [frameBaseName]);

  // Progressive frame loading
  const loadFrames = useCallback(async () => {
    const frames: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Load frames in batches for better UX
    const batchSize = 10;
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
            
            // Start animation after first batch is loaded
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
      // Load initial batch first
      await loadBatch(0, initialBatch);
      
      // Load remaining frames in background
      for (let i = initialBatch; i < totalFrames; i += batchSize) {
        setTimeout(() => loadBatch(i, i + batchSize), (i - initialBatch) * 50);
      }
      
    } catch (error) {
      console.error("Error loading frames:", error);
    }

    framesRef.current = frames;
  }, [totalFrames, getFrameUrl]);

  // Draw frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const frame = framesRef.current[frameIndex];
    
    if (!canvas || !ctx || !frame) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw frame to fill canvas completely
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  }, []);

  // Set up scroll animation
  useEffect(() => {
    if (isLoading || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    let animationId: number;
    let hasCompleted = false;

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "center bottom",
      end: "+=200vh",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        
        // Only animate forward, don't reverse once completed
        if (self.progress === 1) {
          hasCompleted = true;
        }
        
        if (hasCompleted && self.progress < 1) {
          return; // Don't reverse animation once completed
        }
        
        animationId = requestAnimationFrame(() => {
          const progress = self.progress;
          const frameIndex = Math.min(
            Math.floor(progress * (totalFrames - 1)),
            totalFrames - 1
          );
          
          if (frameIndex !== currentFrameRef.current && framesRef.current[frameIndex]) {
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          }
        });
      }
    });

    // Draw initial frame
    if (framesRef.current[0]) {
      drawFrame(0);
    }

    return () => {
      scrollTrigger.kill();
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isLoading, totalFrames, drawFrame]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      if (!canvas || !container) return;
      
      const containerRect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Calculate responsive dimensions
      const maxWidth = Math.min(1280, containerRect.width);
      const calculatedHeight = (maxWidth * 720) / 1280; // Maintain 1280:720 aspect ratio
      const height = Math.min(calculatedHeight, 720);
      
      // Set canvas display size
      canvas.style.width = `${maxWidth}px`;
      canvas.style.height = `${height}px`;
      
      // Set canvas internal dimensions for crisp rendering
      canvas.width = maxWidth * dpr;
      canvas.height = height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      // Redraw current frame
      if (framesRef.current[currentFrameRef.current]) {
        drawFrame(currentFrameRef.current);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // Start loading frames
  useEffect(() => {
    loadFrames();
  }, [loadFrames]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[720px] ${className}`}
    >
      {/* Canvas container respecting native image dimensions */}
      <div className="w-full h-full flex items-center justify-center">
        <canvas 
          ref={canvasRef}
          className="block"
        />
      </div>
          
      {/* Loading indicator */}
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