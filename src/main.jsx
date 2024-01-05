import React from 'react'
import Ably from 'ably/promises'
import { AblyProvider } from 'ably/react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Spaces from '@ably/spaces'
import { SpacesProvider, SpaceProvider } from '@ably/spaces/react'

const client = new Ably.Realtime.Promise({ authUrl: "/api/ably/token" });
const spaces = new Spaces(client);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AblyProvider client={client}>
      <SpacesProvider client={spaces}>
        <SpaceProvider
          name="datagrid"
          options={{ offlineTimeout: 100 }}
        >
          <App />
        </SpaceProvider>
      </SpacesProvider>
    </AblyProvider>
  </React.StrictMode>,
);