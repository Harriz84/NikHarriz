const DAYS = window.BERLIN_DAY_PARTS || [];
const GUIDE_CONTENT = window.BERLIN_GUIDE_CONTENT || {};
const GALLERY_DATA = window.BERLIN_GALLERIES || {};
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[char]));
const paragraphs = value => (Array.isArray(value) ? value : [value]).filter(Boolean).map(text => `<p>${esc(text)}</p>`).join("");

const PHOTO_MAP = {
  "Berlin Hauptbahnhof":"exact-berlin-hauptbahnhof.jpg",
  "Berlin Hauptbahnhof & vertrek":"exact-berlin-hauptbahnhof-vertrek.jpg",
  "Café am Neuen See":"cafe-am-neuen-see.jpg",
  "Berlin Marriott Hotel":"exact-berlin-marriott-hotel.jpg",
  "Potsdamer Platz & hotelomgeving":"exact-potsdamer-platz-hotelomgeving.jpg",
  "Markthalle Neun – Street Food Thursday":"markthalle-neun.jpg",
  "Zoo Berlin":"exact-zoo-berlin.jpg",
  "Aquarium Berlin":"exact-aquarium-berlin.jpg",
  "Kaiser-Wilhelm-Gedächtniskirche":"exact-kaiser-wilhelm-gedachtniskirche.jpg",
  "Bikini Berlin & stukje Kurfürstendamm":"exact-bikini-berlin-stukje-kurfurstendamm.jpg",
  "NENI Berlin":"exact-neni-berlin.jpg",
  "ANOHA Kindermuseum":"exact-anoha-kindermuseum.jpg",
  "The Wall Museum":"exact-the-wall-museum.jpg",
  "Oberbaumbrücke":"oberbaumbruecke.jpg",
  "Arminiusmarkthalle":"arminiusmarkthalle.jpg",
  "Schloss Bellevue":"schloss-bellevue.jpg",
  "Haus der Kulturen der Welt":"haus-der-kulturen.jpg",
  "Bundeskanzleramt":"bundeskanzleramt.jpg",
  "Reichstag":"reichstag.jpg",
  "Burgermeister Potsdamer Platz":"exact-burgermeister-potsdamer-platz.jpg",
  "Topographie des Terrors":"topographie-des-terrors.jpg",
  "Checkpoint Charlie":"checkpoint-charlie.jpg",
  "Panorama Punkt":"exact-panorama-punkt.jpg",
  "Holocaustmonument":"exact-holocaustmonument.jpg",
  "Brandenburger Tor":"exact-brandenburger-tor.jpg",
  "East Side Gallery":"exact-east-side-gallery.jpg",
  "Zicht op Molecule Man & Badeschiff":"exact-zicht-op-molecule-man-badeschiff.jpg",
  "RAW-Gelände":"exact-raw-gelande.jpg",
  "Boxhagener Platz vlooienmarkt":"exact-boxhagener-platz-vlooienmarkt.jpg",
  "Mauerpark markt & karaoke":"exact-mauerpark-markt-karaoke.jpg",
  "Gedenkstätte Berliner Mauer – Bernauer Straße":"exact-gedenkstatte-berliner-mauer-bernauer-strasse.jpg",
  "BeachMitte":"exact-beachmitte.jpg",
  "Alexanderplatz":"exact-alexanderplatz.jpg",
  "Fernsehturm":"exact-fernsehturm.jpg",
  "Berliner Dom":"exact-berliner-dom.jpg",
  "Museumeiland":"exact-museumeiland.jpg",
  "Monbijoupark":"exact-monbijoupark.jpg",
  "Hackesche Höfe":"exact-hackesche-hofe.jpg",
  "Scheunenviertel / Spandauer Vorstadt":"exact-scheunenviertel-spandauer-vorstadt.jpg",
  "Snelle lunch rond Hackescher Markt":"exact-hackesche-hofe.jpg",
  "Vertrek vanaf hotel":"exact-berlin-marriott-hotel.jpg",
  "Terug naar hotel":"exact-berlin-marriott-hotel.jpg",
  "Uitchecken & bagage opslaan":"exact-berlin-marriott-hotel.jpg",
  "Bagage ophalen bij hotel":"exact-berlin-marriott-hotel.jpg"
};

const RATINGS = {
  "Berlin Marriott Hotel": {score:4.4, url:"https://www.tripadvisor.com/Hotel_Review-g187323-d276043-Reviews-Berlin_Marriott_Hotel-Berlin.html"},
  "Markthalle Neun – Street Food Thursday": {score:4.3, url:"https://www.tripadvisor.com/Restaurant_Review-g187323-d7085686-Reviews-Markthalle_Neun-Berlin.html"},
  "Potsdamer Platz & hotelomgeving": {score:4.1, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190537-Reviews-Potsdamer_Platz-Berlin.html"},
  "Zoo Berlin": {score:4.3, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d314008-Reviews-Zoo_Berlin-Berlin.html"},
  "Aquarium Berlin": {score:4.1, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d2229043-Reviews-Aquarium_Berlin-Berlin.html"},
  "Café am Neuen See": {score:3.3, url:"https://www.tripadvisor.com/Restaurant_Review-g187323-d695546-Reviews-Cafe_am_Neuen_See_Biergarten-Berlin.html"},
  "Kaiser-Wilhelm-Gedächtniskirche": {score:4.4, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190541-Reviews-Kaiser_Wilhelm_Memorial_Church-Berlin.html"},
  "Bikini Berlin & stukje Kurfürstendamm": {score:4.2, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d6940796-Reviews-Bikini_Berlin-Berlin.html"},
  "NENI Berlin": {score:4.0, url:"https://www.tripadvisor.com/Restaurant_Review-g187323-d6219662-Reviews-NENI-Berlin.html"},
  "ANOHA Kindermuseum": {score:4.7, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d23618594-Reviews-Anoha_Die_Kinderwelt_Des_Judischen_Museums_Berlin-Berlin.html"},
  "Checkpoint Charlie": {score:3.3, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d1166028-Reviews-Checkpoint_Charlie-Berlin.html"},
  "East Side Gallery": {score:4.4, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d191041-Reviews-East_Side_Gallery-Berlin.html"},
  "Brandenburger Tor": {score:4.5, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190518-Reviews-Brandenburg_Gate-Berlin.html"},
  "Topographie des Terrors": {score:4.5, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190535-Reviews-Topography_of_Terror-Berlin.html"},
  "Holocaustmonument": {score:4.4, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d617423-Reviews-The_Holocaust_Memorial_Memorial_to_the_Murdered_Jews_of_Europe-Berlin.html"},
  "Reichstag": {score:4.6, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190517-Reviews-Reichstag_Building-Berlin.html"},
  "Burgermeister Potsdamer Platz": {score:4.4, url:"https://www.tripadvisor.com/Restaurant_Review-g187323-d23125400-Reviews-Burgermeister_Potsdamer_Platz-Berlin.html"},
  "Panorama Punkt": {score:4.2, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d313992-Reviews-Panoramapunkt-Berlin.html"},
  "Haus der Kulturen der Welt": {score:4.0, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d3497875-Reviews-Haus_der_Kulturen_der_Welt-Berlin.html"},
  "Schloss Bellevue": {score:4.1, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d10036994-Reviews-Bellevue_Palace-Berlin.html"},
  "Arminiusmarkthalle": {score:4.1, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d8113147-Reviews-Arminiusmarkthalle-Berlin.html"},
  "The Wall Museum": {score:3.8, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d10109747-Reviews-The_Wall_Museum-Berlin.html"},
  "Oberbaumbrücke": {score:4.2, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d3953115-Reviews-Oberbaumbrucke-Berlin.html"},
  "RAW-Gelände": {score:null, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d3633006-Reviews-RAW_Tempel-Berlin.html"},
  "Boxhagener Platz vlooienmarkt": {score:4.2, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d547346-Reviews-Boxhagener_Platz-Berlin.html"},
  "Mauerpark markt & karaoke": {score:4.2, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d3470243-Reviews-Mauerpark_Flea_Market-Berlin.html"},
  "Gedenkstätte Berliner Mauer – Bernauer Straße": {score:4.5, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d196239-Reviews-Memorial_of_the_Berlin_Wall-Berlin.html"},
  "BeachMitte": {score:4.4, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d2341355-Reviews-Beachmitte-Berlin.html"},
  "Alexanderplatz": {score:3.9, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d265858-Reviews-Alexanderplatz-Berlin.html"},
  "Fernsehturm": {score:4.0, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190589-Reviews-Berliner_Fernsehturm-Berlin.html"},
  "Berliner Dom": {score:4.4, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190545-Reviews-Berliner_Dom-Berlin.html"},
  "Museumeiland": {score:4.6, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190520-Reviews-Museum_Island-Berlin.html"},
  "Hackesche Höfe": {score:4.3, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d190659-Reviews-Die_Hackeschen_Hoefe-Berlin.html"},
  "Snelle lunch rond Hackescher Markt": {score:4.2, url:"https://www.tripadvisor.com/Attraction_Review-g187323-d7083034-Reviews-Hackescher_Markt-Berlin.html"}
};

const RATING_ALIASES = {
  "Vertrek vanaf hotel":"Berlin Marriott Hotel",
  "Terug naar hotel":"Berlin Marriott Hotel",
  "Uitchecken & bagage opslaan":"Berlin Marriott Hotel",
  "Bagage ophalen bij hotel":"Berlin Marriott Hotel"
};

const HISTORY = {
  "Berlin Hauptbahnhof":"Het glazen hoofdstation opende in 2006 op de plek van het vroegere Lehrter Bahnhof. De kruisende spoorlagen maken het tot een van Europa’s opvallendste stationsgebouwen.",
  "Berlin Hauptbahnhof & vertrek":"Het glazen hoofdstation opende in 2006 op de plek van het vroegere Lehrter Bahnhof. De kruisende spoorlagen maken het tot een van Europa’s opvallendste stationsgebouwen.",
  "Berlin Marriott Hotel":"Jullie uitvalsbasis ligt aan het moderne Potsdamer Platz, een gebied dat na de Duitse hereniging vrijwel volledig opnieuw werd opgebouwd.",
  "Markthalle Neun – Street Food Thursday":"Markthal IX werd in 1891 geopend als onderdeel van Berlijns netwerk van overdekte markten. Sinds de heropening in 2011 draait de hal om ambachtelijk eten en buurtcultuur.",
  "Potsdamer Platz & hotelomgeving":"Voor de oorlog was dit een van Europa’s drukste pleinen. Tijdens de Koude Oorlog lag het braak bij de Muur; vanaf de jaren negentig werd het een symbool van het nieuwe Berlijn.",
  "Zoo Berlin":"De dierentuin opende in 1844 en is de oudste van Duitsland. Hij staat bekend om zijn grote soortenrijkdom en de historische toegangspoorten.",
  "Aquarium Berlin":"Het aquarium opende in 1913 en vormt met de Zoo één historisch dierenparkcomplex. De collectie loopt van zeedieren tot reptielen en insecten.",
  "Café am Neuen See":"Deze biertuin ligt aan de Neuer See in de Tiergarten. De combinatie van water, bomen en roeiboten maakt het vooral een rustpunt tussen de stadse bezienswaardigheden.",
  "Kaiser-Wilhelm-Gedächtniskirche":"De beschadigde toren uit 1895 bleef na de oorlog bewust als ruïne staan. De moderne kerk uit de jaren zestig vormt samen met de ruïne een monument voor vrede.",
  "ANOHA Kindermuseum":"ANOHA is het kinderdeel van het Joods Museum Berlijn. De houten ark in een voormalige bloemenmarkthal vertaalt het verhaal van Noach naar spel, samenwerking en duurzaamheid.",
  "Checkpoint Charlie":"Hier lag vanaf 1961 de bekendste grensovergang voor geallieerden en buitenlanders. De huidige wachtpost is een reconstructie; de historische betekenis zit vooral in de plek.",
  "Topographie des Terrors":"Op dit terrein stonden de hoofdkwartieren van Gestapo, SS en Reichsveiligheidshoofdbureau. Het documentatiecentrum legt uit hoe de naziterreur bestuurlijk werd georganiseerd.",
  "Panorama Punkt":"De Kollhoff-Tower hoort bij de wederopbouw van Potsdamer Platz. De lift naar het uitzichtplatform geldt als een van de snelste van Europa.",
  "Holocaustmonument":"Het monument van Peter Eisenman werd in 2005 geopend. De 2.711 betonnen stelen vormen een abstract landschap dat bewust geen vaste interpretatie oplegt.",
  "Brandenburger Tor":"De poort werd tussen 1788 en 1791 gebouwd. Na jaren in de grenszone van de Berlijnse Muur werd zij hét symbool van Duitse hereniging.",
  "Reichstag":"Het parlementsgebouw opende in 1894, brandde in 1933 en raakte zwaar beschadigd in de oorlog. Norman Foster voegde na de hereniging de transparante glazen koepel toe.",
  "Bundeskanzleramt":"Het bondskanselarijgebouw opende in 2001 als onderdeel van het regeringslint langs de Spree. De grote ronde opening leverde de bijnaam ‘wasmachine’ op.",
  "Haus der Kulturen der Welt":"Het gebouw werd in 1957 als Amerikaans congresgebouw geopend. De gebogen dakvorm gaf het de Berlijnse bijnaam ‘zwangere oester’.",
  "Schloss Bellevue":"Het neoclassicistische paleis dateert uit 1786 en is sinds 1994 de officiële ambtswoning van de Duitse bondspresident.",
  "Arminiusmarkthalle":"De markthal in Moabit opende in 1891. De monumentale ijzerconstructie huisvest tegenwoordig zowel verskramen als horeca.",
  "East Side Gallery":"Na de val van de Muur beschilderden in 1990 meer dan honderd kunstenaars dit 1,3 kilometer lange muurdeel. Het werd een internationaal symbool van vrijheid.",
  "The Wall Museum":"Het museum in de voormalige Mühlenspeicher vertelt chronologisch over de bouw, het dagelijks leven en de val van de Berlijnse Muur met multimedia en ooggetuigenverhalen.",
  "Oberbaumbrücke":"De bakstenen dubbeldeksbrug werd eind negentiende eeuw gebouwd. Tijdens de deling was dit een grensovergang; nu verbindt zij Kreuzberg en Friedrichshain.",
  "Zicht op Molecule Man & Badeschiff":"Molecule Man van Jonathan Borofsky staat sinds 1999 in de Spree. Het Badeschiff opende in 2004 als drijvend zwembad in een omgebouwde vrachtbak.",
  "RAW-Gelände":"Het terrein begon als spoorwegwerkplaats. Na de industrieperiode groeide het uit tot een centrum voor street art, sport, cultuur en nachtleven.",
  "Mauerpark markt & karaoke":"Dit langgerekte park ligt op een voormalige grensstrook. De zondagse vlooienmarkt en openluchtkaraoke maakten het tot een van Berlijns bekendste ontmoetingsplekken.",
  "Gedenkstätte Berliner Mauer – Bernauer Straße":"Bernauer Straße laat de volledige voormalige grensopbouw zien. Vluchtverhalen, fundamenten, Muur en wachttoren maken de werking van de grens hier tastbaar.",
  "Fernsehturm":"De DDR opende de televisietoren in 1969 als technisch én politiek prestigeproject. Met 368 meter bepaalt hij nog altijd de skyline.",
  "Berliner Dom":"De huidige dom werd in 1905 voltooid als representatieve hof- en dynastieke kerk. Na oorlogsschade volgde een langdurige restauratie.",
  "Museumeiland":"Vijf grote musea vormden hier tussen 1830 en 1930 een uitzonderlijk ensemble. Het eiland staat sinds 1999 op de UNESCO-Werelderfgoedlijst.",
  "Hackesche Höfe":"De acht verbonden binnenhoven openden in 1906 en combineren jugendstilarchitectuur met wonen, werkplaatsen, winkels en cultuur."
};

const LOOK_FOR = {
  "Markthalle Neun – Street Food Thursday":"Kijk omhoog naar de historische ijzerconstructie en probeer meerdere kleine gerechten te delen. Juist de combinatie van oude markthal en hedendaagse eetcultuur maakt deze stop bijzonder.",
  "Zoo Berlin":"Begin bij de dieren die voor jullie het belangrijkst zijn en gebruik daarna een logische lus. De historische olifantenpoort, het pandaverblijf en de groene lanen zijn herkenningspunten.",
  "Aquarium Berlin":"Verdeel de aandacht over de drie verdiepingen: vissen en haaien, reptielen en amfibieën, daarna insecten. De architectuur en mozaïeken horen ook bij het bezoek.",
  "Kaiser-Wilhelm-Gedächtniskirche":"Vergelijk bewust de beschadigde oude toren met de moderne blauwe glaswanden. Samen laten ze zien hoe Berlijn herinnering en wederopbouw naast elkaar zet.",
  "ANOHA Kindermuseum":"Laat Layina zelf dieren kiezen, bouwen en samenwerken. Het museum is ontworpen om aan te raken en te bewegen; jullie hoeven geen vaste route te volgen.",
  "Checkpoint Charlie":"Kijk verder dan de gereconstrueerde wachtpost: de straat, informatiepanelen en oude foto’s helpen om de vroegere grenssituatie beter te begrijpen.",
  "Topographie des Terrors":"Begin buiten bij de muurrest en tijdlijn, ga daarna naar binnen. Kies enkele thema’s en persoonlijke verhalen; alles lezen is voor één bezoek te veel.",
  "Panorama Punkt":"Zoek vanuit het uitzicht eerst jullie hotel, daarna Brandenburger Tor, Tiergarten, Reichstag en Fernsehturm. Zo wordt de rest van de reis ruimtelijk duidelijk.",
  "Holocaustmonument":"Loop vanaf de lage rand langzaam naar het diepere midden. De veranderende hoogte, het aflopende terrein en het verdwijnen van de stad uit beeld vormen de ervaring.",
  "Brandenburger Tor":"Bekijk de Quadriga bovenop en loop ook even door de poort. Vanaf de westkant zie je de as door Tiergarten; vanaf Pariser Platz de historische stadszijde.",
  "Reichstag":"Let op het contrast tussen de negentiende-eeuwse stenen gevel en de moderne glazen koepel. De transparantie van de koepel verwijst naar democratisch bestuur.",
  "Bundeskanzleramt":"Bekijk het gebouw vanaf de Spreezijde. De grote ronde opening, loopbruggen en zichtlijn richting parlement horen bij het ontwerp van het regeringskwartier.",
  "Haus der Kulturen der Welt":"Let op het gebogen dak en de ligging tussen Tiergarten en Spree. De sculptuur en spiegelvijver versterken de typische jaren-vijftigarchitectuur.",
  "Schloss Bellevue":"Het beste totaalbeeld krijg je vanaf de overzijde van de oprijlaan. De vlag op het dak laat zien of de bondspresident in Berlijn aanwezig is.",
  "Arminiusmarkthalle":"Kijk omhoog naar de monumentale spanten en lichtstraten. Loop eerst één ronde langs alle kramen voordat jullie bepalen waar je gaat zitten.",
  "East Side Gallery":"Bekijk niet alleen de beroemde Kus. Let ook op de Trabant die door de Muur breekt, de politieke teksten en de verschillende stijlen van internationale kunstenaars.",
  "The Wall Museum":"Volg de zalen chronologisch: bouw van de Muur, vluchtpogingen, dagelijks leven, protest en uiteindelijk de val. De ooggetuigenbeelden geven de meeste context.",
  "Oberbaumbrücke":"Loop aan de rivierzijde en kijk zowel naar de bakstenen torens als naar de passerende U-Bahn boven het wegdek. Vanaf het midden opent het uitzicht over de Spree.",
  "RAW-Gelände":"Let op hoe oude spoorgebouwen, graffiti, sport en horeca door elkaar lopen. Het terrein verandert voortdurend; de sfeer is belangrijker dan één specifiek object.",
  "Mauerpark markt & karaoke":"Gebruik de markt voor sfeer en kleine vondsten, maar bewaar energie voor het park. Vanaf de helling heb je overzicht over de karaoke en de oude grenszone.",
  "Gedenkstätte Berliner Mauer – Bernauer Straße":"Ga naar het uitkijkplatform als het open is. Van boven zie je de dubbele Muur, zandstrook, patrouilleweg en wachttoren als één compleet grenssysteem.",
  "Fernsehturm":"Kijk vanaf de voet omhoog naar de bol en zoek in zonlicht naar de lichtreflectie die Berlijners het ‘wraak van de paus’-kruis noemen.",
  "Berliner Dom":"Bekijk de koepel, beelden en brede trap vanaf Lustgarten. Vanaf de overkant van de Spree zie je beter hoe de Dom bij Museumeiland hoort.",
  "Museumeiland":"Loop bewust langs de zichtlijnen tussen Dom, Altes Museum, Neues Museum en James-Simon-Galerie. Het geheel is belangrijker dan één gevel.",
  "Hackesche Höfe":"Begin in Hof I met de kleurrijke jugendstilgevel en loop daarna door naar de rustigere achterhoven. Iedere binnenplaats had oorspronkelijk een andere functie."
};

function familyTip(stop){
  const text=(stop.type+" "+stop.inside+" "+stop.details).toLowerCase();
  if(text.includes("kind")||stop.title.includes("Zoo")||stop.title.includes("Aquarium")) return "Geef Layina een eigen zoekopdracht of keuze, plan een drinkpauze en stop voordat de concentratie weg is. Deze locatie werkt het beste wanneer zij actief mag meedoen.";
  if(text.includes("museum")||text.includes("histor")) return "De inhoud kan zwaar of tekstgericht zijn. Kies twee of drie kernverhalen, leg die eenvoudig uit en wissel luisteren af met bewegen of buiten kijken.";
  if(text.includes("markt")||text.includes("food")||text.includes("eten")) return "Spreek bij drukte een vast herkenningspunt af. Eerst samen rondkijken, daarna eten kiezen, voorkomt dat jullie elkaar tussen de kramen kwijtraken.";
  if(text.includes("buiten")||text.includes("wand")) return "Maak er geen schoolles van: vertel één opvallend verhaal, laat haar iets zoeken of fotograferen en gebruik de plek daarna als onderdeel van de wandeling.";
  return "Houd deze stop flexibel. Een korte, prettige kennismaking is waardevoller dan langer blijven wanneer de energie op is.";
}

function visitStrategy(stop){
  if(stop.official) return "Controleer vlak voor vertrek de officiële website voor openingstijden, werkzaamheden en eventuele tijdsloten. Gebruik bij reserveringen altijd de officiële aanbieder.";
  if(stop.inside.toLowerCase().includes("buiten")) return "Deze buitenstop heeft geen entree. Kijk vlak voor vertrek naar weer, hitte en eventuele evenementen die de bereikbaarheid kunnen beïnvloeden.";
  return "Controleer op de dag zelf openingstijden en bereikbaarheid. De Google Maps-knop gebruikt jullie actuele positie en actuele verkeersinformatie.";
}

const mapsSearch = query => "https://www.google.com/maps/search/?" + new URLSearchParams({api:"1", query});
const mapsDir = (a,b,mode) => "https://www.google.com/maps/dir/?" + new URLSearchParams({api:"1", origin:a, destination:b, travelmode:mode});
const navigateNow = destination => "https://www.google.com/maps/dir/?" + new URLSearchParams({api:"1", destination, travelmode:"transit"});
const tripSearch = title => "https://www.tripadvisor.com/Search?q=" + encodeURIComponent(title + " Berlin");
const best = (leg,mode) => {
  const advice = leg.recommend.toLowerCase();
  return (mode==="walking"&&advice.includes("lopen") || mode==="transit"&&advice.includes("ov") || mode==="driving"&&advice.includes("taxi")) ? "best" : "";
};
const saving = leg => {
  if(leg.walk<=15 || leg.scenic) return "";
  const fastest=Math.min(leg.transit,leg.taxi), difference=leg.walk-fastest;
  return difference<5 ? "" : `<p class="saving">⏱️ ${leg.taxi<=leg.transit?"Taxi":"OV"} bespaart ongeveer ${difference} minuten ten opzichte van lopen.</p>`;
};
const ratingFor = stop => RATINGS[RATING_ALIASES[stop.title] || stop.title] || {score:null,url:tripSearch(stop.title)};
const photoFor = stop => PHOTO_MAP[stop.title] ? "assets/photos/"+PHOTO_MAP[stop.title] : "";
const galleryFor = stop => {
  const explicit=(GALLERY_DATA[stop.title] || []).map(item => typeof item === "string" ? {src:item,alt:stop.title} : item);
  const primary=photoFor(stop);
  if(primary && !explicit.some(item=>item.src===primary)) explicit.unshift({src:primary,alt:stop.title});
  return explicit.length ? explicit.slice(0,5) : primary ? [{src:primary,alt:stop.title}] : [];
};
const stars = score => {
  const rating = Number(score) || 0;
  const label = rating ? `${rating.toFixed(1)} van 5 sterren` : "Geen afzonderlijke Tripadvisor-score gecontroleerd";
  return `<span class="trip-stars" aria-label="${label}" title="${label}"><span class="stars-empty">★★★★★</span><span class="stars-fill" style="width:${rating * 20}%">★★★★★</span></span>`;
};

function carousel(stop, extraClass=""){
  const images=galleryFor(stop);
  if(!images.length) return `<div class="fallback"><b>${esc(stop.typeIcon)}</b><span>Geen locatiebeeld beschikbaar</span></div>`;
  return `<div class="photo-carousel ${extraClass}" data-carousel aria-label="Fotogalerij van ${esc(stop.title)}"><div class="photo-track">${images.map((item,index)=>`<figure class="photo-slide"><img src="${esc(item.src)}" alt="${esc(item.alt || `${stop.title}, foto ${index+1}`)}" loading="${index===0?"eager":"lazy"}" decoding="async"></figure>`).join("")}</div><div class="photo-progress" aria-hidden="true"><div class="photo-dots">${images.map((_,index)=>`<span${index===0?' class="active"':""}></span>`).join("")}</div><span class="photo-count">1 / ${images.length}</span></div></div>`;
}

function media(stop){
  const local=galleryFor(stop).length>0;
  const wiki=!local&&stop.wiki_exact ? esc(stop.wiki_exact) : "";
  return `<div class="media${local?" loaded":""}" data-stop="${esc(stop.uid)}" data-wiki="${wiki}" role="button" tabindex="0" aria-label="Veeg door vijf foto's of open de visuele gids voor ${esc(stop.title)}">${carousel(stop,"card-carousel")}<span class="letter">${esc(stop.letter)}</span></div>`;
}

function stopCard(stop){
  const rating=ratingFor(stop);
  return `<article class="stop">${media(stop)}<div class="content"><div class="time">${esc(stop.time)}</div><h3>${esc(stop.title)}</h3><div class="badges"><span>${esc(stop.typeIcon)} ${esc(stop.type)}</span><span>⏳ ${esc(stop.visit)}</span><span>📌 ${esc(stop.inside)}</span><span class="rating-badge">${stars(rating.score)} ${rating.score?rating.score.toFixed(1)+"/5":"live bekijken"}</span></div><p>${esc(stop.summary)}</p><details><summary>Meer uitleg en praktisch</summary><div class="details"><p><strong>Wat doen jullie?</strong> ${esc(stop.details)}</p><p><strong>Praktisch:</strong> ${esc(stop.practical)}</p><p><strong>Adres:</strong> ${esc(stop.address)}</p></div></details><div class="buttons"><a class="navigate" href="${navigateNow(stop.address)}" target="_blank" rel="noopener">➤ Vanaf mijn locatie</a><a class="primary" href="${mapsSearch(stop.address)}" target="_blank" rel="noopener">📍 Bekijk op kaart</a><button type="button" data-open-info="${esc(stop.uid)}">▦ Visuele gids</button><a href="${rating.url}" target="_blank" rel="noopener">★ Tripadvisor</a>${stop.official?`<a href="${esc(stop.official)}" target="_blank" rel="noopener">🌐 Officieel / tickets</a>`:""}</div></div></article>`;
}

function legCard(day,leg){
  const a=day.stops.find(item=>item.letter===leg.from), b=day.stops.find(item=>item.letter===leg.to);
  return `<section class="leg"><div class="legtop"><strong>${leg.from} → ${leg.to}: ${esc(b.title)}</strong><span>${esc(leg.distance)}</span></div><div class="modes"><a class="mode ${best(leg,"walking")}" href="${mapsDir(a.address,b.address,"walking")}">🚶<b>${leg.walk} min</b><span>Lopen</span><small>live route</small></a><a class="mode ${best(leg,"transit")}" href="${mapsDir(a.address,b.address,"transit")}">🚆<b>${leg.transit} min</b><span>OV</span><small>live route</small></a><a class="mode ${best(leg,"driving")}" href="${mapsDir(a.address,b.address,"driving")}">🚕<b>${leg.taxi} min</b><span>Taxi</span><small>rijroute</small></a></div><div class="advice"><strong>Advies: ${esc(leg.recommend)}</strong><br>${esc(leg.note)}</div>${saving(leg)}</section>`;
}

function daySection(day){
  let flow="";
  day.stops.forEach((stop,index)=>{flow+=stopCard(stop);if(day.legs[index])flow+=legCard(day,day.legs[index]);});
  return `<section class="day" id="${day.id}"><div class="dayhead day-color day-${day.id}"><div class="day-number">${esc(day.short)}</div><div class="daytitle"><span>${esc(day.date)}</span><h2>${esc(day.title)}</h2><p>${esc(day.summary)}</p></div></div><div class="meta"><span>🌡️ ${esc(day.weather)}</span><span>🕒 ${day.start}–${day.end}</span><span>🚶 ${esc(day.stats.walk)}</span><span>📍 ${esc(day.stats.visit)}</span></div><div class="routes">${day.fullRoutes.map(route=>`<a class="route" href="${esc(route.url)}">🗺️ ${esc(route.label)}</a>`).join("")}</div>${flow}</section>`;
}

function classification(score){
  if(!score) return "Open Tripadvisor voor de actuele waardering";
  if(score>=4.6) return "Uitmuntend gewaardeerd";
  if(score>=4.3) return "Zeer goed gewaardeerd";
  if(score>=4.0) return "Goed gewaardeerd";
  return "Gemengd gewaardeerd";
}

function photoSources(stop){
  const sources=galleryFor(stop).filter(item=>item.source);
  if(!sources.length) return "";
  return `<details class="photo-sources"><summary>Fotobronnen van deze locatie</summary><ol>${sources.map((item,index)=>`<li><a href="${esc(item.source)}" target="_blank" rel="noopener">Foto ${index+2}</a>${item.credit?` · ${esc(item.credit)}`:""}${item.license?` · ${esc(item.license)}`:""}</li>`).join("")}</ol></details>`;
}

function openInfographic(uid){
  const stop=ALL_STOPS.find(item=>item.uid===uid);
  if(!stop) return;
  const rating=ratingFor(stop);
  const fallbackHistory=HISTORY[stop.title] || (stop.type.includes("Route") || stop.type.includes("Praktisch") || stop.type.includes("Start") || stop.type.includes("Eind") ? "Dit is vooral een praktisch routepunt in jullie planning. De waarde zit in de ligging en de logische aansluiting op de volgende stop." : "Deze locatie vertelt een eigen stukje van Berlijn. Gebruik de samenvatting en bezoektips hieronder om snel te bepalen waar jullie aandacht aan willen geven.");
  const guide=GUIDE_CONTENT[stop.title] || {
    intro:stop.summary,
    history:[fallbackHistory],
    experience:stop.details,
    look:LOOK_FOR[stop.title] || `Gebruik ${stop.title} niet alleen als fotostop. Kijk naar de omgeving, lees één informatiepaneel en verbind wat je ziet met de plaats van deze stop in de dagroute.`,
    layina:familyTip(stop),
    tip:stop.practical
  };
  document.getElementById("infographic-root").innerHTML=`<div class="info-overlay" role="dialog" aria-modal="true" aria-labelledby="info-title"><article class="info-sheet"><button type="button" class="info-close" aria-label="Sluit de locatie-infographic">×</button><header class="info-hero">${carousel(stop,"hero-carousel")}<div class="info-title"><span>${esc(stop.type)} · ${esc(stop.visit)}</span><h2 id="info-title">${esc(stop.title)}</h2></div></header><div class="info-body"><section class="score-card"><div class="score-number">${rating.score?rating.score.toFixed(1):"–"}</div><div><div class="rating-stars-wrap">${stars(rating.score)}</div><strong>${classification(rating.score)}</strong><small>${rating.score?"Tripadvisor-waardering · gecontroleerd 29 juli 2026":"Geen afzonderlijke score vastgezet; open Tripadvisor live"}</small></div><a href="${rating.url}" target="_blank" rel="noopener">Tripadvisor openen</a></section><div class="infographic-grid"><section class="info-block wide guide-lead"><div class="icon">🎙️</div><h3>De reisleider vertelt</h3>${paragraphs(guide.intro)}</section><section class="info-block wide story-block"><div class="icon">⌛</div><h3>Het verhaal van deze plek</h3>${paragraphs(guide.history)}</section><section class="info-block wide experience-block"><div class="icon">👀</div><h3>Wat jullie hier gaan ervaren</h3>${paragraphs(guide.experience)}<p><strong>In jullie planning:</strong> ${esc(stop.details)}</p></section><section class="info-block"><div class="icon">⏱</div><h3>Jullie bezoek</h3><p><strong>${esc(stop.visit)}</strong><br>${esc(stop.inside)}<br>Gepland: ${esc(stop.time)}</p></section><section class="info-block"><div class="icon">🧭</div><h3>Plaats in de route</h3><p>Stop ${esc(stop.letter)} op ${esc(stop.time)}. Google Maps bepaalt bij openen de route vanaf jullie actuele locatie.</p></section><section class="info-block wide accent-block"><div class="icon">🔎</div><h3>Hier moet je ter plekke op letten</h3>${paragraphs(guide.look)}</section><section class="info-block wide layina-story"><div class="icon">👧</div><h3>Zo kun je het aan Layina vertellen</h3>${paragraphs(guide.layina)}</section><section class="info-block wide guide-tip"><div class="icon">💡</div><h3>Tip van de reisleider</h3>${paragraphs(guide.tip)}<p><strong>Praktisch:</strong> ${esc(stop.practical)}</p><p>${esc(visitStrategy(stop))}</p></section><section class="info-block wide"><div class="icon">📍</div><h3>Adres en verder reizen</h3><p>${esc(stop.address)}</p><p>Tik onderaan op navigeren om Google Maps vanaf jullie actuele locatie te laten rekenen.</p></section></div>${photoSources(stop)}<div class="info-actions"><a href="${navigateNow(stop.address)}" target="_blank" rel="noopener">➤ Navigeer vanaf mijn locatie</a>${stop.official?`<a href="${esc(stop.official)}" target="_blank" rel="noopener">Tickets / officiële website</a>`:`<a href="${mapsSearch(stop.address)}" target="_blank" rel="noopener">Open in Google Maps</a>`}</div></div></article></div>`;
  document.body.classList.add("modal-open");
  initializeCarousels(document.getElementById("infographic-root"));
  const closeButton=document.querySelector(".info-close");
  closeButton.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();closeInfographic();},{once:true});
  try{closeButton.focus({preventScroll:true});}catch{closeButton.focus();}
}

function closeInfographic(){
  document.getElementById("infographic-root").innerHTML="";
  document.body.classList.remove("modal-open");
}

async function loadMedia(element){
  const title=element.dataset.wiki;
  if(!title) return;
  try{
    const response=await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(title));
    if(!response.ok) throw new Error();
    const data=await response.json(), url=data.thumbnail?.source||data.originalimage?.source;
    if(!url) throw new Error();
    const image=element.querySelector("img");
    image.src=url;
    image.onload=()=>element.classList.add("loaded");
    const credit=element.querySelector(".credit");
    credit.href=data.content_urls?.desktop?.page||("https://en.wikipedia.org/wiki/"+encodeURIComponent(title));
  }catch{}
}

function initializeCarousels(root=document){
  root.querySelectorAll("[data-carousel]").forEach(carouselElement=>{
    if(carouselElement.dataset.ready) return;
    carouselElement.dataset.ready="true";
    const track=carouselElement.querySelector(".photo-track");
    const dots=[...carouselElement.querySelectorAll(".photo-dots span")];
    const count=carouselElement.querySelector(".photo-count");
    let frame=0, moved=false, startX=0, startScroll=0;
    const update=()=>{
      frame=0;
      const index=Math.max(0,Math.min(dots.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));
      dots.forEach((dot,dotIndex)=>dot.classList.toggle("active",dotIndex===index));
      if(count) count.textContent=`${index+1} / ${dots.length}`;
    };
    track.addEventListener("scroll",()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});
    track.addEventListener("pointerdown",event=>{startX=event.clientX;startScroll=track.scrollLeft;moved=false;},{passive:true});
    track.addEventListener("pointermove",event=>{if(Math.abs(event.clientX-startX)>8||Math.abs(track.scrollLeft-startScroll)>8)moved=true;},{passive:true});
    track.addEventListener("click",event=>{if(moved){event.preventDefault();event.stopPropagation();moved=false;}},true);
    update();
  });
}

const ALL_STOPS=[];
DAYS.forEach(day=>day.stops.forEach((stop,index)=>{stop.uid=`${day.id}-${index}`;ALL_STOPS.push(stop);}));

function init(){
  document.getElementById("daynav").innerHTML=DAYS.map(day=>`<a href="#${day.id}"><b>${esc(day.short)}</b><small>${esc(day.date)}</small></a>`).join("")+`<a href="#tips"><b>☎</b><small>Tips</small></a>`;
  document.getElementById("app").innerHTML=DAYS.map(daySection).join("");
  initializeCarousels();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){loadMedia(entry.target);observer.unobserve(entry.target);}}),{rootMargin:"350px"});
  document.querySelectorAll(".media[data-wiki]").forEach(element=>observer.observe(element));
  document.addEventListener("click",event=>{
    const opener=event.target.closest("[data-open-info],.stop .media[data-stop]");
    if(opener){event.preventDefault();openInfographic(opener.dataset.openInfo||opener.dataset.stop);return;}
    if(event.target.closest(".info-close") || (event.target.classList.contains("info-overlay"))) closeInfographic();
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape") closeInfographic();
    if((event.key==="Enter"||event.key===" ") && event.target.matches(".stop .media[data-stop]")){event.preventDefault();openInfographic(event.target.dataset.stop);}
  });
  if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
}

document.addEventListener("DOMContentLoaded",init);
