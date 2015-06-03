// Definicion del modelo de Quiz-Fav
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  	'Fav',
    { pregunta: {
        type: DataTypes.STRING
      }
    }
  );
}
