import { View, ActivityIndicator, Text } from "react-native";

export default function Loading() {
  return (
    <View style={{ alignItems: "center" }}>
      <ActivityIndicator color="#b40000" style={{ marginTop: 30 }} size={50} />
      <Text
        style={{
          marginTop: 10,
          fontWeight: "bold",
          fontSize: 22,
          color: "#b40000",
        }}
      >
        Trazendo Alimentos...
      </Text>
    </View>
  );
}
