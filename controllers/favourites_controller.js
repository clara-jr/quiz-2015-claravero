var models = require('../models/models.js');

// GET load de las preguntas que tiene un usuario como favoritas
exports.show = function(req, res, next) {
  var options = {};
  if (req.session.user) {
    options.where = {UserId:req.user.id}
  }
  models.Fav.findAll(options).then(
    function(favs) {
      var lel = [];
      for(index in favs) {
        lel[index]=true;
      }
      res.render('quizes/index.ejs', {quizes:favs, fav:true, favs:lel, models:models, errors: []});
    }).catch(function(error){next(error)});
};

// PUT marcar una pregunta como favorita
exports.fav = function(req, res, next) {
  var options = {};
  options.where = {id:req.quiz.id}
  models.Quiz.findAll(options).then(
    function(encontrado) {
      var fav = models.Fav.build(
        { UserId: req.user.id,
          QuizId: encontrado[0].id,
          pregunta: encontrado[0].pregunta
        }
      )
      fav
      .validate()
      .then(
        function(err){
          if (err) {
            next(new Error ('Error procesando la petición'));
          }
          else {
            fav // save: guarda en DB
            .save()
            .then(res.redirect(req.get('referer')))
          }
        }
      ).catch(function(error){next(error)});
    }
  )
};

// DELETE borrar un favorito
exports.unfav = function(req, res, next) {
  var i;
  models.Fav.findAll().then(
    function(favs){
      for(i=0; i<favs.length; i++) {
        if((favs[i].UserId === req.user.id) && (favs[i].QuizId === req.quiz.id)) {
          break;
        }
      }
      models.Fav.find({
        where: {
          UserId: favs[i].UserId,
          QuizId: favs[i].QuizId
        }
      })
      .then(function(fav) {
        fav.destroy() //borra de la base de datos
        .then(res.redirect(req.get('referer')))
    })
  })
};
