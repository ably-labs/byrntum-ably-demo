import { useRef, useMemo, useEffect, useState } from 'react';
import { getSchedulerConfig } from './config/schedulerConfig';
import { BryntumScheduler } from '@bryntum/scheduler-react';
import { useChannel } from 'ably/react';
import { useSpace, useMembers } from '@ably/spaces/react';
import './App.css';

const USER_NAMES = [
  'Austin', 'Bennett', 'Christopher', 'Dominic', 'Eddi', 'Felix', 'Grady', 'Henry', 'Ivan', 'Jack', 'Kane',
  'Lambert', 'Mickey', 'Nolan', 'Oliver', 'Princeton', 'Quentin', 'Remi', 'Samson', 'Thomas', 'Urbain', 'Vance',
  'Weston', 'Xavier', 'York', 'Zane', 'Ariel', 'Brinley', 'Catarina', 'Diana', 'Emma', 'Fiona', 'Gabriella', 'Harmony',
  'Isabella', 'Jillian', 'Katalina', 'Lily', 'Matilda', 'Nadia', 'Olivia', 'Priscilla', 'Quinn', 'Renee', 'Staci',
  'Trinity', 'Ursula', 'Victoria', 'Wendy', 'Xenia', 'Yasmine', 'Zoe'];

function App() {
  const schedulerRef = useRef(null);
  const { space } = useSpace();
  const { members } = useMembers();
  let schedulerConfig = useMemo(() => getSchedulerConfig(members), [members]);
  let ignoreChange = false;
  const [startTimestamp, setStartTimestamp] = useState(0);

  const CHANNEL_NAME = 'scheduler';
  const { channel } = useChannel(`[?rewind=5s]${CHANNEL_NAME}`);

  useEffect(() => {
    space?.enter({
      username: USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)]
    });
  }, [space]);

  useEffect(() => {
    async function initListeners() {
      const scheduler = schedulerRef.current?.instance;
      scheduler.eventStore.on({
        change: onEventStoreChange,
        addConfirmed: onEventStoreAddConfirmed
      });
    }
    initListeners();
  }, [schedulerRef]);

  const onEventStoreChange = (event) => {
    const { action, changes } = event;

    const records = (event.records ? event.records : [event.record]).filter(r => r?.isPersistable);
    if (!records.length || ignoreChange) {
      return;
    }

    switch (action) {
      case 'update': {
        const data = {};

        Object.keys(changes).forEach(key => {
          data[key] = changes[key].value;
        });
        channel.publish('updateEvent', { id: records[0].id, changes: data });
        break;
      }

      case 'remove':
        channel.publish('removeEvent', { records: records.map(rec => rec.id) });
        break;
      case 'resizeEvent': {
        const
          element = scheduler.getElementFromEventRecord(eventRecord),
          startDate = new Date(data.startDate),
          startX = scheduler.getCoordinateFromDate(startDate);

        if (!element) {
          break;
        }

        element.dataset.userName = data.userName;

        // Prevent dragging & resizing while other user is performing an action on the event
        eventRecord.draggable = false;
        eventRecord.resizable = false;

        if (element) {
          // Dragging, match position
          if (data.command === 'dragEvent') {
            element.classList.add('b-remote-drag');
          }

          // Resizing, match position + size
          if (data.command === 'resizeEvent') {
            element.classList.add(`b-remote-resize-${data.edge}`);

            const
              endDate = new Date(data.endDate),
              endX = scheduler.getCoordinateFromDate(endDate);

            element.parentElement.style.width = `${Math.abs(endX - startX)}px`;
          }
        }
        break;
      }
    }

    updateTimeLine();
  }

  const onEventStoreAddConfirmed = ({ record }) => {
    channel.publish('addEvent', { records: [record] });
  }

  useEffect(() => {
    if (!schedulerRef.current) return;

    const onMessage = async (msg) => {
      if (msg.timestamp <= startTimestamp) return;
      const scheduler = schedulerRef.current?.instance;
      ignoreChange = true;
      handleMessage(msg);
      updateTimeLine();
      await scheduler.project.commitAsync();
      ignoreChange = false;
    };

    channel.subscribe(onMessage);
  }, [schedulerRef]);


  useEffect(() => {
    if (!schedulerRef.current) return;

    // Fetch initial state and set up initial timestamp
    const fetchInitialState = async () => {
      ignoreChange = true;

      try {
        const response = await fetch('/api/state');
        if (!response.ok) {
          throw new Error('Failed to fetch initial state');
        }
        const initialState = await response.json();
        setStartTimestamp(initialState.timestamp);

        const scheduler = schedulerRef.current?.instance;
        Object.assign(scheduler, initialState.data);
        updateTimeLine();
        await scheduler.project.commitAsync();
      } catch (error) {
        console.error('Error fetching initial state:', error);
      }

      ignoreChange = false;
    };

    fetchInitialState();

  }, [schedulerRef]);

  const updateTimeLine = () => {
    const scheduler = schedulerRef.current?.instance;

    if (scheduler.events.length > 0) {
      scheduler.setTimeSpan(scheduler.eventStore.min('startDate'), scheduler.eventStore.max('endDate'));
    }
  }

  const handleMessage = (msg) => {
    const
      command = msg.name,
      data = msg.data,
      userName = msg.clientId,
      scheduler = schedulerRef.current?.instance,
      eventRecord = data.id ? scheduler.eventStore.getById(data.id) : null;
    switch (command) {
      case 'updateEvent':
        if (!eventRecord) return;
        Object.keys(data.changes).forEach(key => {
          if (key.endsWith('Date')) {
            data.changes[key] = new Date(data.changes[key]);
          }
        });

        Object.assign(eventRecord, data.changes);
        updateTimeLine();
        break;

      // Removing an event
      case 'removeEvent':
        scheduler.eventStore.remove(data.records);
        break;

      // Adding an event
      case 'addEvent':
        scheduler.eventStore.add(data.records);
        break;
      case 'dragEvent': {
        const element = scheduler.getElementFromEventRecord(eventRecord);
        if (!element) {
          break;
        }

        element.dataset.userName = data.userName;

        eventRecord.draggable = false;
        eventRecord.resizable = false;

        element.classList.add('b-remote-drag');
        break;
      }
    }
  };

  return (
    <>
      <BryntumScheduler
        ref={schedulerRef}
        {...schedulerConfig}
        width={1000}
        height={500}
      />
    </>
  );
}

export default App
