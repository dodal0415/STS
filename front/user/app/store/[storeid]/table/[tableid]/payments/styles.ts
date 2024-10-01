import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const getResponsiveStyles = () => {
  const getwidth = Math.min(Math.max(384, width * 0.9), 800);

  return StyleSheet.create({
    responsiveContainer: {
      ...styles.container,
      width: getwidth,
      alignSelf: "center",

      paddingTop: "10%",
    },
  });
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "5%",
    paddingHorizontal: "5%",
    marginStart: "5%",
  },
  spacer: {
    height: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
    marginEnd: "10%",
  },
  buttonContainer: {
    width: "90%",
  },
  button: {
    backgroundColor: "#D9D9D9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  cardorcashContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardorcash: {
    display: "flex",
    backgroundColor: "#D9D9D9",
    justifyContent: "center", // 가로 방향 중앙 정렬
    alignItems: "center", // 세로 방향 중앙 정렬
    padding: 70,
    borderRadius: 5,
    margin: 10,

    alignSelf: "center", // 부모 컨테이너 내에서 중앙 정렬
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputtext: {
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  input: {
    backgroundColor: "#D9D9D9",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  inputContainer: {
    marginTop: 10,
    width: "90%",
    borderWidth: 10,
    borderColor: "#D9D9D9",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderItemName: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  orderItemPrice: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "flex-start",
  },
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60,
    width: "100%",
  },
  bottomButtonContainer: {
    width: "90%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomButton: {
    backgroundColor: "#551699",
    borderRadius: 5,
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "#ccc",
  },
  menuButtonText: {
    color: "black",
    fontSize: 16,
  },
  menuButton: {
    backgroundColor: "#000",
    alignItems: "center",
    margin: 5,
    padding: 8,
  },
  menuButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lineBreak: {
    height: 1,
    width: "100%",
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
  },
});

export default getResponsiveStyles;
