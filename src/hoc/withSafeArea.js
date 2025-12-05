import React from'react';import{SafeAreaView}from'react-native';export default function withSafeArea(C){return p=>(<SafeAreaView style={{flex:1}}><C {...p}/></SafeAreaView>)}
