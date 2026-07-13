const C=(name,domain)=>({name,domain});
const PLAYERS=[
{name:"Zlatan Ibrahimović",a:["zlatan","ibrahimovic","zlatan ibrahimovic"],nation:"Zweden",position:"Spits",clubs:[C("Malmö FF","mff.se"),C("Ajax","ajax.nl"),C("Juventus","juventus.com"),C("Internazionale","inter.it"),C("FC Barcelona","fcbarcelona.com"),C("AC Milan","acmilan.com"),C("Paris Saint-Germain","psg.fr"),C("Manchester United","manutd.com"),C("LA Galaxy","lagalaxy.com"),C("AC Milan","acmilan.com")]},
{name:"Ronaldo Nazário",a:["ronaldo","r9","ronaldo nazario"],nation:"Brazilië",position:"Spits",clubs:[C("Cruzeiro","cruzeiro.com.br"),C("PSV","psv.nl"),C("FC Barcelona","fcbarcelona.com"),C("Internazionale","inter.it"),C("Real Madrid","realmadrid.com"),C("AC Milan","acmilan.com"),C("Corinthians","corinthians.com.br")]},
{name:"Arjen Robben",a:["robben","arjen robben"],nation:"Nederland",position:"Vleugelaanvaller",clubs:[C("FC Groningen","fcgroningen.nl"),C("PSV","psv.nl"),C("Chelsea","chelseafc.com"),C("Real Madrid","realmadrid.com"),C("Bayern München","fcbayern.com"),C("FC Groningen","fcgroningen.nl")]},
{name:"Edwin van der Sar",a:["van der sar","edwin van der sar","vandersar"],nation:"Nederland",position:"Doelman",clubs:[C("Ajax","ajax.nl"),C("Juventus","juventus.com"),C("Fulham","fulhamfc.com"),C("Manchester United","manutd.com"),C("VV Noordwijk","vvnoordwijk.nl")]},
{name:"David Beckham",a:["beckham","david beckham"],nation:"Engeland",position:"Middenvelder",clubs:[C("Manchester United","manutd.com"),C("Preston North End","pnefc.net"),C("Real Madrid","realmadrid.com"),C("LA Galaxy","lagalaxy.com"),C("AC Milan","acmilan.com"),C("LA Galaxy","lagalaxy.com"),C("Paris Saint-Germain","psg.fr")]},
{name:"Thierry Henry",a:["henry","thierry henry"],nation:"Frankrijk",position:"Spits",clubs:[C("AS Monaco","asmonaco.com"),C("Juventus","juventus.com"),C("Arsenal","arsenal.com"),C("FC Barcelona","fcbarcelona.com"),C("New York Red Bulls","newyorkredbulls.com"),C("Arsenal","arsenal.com")]},
{name:"Kaká",a:["kaka","ricardo kaka"],nation:"Brazilië",position:"Aanvallende middenvelder",clubs:[C("São Paulo","saopaulofc.net"),C("AC Milan","acmilan.com"),C("Real Madrid","realmadrid.com"),C("AC Milan","acmilan.com"),C("Orlando City","orlandocitysc.com")]},
{name:"Fernando Torres",a:["torres","fernando torres","el nino"],nation:"Spanje",position:"Spits",clubs:[C("Atlético Madrid","atleticodemadrid.com"),C("Liverpool","liverpoolfc.com"),C("Chelsea","chelseafc.com"),C("AC Milan","acmilan.com"),C("Atlético Madrid","atleticodemadrid.com"),C("Sagan Tosu","sagan-tosu.net")]},
{name:"Luís Figo",a:["figo","luis figo"],nation:"Portugal",position:"Vleugelaanvaller",clubs:[C("Sporting CP","sporting.pt"),C("FC Barcelona","fcbarcelona.com"),C("Real Madrid","realmadrid.com"),C("Internazionale","inter.it")]},
{name:"Ronaldinho",a:["ronaldinho","ronaldinho gaucho"],nation:"Brazilië",position:"Aanvallende middenvelder",clubs:[C("Grêmio","gremio.net"),C("Paris Saint-Germain","psg.fr"),C("FC Barcelona","fcbarcelona.com"),C("AC Milan","acmilan.com"),C("Flamengo","flamengo.com.br"),C("Atlético Mineiro","atletico.com.br"),C("Querétaro","clubqueretaro.com"),C("Fluminense","fluminense.com.br")]},
{name:"Andrea Pirlo",a:["pirlo","andrea pirlo"],nation:"Italië",position:"Middenvelder",clubs:[C("Brescia","bresciacalcio.it"),C("Internazionale","inter.it"),C("Reggina","reggina1914.it"),C("Brescia","bresciacalcio.it"),C("AC Milan","acmilan.com"),C("Juventus","juventus.com"),C("New York City FC","nycfc.com")]},
{name:"Ruud van Nistelrooij",a:["van nistelrooij","van nistelrooy","ruud van nistelrooy"],nation:"Nederland",position:"Spits",clubs:[C("FC Den Bosch","fcdenbosch.nl"),C("sc Heerenveen","sc-heerenveen.nl"),C("PSV","psv.nl"),C("Manchester United","manutd.com"),C("Real Madrid","realmadrid.com"),C("Hamburger SV","hsv.de"),C("Málaga CF","malagacf.com")]},
{name:"Patrick Kluivert",a:["kluivert","patrick kluivert"],nation:"Nederland",position:"Spits",clubs:[C("Ajax","ajax.nl"),C("AC Milan","acmilan.com"),C("FC Barcelona","fcbarcelona.com"),C("Newcastle United","nufc.co.uk"),C("Valencia","valenciacf.com"),C("PSV","psv.nl"),C("Lille OSC","losc.fr")]},
{name:"Dennis Bergkamp",a:["bergkamp","dennis bergkamp"],nation:"Nederland",position:"Schaduwspits",clubs:[C("Ajax","ajax.nl"),C("Internazionale","inter.it"),C("Arsenal","arsenal.com")]},
{name:"Clarence Seedorf",a:["seedorf","clarence seedorf"],nation:"Nederland",position:"Middenvelder",clubs:[C("Ajax","ajax.nl"),C("Sampdoria","sampdoria.it"),C("Real Madrid","realmadrid.com"),C("Internazionale","inter.it"),C("AC Milan","acmilan.com"),C("Botafogo","botafogo.com.br")]},
{name:"Wesley Sneijder",a:["sneijder","wesley sneijder"],nation:"Nederland",position:"Aanvallende middenvelder",clubs:[C("Ajax","ajax.nl"),C("Real Madrid","realmadrid.com"),C("Internazionale","inter.it"),C("Galatasaray","galatasaray.org"),C("OGC Nice","ogcnice.com"),C("Al-Gharafa","algharafa.qa")]},
{name:"Robin van Persie",a:["van persie","robin van persie","rvp"],nation:"Nederland",position:"Spits",clubs:[C("Feyenoord","feyenoord.com"),C("Arsenal","arsenal.com"),C("Manchester United","manutd.com"),C("Fenerbahçe","fenerbahce.org"),C("Feyenoord","feyenoord.com")]},
{name:"Xabi Alonso",a:["xabi alonso","alonso"],nation:"Spanje",position:"Middenvelder",clubs:[C("Real Sociedad","realsociedad.eus"),C("SD Eibar","sdeibar.com"),C("Liverpool","liverpoolfc.com"),C("Real Madrid","realmadrid.com"),C("Bayern München","fcbayern.com")]},
{name:"Wayne Rooney",a:["rooney","wayne rooney"],nation:"Engeland",position:"Aanvaller",clubs:[C("Everton","evertonfc.com"),C("Manchester United","manutd.com"),C("Everton","evertonfc.com"),C("D.C. United","dcunited.com"),C("Derby County","dcfc.co.uk")]},
{name:"Cesc Fàbregas",a:["fabregas","cesc fabregas","cesc"],nation:"Spanje",position:"Middenvelder",clubs:[C("Arsenal","arsenal.com"),C("FC Barcelona","fcbarcelona.com"),C("Chelsea","chelseafc.com"),C("AS Monaco","asmonaco.com"),C("Como 1907","comofootball.com")]}
];

// Multiplayer hotfix: de visuele antwoordstatus mag de beoordeling door de host niet vooraf blokkeren.
window.addEventListener('load',()=>{
  window.applyGuessStatus=function(player,text){
    const e=document.getElementById('guessState'+player);
    if(!e)return;
    e.className='guessstate done';
    const status=e.querySelector('span');
    if(status)status.textContent=text;
  };
});
