import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import MeetingProviderWrapperfrom from './MeetingProviderWrapper'
import {
  lightTheme,
  NotificationProvider,
  darkTheme,
  GlobalStyles,
  MeetingProvider
} from 'amazon-chime-sdk-component-library-react';
import meetingConfig from './meetingConfig';
import { AppStateProvider, useAppState } from './AppStateProvider';
const App = () => {

  const meetingConfigValue = {
    ...meetingConfig
  };
  return (
    <Router>
      <AppStateProvider>
        <MeetingProvider {...meetingConfigValue}>
          <Theme>
            <MeetingProviderWrapperfrom />
          </Theme>
        </MeetingProvider>
      </AppStateProvider>
    </Router>
  );
}

const Theme = ({ children }) => {
  const { theme } = useAppState();

  return (
    <ThemeProvider theme={theme === 'dark' ? lightTheme : darkTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

export default App;