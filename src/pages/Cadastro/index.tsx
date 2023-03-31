import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import BotoesCategoria from "../../components/BotoesCategoria";
import { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  TextInput,
  SegmentedButtons,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import firebase from "../../config/firebaseConnection";
import { RootRouteProps } from "../../interfaces/RootStackParamList";

export default function Cadastro() {
  const [categoria, setCategoria] = useState<string>("laticinio");

  const [unidadeMedida, setUnidadeMedida] = useState("");

  const [id, setId] = useState("");

  const [nome, setNome] = useState("");

  const [nomeOriginal, setNomeOriginal] = useState("");

  const [quantidade, setQuantidade] = useState("");

  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();

  const route = useRoute<RootRouteProps<"Editar">>();

  useEffect(() => {
    if (route.params) {
      setCarregando(true);
      setId(route.params.id);

      firebase
        .database()
        .ref(route.params.categoria)
        .child(route.params.id)
        .get()
        .then((snapshot) => {
          setNome(snapshot.val().nome);
          setNomeOriginal(snapshot.val().nome);
          setCategoria(route.params.categoria);
          setQuantidade(`${snapshot.val().quantidade}`);
          setUnidadeMedida(snapshot.val().unidadeMedida);
          setCarregando(false);
        });
    }
  }, []);

  const handleSelecionaUnidade = (valor: string) => {
    Keyboard.dismiss();
    setUnidadeMedida(valor);
  };

  const handleCadastraAlimento = () => {
    if (nome === "" || quantidade === "") {
      return;
    }

    if (id !== "") {
      firebase
        .database()
        .ref(categoria)
        .child(id)
        .update({
          nome: nome,
          quantidade: +quantidade,
          unidadeMedida: unidadeMedida,
        })
        .then(() => {
          navigation.goBack();
          ToastAndroid.showWithGravityAndOffset(
            `${nome} editado com sucesso`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        })
        .catch(() => {
          ToastAndroid.showWithGravityAndOffset(
            "Houve um erro ao editar o Alimento",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        });
      return;
    }

    const tarefas = firebase.database().ref(categoria);

    const chave = tarefas.push().key;

    tarefas
      .child(chave!)
      .set({
        nome: nome,
        quantidade: +quantidade,
        unidadeMedida: unidadeMedida,
      })
      .then((response) => {
        ToastAndroid.showWithGravityAndOffset(
          "Alimento cadastrado com sucesso",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        navigation.goBack();
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fa9a9a" }}>
      {carregando ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator
            color="#b40000"
            style={{ marginTop: 30 }}
            size={50}
          />
          <Text
            style={{
              marginTop: 10,
              fontWeight: "bold",
              fontSize: 22,
              color: "#b40000",
            }}
          >
            Trazendo Alimento...
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              icon="keyboard-backspace"
              size={25}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>
              {id !== "" ? `Editar ${nomeOriginal}` : "Cadastrar Alimento"}
            </Text>
            <View style={styles.contentArea}>
              <View style={{ width: "100%" }}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                  Categoria
                </Text>
              </View>
              <BotoesCategoria
                categoria={categoria}
                setCategoria={setCategoria}
                disabled={id !== ""}
              />
              <TextInput
                mode="outlined"
                value={nome}
                onChangeText={(text) => setNome(text)}
                label="Nome"
                style={{ backgroundColor: "#fa9a9a", marginTop: 10 }}
                outlineColor="#F00"
                activeOutlineColor="#bc0000"
              />
              <TextInput
                mode="outlined"
                value={quantidade}
                onChangeText={(text) => setQuantidade(text)}
                label="Quantidade"
                keyboardType="numeric"
                style={{ backgroundColor: "#fa9a9a", marginVertical: 20 }}
                outlineColor="#F00"
                activeOutlineColor="#bc0000"
              />
              <View style={{ width: "100%" }}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                  Unidade de Medida
                </Text>
              </View>
              <SegmentedButtons
                style={{ marginVertical: 20 }}
                value={unidadeMedida}
                onValueChange={handleSelecionaUnidade}
                buttons={[
                  {
                    value: "ml",
                    label: "Mililitro",
                    checkedColor: "#F00",
                  },
                  {
                    value: "un",
                    label: "Unidade",
                    checkedColor: "#F00",
                  },
                  {
                    value: "g",
                    label: "Grama",
                    checkedColor: "#F00",
                  },
                ]}
              />
              <Button
                icon="food-drumstick"
                mode="elevated"
                buttonColor="#FC6767"
                textColor="#FFF"
                style={{ justifyContent: "center", height: 40 }}
                onPress={handleCadastraAlimento}
              >
                {id !== "" ? "Editar" : "Cadastrar"}
              </Button>
            </View>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fa9a9a",
    alignItems: "center",
    marginTop: "10%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
  },
  contentArea: {
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 10,
  },
});
