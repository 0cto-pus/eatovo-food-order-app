import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Category } from "../redux";
import { replaceLocalhost } from "../utils/changeUrl";

interface CategoryProps {
  item: Category;
  onTap: Function;
}
const CategoryCard: React.FC<CategoryProps> = ({ item, onTap }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onTap(item)}>
      <Image
        source={{ uri: replaceLocalhost(item.icon) }}
        style={{
          width: 120,
          height: 120,
          borderRadius: 20,
          backgroundColor: "#EAEAEA",
        }}
      />
      <Text style={{ fontSize: 15, marginTop: 10, color: "#2E2E2E" }}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 140,
    justifyContent: "space-around",
    alignItems: "center",
    margin: 5,
  },
});

export { CategoryCard };
