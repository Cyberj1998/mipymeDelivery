import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyLoader from "../../components/MyLoader";
import ProductCard from "../../components/ProductCard";

//------------------appwrite credentials
import { Client, Query, TablesDB } from "react-native-appwrite";
const APPWRITE_PROJECT_NAME = "New project";
const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT!;
const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID!;

//-----------------images imports
import AseoIcon from "../../assets/images/icons/aseo.png";
import BebidasIcon from "../../assets/images/icons/bebidas.png";
import CarnicosIcon from "../../assets/images/icons/carnicos.png";
import ConfiturasIcon from "../../assets/images/icons/confituras.png";
import Logo from "../../assets/images/icons/logo-2.png";
import Micelaneas from "../../assets/images/icons/micelaneas.png";
import Moon from "../../assets/images/icons/moon.png";
import SearchIcon from "../../assets/images/icons/search.png";
import Sun from "../../assets/images/icons/sun.png";

//-------------------------cart store imports
import useCartStore from "@/store/CartSlice";

export default function HomeScreen() {
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

  interface CategoryItem {
    category: string;
    image: any;
  }

  const categories = [
    {
      category: "todo",
      image: "",
    },
    {
      category: "aseo",
      image: AseoIcon,
    },
    {
      category: "bebidas",
      image: BebidasIcon,
    },
    {
      category: "carnicos",
      image: CarnicosIcon,
    },
    {
      category: "confituras",
      image: ConfiturasIcon,
    },
    {
      category: "micelaneas",
      image: Micelaneas,
    },
  ];

  //------------------cart store databse cache
  const addToCache = useCartStore((state) => state.addToCache);
  const databaseCache = useCartStore((state) => state.databaseCache);

  const [category, setCategory] = useState("todo");
  const [searchValue, setSearchValue] = useState("");
  const [productsDatabase, setProductsDatabase] = useState<Product[]>([]);

  //----------------pagination states
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  //-----------------dark and light states
  const toggleTheme = useCartStore((state) => state.toggleTheme);
  const theme = useCartStore((state) => state.theme);
  const [dark, setDark] = useState(false);

  const handleTheme = () => {
    setDark((prev) => !prev);
    toggleTheme();
  };

  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  const tablesDB = new TablesDB(client);

  const handleCallRows = async (limit: number, currentOffset: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await tablesDB.listRows(DATABASE_ID, "products", [
        Query.limit(limit),
        Query.offset(currentOffset),
      ]);

      const newRows = response.rows as unknown as Product[];

      if (newRows.length < LIMIT) {
        setHasMore(false);
      }

      newRows.forEach((product) => {
        addToCache(product);
      });
      setOffset((prev) => prev + limit);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallByCategory = async (selectedCategory: string) => {
    try {
      const response = await tablesDB.listRows(DATABASE_ID, "products", [
        Query.equal("category", selectedCategory), // Use the argument here
      ]);

      const newRows = response.rows as unknown as Product[];
      newRows.forEach((product) => {
        addToCache(product);
        console.log(product);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCallRows(LIMIT, offset);
  }, []);

  const filteredProducts = useMemo(() => {
    const categoryFiltered =
      category === "todo"
        ? databaseCache
        : databaseCache.filter((item: any) => item.category === category);

    return categoryFiltered.filter((item: any) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [category, searchValue, databaseCache]);

  const handleCategory = async (category: CategoryItem) => {
    setCategory(category.category);
    await handleCallByCategory(category.category);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "white" : "#352F44" },
      ]}
    >
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => handleTheme()}
          style={[
            styles.toggleContainer,
            { alignItems: theme === "light" ? "flex-start" : "flex-end" },
            { backgroundColor: theme === "light" ? "#5f5f65" : "#dadae7" },
          ]}
        >
          <View style={styles.SunMoonContainer}>
            <Image source={Sun} style={styles.SunMoon} />
            <Image source={Moon} style={styles.SunMoon} />
          </View>
          <View
            style={[
              styles.toggle,
              { backgroundColor: theme === "light" ? "#dadae7" : "#5f5f65" },
            ]}
          ></View>
        </TouchableOpacity>
        <Image style={styles.logo} source={Logo} />
      </View>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="buscar..."
          placeholderTextColor="#999"
          multiline={true}
          textAlignVertical="top"
          onChangeText={(text) => setSearchValue(text)}
          value={searchValue}
        />
        <TouchableOpacity>
          <Image source={SearchIcon} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.categoryBar} horizontal>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              category.category === "todo" && { width: 80 },
              { backgroundColor: theme === "light" ? "#488dd7" : "#5C5470" },
            ]}
            onPress={() => handleCategory(category)}
          >
            <Text style={styles.categoryText}>{category.category}</Text>
            {category.image ? (
              <Image style={styles.categoryIcon} source={category.image} />
            ) : (
              ""
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {databaseCache.length === 0 ? (
        <View style={styles.loadingContainer}>
          <MyLoader size={100} speed={2000} color="#48d769" />
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.$id}
          numColumns={2}
          contentContainerStyle={styles.flatListContentContainer}
          onEndReached={() => handleCallRows(LIMIT, offset)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <Text style={styles.textLoading}>Cargando...</Text> : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  navbar: {
    height: 40,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 40,
    width: 40,
  },
  categoryButton: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    height: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 500,
    color: "white",
  },
  searchBar: {
    height: 40,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#989898",
    borderRadius: 15,
    width: "80%",
  },
  searchIcon: {
    height: 30,
    width: 30,
  },
  categoryIcon: {
    height: 30,
    width: 30,
  },
  categoryBar: {
    height: 70,
    flexGrow: 0,
  },
  loadingContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textLoading: {
    fontSize: 15,
    fontWeight: 500,
    color: "#488dd7",
  },
  toggleContainer: {
    height: 30,
    width: 60,
    borderRadius: 50,
    position: "absolute",
    left: 10,
    display: "flex",
  },
  toggle: {
    height: 25,
    width: 25,
    borderRadius: 100,
    position: "absolute",
    margin: 3,
  },
  SunMoon: {
    height: 20,
    width: 20,
    margin: 4,
  },
  SunMoonContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
