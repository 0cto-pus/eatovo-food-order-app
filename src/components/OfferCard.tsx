import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { OfferModel } from "../redux";
import { replaceLocalhost } from "../utils/changeUrl";
import { TouchableOpacity } from "react-native-gesture-handler";

interface OfferCardProps {
  item: OfferModel;
  onTapApply: Function;
  onTapRemove: Function;
  isApplied: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ item, onTapApply, onTapRemove, isApplied }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: replaceLocalhost(item.images[0]) }}
        style={{
          width: Dimensions.get("screen").width - 20,
          height: 200,
          borderRadius: 20,
          backgroundColor: "#EAEAEA",
        }}
      />

      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ display: "flex", flex: 7.5, padding: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#2E2E2E" }}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: "#2E2E2E" }}>{item.description}</Text>
        </View>

        <View style={{ display: "flex", flex: 4.5, padding: 10 }}>
          {isApplied ? (
            <TouchableOpacity
              onPress={() => {
                onTapRemove(item);
              }}
              style={[styles.applyPromo, { backgroundColor: "#0E45FB" }]}
            >
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#EFEFEF" }}> Kaldır </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                onTapApply(item);
              }}
              style={styles.applyPromo}
            >
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#EFEFEF" }}> Kullan:</Text>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#EFEFEF" }}> {item.promoCode}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    width: Dimensions.get("screen").width - 20,
    margin: 10,
    borderRadius: 20,
    height: 270,
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    flexDirection: "column",
  },
  navigation: { flex: 2, backgroundColor: "red" },
  body: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  footer: { flex: 1, backgroundColor: "cyan" },
  applyPromo: {
    flexDirection: "row",
    backgroundColor: "#B5E83A",
    padding: 10,
    paddingRight: 25,
    paddingLeft: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});

export { OfferCard };
