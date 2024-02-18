"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const ical = require("node-ical");
let AppService = class AppService {
    async getEvents() {
        const calendarUrls = [
            'https://calendar.google.com/calendar/ical/c_6166438be80c6264810dcfa3a6d8b02cc7c209fd66894eb0fa8ce7bb8d82efb2%40group.calendar.google.com/public/basic.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/0685cc3456eb4029a13dcc5cb2507003941587491522089634/calendar.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/4d8e3809c662407788d7bd53a491891017821783700213908280/calendar.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/39834768f9f64608bccc710cecf9053511768132098882597266/calendar.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/39834768f9f64608bccc710cecf9053511768132098882597266/calendar.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/e9a49e2f711c4a418bed0a916ec8509b15230699364362141759/calendar.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/27efba0d21af47d4805cdca333a6ec347063493297512780677/calendar.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/d4c6669fe82d49e88afbada23c0d60a42169409082601815304/calendar.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/3775c0040ecd4c94984791b23c978e2115812837790103755787/calendar.ics',
            'https://outlook.office365.com/owa/calendar/cb667b0fc3c64d00ac29c54350fc0304@upsa-vaud.ch/7f45e5f20edf4759a0ac7f78e841e27f17674725561211878860/calendar.ics',
        ];
        const promises = calendarUrls.map((calendarUrl) => {
            return new Promise((resolve, reject) => {
                ical.fromURL(calendarUrl, {}, (err, data) => {
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
                                        summary: event.summary || 'No title',
                                        start: event.start || 'No start',
                                        end: event.end || 'No end',
                                    };
                                }
                                else if (eventStart > now) {
                                    nextEvent = {
                                        summary: event.summary || 'No title',
                                        start: event.start || 'No start',
                                        end: event.end || 'No end',
                                    };
                                    break;
                                }
                            }
                        }
                    }
                    resolve({
                        calendarName: calendarName,
                        currentEvent: currentEvent,
                        nextEvent: nextEvent,
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
                    nextEvent: event.nextEvent || null,
                };
            }
            return acc;
        }, {});
        return groupedEvents;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map