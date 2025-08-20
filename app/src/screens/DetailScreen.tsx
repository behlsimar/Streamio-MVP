import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { api } from '../api';

export default function DetailScreen({ route }: any){
  const { type, id } = route.params;
  const [meta, setMeta] = useState<any>(null);
  const [streams, setStreams] = useState<any[]>([]);
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => { (async () => {
    const m = await api.meta(type, id); setMeta(m.meta);
    const s = await api.streams(type, id); setStreams(s.streams||[]);
    const p = await api.providers(type, id); setProviders(p);
  })(); }, [type,id]);

  if (!meta) return <ActivityIndicator style={{ marginTop:40 }} />;

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#0b0b0b' }} contentContainerStyle={{ padding:12 }}>
      <View style={{ flexDirection:'row', gap:12 }}>
        {meta.poster ? <Image source={{ uri: meta.poster }} style={{ width:120, height:180, borderRadius:10 }} /> : null}
        <View style={{ flex:1 }}>
          <Text style={{ color:'#fff', fontSize:20, fontWeight:'700' }}>{meta.title}</Text>
          <Text style={{ color:'#aaa', marginTop:4 }}>{meta.year} • {meta.genres?.join(', ')}</Text>
          <Text style={{ color:'#bbb', marginTop:12 }}>{meta.overview}</Text>
        </View>
      </View>
      {!!providers?.providers?.flatrate?.length && (
        <View style={{ marginTop:16 }}>
          <Text style={{ color:'#fff', fontSize:16, fontWeight:'700' }}>Available On</Text>
          {providers.providers.flatrate.map((p:any, idx:number) => (<Text key={idx} style={{ color:'#ddd', marginTop:6 }}>• {p.provider_name}</Text>))}
        </View>
      )}
      <View style={{ marginTop:16 }}>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'700' }}>Streams</Text>
        {streams.length === 0 && <Text style={{ color:'#aaa', marginTop:8 }}>No streams found. Try enabling add-ons.</Text>}
        {streams.map((s, idx) => (
          <Pressable key={idx} onPress={() => Linking.openURL(s.url)} style={{ padding:12, backgroundColor:'#171717', borderRadius:10, marginTop:8 }}>
            <Text style={{ color:'#fff', fontWeight:'600' }}>{s.name} {s.quality ? `• ${s.quality}` : ''}</Text>
            <Text style={{ color:'#bbb', marginTop:4 }}>{s.description} ({s.type}) — {s.source}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}