import ProductCard from "@/components/ProductCard";
import useCartStore from "@/store/CartSlice";
import { useMemo } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "../../assets/images/banner.png";

export default function ofertas() {
  const databaseCache = useCartStore((state) => state.databaseCache);
  const theme = useCartStore((state) => state.theme);

  const discountedProducts = useMemo(() => {
    return databaseCache.filter((item: any) => item.oferta === true);
  }, [databaseCache]);

  interface Product {
    $id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    local: string;
  }

  const renderProductItem: ListRenderItem<Product> = ({ item }) => (
    <ProductCard item={item} />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "white" : "#2b2b2b" },
      ]}
    >
      <View style={styles.banner}>
        <Image source={Banner} style={styles.bannerImage} />
      </View>
      <FlatList
        style={styles.flatList}
        data={discountedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerStyle={styles.flatListContentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  banner: {
    height: 150,
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    height: 150,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 20,
  },
  flatList: {
    width: "100%",
    marginBottom: 80,
    flexWrap: "wrap",
  },
  flatListContentContainer: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
});
