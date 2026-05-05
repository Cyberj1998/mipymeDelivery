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
import Micelaneas from "../assets/images/icons/micelaneas.png";
import Store from "../assets/images/icons/store.png";

export default function ProductCard({ item }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (item) => {
    addToCart(item);
    console.log(item);
  };

  return (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.textContainer}>
        <Text style={styles.productName} numberOfLines={2}>
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
          <Text style={styles.storeText}>{item.local}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>añadir al carrito</Text>
          <Image source={CartIcon} style={styles.cartIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#eeeeee",
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
    overflow: "hidden",
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
    color: "#333333",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00a746",
  },
  addButton: {
    backgroundColor: "#15caca",
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
    color: "#ffffff",
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
});
