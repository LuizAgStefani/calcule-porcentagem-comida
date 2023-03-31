import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../interfaces/RootStackParamList";
import Cadastro from "../pages/Cadastro";
import Main from "../pages/Main";
import Registros from "../pages/Registros";

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="Registros" component={Registros} />
      <Stack.Screen name="Cadastrar" component={Cadastro} />
      <Stack.Screen name="Editar" component={Cadastro} />
    </Stack.Navigator>
  );
}
