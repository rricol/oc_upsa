import { Injectable } from '@nestjs/common';
import * as ical from 'node-ical';

@Injectable()
export class AppService {
  async getEvents() {
    const calendarUrls = [
      {
        name: 'Garage 002',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/3b08e8a6191a46ceaf2373cc63027837391077006656930403/calendar.ics'
      },
      {
        name: 'Garage 003',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/c987bf2910714672887ecd96d81e86fe16829438195686483790/calendar.ics'
      },
      {
        name: 'Garage 004 VU',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/4528b31398504cc1a4b484a283a6df843058598388647881466/calendar.ics'
      },
      {
        name: 'Electricité 201',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/29f186a1ce92473ab81055ae4bb59fd711070865801636167837/calendar.ics'
      },
      {
        name: 'Electricité 202',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/c462fceec76043038bd0a59e2ba53f9e5913505505940999058/calendar.ics'
      },
      {
        name: 'Garage 2R 203',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/a36aeebb437d4f0f8e7e90d6e25d8cb411120817362923158412/calendar.ics'
      },
      {
        name: 'Technique auto 204',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/c7a66a3ed2fc4721a564c4c09c043cdb7139031718621419397/calendar.ics'
      },
      {
        name: 'Electronique 406',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/968c008b6cd44bdc963fa57a93f8beae15768864573991419461/calendar.ics'
      },
      {
        name: 'Assem. & constr. 407',
        url: 'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/846f69a317b048189887a4b707ee4d6b4038843395982513225/calendar.ics'
      }
    ];

    const promises = calendarUrls.map((calendarUrl) => {
      return new Promise((resolve, reject) => {
        ical.fromURL(calendarUrl.url, {}, (err, data) => {
          if (err) {
            reject(err);
            return;
          }

          let currentEvent = null;
          let nextEvent = null;
          let calendarName = '';
          for (const k in data) {
            const now = new Date();
            if (data.hasOwnProperty(k)) {
              const event = data[k];

              // récupération du nom de la salle
              const wrCalName = data.vcalendar['WR-CALNAME'];
              calendarName = wrCalName;
              if (wrCalName.includes('-')) {
                const parts = wrCalName.split('-');
                calendarName = parts[1].trim();
              }
              if (event.type === 'VEVENT') {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                if (eventStart <= now && eventEnd >= now) {
                  currentEvent = {
                    summary: event.summary || 'Occupé',
                    start: event.start || 'No start',
                    end: event.end || 'No end'
                  };
                } else if (
                  eventStart > now
                  // (nextEvent === null || eventStart < new Date(nextEvent.start))
                ) {
                  nextEvent = {
                    summary: event.summary || 'Occupé',
                    start: event.start || 'No start',
                    end: event.end || 'No end'
                  };
                  break;
                }
              }
            }
          }

          resolve({
            calendarName: calendarName,
            currentEvent: currentEvent,
            nextEvent: nextEvent
          });
        });
      });
    });

    const results = await Promise.all(promises);

    const allEvents = [].concat(...results);
    const groupedEvents = allEvents.reduce((acc, event) => {
      if (!acc[event.calendarName]) {
        acc[event.calendarName] = {
          currentEvent: event.currentEvent || null,
          nextEvent: event.nextEvent || null
        };
      }
      return acc;
    }, {});

    return groupedEvents;
  }
}
