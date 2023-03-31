import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

interface Props {
  categoria: string;
  setCategoria: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

export default function BotoesCategoria({
  categoria,
  setCategoria,
  disabled,
}: Props) {
  return (
    <View style={styles.areaCategorias}>
      <SegmentedButtons
        value={categoria}
        onValueChange={setCategoria}
        buttons={[
          {
            value: "laticinio",
            label: "Laticínio",
            icon: "cow",
            checkedColor: "#F00",
            disabled,
          },
          {
            value: "proteina",
            label: "Proteína",
            icon: "food-drumstick",
            checkedColor: "#F00",
            disabled,
          },
        ]}
      />
      <SegmentedButtons
        value={categoria}
        onValueChange={setCategoria}
        buttons={[
          {
            value: "carboidrato",
            label: "Carboídrato",
            icon: "bread-slice",
            checkedColor: "#F00",
            disabled,
          },
          {
            value: "fruta",
            label: "Fruta",
            icon: "fruit-grapes",
            checkedColor: "#F00",
            disabled,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
