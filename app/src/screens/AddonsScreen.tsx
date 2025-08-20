import React, { useEffect, useState } from 'react';
import { View, Text, Switch, ActivityIndicator } from 'react-native';
import { api } from '../api';

export default function AddonsScreen(){
  const [addons, setAddons] = useState<any[]|null>(null);
  const load = async () => { const d = await api.addons(); setAddons(d.addons||[]); };
  useEffect(() => { load(); }, []);
  if (!addons) return <ActivityIndicator style={{ marginTop:40 }} />;
  return (
    <View style={{ flex:1, backgroundColor:'#0b0b0b', padding:12 }}>
      <Text style={{ color:'#fff', fontSize:18, fontWeight:'700', marginBottom:8 }}>Add-ons</Text>
      {addons.map((a, idx) => (
        <View key={idx} style={{ backgroundColor:'#171717', padding:12, borderRadius:10, marginBottom:8, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
          <View>
            <Text style={{ color:'#fff', fontWeight:'600' }}>{a.name}</Text>
            {!!a.disclaimer && <Text style={{ color:'tomato' }}>{a.disclaimer}</Text>}
            <Text style={{ color:'#aaa' }}>{a.type}</Text>
          </View>
          <Switch value={a.enabled} onValueChange={async (v)=>{ const d = await api.toggleAddon(a.key, v); setAddons(d.addons||[]); }} />
        </View>
      ))}
    </View>
  );
}