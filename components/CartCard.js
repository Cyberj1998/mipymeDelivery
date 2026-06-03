import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Left from "../assets/images/icons/left.png";
import Icon from "../assets/images/icons/remove.png";
import Right from "../assets/images/icons/right.png";
import useCartStore from "../store/CartSlice";

export default function CartCard({ item }) {
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const theme = useCartStore((state) => state.theme);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme === "light" ? "#f0f0f0" : "#4a4a4a" },
      ]}
    >
      <View style={styles.infoContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text
          style={[
            styles.name,
            { color: theme === "light" ? "#444444" : "#fff" },
          ]}
        >
          {item.name}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(item.$id)}>
          <Image source={Left} style={styles.arrow} />
        </TouchableOpacity>
        <Text
          style={[styles.quantity, { color: theme === "light" ? "" : "white" }]}
        >
          {item.quantity}
        </Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.$id)}>
          <Image source={Right} style={styles.arrow} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromCart(item.$id)}
      >
        <Image style={styles.delete} source={Icon} />
      </TouchableOpacity>
      <Text style={[styles.price, { color: theme === "light" ? "" : "white" }]}>
        $: {item.price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    width: "90%",
    height: 120,
    marginVertical: 10,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  image: {
    height: 90,
    width: 90,
    resizeMode: "contain",
  },
  infoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  name: {
    fontSize: 12,
    lineHeight: 24,
  },
  deleteButton: {
    margin: 5,
    position: "absolute",
    top: 0,
    right: 0,
  },
  delete: {
    height: 40,
    width: 40,
  },
  arrow: {
    height: 35,
    width: 35,
    margin: 10,
  },
  quantityContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 25,
  },
  price: {
    fontSize: 20,
  },
});
