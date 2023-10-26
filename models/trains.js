const fetch = require('node-fetch');
const EventSource = require('eventsource');

function getQuery() {
    return `<REQUEST>
                <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                <QUERY sseurl="true" 
                namespace="järnväg.trafikinfo" 
                objecttype="TrainPosition" 
                schemaversion="1.0" limit="1" />
            </REQUEST>`;
}

const trains = {
    fetchTrainPositions: async function fetchTrainPositions(io) {
        const trainPositions = {};
        const eventSource = await this.createEventSource();

        eventSource.onopen = () => {
            console.log("Connection to server opened.");
        };

        io.on('connection', () => {
            console.log('a user connected');

            eventSource.onmessage = (e) => {
                this.trackPosition(e, io, trainPositions);
            };
        });

        eventSource.onerror = (e) => {
            console.log("EventSource failed.", e);
        };
    },

    createEventSource: async function createEventSource() {
        const query = getQuery();

        const response = await fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
            }
        );
        const result = await response.json();
        const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL;

        const eventSource = new EventSource(sseurl);

        return eventSource;
    },

    trackPosition: function trackPosition(e, io, trainPositions) {
        try {
            const parsedData = JSON.parse(e.data);

            if (parsedData) {
                const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];
                const matchCoords = /(\d*\.\d+|\d+),?/g;
                const position = changedPosition.Position.WGS84
                    .match(matchCoords)
                    .map((t=>parseFloat(t)))
                    .reverse();

                const trainObject = {
                    trainnumber: changedPosition.Train.OperationalTrainNumber,
                    position: position,
                    timestamp: changedPosition.TimeStamp,
                    bearing: changedPosition.Bearing,
                    status: !changedPosition.Deleted,
                    speed: changedPosition.Speed,
                };

                if (
                    Object.prototype.hasOwnProperty
                        .call(trainPositions, changedPosition.Train.OperationalTrainNumber)
                ) {
                    io.emit("message", trainObject);
                }

                trainPositions[changedPosition.Train.OperationalTrainNumber] = trainObject;
            }
        } catch (e) {
            console.log(e);
        }
        return;
    }
};

module.exports = trains;
