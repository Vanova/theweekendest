import React from 'react';
import TrainMapStop from './trainMapStop.jsx';
import { cloneDeep } from "lodash";

class TripMap extends React.Component {  
  normalizeTrip(arrivalTimes, currentTime) {
    const times = Object.keys(arrivalTimes).filter((key) => {
      const estimatedTime = arrivalTimes[key];
      return estimatedTime >= (currentTime - 59);
    }).map((key) => {
      const estimatedTime = arrivalTimes[key];
      return {
        stop_id: key.substr(0, 3),
        estimated_time: estimatedTime,
      };
    });

    const firstStopInFuture = times.find((a) => a.estimated_time >= currentTime + 30);
    if (!firstStopInFuture) {
      return times;
    }

   const pos = times.indexOf(firstStopInFuture);
   return times.slice(Math.max(0, pos - 1), times.length);
  }

  render() {
    const { trip, train, trains, stops, accessibleStations, elevatorOutages } = this.props;
    const currentTime = Date.now() / 1000;
    const tripRoute = this.normalizeTrip(trip.times, currentTime);
    return(
      <div>
        <ul style={{listStyleType: "none", textAlign: "left", margin: "auto", padding: 0, marginBottom: '.5em'}}>
          {
            tripRoute.map((tripStop) => {
              const stopId = tripStop.stop_id
              const stop = stops[stopId];
              let transfers = stop && cloneDeep(stop.trains.filter(route => route.id != train.id));
              return (
                <TrainMapStop key={stopId} trains={trains} stop={stop} color={train.color} southStop={true}
                  northStop={false} transfers={transfers} branchStops={[true]} activeBranches={[true]}
                  accessibleStations={accessibleStations} elevatorOutages={elevatorOutages}
                  arrivalTime={Math.max(tripStop.estimated_time - currentTime, 1)}
                  />
              )
            })
          }
        </ul>
      </div>
    )
  }
}
export default TripMap