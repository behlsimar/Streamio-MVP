import React, { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator, FlatList, Text, Image, Pressable } from 'react-native';
import { api } from '../api';

export default function SearchScreen({ navigation }: any){
  const [q,setQ] = useState('');
  const [loading,setLoading] = useState(false);
  const [results,setResults] = useState<any[]>([]);
  const [err,setErr] = useState<string|null>(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) { setResults([]); setErr(null); return; }
      try {
        setLoading(true);
        const data = await api.search(q.trim());
        setResults(data.results || []);
        setErr(null);
      } catch (e:any) {
        setErr(e?.message || 'Search failed');
      } finally { setLoading(false); }
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const renderItem = ({ item }: any) => (
    <Pressable onPress={() => { const [type, raw] = item.id.split(':'); navigation.navigate('Detail', { id: raw, type }); }}
      style={{ flexDirection:'row', padding:12, gap:12, alignItems:'center' }}>
      {item.poster ? <Image source={{ uri:item.poster }} style={{ width:60, height:90, borderRadius:8 }} /> : <View style={{ width:60, height:90, borderRadius:8, backgroundColor:'#222' }} />}
      <View style={{ flex:1 }}>
        <Text style={{ fontSize:16, fontWeight:'600', color:'#fff' }}>{item.title}</Text>
        <Text style={{ fontSize:12, color:'#aaa', marginTop:2 }}>{item.type?.toUpperCase?.()}{item.year ? ` • ${item.year}` : ''}</Text>
        {!!item.overview && <Text numberOfLines={2} style={{ fontSize:12, color:'#bbb', marginTop:6 }}>{item.overview}</Text>}
      </View>
      {typeof item.rating === 'number' && <Text style={{ color:'#fff' }}>{item.rating.toFixed(1)}</Text>}
    </Pressable>
  );

  return (
    <View style={{ flex:1, backgroundColor:'#0b0b0b' }}>
      <TextInput placeholder="Search movies & series" placeholderTextColor="#777" value={q} onChangeText={setQ} autoCapitalize="none"
        style={{ backgroundColor:'#171717', color:'#fff', margin:12, borderRadius:12, paddingHorizontal:14, height:48, fontSize:16 }} />
      {loading && <ActivityIndicator style={{ marginTop:8 }} />}
      {!!err && <Text style={{ color:'tomato', marginHorizontal:12 }}>{err}</Text>}
      <FlatList data={results} keyExtractor={(it)=>it.id} renderItem={renderItem} ItemSeparatorComponent={() => <View style={{ height:1, backgroundColor:'#111' }} />}
        contentContainerStyle={{ paddingBottom:24 }} />
    </View>
  );
}