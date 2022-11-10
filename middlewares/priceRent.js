const startingPrice = 10;

const rentPrice = (userReturn, estimatedDate) => {
  const userReturnDate = new Date(userReturn);
  const renturnDate = new Date(estimatedDate);

  //Cuanto tiempo paso desde que lo alquilo al tiempo esperado
  const dateDiference = userReturnDate.getTime() - renturnDate.getTime();
  //console.log(Date(dateDiference)); //TIEMPO EN MILISEGUNDOS

  //Pasar "dateDiference" de Milisegundos a Dias
  const daysDiference = dateDiference / (1000 * 60 * 60 * 24);
  //console.log(Date(daysDiference)); //TIMEPO EN DIAS

  //Si los dias de diferencia supera los dias esperados:
  if (daysDiference <= 0) {
    return startingPrice;
  } else {
    let penaltyPrice = startingPrice;

    for (let i = 0; i < daysDiference; i++) {
      penaltyPrice += penaltyPrice * 0.1;
    }
    console.log("Multando...");
    return penaltyPrice;
  }
};

module.exports = { rentPrice };
