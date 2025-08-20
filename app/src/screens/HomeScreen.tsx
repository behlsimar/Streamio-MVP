import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { api } from '../api';

function Row({ title, data, onPress }: any){
  return (
    <View style={{ marginVertical:12 }}>
      <Text style={{ color:'#fff', fontSize:18, fontWeight:'700', marginLeft:12 }}>{title}</Text>
      <FlatList horizontal data={data} keyExtractor={(it)=>it.id} contentContainerStyle={{ paddingHorizontal:12 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPress(item)} style={{ marginRight:10 }}>
            {item.poster ? <Image source={{ uri:item.poster }} style={{ width:120, height:180, borderRadius:10 }} /> : <View style={{ width:120, height:180, borderRadius:10, backgroundColor:'#222' }} />}
            <Text numberOfLines={1} style={{ color:'#ddd', width:120, marginTop:6 }}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

export default function HomeScreen({ navigation }: any){
  const [movieTrend, setMovieTrend] = useState<any[]>([]);
  const [tvTrend, setTvTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try{
      const m = await api.catalog('movie','trending');
      const t = await api.catalog('tv','trending');
      setMovieTrend(m.results||[]);
      setTvTrend(t.results||[]);
    } finally { setLoading(false); }
  })(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop:40 }} />;

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#0b0b0b' }}>
      <Row title="Trending Movies" data={movieTrend} onPress={(it:any)=>{ const [type, raw] = it.id.split(':'); navigation.navigate('Detail', { type, id: raw }); }} />
      <Row title="Trending Series" data={tvTrend} onPress={(it:any)=>{ const [type, raw] = it.id.split(':'); navigation.navigate('Detail', { type, id: raw }); }} />
    </ScrollView>
  );
}