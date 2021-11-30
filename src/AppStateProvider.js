// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useContext, useState } from 'react';
import { MeetingMode, Layout } from './types';


const AppStateContext = React.createContext(null);

const useAppState = () => {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return state;
}

const query = new URLSearchParams(window.location.search);

const AppStateProvider = ({ children }) => {
  const [meetingId, setMeeting] = useState(query.get('meetingId') || '');
  const [region, setRegion] = useState(query.get('region') || '');
  const [meetingMode, setMeetingMode] = useState(MeetingMode.Attendee);
  const [layout, setLayout] = useState(Layout.Gallery);
  const [localUserName, setLocalName] = useState('');
  const [isWebAudioEnabled, setIsWebAudioEnabled] = useState(false);
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'light';
  });

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleWebAudio = () => {
    setIsWebAudioEnabled(current => !current);
  }

  var setAppMeetingInfo = (meetingId, name, region) => {
    setRegion(region);
    setMeeting(meetingId);
    setLocalName(name);
  };

  var providerValue = {
    meetingId,
    localUserName,
    theme,
    isWebAudioEnabled,
    region,
    meetingMode,
    layout,
    toggleTheme,
    toggleWebAudio,
    setAppMeetingInfo,
    setMeetingMode,
    setLayout,
  };

  return (
    <AppStateContext.Provider value={providerValue}>
      {children}
    </AppStateContext.Provider>
  );
}

export { AppStateProvider, useAppState }

