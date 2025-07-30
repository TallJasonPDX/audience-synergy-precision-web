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
  totalFrames = 212, 
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
  const [animationCompleted, setAnimationCompleted] = useState(false);

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
            console.log(`Loaded frame ${i + 1}/${totalFrames}`);
            if (loadedCount === initialBatch) {
              setIsLoading(false);
            }
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load frame ${i + 1}/${totalFrames}`);
            reject();
          };
          img.src = getFrameUrl(i + 1);
        });
        promises.push(promise);
      }
      await Promise.allSettled(promises);
    };

    try {
      console.log(`Starting to load ${totalFrames} frames...`);
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
    let scrollTriggerInstance: ScrollTrigger;
    
    const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 150px",
        end: "+=6000",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        animation: gsap.to(animation, {
            frame: totalFrames - 1,
            snap: "frame",
            ease: "none",
        }),
        onUpdate: (self) => {
            const frameIndex = Math.round(animation.frame);
            
            // Check if animation is complete
            if (frameIndex >= totalFrames - 1 && !animationCompleted) {
                console.log("Animation completed - resizing container and locking to final frame");
                setAnimationCompleted(true);
                
                // Resize the scroll trigger to reduce scroll area
                setTimeout(() => {
                    st.kill();
                    scrollTriggerInstance = ScrollTrigger.create({
                        trigger: containerRef.current,
                        start: "top 150px",
                        end: "+=200", // Much shorter end distance
                        pin: true,
                        anticipatePin: 1,
                        onUpdate: () => {
                            // Always show final frame
                            if (currentFrameRef.current !== totalFrames - 1) {
                                currentFrameRef.current = totalFrames - 1;
                                requestAnimationFrame(() => drawFrame(totalFrames - 1));
                            }
                        }
                    });
                }, 100);
            }
            
            // Only animate if not completed
            if (!animationCompleted) {
                console.log(`Animation progress: frame ${frameIndex + 1}/${totalFrames} (${((frameIndex + 1) / totalFrames * 100).toFixed(1)}%)`);
                if (frameIndex !== currentFrameRef.current) {
                    currentFrameRef.current = frameIndex;
                    requestAnimationFrame(() => drawFrame(frameIndex));
                }
            }
        }
    });

    return () => {
      st.kill();
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, [isLoading, totalFrames, drawFrame, animationCompleted]);

  useEffect(() => {
    loadFrames();
  }, [loadFrames]);

  // FIXED: The root element no longer has a minimum height, allowing the parent
  // to control its size, which prevents the layout from breaking.
  return (
    <div 
      ref={containerRef}
      className={`relative w-full mx-auto flex items-center justify-center ${
        animationCompleted ? 'aspect-video max-w-[1280px]' : 'aspect-video max-w-[1280px]'
      } ${className}`}
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
