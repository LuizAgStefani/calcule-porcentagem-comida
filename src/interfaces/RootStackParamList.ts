import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Registros: undefined;
  Cadastrar: undefined;
  Editar: { id: string; categoria: string };
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;
