import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { useNavigation } from "../utils";

import { connect } from "react-redux";
import { ButtonWithIcon, CategoryCard, SearchBar, RestaurantCard } from "../components";
import { onAvailability, onSearchFoods, UserState, ApplicationState, ShoppingState, Restaurant, FoodModel } from "../redux";

interface HomeProps {
  userReducer: UserState;
  shoppingReducer: ShoppingState;
  onAvailability: Function;
  onSearchFoods: Function;
}

export const _HomeScreen: React.FC<HomeProps> = (props) => {
  const { navigate } = useNavigation();

  const { location } = props.userReducer;
  const { availability } = props.shoppingReducer;

  const { categories, foods, restaurants } = availability;

  useEffect(() => {
    if (location?.postalCode) {
      props.onAvailability(location.postalCode);
    }
    setTimeout(() => {
      if (location?.postalCode) {
        props.onSearchFoods(location.postalCode);
      }
    }, 1000);
  }, [, location]);

  const onTapRestaurant = (item: Restaurant) => {
    navigate("RestaurantPage", { restaurant: item });
  };

  const onTapFood = (item: FoodModel) => {
    navigate("FoodDetailPage", { food: item });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <View
          style={{
            display: "flex",
            marginTop: 50,
            flex: 4,
            backgroundColor: "white",

            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
          }}
        >
          <Image source={require("../images/delivery_icon.png")} style={{ height: 32, width: 32 }} />
          <Text style={{ width: 280, marginRight: 5 }}>{`${location.displayAddress}`} </Text>
          <ButtonWithIcon
            onTap={() => {
              navigate("LocationPage");
            }}
            icon={require("../images/edit_icon.png")}
            width={30}
            height={30}
          />
        </View>
        <View
          style={{
            display: "flex",
            height: 50,
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 4,
            marginRight: 10,
          }}
        >
          <SearchBar
            didTouch={() => {
              navigate("SearchPage");
            }}
            onTextChange={() => {}}
          />
          <ButtonWithIcon onTap={() => {}} icon={require("../images/hambar.png")} width={50} height={40} />
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ item }) => (
              <CategoryCard
                item={item}
                onTap={() => {
                  alert("TODO: Later");
                }}
              />
            )}
            keyExtractor={(item) => `${item.id}`}
          />
          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "600",
                color: "#2E2E2E",
                marginLeft: 20,
              }}
            >
              {" "}
              En İyi Restoranlar
            </Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={restaurants}
            renderItem={({ item }) => <RestaurantCard item={item} onTap={onTapRestaurant} />}
            keyExtractor={(item) => `${item._id}`}
          />

          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "600",
                color: "#2E2E2E",
                marginLeft: 20,
              }}
            >
              {" "}
              Favoriler
            </Text>
          </View>
          <FlatList horizontal showsHorizontalScrollIndicator={false} data={foods} renderItem={({ item }) => <RestaurantCard item={item} onTap={onTapFood} />} keyExtractor={(item) => `${item._id}`} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  navigation: {
    flex: 2,
  },
  body: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapToStateProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
  shoppingReducer: state.shoppingReducer,
});
const HomeScreen = connect(mapToStateProps, { onAvailability, onSearchFoods })(_HomeScreen);

export { HomeScreen };
