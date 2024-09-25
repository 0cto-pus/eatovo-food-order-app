import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { FoodModel } from "../redux";
import { ButtonAddRemove } from "./ButtonAddRemove";
import { replaceLocalhost } from "../utils/changeUrl";

interface FoodCardProps {
  item: FoodModel;
  onTap: Function;
  onUpdateCart: Function;
  unit?: number | undefined;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onTap, onUpdateCart, unit }) => {
  const didUpdateCart = (unit: number) => {
    item.unit = unit;
    onUpdateCart(item);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: replaceLocalhost(item.images[0]) }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 20,
          backgroundColor: "#EAEAEA",
        }}
      />
      <TouchableOpacity
        onPress={() => onTap(item)}
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={{ display: "flex", flex: 7, padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#2E2E2E" }}>{item.name}</Text>
        </View>
        <View
          style={{
            display: "flex",
            flex: 5,
            padding: 10,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#2E2E2E" }}>{item.price}₺</Text>
          {unit !== undefined ? (
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#7C7C7C" }}>Adet: {unit}</Text>
          ) : (
            <ButtonAddRemove
              onAdd={() => {
                let unit = isNaN(item.unit) ? 0 : item.unit;
                didUpdateCart(unit + 1);
              }}
              onRemove={() => {
                let unit = isNaN(item.unit) ? 0 : item.unit;
                didUpdateCart(unit > 0 ? unit - 1 : unit);
              }}
              qty={item.unit}
            />
          )}
        </View>
      </TouchableOpacity>
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
    backgroundColor: "#FFF",
    height: 100,
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    flexDirection: "row",
  },
  navigation: { flex: 2, backgroundColor: "red" },
  body: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  footer: { flex: 1, backgroundColor: "cyan" },
});

export { FoodCard };
