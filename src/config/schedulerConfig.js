export const getSchedulerConfig = (members) => {
    // Configuration for Bryntum Scheduler
    return {
        autoAdjustTimeAxis: false,
        emptyText: '',
        zoomOnMouseWheel: false,
        zoomOnTimeAxisDoubleClick: false,
        responsiveLevels: {
            small: {
                levelWidth: 800,
                rowHeight: 35,
                barMargin: 2
            },
            normal: {
                levelWidth: '*',
                rowHeight: 50,
                barMargin: 5
            }
        },
        viewPreset: {
            base: 'hourAndDay',
            timeResolution: {
                unit: 'minute',
                increment: 5
            }
        },
        columns: [
            {
                field: 'name',
                text: 'Name',
                width: 70
            }
        ],
        bbar: [
            {
                type: 'widget',
                html: '<label>Who is online:</label>'
            },
            {
                type: 'container',
                html: members.map(member => `<span>${member.profileData.username}</span>`).join(', ')
            }
        ]
    }
};