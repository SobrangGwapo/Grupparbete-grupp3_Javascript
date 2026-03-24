// DOM-REFERENSER
// Hämtar viktiga element från HTML som vi ska jobba med
const eventsContainer = document.querySelector('#events-container');
const noEventsMsg     = document.querySelector('#no-events-msg');
const modalOverlay    = document.querySelector('#modal-overlay');
const registerForm    = document.querySelector('#register-form');
const eventIdInput    = document.querySelector('#event-id-input');


// TESTDATA (ANVÄNDS VID FÖRSTA BESÖKET)
// Används endast om localStorage är tomt (för att visa exempeldata)
// Fältnamn matchar Max's db.json
const sampleEvents = [
  {
    id: 1,
    namn: 'Söndags-Sparring',
    datum: '2024-05-12',
    tid: '12:00',
    adress: 'Vasagatan 30, Skövde BC',
    klubb: 'Skövde Boxning Club',
    kontakt: 'Ricky Svensson',
    telefon: '070-123 4567',
    deltagare: [
      { id:1, fornamn:'Viktor', efternamn:'Karlsson', kon:'Kille', vikt:67, foddar:2006, klubb:'Skövde Boxning Club', telefon:'070-111 2223' },
      { id:2, fornamn:'Linus',  efternamn:'Andersson',kon:'Kille', vikt:74, foddar:2008, klubb:'Skövde Boxning Club', telefon:'070-222 3334' },
      { id:3, fornamn:'Emma',   efternamn:'Larsson',  kon:'Tjej',  vikt:55, foddar:2007, klubb:'Skövde Boxning Club', telefon:'070-556 1234' },
      { id:4, fornamn:'Felix',  efternamn:'Nilsson',  kon:'Kille', vikt:81, foddar:2005, klubb:'IF Linnéa',           telefon:'070-777 0001' },
      { id:5, fornamn:'Amir',   efternamn:'Bakaric',  kon:'Kille', vikt:70, foddar:2006, klubb:'Linköpings BK',       telefon:'073-631 5432' },
      { id:6, fornamn:'Johan',  efternamn:'Svensson', kon:'Kille', vikt:79, foddar:2003, klubb:'Partille BK',         telefon:'070-456 7890' },
    ]
  },
  {
    id: 2,
    namn: 'Måndags-Match',
    datum: '2024-05-20',
    tid: '18:00',
    adress: 'Idrottsgatan 5, Skövde',
    klubb: 'Skövde Boxning Club',
    kontakt: 'Anna Lindqvist',
    telefon: '073-456 7890',
    deltagare: []
  }
];


// HJÄLPFUNKTION: FORMATERA DATUM
// Gör om datum från YYYY-MM-DD till ett mer läsbart svenskt format
const formatDate = (s) => {
  const months = ['januari','februari','mars','april','maj','juni',
    'juli','augusti','september','oktober','november','december'];
  const [year, month, day] = s.split('-');
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
};


// SKAPA: RAD FÖR DELTAGARE
// Skapar en tabellrad för en deltagare
// Använder Max's fältnamn: fornamn, efternamn, foddar, telefon
const createParticipantRow = (p, eventId, index) => {
  const tr = document.createElement('tr');

  // Kön, vikt, födelseår, namn (för- och efternamn)
  [p.kon, `${p.vikt} kg`, p.foddar, `${p.fornamn} ${p.efternamn}`].forEach(text => {
    const td = document.createElement('td');
    td.textContent = text;
    tr.appendChild(td);
  });

  // Klubb + telefonnummer
  const tdKlubb = document.createElement('td');
  tdKlubb.innerHTML = `${p.klubb}<br><small style="color:#999">📞 ${p.telefon}</small>`;
  tr.appendChild(tdKlubb);

  // Kontaktkolumn
  const tdKontakt = document.createElement('td');
  tdKontakt.innerHTML = `📞 ${p.telefon}`;
  tr.appendChild(tdKontakt);

  // Radera-knapp
  const tdDel = document.createElement('td');
  const delBtn = document.createElement('button');
  delBtn.classList.add('btn-delete');
  delBtn.innerHTML = '🗑';
  delBtn.title = `Ta bort ${p.fornamn} ${p.efternamn}`;

  // När man klickar → ta bort deltagaren
  delBtn.addEventListener('click', () => handleDelete(eventId, index));

  tdDel.appendChild(delBtn);
  tr.appendChild(tdDel);

  return tr;
};


// SKAPA: DELTAGARTABELL
// Skapar hela tabellen med deltagare för ett event
const createParticipantTable = (deltagare, eventId) => {
  const table = document.createElement('table');
  table.classList.add('participant-table');

  // Tabellhuvud (rubriker)
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  ['Kön', 'Vikt', 'Född år', 'Namn', 'Klubb', 'Kontakt', 'Radera']
    .forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      headerRow.appendChild(th);
    });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Tabellinnehåll
  const tbody = document.createElement('tbody');

  // Om inga deltagare finns → visa meddelande
  if (deltagare.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', '7');
    td.classList.add('no-participants');
    td.textContent = 'Inga anmälda deltagare ännu.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    deltagare.forEach((p, i) =>
      tbody.appendChild(createParticipantRow(p, eventId, i))
    );
  }

  table.appendChild(tbody);
  return table;
};


// SKAPA: EVENT-KORT
// Skapar hela UI-kortet för ett event
// Använder Max's fältnamn: namn, datum, tid, adress, klubb, kontakt, telefon, deltagare
const createEventCard = (event) => {
  const card = document.createElement('div');
  card.classList.add('event-card');

  const inner = document.createElement('div');
  inner.classList.add('event-card-inner');

  // Header (namn + knapp)
  const header = document.createElement('div');
  header.classList.add('card-header');

  const name = document.createElement('h3');
  name.classList.add('event-name');
  name.textContent = event.namn.toUpperCase();

  // Knapp för att öppna anmälningsformulär
  const regBtn = document.createElement('button');
  regBtn.classList.add('btn-register');
  regBtn.innerHTML = 'Anmäl dig ›';
  regBtn.addEventListener('click', () => openModal(event.id));

  header.appendChild(name);
  header.appendChild(regBtn);
  inner.appendChild(header);

  // Information om eventet
  const meta = document.createElement('div');
  meta.classList.add('card-meta');
  meta.innerHTML = `
    <div class="meta-row">
      <span class="meta-item">📅 <strong>${formatDate(event.datum)}</strong>, kl: ${event.tid}</span>
    </div>
    <div class="meta-row">
      <span class="meta-item">📍 ${event.adress}</span>
      <span class="meta-divider">|</span>
      <span class="meta-item">🥊 ${event.klubb}</span>
    </div>
    <div class="meta-row">
      <span class="meta-item">📞 ${event.kontakt} ${event.telefon}</span>
    </div>`;

  inner.appendChild(meta);

  // Lägg till deltagartabell
  inner.appendChild(createParticipantTable(event.deltagare, event.id));

  card.appendChild(inner);
  return card;
};


// VISA ALLA EVENTS
// Renderar alla events på sidan
const displayEvents = (events) => {
  eventsContainer.innerHTML = '';

  // Om inga events finns → visa meddelande
  if (events.length === 0) {
    noEventsMsg.style.display = 'block';
    return;
  }

  noEventsMsg.style.display = 'none';

  // Skapa kort för varje event
  events.forEach(event =>
    eventsContainer.appendChild(createEventCard(event))
  );
};


// HANTERA: TA BORT DELTAGARE
// Tar bort en deltagare från ett event
const handleDelete = (eventId, index) => {
  const events = getFromStorage('events');

  const idx = events.findIndex(e => e.id === eventId);

  if (idx !== -1) {
    events[idx].deltagare.splice(index, 1);

    // Uppdatera localStorage
    localStorage.setItem('events', JSON.stringify(events));

    // Uppdatera UI
    displayEvents(events);
  }
};


// MODAL: ÖPPNA
// Visar formuläret för att anmäla sig
const openModal = (eventId) => {
  eventIdInput.value = eventId;
  registerForm.reset();
  eventIdInput.value = eventId;
  modalOverlay.style.display = 'flex';
};


// MODAL: STÄNG
// Stänger formuläret
const closeModal = () => {
  modalOverlay.style.display = 'none';
  registerForm.reset();
};


// Event listeners för att stänga modal
document.querySelector('#close-modal').addEventListener('click', closeModal);
document.querySelector('#cancel-btn').addEventListener('click', closeModal);

// Klick utanför modal → stäng
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});


// FORM: SKICKA
// Körs när användaren skickar formuläret
// Skapar deltagarobjekt med Max's fältnamn
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const eventId = parseInt(eventIdInput.value);

  // Hämta för- och efternamn från namnfältet
  const fullNamn = document.querySelector('#namn').value.trim().split(' ');
  const fornamn = fullNamn[0] || '';
  const efternamn = fullNamn.slice(1).join(' ') || '';

  // Skapa deltagarobjekt med Max's fältnamn
  const deltagare = {
    id:        Date.now(), // unikt id
    fornamn:   fornamn,
    efternamn: efternamn,
    kon:       document.querySelector('#kon').value,
    foddar:    parseInt(document.querySelector('#fodelsear').value),
    vikt:      parseInt(document.querySelector('#vikt').value),
    klubb:     document.querySelector('#klubb').value.trim(),
    telefon:   document.querySelector('#mobilnummer').value.trim(),
  };

  const events = getFromStorage('events');
  const idx = events.findIndex(ev => ev.id === eventId);

  if (idx !== -1) {
    events[idx].deltagare.push(deltagare);

    // Spara i localStorage
    localStorage.setItem('events', JSON.stringify(events));
  }

  closeModal();
  displayEvents(events);
});


// INITIERING
// Körs när sidan laddas
const initApp = () => {
  const stored = getFromStorage('events');

  // Om ingen data finns → använd testdata
  if (stored.length === 0) {
    localStorage.setItem('events', JSON.stringify(sampleEvents));
    displayEvents(sampleEvents);
  } else {
    displayEvents(stored);
  }
};


// Hjälpfunktion för att uppdatera events manuellt
const refreshEvents = () => displayEvents(getFromStorage('events'));


// Kör init när sidan är redo
document.addEventListener('DOMContentLoaded', initApp);