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
import DeleteIcon from "../assets/images/icons/delete.png";
import Micelaneas from "../assets/images/icons/micelaneas.png";
import Offer from "../assets/images/icons/offer.png";
import Store from "../assets/images/icons/store.png";

let soundObject = null;

const CACHE_STORAGE_KEY = "@shopping_cart";

export default function ProductCard({ item, onRemove }) {
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

      await soundObject.replayAsync();
    } catch (error) {
      console.log("Error playing sound", error);
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
        { backgroundColor: theme === "light" ? "#f0f0f0" : "#4a4a4a" },
      ]}
    >
      {item.oferta === true ? (
        <Image source={Offer} style={styles.offerIcon} />
      ) : (
        ""
      )}
      <TouchableOpacity
        onPress={() => onRemove(item)}
        style={styles.addToFavorite}
      >
        <Image source={DeleteIcon} style={styles.favorite} />
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
            { backgroundColor: theme === "light" ? "#3e8dc2" : "#cfa1d7" },
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
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
    width: 350,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  priceCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00a746",
  },
  storeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  storeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#777",
    marginLeft: 4,
  },
  storeIcon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
  },
  addButton: {
    backgroundColor: "#00a746",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 150,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
  },
  addToFavorite: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  offerIcon: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
  },
  categoryIcon: { height: 20, width: 20 },
  cartIcon: { height: 20, width: 20 },
  favorite: { height: 22, width: 22 },
  offerIconStyle: { height: 22, width: 22 },
});
