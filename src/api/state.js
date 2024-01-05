import Ably from "ably/promises";

let initData = {
    "timestamp": 1704465181411,
    "data": {
        "resources": [
            {
                "id": 1,
                "name": "Rob",
                "type": "Sales",
                "eventColor": "red"
            },
            {
                "id": 2,
                "name": "Mike",
                "type": "Sales",
                "eventColor": "orange"
            },
            {
                "id": 3,
                "name": "Kate",
                "type": "Sales",
                "eventColor": "green"
            },
            {
                "id": 4,
                "name": "Lisa",
                "type": "Developer",
                "eventColor": "blue"
            },
            {
                "id": 5,
                "name": "Dave",
                "type": "Developer",
                "eventColor": "teal"
            },
            {
                "id": 6,
                "name": "Arnold",
                "type": "Developer",
                "eventColor": "lime"
            },
            {
                "id": 7,
                "name": "Lee",
                "type": "Marketing",
                "eventColor": "purple"
            },
            {
                "id": 8,
                "name": "Jong",
                "type": "Marketing",
                "eventColor": "cyan"
            }
        ],
        "events": [
            {
                "id": 1,
                "resourceId": 1,
                "name": "Important Meeting",
                "startDate": "2019-02-07 09:00",
                "endDate": "2019-02-07 10:30",
                "durationUnit": "h",
                "eventType": "Meeting",
                "iconCls": "b-fa b-fa-exclamation-circle"
            },
            {
                "id": 2,
                "resourceId": 2,
                "name": "Team Meeting",
                "startDate": "2019-02-07 10:00",
                "endDate": "2019-02-07 11:30",
                "durationUnit": "h",
                "eventType": "Meeting",
                "iconCls": "b-fa b-fa-calendar"
            },
            {
                "id": 3,
                "resourceId": 3,
                "name": "Take cat to vet",
                "startDate": "2019-02-07 11:00",
                "endDate": "2019-02-07 12:30",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-cat"
            },
            {
                "id": 4,
                "resourceId": 4,
                "name": "Launch",
                "startDate": "2019-02-07 12:00",
                "endDate": "2019-02-07 13:30",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-info"
            },
            {
                "id": 5,
                "resourceId": 5,
                "name": "Sales demo",
                "startDate": "2019-02-07 13:00",
                "endDate": "2019-02-07 14:30",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-clock"
            },
            {
                "id": 6,
                "resourceId": 6,
                "name": "Daily Scrum",
                "startDate": "2019-02-07 14:00",
                "endDate": "2019-02-07 15:30",
                "durationUnit": "h",
                "eventType": "Meeting",
                "iconCls": "b-fa b-fa-calendar"
            },
            {
                "id": 7,
                "resourceId": 7,
                "name": "Sales Forecast Meeting",
                "startDate": "2019-02-07 15:00",
                "endDate": "2019-02-07 16:30",
                "durationUnit": "h",
                "eventType": "Meeting",
                "iconCls": "b-fa b-fa-calendar"
            },
            {
                "id": 8,
                "resourceId": 8,
                "name": "Get car repaired",
                "startDate": "2019-02-07 16:00",
                "endDate": "2019-02-07 17:30",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-car"
            },
            {
                "id": 9,
                "resourceId": 8,
                "name": "Dentist Appointment",
                "startDate": "2019-02-07 10:00",
                "endDate": "2019-02-07 11:00",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-clock"
            },
            {
                "id": 10,
                "resourceId": 6,
                "name": "Presentation",
                "startDate": "2019-02-07 10:00",
                "endDate": "2019-02-07 12:00",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-video"
            },
            {
                "id": 11,
                "resourceId": 7,
                "name": "Customer Meeting",
                "startDate": "2019-02-07 10:00",
                "endDate": "2019-02-07 11:30",
                "durationUnit": "h",
                "eventType": "Meeting",
                "iconCls": "b-fa b-fa-calendar-alt"
            },
            {
                "id": 12,
                "resourceId": 3,
                "name": "Visit cafe",
                "startDate": "2019-02-07 14:00",
                "endDate": "2019-02-07 16:00",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-mug-hot"
            },
            {
                "id": 13,
                "resourceId": 2,
                "name": "Movie",
                "startDate": "2019-02-07 14:30",
                "endDate": "2019-02-07 16:00",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-film"
            },
            {
                "id": 14,
                "resourceId": 1,
                "name": "Meet train",
                "startDate": "2019-02-07 15:00",
                "endDate": "2019-02-07 16:00",
                "durationUnit": "h",
                "eventType": "Appointment",
                "iconCls": "b-fa b-fa-train"
            }
        ]
    }
};

const client = new Ably.Realtime(import.meta.env.VITE_ABLY_API_KEY);
client.channels.get('scheduler').subscribe('updateEvent', (message) => {
    let change = message.data;
    const eventToUpdate = initData.data.events.find(event => event.id === change.id);
    if (eventToUpdate) {
        Object.keys(change.changes).forEach(key => {
            eventToUpdate[key] = change.changes[key];
        });
        initData.timestamp = message.timestamp;
    }
});

client.channels.get('scheduler').subscribe('addEvent', (message) => {
    let change = message.data;
    change.records.forEach(newEvent => {
        const eventExists = initData.data.events.some(event => event.id === newEvent.id);
        if (!eventExists) {
            initData.data.events.push(newEvent);
            initData.timestamp = message.timestamp
        } else {
            console.error(`Event with ID ${newEvent.id} already exists. Skipping addition.`);
        }
    });
});

client.channels.get('scheduler').subscribe('removeEvent', (message) => {
    let change = message.data;
    change.records.forEach(newEvent => {
        initData.data.events = initData.data.events.filter(event =>  {
            return event.id !== newEvent;
        });
        initData.timestamp = message.timestamp;      
    });
});

export const GET = async (req, res) => {
    return res.json(initData);
};
