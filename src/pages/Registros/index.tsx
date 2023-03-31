import { Text, View, StyleSheet, FlatList } from "react-native";
import BotoesCategoria from "../../components/BotoesCategoria";
import { useState, useEffect } from "react";
import { IconButton, Button, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../config/firebaseConnection";
import { Alimento } from "../../interfaces/Alimento";
import CardAlimentosGerencial from "../../components/CardAlimentosGerenciavel";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Loading from "../../components/Loading";

export default function Registros() {
  const [categoria, setCategoria] = useState<string>("laticinio");

  const [alimentos, setAlimentos] = useState<Alimento[]>([]);

  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    setCarregando(true);

    firebase
      .database()
      .ref(categoria)
      .on("value", (snapshot) => {
        setAlimentos([]);
        snapshot.forEach((childItem) => {
          const alimento: Alimento = {
            key: childItem.key!,
            nome: childItem.val().nome,
            quantidade: childItem.val().quantidade,
            unidadeMedida: childItem.val().unidadeMedida,
          };

          setAlimentos((alimentos) => [...alimentos, alimento]);
        });

        setCarregando(false);
      });
  }, [categoria]);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "95%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 15,
        }}
      >
        <IconButton
          icon="keyboard-backspace"
          size={25}
          onPress={() => navigation.goBack()}
        />
        <Button
          icon="food-drumstick"
          mode="elevated"
          buttonColor="#FC6767"
          textColor="#FFF"
          style={{ justifyContent: "center", height: 40 }}
          onPress={() => navigation.navigate("Cadastrar")}
        >
          Adicionar Alimento
        </Button>
      </View>
      <Text style={styles.title}>Alimentos Cadastrados</Text>
      <View style={styles.contentArea}>
        <BotoesCategoria categoria={categoria} setCategoria={setCategoria} />
        {carregando ? (
          <Loading />
        ) : (
          <FlatList
            style={{ marginTop: 10 }}
            data={alimentos}
            renderItem={({ item }) => (
              <CardAlimentosGerencial alimento={item} categoria={categoria} />
            )}
            ListEmptyComponent={() => (
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Icon name="food-drumstick-off" size={35} color="#900" />
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#b40000",
                  }}
                >
                  Sem Alimentados Cadastrados
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fa9a9a",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  contentArea: {
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 10,
  },
});
