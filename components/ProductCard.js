import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCartStore from "../store/CartSlice";

//-----------------icons

import CartIcon from "../assets/images/cart.png";
import AseoIcon from "../assets/images/icons/aseo.png";
import BebidasIcon from "../assets/images/icons/bebidas.png";
import CarnicosIcon from "../assets/images/icons/carnicos.png";
import ConfiturasIcon from "../assets/images/icons/confituras.png";
import Heart from "../assets/images/icons/heart.png";
import Micelaneas from "../assets/images/icons/micelaneas.png";
import Offer from "../assets/images/icons/offer.png";
import Store from "../assets/images/icons/store.png";

let soundObject = null;

const CACHE_STORAGE_KEY = "@shopping_cart";

export default function ProductCard({ item }) {
  const theme = useCartStore((state) => state.theme);
  const addToCart = useCartStore((state) => state.addToCart);

  //-------------------sound function
  const playAddToCartSound = async () => {
    try {
      if (!soundObject) {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/blop.mp3"),
        );
        soundObject = sound;
      }

      // Play from start
      await soundObject.replayAsync();
    } catch (error) {
      console.log("Error playing sound", error);
    }
  };

  //---------------------handle add to Cache Storage Function

  const saveToAsyncStorage = async (item) => {
    try {
      const jsonValue = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
      let cache = jsonValue != null ? JSON.parse(jsonValue) : [];

      const isDuplicate = cache.some((cacheItem) => cacheItem.$id === item.$id);

      if (isDuplicate) {
        console.log("Item already in cart");
        return false;
      }

      // Add and save
      cache.push(item);
      await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
      console.log(cache);
      return true;
    } catch (error) {
      console.error("AsyncStorage Error:", error);
      return false;
    }
  };

  //---------------------handle add to cart function
  const handleAddToCart = (item) => {
    addToCart(item);
    playAddToCartSound();
    console.log(item);
  };

  return (
    <View
      style={[
        styles.productCard,
        { backgroundColor: theme === "light" ? "#eeeeee" : "#5C5470" },
      ]}
    >
      {item.oferta === true ? (
        <Image source={Offer} style={styles.offerIcon} />
      ) : (
        ""
      )}
      <TouchableOpacity
        onPress={() => saveToAsyncStorage(item)}
        style={styles.addToFavorite}
      >
        <Image source={Heart} style={styles.favorite} />
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.productName,
            { color: theme === "light" ? "#333333" : "#fff" },
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <View style={styles.priceCategoryContainer}>
          <Text style={styles.productPrice}>$: {item.price}</Text>
          <Image
            style={styles.categoryIcon}
            source={
              item.category === "aseo"
                ? AseoIcon
                : item.category === "bebidas"
                  ? BebidasIcon
                  : item.category === "carnicos"
                    ? CarnicosIcon
                    : item.category === "confituras"
                      ? ConfiturasIcon
                      : item.category === "micelaneas"
                        ? Micelaneas
                        : ""
            }
          />
        </View>
        <View style={styles.storeContainer}>
          <Image source={Store} style={styles.storeIcon} />
          <Text
            style={[
              styles.storeText,
              { color: theme === "light" ? "" : "#fff" },
            ]}
          >
            {item.local}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: theme === "light" ? "#15caca" : "#b0a1d5" },
          ]}
          onPress={() => handleAddToCart(item)}
        >
          <Text
            style={[
              styles.addButtonText,
              { color: theme === "light" ? "#ffff" : "black" },
            ]}
          >
            añadir al carrito
          </Text>
          <Image source={CartIcon} style={styles.cartIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 8,
    flexDirection: "column",
    justifyContent: "space-between",
    width: 160,
    flexShrink: false,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "visible",
  },
  productImage: {
    margin: 5,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  textContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 15,
    width: "100%",
    fontWeight: "bold",
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00a746",
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignSelf: "center",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  categoryIcon: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  priceCategoryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  idText: {
    color: "white",
    borderRadius: 12,
    backgroundColor: "#969696",
  },
  storeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  storeIcon: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  storeText: {
    fontSize: 12,
    fontWeight: 500,
    marginLeft: 5,
  },
  cartIcon: {
    height: 20,
    width: 20,
  },
  addToFavorite: {
    height: 20,
    width: 20,
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 50,
  },
  favorite: {
    height: 20,
    width: 20,
  },
  offerIcon: {
    height: 20,
    width: 20,
    position: "absolute",
    top: 5,
    left: 5,
    zIndex: 50,
  },
});
