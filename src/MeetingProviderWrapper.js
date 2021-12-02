// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState } from 'react';
import { MeetingMode, Layout } from './types';
import { Route, Switch } from 'react-router-dom';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import {
  MeetingProvider,
  AudioOutputControl,
  VoiceFocusProvider,
  useMeetingManager,
  DevicePermissionStatus,
  useDevicePermissionStatus,
  useAudioVideo,
  DeviceLabels,
  Camera,
  VideoInputControl,
  useNotificationDispatch,
  ActionType,
  Severity,
  VideoTileGrid,
  FeaturedRemoteVideos,
  RemoteVideos,
  useLocalVideo,
  LocalVideo,
  PreviewVideo,
  BackgroundBlurProvider,
  BackgroundBlurCheckbox,
  AudioInputControl,
  AudioInputVFControl,
  VideoGrid,
  VideoTile,
  ContentShare,
  useContentShareControls,
  ControlBar
} from 'amazon-chime-sdk-component-library-react';
import { v4 as uuidv4 } from 'uuid';
import { DeviceSetup } from './views';
// import MeetingEventObserver from '../MeetingEventObserver';
import meetingConfig from './meetingConfig';
import { useAppState } from './AppStateProvider';
import DevicePermissionPrompt from './DevicePermissionPrompt';

const fetchMeeting = async () => {
  const response = await fetch(
    `https://192.168.182.72:8080/join?title=1&name=${uuidv4()}&region=us-east-1`,
    {
      method: 'POST',
    }
  );
  const data = await response.json();
  if (data.error) {
    throw new Error(`Server error: ${data.error}`);
  }

  return data;
}

const MeetingProviderWrapper = () => {
  const { isWebAudioEnabled } = useAppState();
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const meetingManager = useMeetingManager()
  var permission = useDevicePermissionStatus()
  const meetingConfigValue = {
    ...meetingConfig,
    enableWebAudio: isWebAudioEnabled,
  };
  const { layout } = useAppState();

  useEffect(async () => {

    // permission = DevicePermissionStatus.GRANTED

    console.log(DeviceLabels)
    console.log(permission)
    console.log('test')
    const JoinInfo = await fetchMeeting()
    console.log(JoinInfo)
    await meetingManager.join({
      meetingInfo: JoinInfo.JoinInfo.Meeting,
      attendeeInfo: JoinInfo.JoinInfo.Attendee,
      deviceLabels: DeviceLabels.AudioAndVideo,
    });
    console.log(JoinInfo.JoinInfo.Attendee)
    await meetingManager.invokeDeviceProvider(DeviceLabels)
    setIsLoading(false);
    console.log(meetingManager)
    console.log(layout)
    // const joinData = {
    //   meetingInfo: JoinInfo.JoinInfo.Meeting,
    //   attendeeInfo: JoinInfo.JoinInfo.Attendee
    // };
    // await meetingManager.join(joinData);
    await meetingManager.start();
    setIsJoined(true)
  }, [])
  const { tileId, isVideoEnabled, setIsVideoEnabled, toggleVideo } = useLocalVideo();
  const { toggleContentShare } = useContentShareControls();
  console.log(isVideoEnabled)

  const getMeetingProviderWrapper = () => {
    return (
      <div>
        <div>
          {isLoading ? (<div> loading </div>) :
            <div>
              {isJoined ? (
                <BackgroundBlurProvider>
                  <div>
                    {/* <h1>VideoTileGrid</h1> */}
                    {/* {isVideoEnabled ? 'LocalVideo is enabled' : 'LocalVideo is disabled'} */}
                    {/* <button onClick={toggleVideo}>Toggle video</button> */}
                    <div style={{ padding: '1rem', height: '70vh', width: '100vw', boxSizing: 'border-box' }}>
                      <VideoTileGrid layout={'featured'} style={{ height: "100%" }} noRemoteVideoView={<div>No one is sharing his video</div>} />
                    </div>
                    {/* <div style={{ padding: '1rem', height: '70vh', boxSizing: 'border-box' }}>
                      <VideoTileGrid layout='standard'
                        className="videos">
                      </VideoTileGrid>
                    </div> */}
                    <div style={{ flex: 1, display: 'grid' }}>
                      <ControlBar>
                        <BrowserView>
                          <ContentShare />
                          <button onClick={toggleContentShare}>Toggle content share</button>
                        </BrowserView>
                        <VideoInputControl />
                        <AudioOutputControl />
                        <AudioInputControl />
                        {/* <AudioInputVFControl /> */}
                        {/* <BackgroundBlurCheckbox /> */}
                      </ControlBar>
                    </div>
                  </div>
                  {/* <DeviceSetup /> */}
                </BackgroundBlurProvider>) : null}
            </div>}
        </div>
      </div>
    );
  };

  const getMeetingProviderWrapperWithVF = () => {
    return (
      <VoiceFocusProvider>
        {getMeetingProviderWrapper()}
      </VoiceFocusProvider>
    );
  };

  return (
    <>
      {isWebAudioEnabled ? getMeetingProviderWrapperWithVF() : getMeetingProviderWrapper()}
    </>
  );
};


export default MeetingProviderWrapper;
