var models = require('../models/models.js');

//GET /quizes/statistics
exports.statistics = function(req, res){
  models.Quiz.findAll().then(function(quizes){
    var numPregs = quizes.length;
    models.Comment.findAll().then(function(comments){
      var numComentarios = comments.length;
      var numComentariospublis = 0;
      var numPregsTot = 0;
      var media = 0;
      var sinComments = 0;
      var conComments = 0;
      var array=[];
      var borrado=1;
      for(var i=0; i<numComentarios; i++){ // por si se borran preguntas (en este caso numPregs no coincidirá con las dimensiones reales de la tabla, si no con las preguntas no nulas)
        if (comments[i].QuizId > numPregsTot) numPregsTot=comments[i].QuizId;
      }
      for(var i=0; i<numComentarios; i++){ // recorro la tabla de comentarios y meto en cada índice del array[i] cuantos comentarios tiene la pregunta número i 
        for (var j=0; j<numPregs; j++) {
          if (quizes[j].id==comments[i].QuizId) {
            borrado=0;
          }
        }
        if (comments[i].publicado==1 && borrado==0) { // compruebo que no esté borrada la pregunta y que el comentario esté publicado
          if(array[comments[i].QuizId]){ // si no es el primer comentario con ese QuizId, aumento en 1 array[QuizId]
            array[comments[i].QuizId]++;
          }else{ // si es el primer comentario con ese QuizId, pongo a 1 array[QuizId]
            array[comments[i].QuizId] = 1;
          }
          numComentariospublis++;
        }
      }
      for(var i=1; i<=numPregsTot; i++){ // recorro la tabla preguntas
        if(array[i]){ // si había comentarios en esa pregunta (es decir, guardé un array[i]!=undefined), conComments++
          conComments++;
        }
      }
      sinComments = numPregs-conComments;
      media = numComentariospublis/numPregs;
      res.render('quizes/statistics', {quizes: quizes, preguntas: numPregs, comentarios: numComentariospublis, media: media, sinComments: sinComments, conComments: conComments, errors: []});
    }).catch(function(error){next(error);})
  }).catch(function(error){next(error);})
};