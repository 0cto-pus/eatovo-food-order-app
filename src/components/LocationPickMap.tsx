import React from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView from "react-native-maps";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface LocationPickMapProps {
  lastLocation: Region;
  onMarkerChanged: Function;
}

const LocationPickMap: React.FC<LocationPickMapProps> = ({ lastLocation, onMarkerChanged }) => {
  const onRegionChange = (newRegion: Region) => {
    onMarkerChanged(newRegion);
  };

  return (
    <View style={styles.container}>
      <MapView style={{ flex: 1 }} initialRegion={lastLocation} onRegionChangeComplete={onRegionChange}></MapView>
      <View style={{ left: "50%", top: "50%", position: "absolute", marginLeft: -24, marginTop: -48 }}>
        <Image
          source={require("../images/delivery_icon.png")}
          style={{
            width: 50,
            height: 50,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    displa: "flex",
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 40,
  },
});

export { LocationPickMap };
