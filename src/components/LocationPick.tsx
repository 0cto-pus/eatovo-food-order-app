import React from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { API_KEY } from "@env";

interface LocationPickProps {
  onChangeLocation: Function;
}

const LocationPick: React.FC<LocationPickProps> = ({ onChangeLocation }) => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        minLength={4}
        placeholder="Adres ara"
        fetchDetails={true}
        onFail={(error) => console.error(error)}
        onPress={(_, details = null) => {
          if (details?.geometry) {
            onChangeLocation(details.geometry.location);
          }
          console.log(JSON.stringify(details?.geometry.location));
        }}
        query={{ key: API_KEY, language: "tr" }}
      ></GooglePlacesAutocomplete>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 40,
  },
});

export { LocationPick };
