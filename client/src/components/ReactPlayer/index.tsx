import ReactPlayer from "react-player/lazy";
import { useInstructerContext } from "../../pages/instructer/InstructerContext";
import { TbRewindBackward5, TbRewindForward5 } from "react-icons/tb";

import VolumeContainer from "./Components/VolumeContainer";
import { MdFullscreen } from "react-icons/md";
import useFullscreen from "./Hooks/useFullscreen";
import PlayPauseButton from "./Components/PlayPauseButton";
import useControlsVisibility from "./Hooks/useControlsVisibility";
import usePlayPause from "./Hooks/usePlayPause";
import { useVolume } from "./Hooks/useVolume";
import { useEffect, useRef, useState } from "react";
import getFormattedTime from "../../../utils/getFormattedTime";
import useSeekAndTime from "./Hooks/useSeekAndTime";
import DurationProgressBar from "./Components/DurationProgressBar";
import RewindButtons from "./Components/RewindButtons";

export type VideoPlayerType = {
    lecture: number;
};

function VideoPlayer({ lecture }: VideoPlayerType) {
    const { curriculumForm } = useInstructerContext();

    const { PlayerContainer, isFullScreen, handleOnClickOnFullScreenButton } =
        useFullscreen();

    const { isControlsVisible, showControls, showControlsInfinitly } =
        useControlsVisibility();

    const { isPlaying, playVideo, pauseVideo } = usePlayPause();

    const {
        handleOnClickVolumeButton,
        handleOnMouseEnterToVolumeRange,
        handleOnMouseLeaveFromVolumeRange,
        handleVolume,
        isVolumeRangeVisible,
        volume,
        isMuted,
    } = useVolume();

    const PlayerRef = useRef<ReactPlayer | null>(null);

    const { playedRange, setPlayedRange, time, setTime } =
        useSeekAndTime(PlayerRef);

    const [isComplated, setIsComplated] = useState(false);

    useEffect(() => {
        setIsComplated(time.playedTime === time.totalTime);
    }, [time]);

    const [isLast5Seconds, setIsLastSecconds] = useState(false);

    useEffect(() => {
        if (PlayerRef.current) {
            const timeDif =
                PlayerRef.current?.getDuration() -
                PlayerRef.current?.getCurrentTime();

            if (timeDif !== 0 && timeDif <= 5) {
                setIsLastSecconds(true);
            }
        }
    }, [playedRange]);

    return (
        <div
            className={`w-96 aspect-video relative
                ${isControlsVisible ? "cursor-auto" : "cursor-none"}    
            `}
            data-theme="mytheme"
            ref={PlayerContainer}
            onMouseEnter={showControls}
            onMouseMove={showControls}
            onMouseLeave={showControlsInfinitly}
        >
            <ReactPlayer
                ref={PlayerRef}
                url={curriculumForm[lecture].videoUrl}
                width={"100%"}
                height={"100%"}
                muted={isMuted}
                volume={volume}
                playing={isPlaying}
                progressInterval={100}
                onProgress={(e) => {
                    setPlayedRange(e.played * 100);
                }}
                onDuration={(durationInSeconds) => {
                    setTime((prev) => ({
                        ...prev,
                        totalTime: getFormattedTime(durationInSeconds),
                    }));
                }}
            />
            <div
                className={`absolute bottom-0 w-full transition-all
                ${
                    isControlsVisible
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                <DurationProgressBar
                    playedRange={playedRange}
                    setPlayedRange={setPlayedRange}
                    Player={PlayerRef}
                />
                <div className="flex gap-4 items-center py-1 px-3">
                    <PlayPauseButton
                        isFullScreen={isFullScreen}
                        isPlaying={isPlaying}
                        playVideo={playVideo}
                        pauseVideo={pauseVideo}
                        isComplated={isComplated}
                    />
                    <RewindButtons
                        isFullScreen={isFullScreen}
                        Player={PlayerRef}
                        isComplated={isComplated}
                        isLast5Seconds={isLast5Seconds}
                    />
                    <VolumeContainer
                        isFullScreen={isFullScreen}
                        isVolumeRangeVisible={isVolumeRangeVisible}
                        handleOnClickVolumeButton={handleOnClickVolumeButton}
                        handleOnMouseEnterToVolumeRange={
                            handleOnMouseEnterToVolumeRange
                        }
                        handleOnMouseLeaveFromVolumeRange={
                            handleOnMouseLeaveFromVolumeRange
                        }
                        handleVolume={handleVolume}
                        volume={volume}
                        time={time}
                    />
                    <button
                        type="button"
                        className="ml-auto"
                        onClick={handleOnClickOnFullScreenButton}
                    >
                        <MdFullscreen color="white" size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
