import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  disable?: boolean;
  onTap: Function;
  width: number;
  height: number;
  title: string;
  isNoBg?: boolean;
}

const ButtonWithTitle: React.FC<ButtonProps> = ({ onTap, width, height, title, isNoBg = false, disable = false }) => {
  if (isNoBg) {
    return (
      <TouchableOpacity disabled={disable} style={[styles.btn, { width, height, backgroundColor: "transparent" }]} onPress={() => onTap()}>
        <Text style={{ fontSize: 16, color: disable ? "#6F6F6F" : "#3980D9" }}>{title}</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={[styles.btn, { width, height }]} onPress={() => onTap()}>
        <Text style={{ fontSize: 16, color: "#FFF" }}>{title}</Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    display: "flex",
    maxHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B5E83A",
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
  },
});

export { ButtonWithTitle };
