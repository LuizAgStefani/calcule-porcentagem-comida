import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import { useEffect, useState } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import BotoesCategoria from "../../components/BotoesCategoria";
import firebase from "../../config/firebaseConnection";
import { Alimento } from "../../interfaces/Alimento";
import Loading from "../../components/Loading";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type DialogItemAlimentoProp = {
  alimento: Alimento;
  setAlimento: (alimento: Alimento) => void;
};

export default function Main() {
  const [categoria, setCategoria] = useState<string>("laticinio");

  const [marginTopImagem] = useState(new Animated.Value(100));

  const [opacidadeTexto] = useState(new Animated.Value(0));

  const [alimentos, setAlimentos] = useState<Alimento[]>([]);

  const [carregandoAlimentos, setCarregandoAlimentos] = useState(false);

  const [resultadoConta, setResultadoConta] = useState("");

  const [loading, setLoading] = useState(false);

  const [dialogAlimento1, setDialogAlimento1] = useState(false);
  const [dialogAlimento2, setDialogAlimento2] = useState(false);

  const [alimento1Selecionado, setAlimento1Selecionado] =
    useState<Alimento | null>(null);
  const [alimento2Selecionado, setAlimento2Selecionado] =
    useState<Alimento | null>(null);

  const [quantidadeAlimentoIncompleto, setQuantidadeAlimentoIncompleto] =
    useState("");

  const navigation = useNavigation();

  const handleAddAlimentoUm = (alimento: Alimento) => {
    if (resultadoConta !== "") {
      setResultadoConta("");
      setAlimento2Selecionado(null);
      setQuantidadeAlimentoIncompleto("");
    }

    setAlimento1Selecionado(alimento);
    handleDismissDialog();
  };

  const handleAddAlimentoDois = (alimento: Alimento) => {
    setAlimento2Selecionado(alimento);
    handleDismissDialog();
  };

  useEffect(() => {
    setCarregandoAlimentos(true);
    setResultadoConta("");
    setAlimento1Selecionado(null);
    setAlimento2Selecionado(null);
    setQuantidadeAlimentoIncompleto("");
    firebase
      .database()
      .ref(categoria)
      .on("value", (snapshot) => {
        setAlimentos([]);
        const alimentosOrdenados: Alimento[] = [];

        snapshot.forEach((childItem) => {
          const alimento: Alimento = {
            key: childItem.key!,
            nome: childItem.val().nome,
            quantidade: childItem.val().quantidade,
            unidadeMedida: childItem.val().unidadeMedida,
          };

          alimentosOrdenados.push(alimento);
        });

        alimentosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));

        setAlimentos(alimentosOrdenados);

        setCarregandoAlimentos(false);
      });
  }, [categoria]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(marginTopImagem, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.timing(opacidadeTexto, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleCalcular = () => {
    if (quantidadeAlimentoIncompleto === "") {
      return;
    }

    const quantidade1 = alimento1Selecionado?.quantidade;

    if (+quantidadeAlimentoIncompleto > quantidade1!) {
      ToastAndroid.showWithGravityAndOffset(
        "A quantidade não pode ser maior do que a quantidade padrão do Alimento",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    const quantidade2 = alimento2Selecionado?.quantidade;

    let resultado1 = (+quantidadeAlimentoIncompleto * 100) / quantidade1!;
    resultado1 = +resultado1.toFixed(0);

    let resultado2 = (resultado1 * quantidade2!) / 100;
    resultado2 = +resultado2.toFixed(0);

    const resultadoFinal = quantidade2! - resultado2;

    setResultadoConta(`${resultadoFinal}`);
  };

  const handleDismissDialog = () => {
    setDialogAlimento1(false);
    setDialogAlimento2(false);
  };

  const DialogItemAlimento = ({
    alimento,
    setAlimento,
  }: DialogItemAlimentoProp) => {
    return (
      <TouchableOpacity
        style={{
          width: "100%",
          borderBottomWidth: 1,
          margin: 5,
          height: 50,
          justifyContent: "center",
          borderBottomColor: "#FFF",
        }}
        onPress={() => setAlimento(alimento)}
      >
        <Text style={{ fontSize: 18, color: "#FFF" }}>{alimento.nome}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog
          style={{ backgroundColor: "#FC6767" }}
          onDismiss={handleDismissDialog}
          visible={dialogAlimento1}
        >
          <Dialog.Title
            style={{
              textAlign: "center",
              color: "#b40000",
              fontWeight: "bold",
            }}
          >
            Escolha o Primeiro Alimento
          </Dialog.Title>
          <Dialog.ScrollArea style={{ height: 200 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={alimentos}
              renderItem={({ item }) => (
                <DialogItemAlimento
                  setAlimento={handleAddAlimentoUm}
                  alimento={item}
                />
              )}
            />
          </Dialog.ScrollArea>
        </Dialog>
        <Dialog
          style={{ backgroundColor: "#FC6767" }}
          onDismiss={handleDismissDialog}
          visible={dialogAlimento2}
        >
          <Dialog.Title
            style={{
              textAlign: "center",
              color: "#b40000",
              fontWeight: "bold",
            }}
          >
            Escolha o Segundo Alimento
          </Dialog.Title>
          <Dialog.ScrollArea style={{ height: 200 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={alimentos}
              renderItem={({ item }) => (
                <DialogItemAlimento
                  setAlimento={handleAddAlimentoDois}
                  alimento={item}
                />
              )}
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
      <Animated.Image
        style={{
          width: marginTopImagem.interpolate({
            inputRange: [0, 100],
            outputRange: [100, 340],
          }),
          height: marginTopImagem.interpolate({
            inputRange: [0, 100],
            outputRange: [100, 340],
          }),
          marginTop: marginTopImagem.interpolate({
            inputRange: [0, 100],
            outputRange: ["10%", "50%"],
          }),
        }}
        source={require("../../assets/icon.png")}
      />
      <Animated.Text style={[styles.textoIcone, { opacity: opacidadeTexto }]}>
        Calcule a Porcentagem
      </Animated.Text>
      <Animated.ScrollView
        style={[styles.contentArea, { opacity: opacidadeTexto }]}
      >
        <BotoesCategoria categoria={categoria} setCategoria={setCategoria} />
        {carregandoAlimentos ? (
          <Loading />
        ) : (
          <>
            {alimentos.length > 0 ? (
              <>
                <View style={styles.areaButtons}>
                  <Button
                    disabled={loading}
                    icon="plus-box-outline"
                    mode="elevated"
                    buttonColor="#FC6767"
                    textColor="#FFF"
                    onPress={() => setDialogAlimento1(true)}
                    style={{ width: "45%" }}
                  >
                    Alimento 1
                  </Button>
                  <Button
                    disabled={loading}
                    icon="plus-box-outline"
                    mode="elevated"
                    buttonColor="#FC6767"
                    textColor="#FFF"
                    onPress={() => setDialogAlimento2(true)}
                    style={{ width: "45%" }}
                  >
                    Alimento 2
                  </Button>
                </View>
                <View style={styles.areaDescAlimento}>
                  <Text style={styles.tituloAlimento}>
                    Alimento 1:{" "}
                    {alimento1Selecionado !== null
                      ? `${alimento1Selecionado.nome}`
                      : "Não escolhido"}
                  </Text>
                  <Text style={styles.helpTextAlimento}>
                    (Alimento que não será consumido completamente)
                  </Text>
                </View>
                <TextInput
                  disabled={alimento1Selecionado === null}
                  mode="outlined"
                  value={quantidadeAlimentoIncompleto}
                  onChangeText={(text) => setQuantidadeAlimentoIncompleto(text)}
                  label="Quantidade"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#fa9a9a",
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                  outlineColor="#F00"
                  activeOutlineColor="#bc0000"
                />
                <View style={[styles.areaDescAlimento, { marginBottom: 20 }]}>
                  <Text style={styles.tituloAlimento}>
                    Alimento 2:{" "}
                    {alimento2Selecionado !== null
                      ? `${alimento2Selecionado.nome}`
                      : "Não escolhido"}
                  </Text>
                  <Text style={styles.helpTextAlimento}>
                    (Alimento que será calculado o restante)
                  </Text>
                </View>
                <Button
                  disabled={
                    alimento1Selecionado === null ||
                    alimento2Selecionado === null
                  }
                  icon="calculator"
                  mode="elevated"
                  buttonColor="#FC6767"
                  textColor="#FFF"
                  onPress={handleCalcular}
                >
                  Calcular
                </Button>
                {resultadoConta !== "" && (
                  <View style={styles.areaResultado}>
                    <Text style={styles.titleResultado}>Resultado</Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#F00",
                        padding: 5,
                        paddingHorizontal: 10,
                        borderRadius: 50,
                        marginTop: 5,
                      }}
                    >
                      <Text style={styles.textResultado}>
                        {resultadoConta}
                        {alimento2Selecionado?.unidadeMedida}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Icon name="food-drumstick-off" size={35} color="#900" />
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#b40000",
                    textAlign: "center",
                  }}
                >
                  Sem Alimentados Cadastrados para essa categoria
                </Text>
              </View>
            )}
          </>
        )}
        <View style={{ alignItems: "flex-end", marginTop: 20 }}>
          <Button
            disabled={loading}
            icon="food-fork-drink"
            mode="elevated"
            buttonColor="#FC6767"
            textColor="#FFF"
            onPress={() => navigation.navigate("Registros")}
            style={{ marginBottom: 5 }}
          >
            Gerenciar Alimentos
          </Button>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fa9a9a",
    alignItems: "center",
  },
  textoIcone: {
    fontWeight: "bold",
    fontSize: 25,
  },
  contentArea: {
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 10,
  },
  areaCategorias: {
    height: 100,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  areaButtons: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  areaDescAlimento: {
    marginTop: 8,
  },
  tituloAlimento: {
    fontSize: 18,
    fontWeight: "bold",
  },
  helpTextAlimento: {
    color: "#e64f4f",
  },
  areaResultado: {
    marginTop: 10,
    alignItems: "center",
  },
  titleResultado: {
    fontWeight: "bold",
    fontSize: 18,
  },
  textResultado: {
    fontWeight: "bold",
    fontSize: 25,
  },
});
