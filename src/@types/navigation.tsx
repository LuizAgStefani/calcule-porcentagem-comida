import { RootStackParamList } from "../interfaces/RootStackParamList";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
