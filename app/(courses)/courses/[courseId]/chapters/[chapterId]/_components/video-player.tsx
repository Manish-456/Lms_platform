"use client";

import { useConfettiStore } from '@/hooks/use-confetti-store';
import { cn } from '@/lib/utils';
import MuxPlayer from '@mux/mux-player-react';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


interface IVideoPlayerProps {
    chapterId : string
courseId : string
nextChapterId? : string
playbackId? : string
isLocked : boolean
completeOnEnd : boolean
title : string
    
}
export default function VideoPlayer({
chapterId,
courseId,
nextChapterId,
playbackId,
title,
isLocked,
completeOnEnd,
} : IVideoPlayerProps) {
    const [isReady, setIsReady] = useState(false);

  return (
    <div className='relative aspect-video '>
        {!isReady && !isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <Loader2 className='h-8 w-8 animate-spin text-secondary' />
            </div>
        )}

        {
            isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 gap-y-2 flex-col text-secondary">
                    <Lock className='h-8 w-8' />
                    <p className="text-sm">This chapter is locked</p>
                </div>
            )
        }
      
      {!isLocked && (
        <MuxPlayer 
        title={title} 
        playbackId={playbackId} onCanPlay={() => setIsReady(true)} 
        onEnded={() => {}} autoPlay/>
      )}
    </div>
  )
}
