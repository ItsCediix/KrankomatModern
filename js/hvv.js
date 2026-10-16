const KrankomatHVV = {
    // Linienfarben der Hamburger U- und S-Bahn (bg = Hintergrund, text = Schriftfarbe)
    LINE_COLORS: {
        U1: { bg: '#0066B3', text: '#ffffff' },
        U2: { bg: '#E2001A', text: '#ffffff' },
        U3: { bg: '#FFD500', text: '#1e1e1e' },
        U4: { bg: '#009A93', text: '#ffffff' },
        S1: { bg: '#00962C', text: '#ffffff' },
        S2: { bg: '#B51143', text: '#ffffff' },
        S3: { bg: '#622181', text: '#ffffff' },
        S5: { bg: '#0089C4', text: '#ffffff' },
        S7: { bg: '#E07D17', text: '#ffffff' }
    },

    init: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        const toggleBtn = document.getElementById('hvv-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.openModal());
        }
        
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('hvv-modal');
            if (modal && e.target === modal) {
                this.closeModal();
            }
        });
    },

    openModal: function() {
        this.renderModal();
        const contentEl = document.getElementById('hvv-content');
        if (!contentEl || !Krankomat.State.data.config?.hvvUrl) return;
        const spinner = contentEl.innerHTML;
        // DSGVO: erst nach Einwilligung Daten von hvv.de laden
        Krankomat.Utils.requireExternalConsent('hvv', contentEl, {
            title: 'HVV-Abfahrten laden?',
            provider: 'Hamburger Verkehrsverbund GmbH',
            host: 'www.hvv.de'
        }, () => {
            contentEl.innerHTML = spinner;
            this.fetchData();
        });
    },

    closeModal: function() {
        const container = document.getElementById('hvv-modal-container');
        if (container) {
            container.innerHTML = '';
        }
    },

    renderModal: function() {
        const container = document.getElementById('hvv-modal-container');
        if (!container) return;

        const hvvUrl = Krankomat.State.data.config?.hvvUrl || '';

        container.innerHTML = `
            <div id="hvv-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
                    <div class="p-4 lg:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 flex items-center justify-center text-[#00962c]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="100.7025 87.8992 323.9685 323.9681" class="w-full h-full">
                                  <defs>
                                    <clipPath clipPathUnits="userSpaceOnUse" id="clipPath188_modal">
                                      <path d="m 482.129,10.747 98.903,0 0,21.033 -98.903,0 0,-21.033 z"/>
                                    </clipPath>
                                  </defs>
                                  <g transform="matrix(12.322287559509277, 0, 0, 12.322287559509277, -2686.6875, -5596.1552734375)">
                                    <g transform="matrix(1, 0, 0, 1, 33.668869, -27.289463)">
                                      <g transform="matrix(1.25,0,0,-1.25,-410.12253,528.29722)">
                                        <g clip-path="url(#clipPath188_modal)">
                                          <g transform="translate(482.1287,21.2643)">
                                            <path d="m 0,0 c 0,5.808 4.708,10.516 10.516,10.516 5.808,0 10.517,-4.708 10.517,-10.516 0,-5.808 -4.709,-10.517 -10.517,-10.517 C 4.708,-10.517 0,-5.808 0,0" style="fill:currentColor;fill-rule:evenodd;stroke:none"/>
                                          </g>
                                          <g transform="translate(498.4521,27.3232)">
                                            <path d="m 0,0 0,-2.729 c -1.449,1.563 -3.633,2.936 -6.193,2.936 -1.45,0 -2.278,-0.772 -2.278,-1.675 0,-3.802 9.468,-1.129 9.468,-7.378 0,-2.523 -2.446,-5.459 -6.569,-5.459 -2.297,0 -4.95,1.035 -6.4,2.334 l 0,3.276 c 1.374,-1.977 3.878,-3.501 6.4,-3.501 1.544,0 2.786,0.884 2.786,1.826 0,3.556 -9.317,1.354 -9.317,7.49 0,3.219 3.143,4.951 5.966,4.951 C -3.784,2.071 -1.675,1.299 0,0" style="fill:#ffffff;fill-rule:evenodd;stroke:none"/>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </svg>
                            </div>
                            <h2 class="text-xl font-bold text-slate-800 dark:text-white">HVV Abfahrten</h2>
                        </div>
                        <button id="hvv-close-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div class="p-4 lg:p-6 overflow-y-auto flex-grow" id="hvv-content">
                        ${!hvvUrl ? `
                            <div class="text-center py-8">
                                <p class="text-slate-500 dark:text-slate-400 mb-4">Keine HVV URL in der Konfiguration gefunden.</p>
                                <p class="text-sm text-slate-400 dark:text-slate-500">Bitte füge eine HVV Abfahrtsmonitor-URL in der Konfiguration (hvvUrl) hinzu.</p>
                            </div>
                        ` : `
                            <div class="flex justify-center items-center py-12">
                                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('hvv-close-btn')?.addEventListener('click', () => this.closeModal());
    },

    fetchData: async function() {
        const hvvUrl = Krankomat.State.data.config?.hvvUrl;
        if (!hvvUrl) return;

        const contentEl = document.getElementById('hvv-content');
        if (!contentEl) return;

        try {
            // Extract show ID
            const urlObj = new URL(hvvUrl);
            const showId = urlObj.searchParams.get('show');

            if (!showId) {
                throw new Error('Keine "show" ID in der URL gefunden.');
            }

            // DSGVO: Die Konfiguration wurde früher über den Drittanbieter-Proxy api.codetabs.com geladen
            // (Übermittlung der IP-Adresse an einen Dritten). Da Station und Filter ohnehin fest auf
            // Berliner Tor gesetzt werden, entfällt dieser Abruf ersatzlos.
            const configData = {};

            // Hardcode Berliner Tor station
            configData.stationList = [{
                name: 'Berliner Tor',
                city: 'Hamburg',
                combinedName: 'Berliner Tor',
                id: 'Master:10952',
                globalId: 'de:02000:10952',
                type: 'STATION'
            }];
            configData.filterList = [];
            
            const stationName = configData.stationList[0].name;
            
            // Fetch departures from HVV API directly (supports CORS for file://)
            const now = new Date();
            const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            const payload = {
                version: 51,
                station: configData.stationList[0],
                time: { date: dateStr, time: timeStr },
                maxList: 40,
                allStationsInChangingNode: true,
                returnFilters: true,
                filter: configData.filterList || [],
                maxTimeOffset: 200,
                useRealtime: true
            };

            const depRes = await fetch('https://www.hvv.de/geofox/departureList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!depRes.ok) {
                throw new Error('Fehler beim Laden der Abfahrten (HVV API).');
            }

            const depData = await depRes.json();
            
            let departures = depData.departures || [];
            
            // Remove Client-Side logic, fetch all departures for Berliner Tor
            // Limit to 20 departures to avoid overwhelming the popup
            // Nur Bahnen anzeigen (U- und S-Bahn), keine Busse
            departures = departures.filter(dep => {
                const type = dep.line && dep.line.type && dep.line.type.simpleType;
                return type !== 'BUS';
            });
            departures = departures.slice(0, 20);
            
            this.renderDepartures(departures, configData.stationList[0].name);

        } catch (error) {
            console.error('HVV Error:', error);
            contentEl.innerHTML = `
                <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
                    <p class="font-medium">Fehler beim Laden der Daten</p>
                    <p class="text-sm mt-1">${error.message}</p>
                </div>
            `;
        }
    },

    renderDepartures: function(departures, stationName) {
        const contentEl = document.getElementById('hvv-content');
        if (!contentEl) return;

        const validDepartures = departures; // HVV API returns valid departures

        if (validDepartures.length === 0) {
            contentEl.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-slate-500 dark:text-slate-400">Keine Abfahrten in nächster Zeit gefunden.</p>
                </div>
            `;
            return;
        }

        let html = `
            <h3 class="font-semibold text-slate-700 dark:text-slate-300 mb-4 text-lg">Abfahrten ab ${stationName}</h3>
            <div class="space-y-3">
        `;

        validDepartures.forEach(dep => {
            const lineName = dep.line && dep.line.name ? dep.line.name : 'Unbekannt';
            const direction = dep.line && dep.line.direction ? dep.line.direction : 'Unbekannt';
            const isCancelled = dep.cancelled === true;
            
            const timeOffset = Math.max(0, dep.timeOffset || 0);
            const delay = dep.delay ? Math.floor(dep.delay / 60) : 0;
            
            let timeText = timeOffset === 0 ? 'Jetzt' : `in ${timeOffset} Min`;
            if (isCancelled) {
                timeText = 'Fällt aus';
            }
            
            let delayHtml = '';
            
            if (!isCancelled) {
                if (delay > 0) {
                    delayHtml = `<span class="text-red-500 text-xs font-medium ml-2">+${delay}</span>`;
                } else if (delay < 0) {
                    delayHtml = `<span class="text-green-500 text-xs font-medium ml-2">${delay}</span>`;
                }
            }

            // Linien-Badge im HVV-Stil: S-Bahn als abgerundete Pille, U-Bahn als eckiges Rechteck,
            // jeweils in der Linienfarbe (Farben zentral in LINE_COLORS pflegen)
            const lineKey = lineName.replace(/\s+/g, '');
            const color = KrankomatHVV.LINE_COLORS[lineKey];
            let badgeShape = 'rounded-md';
            let badgeStyle = '';
            let badgeClasses = 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
            if (/^S\d/.test(lineKey)) {
                badgeShape = 'rounded-full';
            } else if (/^U\d/.test(lineKey)) {
                badgeShape = 'rounded-none';
            }
            if (color) {
                badgeStyle = `background-color:${color.bg};color:${color.text};`;
                badgeClasses = '';
            }
            const iconHtml = lineKey;

            const platform = dep.realtimePlatform || dep.platform || '';

            html += `
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors ${isCancelled ? 'opacity-60' : ''}">
                    <div class="flex items-center space-x-4 overflow-hidden">
                        <div class="${badgeClasses} ${badgeShape} font-bold text-sm leading-none px-2.5 py-1.5 min-w-[3rem] text-center flex-shrink-0 flex items-center justify-center tracking-tight" style="${badgeStyle}">
                            ${iconHtml}
                        </div>
                        <div class="truncate">
                            <p class="font-medium text-slate-800 dark:text-slate-200 truncate ${isCancelled ? 'line-through' : ''}" title="${direction}">${direction}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">${platform ? 'Gleis ' + platform : ''}</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4">
                        <p class="font-bold ${isCancelled ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}">${timeText}</p>
                        ${delayHtml}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        contentEl.innerHTML = html;
    }
};

// Expose globally
window.KrankomatHVV = KrankomatHVV;
