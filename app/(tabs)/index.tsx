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
import { Client, TablesDB } from "react-native-appwrite";
const APPWRITE_PROJECT_NAME = "New project";
const PROJECT_ID = "69f7be4d001510953812";
const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";

//-----------------images imports
import AseoIcon from "../../assets/images/icons/aseo.png";
import BebidasIcon from "../../assets/images/icons/bebidas.png";
import CarnicosIcon from "../../assets/images/icons/carnicos.png";
import ConfiturasIcon from "../../assets/images/icons/confituras.png";
import Logo from "../../assets/images/icons/logo-2.png";
import Micelaneas from "../../assets/images/icons/micelaneas.png";
import SearchIcon from "../../assets/images/icons/search.png";

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

  const [category, setCategory] = useState("todo");
  const [searchValue, setSearchValue] = useState("");
  const [productsDatabase, setProductsDatabase] = useState<Product[]>([]);

  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  const tablesDB = new TablesDB(client);

  const handleCallRows = () => {
    let promise = tablesDB.listRows("69f7bf3d003d2045f024", "products");

    promise.then(
      function (response) {
        setProductsDatabase(response.rows as unknown as Product[]);
        console.log(productsDatabase);
      },
      function (error) {
        console.log(error);
      },
    );
  };

  useEffect(() => {
    handleCallRows();
  }, []);

  const filteredProducts = useMemo(() => {
    const categoryFiltered =
      category === "todo"
        ? productsDatabase
        : productsDatabase.filter((item) => item.category === category);

    return categoryFiltered.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [category, searchValue, productsDatabase]);

  const handleCategory = (category: CategoryItem) => {
    setCategory(category.category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <Image style={styles.logo} source={Logo} />
      </View>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Introdusca su direccion..."
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
            style={styles.categoryButton}
            onPress={() => handleCategory(category)}
          >
            <Text style={styles.categoryText}>{category.category}</Text>
            <Image style={styles.categoryIcon} source={category.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {productsDatabase.length === 0 ? (
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
    backgroundColor: "white",
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
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 55,
    width: 55,
  },
  categoryButton: {
    backgroundColor: "#488dd7",
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
    width: "70%",
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
});
