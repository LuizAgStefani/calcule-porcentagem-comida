import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import { List } from "react-native-paper";
import { Alimento } from "../interfaces/Alimento";
import { useNavigation } from "@react-navigation/native";
import firebase from "../config/firebaseConnection";

interface Props {
  alimento: Alimento;
  categoria: string;
}

export default function CardAlimentosGerencial({ alimento, categoria }: Props) {
  const [icone, setIcone] = useState("cow");

  useEffect(() => {
    switch (categoria) {
      case "laticinio":
        setIcone("cow");
        break;
      case "proteina":
        setIcone("food-drumstick");
        break;
      case "carboidrato":
        setIcone("bread-slice");
        break;
      case "fruta":
        setIcone("fruit-grapes");
        break;
      default:
        break;
    }
  }, []);

  const navigation = useNavigation();

  const handleExcluirAlimento = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Você quer realmente excluir o(a) ${alimento.nome}?`,
      [
        {
          text: "Cancelar",
          onPress: () => false,
        },
        {
          text: "Confirmar",
          onPress: () => excluirAlimento(alimento.key),
        },
      ]
    );
  };

  const excluirAlimento = (id: string) => {
    firebase
      .database()
      .ref(categoria)
      .child(id)
      .remove()
      .then(() => {
        ToastAndroid.showWithGravityAndOffset(
          `${alimento.nome} excluído(a) com sucesso`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      })
      .catch(() => {
        ToastAndroid.showWithGravityAndOffset(
          "Houve um erro ao excluir o alimento",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      });
  };

  return (
    <>
      {alimento && (
        <List.Item
          title={
            <Text style={{ fontWeight: "bold", color: "#b40000" }}>
              {alimento.nome}
            </Text>
          }
          description={
            <Text style={{ color: "#b40000" }}>
              {alimento.quantidade}
              {alimento.unidadeMedida}
            </Text>
          }
          left={(props) => (
            <List.Icon {...props} icon={icone} color="#b40000" />
          )}
          right={(props) => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Editar", { id: alimento.key, categoria })
                }
                {...props}
              >
                <List.Icon icon="lead-pencil" color="#b40000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExcluirAlimento} {...props}>
                <List.Icon icon="trash-can" color="#b40000" />
              </TouchableOpacity>
            </View>
          )}
          style={{
            backgroundColor: "#FC6767",
            borderRadius: 15,
            marginBottom: 10,
          }}
        />
      )}
    </>
  );
}
