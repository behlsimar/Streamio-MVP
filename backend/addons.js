const enabled = new Set(['publicDomain','trailers']);
export function listAddons(){
  return [
    { key:'publicDomain', name:'Public Domain', enabled:enabled.has('publicDomain'), type:'http' },
    { key:'trailers', name:'Trailers (YouTube)', enabled:enabled.has('trailers'), type:'youtube' },
    { key:'magnetMock', name:'Magnet Demo', enabled:enabled.has('magnetMock'), type:'magnet', disclaimer:'Demo only' },
  ];
}
export function toggleAddon(key,on){ if(on) enabled.add(key); else enabled.delete(key); return listAddons(); }
export async function streamsFor({ type, id, meta }){
  const out = [];
  if (enabled.has('trailers')){
    const yt = (meta?.videos?.results||[]).find(v=>v.site==='YouTube' && v.type==='Trailer');
    if (yt) out.push({ name:'Trailer', description:'Official trailer on YouTube', type:'youtube',
      url:`https://www.youtube.com/watch?v=${yt.key}`, quality:'hd', source:'Trailers' });
  }
  if (enabled.has('publicDomain')){
    const title = (meta?.title||'').toLowerCase();
    if (title.includes('night of the living dead')){
      out.push({ name:'Public Domain HD', description:'Archive.org stream', type:'http',
        url:'https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4', quality:'sd', source:'Public Domain' });
    }
  }
  if (enabled.has('magnetMock')){
    out.push({ name:'Magnet Demo', description:'Placeholder magnet link for testing UI only',
      type:'magnet', url:'magnet:?xt=urn:btih:DEMO12345&dn=Demo+Only', quality:'unknown', source:'Mock' });
  }
  return out;
}